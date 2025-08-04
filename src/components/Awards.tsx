'use client';

import { FC } from 'react';
import { useTranslations } from 'next-intl';

interface AwardItem {
  place: string;
  award: string;
  period: string;
  link: string;
}

const Awards: FC = () => {
  const t = useTranslations('sections.awards');
  const awardsData: AwardItem[] = t.raw('awardsData') as AwardItem[];

  return (
    <section className="w-full max-w-3xl mx-auto">
      <h2 className="text-xl font-bold">{t('title')}</h2>
      {awardsData.map((item, index) => (
        <div key={index} className="bg-black/[.05] dark:bg-white/[.06] p-2 rounded-lg mb-3">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row justify-start items-center gap-1">
              <span className="text-lg">•</span>
              <span className="text-sm font-bold">{item.place}</span>
              <span>-</span>
              <span className="text-sm">{item.award}</span>
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400">{item.period}</span>
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
