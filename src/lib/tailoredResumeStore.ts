import type { JdInsights, ResumeContent, TailoredResumeDraft } from '@/types/resume';
import { Redis } from '@upstash/redis';

const DRAFT_TTL_MS = 30 * 60 * 1000;
const DRAFT_TTL_SECONDS = DRAFT_TTL_MS / 1000;
const DRAFT_KEY_PREFIX = 'resume-tailor:draft:';
const KEEPALIVE_KEY = 'resume-tailor:keepalive';
const KEEPALIVE_TTL_SECONDS = 86_400;

type TailoredResumeStore = Map<string, TailoredResumeDraft>;

declare global {
  var __tailoredResumeDrafts: TailoredResumeStore | undefined;
}

function getStore() {
  globalThis.__tailoredResumeDrafts ??= new Map();
  return globalThis.__tailoredResumeDrafts;
}

function getRedisEnv() {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    return null;
  }

  return { url, token };
}

function getRedis() {
  const env = getRedisEnv();
  if (!env) return null;

  return new Redis(env);
}

function getDraftKey(draftId: string) {
  return `${DRAFT_KEY_PREFIX}${draftId}`;
}

function pruneExpiredDrafts() {
  const now = Date.now();
  for (const [draftId, draft] of getStore()) {
    if (draft.expiresAt <= now) {
      getStore().delete(draftId);
    }
  }
}

function getRemainingTtlSeconds(draft: TailoredResumeDraft) {
  return Math.max(0, Math.ceil((draft.expiresAt - Date.now()) / 1000));
}

async function setDraft(draft: TailoredResumeDraft, ttlSeconds: number) {
  const redis = getRedis();

  if (redis) {
    await redis.set(getDraftKey(draft.id), draft, { ex: ttlSeconds });
    return;
  }

  getStore().set(draft.id, draft);
}

export async function createTailoredResumeDraft({
  locale,
  resume,
  jdTitle,
  company,
  changeSummary,
  jdInsights,
}: {
  locale: string;
  resume: ResumeContent;
  jdTitle?: string;
  company?: string;
  changeSummary: string[];
  jdInsights: JdInsights;
}) {
  pruneExpiredDrafts();

  const now = Date.now();
  const draft: TailoredResumeDraft = {
    id: crypto.randomUUID(),
    locale,
    resume,
    createdAt: now,
    expiresAt: now + DRAFT_TTL_MS,
    jdTitle,
    company,
    changeSummary,
    jdInsights,
  };

  await setDraft(draft, DRAFT_TTL_SECONDS);
  return draft;
}

export async function getTailoredResumeDraft(draftId: string) {
  const redis = getRedis();

  if (redis) {
    const draft = await redis.get<TailoredResumeDraft>(getDraftKey(draftId));

    if (!draft) {
      return null;
    }

    if (draft.expiresAt <= Date.now()) {
      await redis.del(getDraftKey(draftId));
      return null;
    }

    return draft;
  }

  pruneExpiredDrafts();
  return getStore().get(draftId) ?? null;
}

export async function updateTailoredResumeDraft(draftId: string, resume: ResumeContent) {
  const draft = await getTailoredResumeDraft(draftId);

  if (!draft) {
    return null;
  }

  const nextDraft: TailoredResumeDraft = {
    ...draft,
    resume,
  };

  const remainingTtlSeconds = getRemainingTtlSeconds(nextDraft);

  if (remainingTtlSeconds <= 0) {
    return null;
  }

  await setDraft(nextDraft, remainingTtlSeconds);
  return nextDraft;
}

export async function pingRedis() {
  const redis = getRedis();

  if (!redis) {
    return { ok: false, skipped: true, reason: 'redis_not_configured' as const };
  }

  await redis.set(KEEPALIVE_KEY, Date.now(), { ex: KEEPALIVE_TTL_SECONDS });
  return { ok: true as const };
}
