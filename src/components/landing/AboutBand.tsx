'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

export default function AboutBand() {
  const t = useTranslations('landing.about');
  const locale = useLocale();

  return (
    <section
      id="about"
      className="px-6 py-20 max-w-[1200px] mx-auto"
      style={{ borderTop: '1px solid #171717' }}
    >
      <div className="max-w-[680px]">
        <h2
          className="font-[family-name:var(--font-geist-mono)] text-[11px] font-medium uppercase tracking-widest mb-6"
          style={{ color: '#808080' }}
        >
          {t('label')}
        </h2>

        <p
          className="font-[family-name:var(--font-geist-sans)] font-normal leading-relaxed mb-8"
          style={{ fontSize: '18px', color: '#4d4d4d', lineHeight: '1.8' }}
        >
          {t('body')}
        </p>

        {/* Workflow accent strip */}
        <div className="flex gap-6 mb-8 flex-wrap">
          <span
            className="font-[family-name:var(--font-geist-mono)] text-xs font-medium uppercase tracking-widest"
            style={{ color: '#0a72ef' }}
          >
            ● Develop
          </span>
          <span
            className="font-[family-name:var(--font-geist-mono)] text-xs font-medium uppercase tracking-widest"
            style={{ color: '#de1d8d' }}
          >
            ● Preview
          </span>
          <span
            className="font-[family-name:var(--font-geist-mono)] text-xs font-medium uppercase tracking-widest"
            style={{ color: '#ff5b4f' }}
          >
            ● Ship
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-4 flex-wrap">
          <a
            href="mailto:gmforzh@gmail.com"
            className="font-[family-name:var(--font-geist-sans)] text-sm font-medium underline underline-offset-4"
            style={{ color: '#0072f5' }}
          >
            {t('contact')}
          </a>
          <Link
            href={`/${locale}/resume`}
            className="font-[family-name:var(--font-geist-sans)] text-sm font-medium text-white bg-[#171717] dark:bg-[#ededed] dark:text-[#171717] px-4 py-2 rounded-md hover:opacity-80 transition-opacity"
          >
            {t('viewResume')} →
          </Link>
        </div>
      </div>
    </section>
  );
}
