import ResumePageClient from '@/components/ResumePageClient';

type ResumePageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ print?: string; pdf?: string }>;
};

export default async function ResumePage({ params, searchParams }: ResumePageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const isPrintMode = resolvedSearchParams.print === '1' || resolvedSearchParams.pdf === '1';

  return <ResumePageClient locale={locale} isPrintMode={isPrintMode} />;
}
