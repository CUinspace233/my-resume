'use client';

import { FC } from 'react';
import { useTranslations } from 'next-intl';

const Education: FC = () => {
  const t = useTranslations('sections.education');

  return (
    <section className="w-full max-w-3xl mx-auto">
      <h2 className="text-xl font-bold">{t('title')}</h2>
      <div className="bg-black/[.05] dark:bg-white/[.06] p-2 rounded-lg">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">{t('university')}</h3>
          <span className="text-xs text-gray-600 dark:text-gray-400">{t('period')}</span>
        </div>
        <p className="text-sm mb-2">{t('degree')}</p>
        <p className="text-xs">
          <span className="font-bold">{t('relevantCourses')}:</span> {t('courses')}
        </p>
      </div>
    </section>
  );
};

export default Education;
