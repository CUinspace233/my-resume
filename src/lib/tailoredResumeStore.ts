import type { JdInsights, ResumeContent, TailoredResumeDraft } from '@/types/resume';

const DRAFT_TTL_MS = 30 * 60 * 1000;

type TailoredResumeStore = Map<string, TailoredResumeDraft>;

declare global {
  // eslint-disable-next-line no-var
  var __tailoredResumeDrafts: TailoredResumeStore | undefined;
}

function getStore() {
  globalThis.__tailoredResumeDrafts ??= new Map();
  return globalThis.__tailoredResumeDrafts;
}

function pruneExpiredDrafts() {
  const now = Date.now();
  for (const [draftId, draft] of getStore()) {
    if (draft.expiresAt <= now) {
      getStore().delete(draftId);
    }
  }
}

export function createTailoredResumeDraft({
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

  getStore().set(draft.id, draft);
  return draft;
}

export function getTailoredResumeDraft(draftId: string) {
  pruneExpiredDrafts();
  return getStore().get(draftId) ?? null;
}

export function updateTailoredResumeDraft(draftId: string, resume: ResumeContent) {
  const draft = getTailoredResumeDraft(draftId);

  if (!draft) {
    return null;
  }

  const nextDraft: TailoredResumeDraft = {
    ...draft,
    resume,
  };

  getStore().set(draftId, nextDraft);
  return nextDraft;
}
