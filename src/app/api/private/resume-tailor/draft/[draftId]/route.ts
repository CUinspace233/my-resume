import type { NextRequest } from 'next/server';
import { getBaseResume } from '@/lib/resumeMessages';
import {
  privateJson,
  requestHasPrivateResumeAccess,
  unauthorizedPrivateJson,
} from '@/lib/privateAuth';
import { getTailoredResumeDraft, updateTailoredResumeDraft } from '@/lib/tailoredResumeStore';
import { validateTailoredResume } from '@/lib/resumeValidation';
import type { ResumeContent } from '@/types/resume';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Params = {
  params: Promise<{ draftId: string }>;
};

export async function PATCH(request: NextRequest, { params }: Params) {
  if (!requestHasPrivateResumeAccess(request)) {
    return unauthorizedPrivateJson();
  }

  const { draftId } = await params;
  const draft = await getTailoredResumeDraft(draftId);

  if (!draft) {
    return privateJson({ error: 'Draft not found or expired' }, { status: 404 });
  }

  const body = (await request.json().catch(() => null)) as { resume?: ResumeContent } | null;

  if (!body?.resume) {
    return privateJson({ error: 'Missing resume draft' }, { status: 400 });
  }

  try {
    const baseResume = await getBaseResume(draft.locale);
    validateTailoredResume(baseResume, body.resume);
    const updatedDraft = await updateTailoredResumeDraft(draftId, body.resume);

    return privateJson({ draftId, tailoredResume: updatedDraft?.resume });
  } catch (error) {
    return privateJson(
      {
        error: error instanceof Error ? error.message : 'Failed to update draft',
      },
      { status: 400 }
    );
  }
}
