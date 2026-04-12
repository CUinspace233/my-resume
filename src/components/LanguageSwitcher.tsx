'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'zh', label: '中' },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    if (newLocale === locale) return;
    const newPath = `/${newLocale}${pathname.startsWith(`/${locale}`) ? pathname.slice(locale.length + 1) : pathname}`;
    router.replace(newPath);
  };

  return (
    <div className="language-switcher-container print:hidden inline-flex h-9 shrink-0 items-center overflow-hidden rounded-xl border border-black/10 bg-white/90 p-0.5 dark:border-white/10 dark:bg-[#171717]">
      {LANGUAGES.map(({ code, label }) => {
        const active = locale === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => switchLocale(code)}
            className="font-[family-name:var(--font-geist-sans)] flex h-8 min-w-[40px] items-center justify-center rounded-[9px] px-2 text-[13px] font-semibold transition-colors cursor-pointer"
            style={
              active
                ? { background: 'var(--foreground)', color: 'var(--background)' }
                : { background: 'transparent', color: 'var(--gray-500)' }
            }
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
