'use client';

import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ThemeToggle from '@/components/ThemeToggle';
import GithubLink from '@/components/GithubLink';
import Link from 'next/link';

export default function SiteNav() {
  const t = useTranslations('landing.nav');
  const locale = useLocale();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md print:hidden"
      style={{ boxShadow: '0px 1px 0px 0px rgba(0,0,0,0.08)' }}
    >
      <div className="mx-auto grid h-16 max-w-[1200px] grid-cols-2 items-center px-6 sm:grid-cols-3">
        {/* Left: name */}
        <Link
          href={`/${locale}`}
          className="font-[family-name:var(--font-geist-sans)] text-sm font-medium text-[#171717] dark:text-[#ededed] tracking-tight whitespace-nowrap hover:opacity-70 transition-opacity"
        >
          Henrick Lin
        </Link>

        {/* Center: nav links */}
        <div className="hidden sm:flex items-center justify-center gap-6">
          <a
            href="#projects"
            className="font-[family-name:var(--font-geist-sans)] text-sm font-medium text-[#4d4d4d] dark:text-[#a1a1a1] hover:text-[#171717] dark:hover:text-[#ededed] transition-colors"
          >
            {t('projects')}
          </a>
          <a
            href="#about"
            className="font-[family-name:var(--font-geist-sans)] text-sm font-medium text-[#4d4d4d] dark:text-[#a1a1a1] hover:text-[#171717] dark:hover:text-[#ededed] transition-colors"
          >
            {t('about')}
          </a>
        </div>

        {/* Right: controls + resume CTA */}
        <div className="flex items-center justify-end gap-1.5">
          <LanguageSwitcher />
          <ThemeToggle />
          <GithubLink
            repoUrl="https://github.com/CUinspace233"
            size="medium"
            className="hidden sm:inline-flex"
          />
          <Link
            href={`/${locale}/resume`}
            className="hidden h-9 items-center justify-center rounded-xl bg-[#171717] px-3.5 text-[13px] font-medium whitespace-nowrap text-center text-white transition-opacity hover:opacity-80 dark:bg-[#ededed] dark:text-[#171717] sm:inline-flex"
            style={{ minWidth: '112px' }}
          >
            {t('resume')} →
          </Link>
        </div>
      </div>
    </nav>
  );
}
