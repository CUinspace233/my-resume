import { hasPrivateResumeAccess, isPrivatePasswordConfigured } from '@/lib/privateAuth';
import { getBaseResume } from '@/lib/resumeMessages';
import PrivateResumeTailorClient from '@/components/private/PrivateResumeTailorClient';
import { connection } from 'next/server';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function PrivateResumeTailorPage({ params }: PageProps) {
  await connection();

  const { locale } = await params;
  const hasAccess = await hasPrivateResumeAccess();
  const passwordConfigured = isPrivatePasswordConfigured();
  const baseResume = passwordConfigured && hasAccess ? await getBaseResume(locale) : null;

  return (
    <PrivateResumeTailorClient
      locale={locale}
      hasInitialAccess={hasAccess}
      passwordConfigured={passwordConfigured}
      baseResume={baseResume}
    />
  );
}
