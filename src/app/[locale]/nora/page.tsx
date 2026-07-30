import NoraLandingClient from '@/components/NoraLandingClient';
import type { Metadata } from 'next';

const NORA_BASE_URL = 'https://nora.cuinspace.com';

type NoraPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: NoraPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isChinese = locale === 'zh';

  return {
    title: isChinese ? '诺日格拉 — 主页' : 'Nuorigela',
    description: isChinese
      ? '诺日格拉的个人主页：国际商务硕士在读，专注运营执行与跨团队协作。'
      : "Nuorigela's personal homepage: incoming International Business master's student focused on operations execution and cross-team collaboration.",
    alternates: {
      canonical: isChinese ? `${NORA_BASE_URL}/zh` : NORA_BASE_URL,
      languages: {
        en: NORA_BASE_URL,
        zh: `${NORA_BASE_URL}/zh`,
      },
    },
    openGraph: {
      type: 'profile',
      title: isChinese ? '诺日格拉 — 主页' : 'Nuorigela',
      description: isChinese
        ? '诺日格拉的个人主页：国际商务硕士在读，专注运营执行与跨团队协作。'
        : "Nuorigela's personal homepage: incoming International Business master's student focused on operations execution and cross-team collaboration.",
      url: isChinese ? `${NORA_BASE_URL}/zh` : NORA_BASE_URL,
      locale: isChinese ? 'zh_CN' : 'en_US',
    },
  };
}

export default async function NoraPage({ params }: NoraPageProps) {
  const { locale } = await params;

  return <NoraLandingClient locale={locale} />;
}
