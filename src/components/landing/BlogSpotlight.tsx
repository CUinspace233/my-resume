'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

const articles = [
  {
    key: 'runtime',
    href: 'agent-runtime-anatomy',
    accent: 'bg-[#0a72ef]',
    lines: ['model -> tool_use', 'runtime -> tool_result', 'context -> next turn'],
  },
  {
    key: 'multiAgent',
    href: 'multi-agent-collaboration',
    accent: 'bg-[#ff5b4f]',
    lines: ['team -> task list', 'mailbox -> message', 'agent -> notification'],
  },
] as const;

export default function BlogSpotlight() {
  const locale = useLocale();
  const t = useTranslations('landing.blog');

  return (
    <section
      id="blog"
      className="mx-auto grid max-w-[1200px] gap-8 px-6 py-16 lg:grid-cols-[minmax(0,0.82fr)_minmax(360px,1.18fr)] lg:items-center"
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

      <div className="grid gap-4">
        {articles.map(article => (
          <Link
            key={article.key}
            href={`/${locale}/blog/${article.href}`}
            className="group grid overflow-hidden rounded-lg bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl dark:bg-[#111] sm:grid-cols-[190px_minmax(0,1fr)]"
            style={{ boxShadow: 'var(--card-shadow)', textDecoration: 'none' }}
          >
            <div className="relative flex min-h-[170px] flex-col justify-between overflow-hidden bg-[#111827] p-5 text-white">
              <div className={`absolute inset-y-0 left-0 w-1.5 ${article.accent}`} />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:28px_28px] opacity-25" />
              <div className="relative">
                <span className="font-[family-name:var(--font-geist-mono)] text-[10px] font-medium uppercase tracking-widest text-white/70">
                  {t(`items.${article.key}.eyebrow`)}
                </span>
                <div className="mt-5 space-y-2 font-[family-name:var(--font-geist-mono)] text-xs text-white/80">
                  {article.lines.map(line => (
                    <div key={line} className="rounded-md bg-black/25 px-3 py-2">
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col p-6">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#0a72ef]/10 px-2 py-0.5 font-[family-name:var(--font-geist-mono)] text-[10px] font-medium uppercase tracking-widest text-[#0a72ef]">
                  {t(`items.${article.key}.tag`)}
                </span>
                <span className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-wider text-[#808080]">
                  {t(`items.${article.key}.readTime`)}
                </span>
              </div>
              <h3 className="mt-5 font-[family-name:var(--font-geist-sans)] text-2xl font-semibold leading-tight text-[#171717] dark:text-[#ededed]">
                {t(`items.${article.key}.title`)}
              </h3>
              <p className="mt-4 flex-1 font-[family-name:var(--font-geist-sans)] text-sm leading-6 text-[#4d4d4d] dark:text-[#a1a1a1]">
                {t(`items.${article.key}.summary`)}
              </p>
              <span className="mt-6 font-[family-name:var(--font-geist-sans)] text-sm font-medium text-[#0072f5] transition-colors group-hover:text-[#0a72ef]">
                {t('cta')} →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
