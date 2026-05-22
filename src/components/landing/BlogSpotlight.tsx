'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

export default function BlogSpotlight() {
  const locale = useLocale();
  const t = useTranslations('landing.blog');
  const href = `/${locale}/blog/agent-runtime-anatomy`;

  return (
    <section
      id="blog"
      className="mx-auto grid max-w-[1200px] gap-8 px-6 py-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,1.1fr)] lg:items-center"
      style={{ borderTop: '1px solid #ebebeb' }}
    >
      <div>
        <h2
          className="mb-5 font-[family-name:var(--font-geist-mono)] text-[11px] font-medium uppercase tracking-widest"
          style={{ color: '#808080' }}
        >
          {t('label')}
        </h2>
        <p className="max-w-xl font-[family-name:var(--font-geist-sans)] text-3xl font-semibold leading-tight text-[#171717] dark:text-[#ededed] sm:text-4xl">
          {t('headline')}
        </p>
        <p className="mt-5 max-w-xl font-[family-name:var(--font-geist-sans)] text-base leading-7 text-[#4d4d4d] dark:text-[#a1a1a1]">
          {t('description')}
        </p>
      </div>

      <Link
        href={href}
        className="group block overflow-hidden rounded-xl bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl dark:bg-[#111]"
        style={{ boxShadow: 'var(--card-shadow)', textDecoration: 'none' }}
      >
        <div className="grid min-h-[260px] gap-0 sm:grid-cols-[1fr_1.2fr]">
          <div className="relative flex min-h-[220px] flex-col justify-between overflow-hidden bg-[#111827] p-5 text-white">
            <div
              className="absolute inset-0 opacity-80"
              style={{
                background:
                  'linear-gradient(135deg, rgba(10,114,239,0.95), rgba(17,24,39,0.9) 45%, rgba(255,91,79,0.92))',
              }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)] bg-[size:28px_28px] opacity-30" />
            <div className="relative">
              <span className="font-[family-name:var(--font-geist-mono)] text-[10px] font-medium uppercase tracking-widest text-white/70">
                {t('eyebrow')}
              </span>
              <div className="mt-6 space-y-2 font-[family-name:var(--font-geist-mono)] text-xs text-white/80">
                <div className="rounded-md bg-black/25 px-3 py-2">model → tool_use</div>
                <div className="rounded-md bg-black/25 px-3 py-2">runtime → tool_result</div>
                <div className="rounded-md bg-black/25 px-3 py-2">context → next turn</div>
              </div>
            </div>
            <span className="relative font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-widest text-white/70">
              query loop
            </span>
          </div>

          <div className="flex flex-col p-6">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#0a72ef]/10 px-2 py-0.5 font-[family-name:var(--font-geist-mono)] text-[10px] font-medium uppercase tracking-widest text-[#0a72ef]">
                {t('tag')}
              </span>
              <span className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-wider text-[#808080]">
                {t('readTime')}
              </span>
            </div>
            <h3 className="mt-5 font-[family-name:var(--font-geist-sans)] text-2xl font-semibold leading-tight text-[#171717] dark:text-[#ededed]">
              {t('title')}
            </h3>
            <p className="mt-4 flex-1 font-[family-name:var(--font-geist-sans)] text-sm leading-6 text-[#4d4d4d] dark:text-[#a1a1a1]">
              {t('summary')}
            </p>
            <span className="mt-6 font-[family-name:var(--font-geist-sans)] text-sm font-medium text-[#0072f5] transition-colors group-hover:text-[#0a72ef]">
              {t('cta')} →
            </span>
          </div>
        </div>
      </Link>
    </section>
  );
}
