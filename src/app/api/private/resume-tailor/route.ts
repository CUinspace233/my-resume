import type { NextRequest } from 'next/server';
import { getBaseResume } from '@/lib/resumeMessages';
import { getResumeTailorProvider } from '@/lib/resumeTailorProvider';
import { validateTailoredResume } from '@/lib/resumeValidation';
import { createTailoredResumeDraft } from '@/lib/tailoredResumeStore';
import {
  privateJson,
  requestHasPrivateResumeAccess,
  unauthorizedPrivateJson,
} from '@/lib/privateAuth';
import type { ResumeTailorRequest, ResumeTailorResponse } from '@/types/resume';

const VALID_LOCALES = new Set(['en', 'zh']);

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  if (!requestHasPrivateResumeAccess(request)) {
    return unauthorizedPrivateJson();
  }

  const body = (await request.json().catch(() => null)) as ResumeTailorRequest | null;
  const locale = body?.locale;
  const jdText = body?.jdText?.trim();

  if (!locale || !VALID_LOCALES.has(locale)) {
    return privateJson({ error: 'Invalid locale' }, { status: 400 });
  }

  if (!jdText || jdText.length < 50) {
    return privateJson({ error: 'Please provide a longer job description' }, { status: 400 });
  }

  try {
    const baseResume = await getBaseResume(locale);
    const provider = getResumeTailorProvider();
    let output = await provider.tailor({
      locale,
      resume: baseResume,
      jdText,
      userInstructions: body.userInstructions,
    });

    try {
      validateTailoredResume(baseResume, output.tailoredResume);
    } catch (validationError) {
      output = await provider.tailor({
        locale,
        resume: baseResume,
        jdText,
        userInstructions: body.userInstructions,
        repairContext: {
          validationError:
            validationError instanceof Error
              ? validationError.message
              : 'Tailored resume failed local validation',
          previousOutput: output,
        },
      });

      validateTailoredResume(baseResume, output.tailoredResume);
    }

    const draft = await createTailoredResumeDraft({
      locale,
      resume: output.tailoredResume,
      jdTitle: output.jdTitle,
      company: output.company,
      changeSummary: output.changeSummary,
      jdInsights: output.jdInsights,
    });

    const response: ResumeTailorResponse = {
      draftId: draft.id,
      tailoredResume: draft.resume,
      changeSummary: draft.changeSummary,
      jdInsights: draft.jdInsights,
    };

    return privateJson(response);
  } catch (error) {
    return privateJson(
      {
        error: error instanceof Error ? error.message : 'Failed to tailor resume',
      },
      { status: 500 }
    );
  }
}
