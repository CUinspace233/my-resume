import { FC } from 'react';
import { useTranslations } from 'next-intl';

interface ProjectData {
  title: string;
  repoUrl?: string;
  repoName?: string;
  technologies: string[];
  description: string[];
  projectUrl?: string;
  siteName?: string;
}

interface ExperienceItem {
  company: string;
  position: string;
  period: string;
  achievements: string[];
  projects: ProjectData[];
}

const Experience: FC = () => {
  const t = useTranslations('sections.experience');

  // Get experience data from translations
  const experienceData: ExperienceItem[] = t.raw('experienceData') as ExperienceItem[];

  return (
    <section className="w-full max-w-3xl mx-auto">
      <h2 className="text-xl font-bold">{t('title')}</h2>
      {experienceData.map((item, index) => (
        <div key={index} className="bg-black/[.05] dark:bg-white/[.06] p-2 rounded-lg mb-3">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold">
              {item.position} – {item.company}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">{item.period}</p>
          </div>
          <ul className="list-disc list-inside space-y-1 text-sm">
            {item.achievements.map((achievement, i) => (
              <li key={i}>{achievement}</li>
            ))}
          </ul>

          {/* Projects */}
          {item.projects && item.projects.length > 0 && (
            <div className="mt-2">
              <h4 className="text-lg font-semibold">{t('projects')}</h4>
              {item.projects.map((project, i) => (
                <div key={i} className="pl-4 border-l-2 border-gray-200">
                  <div className="font-medium text-lg">
                    {project.title}
                    {project.projectUrl && (
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
                    {project.description.map((desc, j) => (
                      <li key={j}>{desc}</li>
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
