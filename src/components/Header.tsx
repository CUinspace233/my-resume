'use client';

import { FC } from 'react';
import { useTranslations } from 'next-intl';

const Header: FC = () => {
  const t = useTranslations('header');
  const mobile = process.env.NEXT_PUBLIC_MOBILE;

  return (
    <header className="w-full max-w-3xl mx-auto mb-4">
      <h1 className="text-2xl font-bold mb-2">{t('name')}</h1>
      <div className="flex flex-wrap gap-2 text-xs">
        {mobile && (
          <>
            <a href={`tel:${mobile.replace(/\s+/g, '')}`} className="hover:underline">
              Mobile: {mobile}
            </a>
            <span className="text-gray-400">|</span>
          </>
        )}
        <a href="mailto:gmforzh@gmail.com" className="hover:underline">
          Email: gmforzh@gmail.com
        </a>
        <span className="text-gray-400">|</span>
        <a
          href="https://github.com/CUinspace233"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-3"
        >
          GitHub: github.com/CUinspace233
        </a>
        <span className="text-gray-400">|</span>
        <a
          href="https://www.linkedin.com/in/henrick-lin-8a2043325/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-3"
        >
          LinkedIn: linkedin.com/in/henrick-lin-8a2043325/
        </a>
      </div>
    </header>
  );
};

export default Header;
