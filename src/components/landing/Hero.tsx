'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import CodeCard from './CodeCard';

export default function Hero() {
  const t = useTranslations('landing.hero');
  const locale = useLocale();

  return (
    <section className="pt-28 pb-20 px-6 max-w-[1200px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left: text */}
        <div className="flex flex-col gap-6">
          {/* Eyebrow */}
          <div className="flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: '#0a72ef' }}
            />
            <span
              className="font-[family-name:var(--font-geist-mono)] text-[11px] font-medium uppercase tracking-widest"
              style={{ color: '#4d4d4d' }}
            >
              {t('eyebrow')}
            </span>
          </div>

          {/* Headline */}
          <div className="flex flex-col gap-1">
            <h1
              className="font-[family-name:var(--font-geist-sans)] font-semibold text-[#171717] dark:text-[#ededed] leading-none"
              style={{
                fontSize: 'clamp(36px, 5vw, 56px)',
                letterSpacing: '-0.04em',
              }}
            >
              {t('headline1')}
            </h1>
            <p
              className="font-[family-name:var(--font-geist-mono)] font-medium"
              style={{
                fontSize: 'clamp(16px, 2.2vw, 22px)',
                letterSpacing: '-0.01em',
                color: '#4d4d4d',
              }}
            >
              <span style={{ color: '#0a72ef' }}>React</span>
              {' · '}
              <span style={{ color: '#0a72ef' }}>Next.js</span>
              {' · '}
              <span style={{ color: '#de1d8d' }}>Python</span>
              {' · '}
              <span style={{ color: '#ff5b4f' }}>FastAPI</span>
            </p>
          </div>

          {/* Subtitle */}
          <p
            className="font-[family-name:var(--font-geist-sans)] font-normal leading-relaxed max-w-[480px]"
            style={{ fontSize: '18px', color: '#4d4d4d' }}
          >
            {t('subtitle')}
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href={`/${locale}/resume`}
              className="font-[family-name:var(--font-geist-sans)] text-sm font-medium text-white bg-[#171717] dark:bg-[#ededed] dark:text-[#171717] px-4 py-2 rounded-md hover:opacity-80 transition-opacity"
            >
              {t('ctaPrimary')}
            </Link>
            <a
              href="https://github.com/CUinspace233"
              target="_blank"
              rel="noopener noreferrer"
              className="font-[family-name:var(--font-geist-sans)] text-sm font-medium text-[#171717] dark:text-[#ededed] px-4 py-2 rounded-md transition-colors hover:bg-[#fafafa] dark:hover:bg-[#111]"
              style={{ boxShadow: '0px 0px 0px 1px rgb(235,235,235)' }}
            >
              {t('ctaSecondary')} ↗
            </a>
          </div>
        </div>

        {/* Right: code card */}
        <div className="w-full">
          <CodeCard />
        </div>
      </div>
    </section>
  );
}
