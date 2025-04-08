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
}

const Projects: FC = () => {
  const t = useTranslations('sections.projects');
  const projectsData: ProjectData[] = t.raw('projectsData') as ProjectData[];

  return (
    <section className="w-full max-w-3xl mx-auto mb-4 mt-16">
      <h2 className="text-xl font-bold mb-2">{t('title')}</h2>
      <div className="space-y-2">
        {projectsData.map((project, index) => (
          <div key={index} className="bg-black/[.05] dark:bg-white/[.06] p-4 rounded-lg">
            <div className="mb-2">
              <h3 className="text-lg font-semibold">
                {project.title}
                {(project.repoName || project.projectUrl) && (
                  <>
                    {' ('}
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:underline"
                    >
                      {project.repoName}
                    </a>
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:underline"
                    >
                      {project.siteName}
                    </a>
                    {')'}
                  </>
                )}
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                <span className="font-medium flex flex-col">{project.technologies.join(', ')}</span>
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
                {project.projectUrl && <span className="mr-2 text-xs">{project.projectUrl}</span>}
              </div>
            </div>
            <ul className="list-disc list-inside space-y-1 text-sm">
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
