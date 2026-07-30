import NrglResumePageClient from '@/components/NrglResumePageClient';
import type { Metadata } from 'next';
import { existsSync } from 'node:fs';
import path from 'node:path';

const NORA_BASE_URL = 'https://nora.cuinspace.com';

type NrglResumePageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ print?: string; pdf?: string; trade?: string }>;
};

export async function generateMetadata({ params }: NrglResumePageProps): Promise<Metadata> {
  const { locale } = await params;
  const isChinese = locale === 'zh';

  return {
    title: isChinese ? '诺日格拉 — 个人简历' : 'Nuorigela — Resume',
    description: isChinese
      ? '诺日格拉的教育背景、实习经历与校园经历。'
      : "Nuorigela's education, internship experience, and campus experience.",
    alternates: {
      canonical: isChinese ? `${NORA_BASE_URL}/zh/resume` : `${NORA_BASE_URL}/resume`,
      languages: {
        en: `${NORA_BASE_URL}/resume`,
        zh: `${NORA_BASE_URL}/zh/resume`,
      },
    },
    openGraph: {
      type: 'profile',
      title: isChinese ? '诺日格拉 — 个人简历' : 'Nuorigela — Resume',
      description: isChinese
        ? '诺日格拉的教育背景、实习经历与校园经历。'
        : "Nuorigela's education, internship experience, and campus experience.",
      url: isChinese ? `${NORA_BASE_URL}/zh/resume` : `${NORA_BASE_URL}/resume`,
      locale: isChinese ? 'zh_CN' : 'en_US',
    },
  };
}

export default async function NrglResumePage({ params, searchParams }: NrglResumePageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const isPrintMode = resolvedSearchParams.print === '1' || resolvedSearchParams.pdf === '1';
  const showTradeExperience = resolvedSearchParams.trade === '1';
  const showPhoto = existsSync(path.join(process.cwd(), 'public', 'nrgl', 'profile.jpg'));

  return (
    <NrglResumePageClient
      locale={locale}
      isPrintMode={isPrintMode}
      showPhoto={showPhoto}
      showTradeExperience={showTradeExperience}
    />
  );
}
