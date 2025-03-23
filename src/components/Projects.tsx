import { FC } from 'react';

const Projects: FC = () => {
  return (
    <section className="w-full max-w-3xl mx-auto mb-2 mt-16">
      <h2 className="text-xl font-bold">Projects</h2>
      <div className="space-y-2">
        <div className="bg-black/[.05] dark:bg-white/[.06] p-4 rounded-lg">
          <div className="mb-2">
            <h3 className="text-lg font-semibold">
              Note Sharing Website (
              <a href="https://github.com/sususu5/StudyShare" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-blue-600 dark:text-blue-400 hover:underline">
                Study Share
              </a>)
            </h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              <span className="mr-2">https://github.com/sususu5/StudyShare</span>
              <span className="font-medium">React, Vite, TypeScript</span>
            </div>
          </div>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Developed a full-stack note-sharing web application during a hackathon with a focus on modular code architecture and user-friendly interfaces.</li>
            <li>Collaborated in a fast-paced team environment, delivering a fully functional prototype under time constraints.</li>
          </ul>
        </div>

        <div className="bg-black/[.05] dark:bg-white/[.06] p-4 rounded-lg">
          <div className="mb-2">
            <h3 className="text-lg font-semibold">AI Image Generation Platform Website</h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              <span className="font-medium">Vue 3, Nuxt 3, MongoDB</span>
            </div>
          </div>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Designed and implemented the frontend of an AI image generation platform.</li>
            <li>Handled website SEO optimization to enhance discoverability and improve performance.</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Projects; 