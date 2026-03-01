import { FC } from 'react';
import { useTranslations } from 'next-intl';

// Project metadata definition
interface ProjectData {
  title: string;
  repoUrl?: string;
  repoName?: string;
  technologies: string[];
  description: string[];
  projectUrl?: string;
  siteName?: string;
  period?: string;
}

const Projects: FC = () => {
  const t = useTranslations('sections.projects');
  const projectsData: ProjectData[] = t.raw('projectsData') as ProjectData[];

  return (
    <section className="w-full max-w-3xl mx-auto">
      <h2 className="text-xl font-bold">{t('title')}</h2>
      <div className="space-y-1">
        {projectsData.map((project, index) => (
          <div key={index} className="bg-black/[.05] dark:bg-white/[.06] p-2 rounded-lg">
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-lg font-semibold">{project.title}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">{project.period}</p>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              <span className="flex flex-col mb-1">{project.technologies.join(', ')}</span>
              <div className="flex gap-2">
                {project.projectUrl && (
                  <a
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {project.projectUrl}
                  </a>
                )}
                {project.projectUrl && project.repoUrl && <span>|</span>}
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {project.repoUrl}
                  </a>
                )}
              </div>
            </div>
            <ul className="list-disc list-inside space-y-1 text-xs">
              {project.description.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
