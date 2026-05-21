'use client';

import { FC } from 'react';
import { useTranslations } from 'next-intl';
import ResumeText from '@/components/ResumeText';

const Education: FC = () => {
  const t = useTranslations('resume.education');

  return (
    <section className="w-full max-w-3xl mx-auto">
      <h2 className="text-xl font-bold">{t('title')}</h2>
      <div className="bg-black/[.05] dark:bg-white/[.06] p-2 rounded-lg">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">
            <ResumeText text={t('university')} />
          </h3>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            <ResumeText text={t('period')} />
          </span>
        </div>
        <p className="text-sm mb-2">
          <ResumeText text={t('degree')} />
        </p>
        <p className="text-xs">
          <span className="font-bold">
            <ResumeText text={t('relevantCourses')} />:
          </span>{' '}
          <ResumeText text={t('courses')} />
        </p>
      </div>
    </section>
  );
};

export default Education;
