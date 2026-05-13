import type { NextRequest } from 'next/server';
import {
  privateJson,
  requestHasPrivateResumeAccess,
  unauthorizedPrivateJson,
} from '@/lib/privateAuth';
import { getBaseResume } from '@/lib/resumeMessages';
import { validateTailoredResume } from '@/lib/resumeValidation';
import { createTailoredResumeDraft } from '@/lib/tailoredResumeStore';
import type { ResumeContent } from '@/types/resume';

const VALID_LOCALES = new Set(['en', 'zh']);

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  if (!requestHasPrivateResumeAccess(request)) {
    return unauthorizedPrivateJson();
  }

  const body = (await request.json().catch(() => null)) as {
    locale?: string;
    resume?: ResumeContent;
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
    const draft = createTailoredResumeDraft({
      locale: body.locale,
      resume: body.resume,
      changeSummary: [],
      jdInsights: {
        roleKeywords: [],
        requiredSkills: [],
        matchNotes: [],
        gapNotes: [],
      },
    });

    return privateJson({
      draftId: draft.id,
      tailoredResume: draft.resume,
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
