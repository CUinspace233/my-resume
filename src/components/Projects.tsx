import { FC } from 'react';

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

// Projects metadata
const projectsData: ProjectData[] = [
  {
    title: "StudyShare - Note Sharing Platform",
    repoUrl: "https://github.com/sususu5/StudyShare",
    repoName: "StudyShare",
    technologies: ["React", "Vite", "TypeScript", "Node.js", "Express"],
    description: [
      "Led a team of 4 developers to build a full-stack note-sharing platform during the 6-day DevSoc Blueprint Hackathon at UNSW.",
      "Implemented the complete note upload system and note details page, including frontend UI and backend integration.",
      "Designed an intuitive interface for students to easily upload, browse, and download course notes in PDF format.",
      "Organized notes by courses with efficient categorization to enhance searchability and user experience.",
      "Collaborated closely with team members to ensure seamless integration between frontend and backend components.",
      "Planned future AI integration to analyze notes and automatically generate practice questions for enhanced learning."
    ]
  },
  {
    title: "AI Image Generation Platform Website",
    technologies: ["Vue 3", "Nuxt 3", "Tailwind CSS", "MongoDB", "i18n"],
    projectUrl: "https://www.diffus.me",
    siteName: "Diffus",
    description: [
      "Designed and implemented the frontend of an AI image generation platform using Vue 3 and Nuxt 3 framework.",
      "Migrated and transformed data to MongoDB, including data cleaning and restructuring to optimize database performance.",
      "Implemented i18n internationalization to support multiple languages, enhancing global user accessibility.",
      "Handled website SEO optimization to enhance discoverability and improve performance metrics."
    ]
  }
];

const Projects: FC = () => {
  return (
    <section className="w-full max-w-3xl mx-auto mb-2 mt-16">
      <h2 className="text-xl font-bold">Projects</h2>
      <div className="space-y-2">
        {projectsData.map((project, index) => (
          <div key={index} className="bg-black/[.05] dark:bg-white/[.06] p-4 rounded-lg">
            <div className="mb-2">
              <h3 className="text-lg font-semibold">
                {project.title}
                {(project.repoName || project.projectUrl)&& (
                  <>
                    {" ("}
                    <a href={project.repoUrl}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="text-blue-600 dark:text-blue-400 hover:underline">
                      {project.repoName}
                    </a>
                    <a href={project.projectUrl}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="text-blue-600 dark:text-blue-400 hover:underline">
                      {project.siteName}
                    </a>
                    {")"}
                  </>
                )}
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                <span className="font-medium flex flex-col">{project.technologies.join(", ")}</span>
                {project.repoUrl && <span className="mr-2 text-xs">{project.repoUrl}</span>}
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