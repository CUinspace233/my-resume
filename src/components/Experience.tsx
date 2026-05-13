import { FC } from 'react';
import { useTranslations } from 'next-intl';
import type { ResumeExperienceItem } from '@/types/resume';

const Experience: FC = () => {
  const t = useTranslations('resume.experience');

  const experienceData = t.raw('items') as ResumeExperienceItem[];

  return (
    <section className="w-full max-w-3xl mx-auto">
      <h2 className="text-xl font-bold">{t('title')}</h2>
      {experienceData.map(item => (
        <div key={item.id} className="bg-black/[.05] dark:bg-white/[.06] p-2 rounded-lg mb-1">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-lg font-semibold">
              {item.position} – {item.company}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">{item.period}</p>
          </div>
          {item.achievements && item.achievements.length > 0 && (
            <ul className="list-disc list-inside space-y-1 text-xs">
              {item.achievements.map(achievement => (
                <li key={achievement}>{achievement}</li>
              ))}
            </ul>
          )}

          {/* Projects */}
          {item.projects && item.projects.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold">{t('projectsLabel')}</h4>
              {item.projects.map(project => (
                <div key={project.id} className="pl-4 border-l-2 border-gray-200">
                  <div className="font-medium text-lg">
                    {project.title}
                    {project.projectUrl && project.siteName && (
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600"
                      >
                        {' '}
                        ({project.siteName})
                      </a>
                    )}
                  </div>

                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1 flex flex-col">
                    {project.technologies.join(', ')}
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    {project.description.map(desc => (
                      <li key={desc}>{desc}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </section>
  );
};

export default Experience;
