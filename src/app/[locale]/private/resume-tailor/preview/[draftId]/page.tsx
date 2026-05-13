import IntlProvider from '@/components/IntlProvider';
import ResumePageClient from '@/components/ResumePageClient';
import { hasPrivateResumeAccess } from '@/lib/privateAuth';
import { getTailoredResumeDraft } from '@/lib/tailoredResumeStore';

export const dynamic = 'force-dynamic';

type PreviewPageProps = {
  params: Promise<{ locale: string; draftId: string }>;
  searchParams: Promise<{ pdf?: string; print?: string }>;
};

export default async function TailoredResumePreviewPage({
  params,
  searchParams,
}: PreviewPageProps) {
  const { locale, draftId } = await params;
  const resolvedSearchParams = await searchParams;
  const isPrintMode = resolvedSearchParams.pdf === '1' || resolvedSearchParams.print === '1';
  const hasAccess = await hasPrivateResumeAccess();

  if (!hasAccess) {
    return (
      <main className="min-h-screen bg-white p-6 text-sm text-[#171717]">
        Private resume preview requires access.
      </main>
    );
  }

  const draft = await getTailoredResumeDraft(draftId);

  if (!draft || draft.locale !== locale) {
    return (
      <main className="min-h-screen bg-white p-6 text-sm text-[#171717]">
        Draft not found or expired.
      </main>
    );
  }

  const messages = (await import(`../../../../../../../messages/${locale}.json`)).default;

  return (
    <IntlProvider locale={locale} messages={{ ...messages, resume: draft.resume }} timeZone="UTC">
      <ResumePageClient locale={locale} isPrintMode={isPrintMode} />
    </IntlProvider>
  );
}
