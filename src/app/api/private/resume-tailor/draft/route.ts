import type { NextRequest } from 'next/server';
import {
  privateJson,
  requestHasPrivateResumeAccess,
  unauthorizedPrivateJson,
} from '@/lib/privateAuth';
import { getBaseResume } from '@/lib/resumeMessages';
import { validateTailoredResume } from '@/lib/resumeValidation';
import { createTailoredResumeDraft } from '@/lib/tailoredResumeStore';
import type { JdInsights, ResumeContent } from '@/types/resume';

const VALID_LOCALES = new Set(['en', 'zh']);

const emptyJdInsights: JdInsights = {
  roleKeywords: [],
  requiredSkills: [],
  matchNotes: [],
  gapNotes: [],
};

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === 'string');
}

function isJdInsights(value: unknown): value is JdInsights {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as Partial<JdInsights>;

  return (
    isStringArray(candidate.roleKeywords) &&
    isStringArray(candidate.requiredSkills) &&
    isStringArray(candidate.matchNotes) &&
    isStringArray(candidate.gapNotes)
  );
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  if (!requestHasPrivateResumeAccess(request)) {
    return unauthorizedPrivateJson();
  }

  const body = (await request.json().catch(() => null)) as {
    locale?: string;
    resume?: ResumeContent;
    changeSummary?: string[];
    jdInsights?: JdInsights;
    company?: string;
    jdTitle?: string;
  } | null;

  if (!body?.locale || !VALID_LOCALES.has(body.locale)) {
    return privateJson({ error: 'Invalid locale' }, { status: 400 });
  }

  if (!body.resume) {
    return privateJson({ error: 'Missing resume draft' }, { status: 400 });
  }

  try {
    const baseResume = await getBaseResume(body.locale);
    validateTailoredResume(baseResume, body.resume);
    const draft = await createTailoredResumeDraft({
      locale: body.locale,
      resume: body.resume,
      changeSummary: isStringArray(body.changeSummary) ? body.changeSummary : [],
      jdInsights: isJdInsights(body.jdInsights) ? body.jdInsights : emptyJdInsights,
      company: typeof body.company === 'string' ? body.company : undefined,
      jdTitle: typeof body.jdTitle === 'string' ? body.jdTitle : undefined,
    });

    return privateJson({
      draftId: draft.id,
      tailoredResume: draft.resume,
      changeSummary: draft.changeSummary,
      jdInsights: draft.jdInsights,
      company: draft.company,
      jdTitle: draft.jdTitle,
    });
  } catch (error) {
    return privateJson(
      {
        error: error instanceof Error ? error.message : 'Failed to create preview draft',
      },
      { status: 400 }
    );
  }
}
