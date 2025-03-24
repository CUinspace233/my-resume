'use client';

import { FC } from 'react';
import { useTranslations } from 'next-intl';

const Education: FC = () => {
  const t = useTranslations('sections.education');

  return (
    <section className="w-full max-w-3xl mx-auto mb-4">
      <h2 className="text-xl font-bold mb-2">{t('title')}</h2>
      <div className="bg-black/[.05] dark:bg-white/[.06] p-4 rounded-lg">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{t('university')}</h3>
          <span className="text-xs text-gray-600 dark:text-gray-400">{t('period')}</span>
        </div>
        <p className="text-sm mb-2">{t('degree')}</p>
        <p className="text-xs">
          <span className="font-medium">{t('coursework')}:</span> {t('courses')}
        </p>
      </div>
    </section>
  );
};

export default Education;
