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
    <div
      className="print:hidden inline-flex items-center rounded-md overflow-hidden"
      style={{ boxShadow: '0px 0px 0px 1px rgb(235,235,235)' }}
    >
      {LANGUAGES.map(({ code, label }) => {
        const active = locale === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => switchLocale(code)}
            className="font-[family-name:var(--font-geist-sans)] text-xs font-medium w-8 h-8 transition-colors cursor-pointer"
            style={
              active
                ? { background: 'var(--foreground)', color: 'var(--background)' }
                : { background: 'transparent', color: '#808080' }
            }
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
