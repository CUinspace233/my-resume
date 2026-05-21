import type { ResumeContent, TailoredResumeExportPackage } from '@/types/resume';

const MESSAGE_NAMESPACES = [
  'buttons',
  'common',
  'exportPdf',
  'header',
  'landing',
  'sections',
] as const;

type MessageNamespace = (typeof MESSAGE_NAMESPACES)[number];
type Locale = 'en' | 'zh';
type NamespaceLoader = () => Promise<{ default: unknown }>;

export type AppMessages = Record<MessageNamespace, unknown> & {
  resume: ResumeContent;
};

const messageLoaders: Record<Locale, Record<MessageNamespace, NamespaceLoader>> = {
  en: {
    buttons: () => import('../../messages/en/buttons.json'),
    common: () => import('../../messages/en/common.json'),
    exportPdf: () => import('../../messages/en/exportPdf.json'),
    header: () => import('../../messages/en/header.json'),
    landing: () => import('../../messages/en/landing.json'),
    sections: () => import('../../messages/en/sections.json'),
  },
  zh: {
    buttons: () => import('../../messages/zh/buttons.json'),
    common: () => import('../../messages/zh/common.json'),
    exportPdf: () => import('../../messages/zh/exportPdf.json'),
    header: () => import('../../messages/zh/header.json'),
    landing: () => import('../../messages/zh/landing.json'),
    sections: () => import('../../messages/zh/sections.json'),
  },
};

const resumePackageLoaders: Record<Locale, () => Promise<{ default: unknown }>> = {
  en: () => import('../../messages/en/resume.json'),
  zh: () => import('../../messages/zh/resume.json'),
};

function assertLocale(locale: string): asserts locale is Locale {
  if (locale !== 'en' && locale !== 'zh') {
    throw new Error(`Unsupported locale "${locale}"`);
  }
}

function isResumePackage(value: unknown): value is TailoredResumeExportPackage {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as Partial<TailoredResumeExportPackage>;

  return (
    candidate.type === 'resume-tailor-draft' &&
    candidate.version === 1 &&
    typeof candidate.locale === 'string' &&
    Boolean(candidate.resume) &&
    Array.isArray(candidate.changeSummary) &&
    Boolean(candidate.jdInsights)
  );
}

export async function getResumePackage(locale: string) {
  assertLocale(locale);
  const resumePackage = (await resumePackageLoaders[locale]()).default;

  if (!isResumePackage(resumePackage)) {
    throw new Error(`Invalid resume package for locale "${locale}"`);
  }

  if (resumePackage.locale !== locale) {
    throw new Error(
      `Resume package locale mismatch: expected "${locale}", received "${resumePackage.locale}"`
    );
  }

  return resumePackage;
}

export async function getBaseResume(locale: string) {
  const resumePackage = await getResumePackage(locale);
  return resumePackage.resume;
}

export async function getAppMessages(locale: string) {
  assertLocale(locale);
  const namespaceEntries = await Promise.all(
    MESSAGE_NAMESPACES.map(async namespace => [
      namespace,
      (await messageLoaders[locale][namespace]()).default,
    ])
  );
  const resumePackage = await getResumePackage(locale);

  return {
    ...Object.fromEntries(namespaceEntries),
    resume: resumePackage.resume,
  } as AppMessages;
}
