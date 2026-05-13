'use client';

import { FC } from 'react';
import { useLocale, useTranslations } from 'next-intl';

const Header: FC = () => {
  const t = useTranslations('resume.header');
  const locale = useLocale();
  const mobile =
    locale === 'zh' ? process.env.NEXT_PUBLIC_MOBILE_ZH : process.env.NEXT_PUBLIC_MOBILE_EN;

  return (
    <header className="w-full max-w-3xl mx-auto mb-3">
      <h1 className="text-2xl font-bold mb-2">{t('name')}</h1>
      <div className="flex flex-wrap gap-x-1.5 gap-y-0.5 text-xs">
        {mobile && (
          <>
            <a href={`tel:${mobile.replace(/\s+/g, '')}`} className="hover:underline">
              {mobile}
            </a>
            <span className="text-gray-400">|</span>
          </>
        )}
        <a href={t('emailHref')} className="hover:underline">
          {t('email')}
        </a>
        <span className="text-gray-400">|</span>
        <a
          href={t('githubUrl')}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-3"
        >
          {t('githubLabel')}
        </a>
        <span className="text-gray-400">|</span>
        <a
          href={t('linkedinUrl')}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-3"
        >
          {t('linkedinLabel')}
        </a>
      </div>
    </header>
  );
};

export default Header;
