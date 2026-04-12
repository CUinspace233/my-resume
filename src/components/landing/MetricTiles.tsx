'use client';

import { useTranslations } from 'next-intl';

export default function MetricTiles() {
  const t = useTranslations('landing.metrics');
  const items = t.raw('items') as Array<{ value: string; label: string }>;

  return (
    <section
      className="px-6 py-16 max-w-[1200px] mx-auto"
      style={{ borderTop: '1px solid #ebebeb' }}
    >
      <p
        className="font-[family-name:var(--font-geist-mono)] text-[11px] font-medium uppercase tracking-widest mb-8"
        style={{ color: '#808080' }}
      >
        {t('label')}
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 p-5 rounded-lg bg-white dark:bg-[#111]"
            style={{ boxShadow: 'var(--card-shadow)' }}
          >
            <span
              className="font-[family-name:var(--font-geist-sans)] font-semibold text-[#171717] dark:text-[#ededed] leading-none"
              style={{ fontSize: 'clamp(24px, 3vw, 36px)', letterSpacing: '-0.04em' }}
            >
              {item.value}
            </span>
            <span
              className="font-[family-name:var(--font-geist-sans)] text-xs font-medium"
              style={{ color: '#4d4d4d' }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
