import { FC } from 'react';

interface ExperienceItem {
  company: string;
  position: string;
  achievements: string[];
  projects: ProjectData[];
}

interface ProjectData {
  title: string;
  repoUrl?: string;
  repoName?: string;
  technologies: string[];
  description: string[];
  projectUrl?: string;
  siteName?: string;
}

const experienceData: ExperienceItem[] = [
  {
    company: 'Graviti',
    position: 'Full Stack Developer Intern',
    achievements: [
      'Built and optimized core features for internal tools using modern frontend stacks.',
      'Participated in code reviews and implemented performance improvements.',
    ],
    projects: [
      {
        title: 'AI Image Generation Platform Website',
        technologies: ['Vue 3', 'Nuxt 3', 'Tailwind CSS', 'MongoDB', 'i18n'],
        projectUrl: 'https://www.diffus.me',
        siteName: 'Diffus',
        description: [
          'Designed and implemented the frontend of an AI image generation platform using Vue 3 and Nuxt 3 framework.',
          'Migrated and transformed data to MongoDB, including data cleaning and restructuring to optimize database performance.',
          'Implemented i18n internationalization to support multiple languages, enhancing global user accessibility.',
          'Handled website SEO (Search Engine Optimization) to enhance discoverability and improve performance metrics.',
        ],
      },
    ],
  },
];

const Experience: FC = () => {
  return (
    <section className="w-full max-w-3xl mx-auto mb-4">
      <h2 className="text-xl font-bold mb-2">Experience</h2>
      {experienceData.map((item, index) => (
        <div key={index} className="bg-black/[.05] dark:bg-white/[.06] p-4 rounded-lg mb-3">
          <h3 className="text-lg font-semibold mb-2">
            {item.position} – {item.company}
          </h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            {item.achievements.map((achievement, i) => (
              <li key={i}>{achievement}</li>
            ))}
          </ul>

          {/* Projects */}
          {item.projects && item.projects.length > 0 && (
            <div className="mt-2">
              <h4 className="text-lg font-medium">Projects</h4>
              {item.projects.map((project, i) => (
                <div key={i} className="mt-1 pl-4 border-l-2 border-gray-200">
                  <div className="font-medium text-lg">
                    {project.title}
                    {project.projectUrl && (
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {' '}
                        ({project.siteName})
                      </a>
                    )}
                  </div>

                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1 flex flex-col">
                    {project.technologies.join(', ')}
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
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-sm">
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
