'use client';

import { FC } from 'react';
import { useTranslations } from 'next-intl';
import ResumeText from '@/components/ResumeText';
import type { ResumeAwardItem } from '@/types/resume';

const Awards: FC = () => {
  const t = useTranslations('resume.awards');
  const awardsData = t.raw('items') as ResumeAwardItem[];

  return (
    <section className="w-full max-w-3xl mx-auto">
      <h2 className="text-xl font-bold">{t('title')}</h2>
      {awardsData.map(item => (
        <div key={item.id} className="bg-black/[.05] dark:bg-white/[.06] p-2 rounded-lg mb-3">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row justify-start items-center gap-1">
              <span className="text-lg">•</span>
              <span className="text-sm font-bold">
                <ResumeText text={item.place} />
              </span>
              <span>-</span>
              <span className="text-sm">
                <ResumeText text={item.award} />
              </span>
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              <ResumeText text={item.period} />
            </span>
          </div>
          {item.link && (
            <div className="text-sm text-gray-600 dark:text-gray-400 ml-3">
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                {item.link}
              </a>
            </div>
          )}
        </div>
      ))}
    </section>
  );
};

export default Awards;
