import { FC } from 'react';
import { useTranslations } from 'next-intl';
import ResumeText from '@/components/ResumeText';
import type { ResumeSocietyItem } from '@/types/resume';

const Societies: FC = () => {
  const t = useTranslations('resume.societies');
  const societiesData = t.raw('items') as ResumeSocietyItem[];

  return (
    <section className="w-full max-w-3xl mx-auto">
      <h2 className="text-xl font-bold">{t('title')}</h2>
      {societiesData.map(item => (
        <div key={item.id} className="bg-black/[.05] dark:bg-white/[.06] p-2 rounded-lg">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold mb-2">
              <ResumeText text={`${item.position} – ${item.organization}`} />
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              <ResumeText text={item.period} />
            </p>
          </div>
          {/* Society Website */}
          {/* <div className="text-xs text-gray-400 mb-1 flex gap-1">
            {item.societyWebsiteUrl && (
              <>
                <a
                  className="text-indigo-600"
                  href={item.societyWebsiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.societyWebsiteDescription}
                </a>
                <a href={item.societyWebsiteUrl} target="_blank" rel="noopener noreferrer">
                  {item.societyWebsiteUrl}
                </a>
              </>
            )}
          </div> */}
          {/* Repo */}
          <div className="text-xs text-gray-400 mb-1 flex gap-1">
            {item.repoUrl && (
              <>
                <a
                  className="text-indigo-600"
                  href={item.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ResumeText text={item.repoDescription} />
                </a>
                <a
                  href={item.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline break-all"
                >
                  {item.repoUrl}
                </a>
              </>
            )}
          </div>
          <ul className="list-disc list-inside space-y-1 text-xs">
            {item.achievements.map(achievement => (
              <li key={achievement}>
                <ResumeText text={achievement} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
};

export default Societies;
