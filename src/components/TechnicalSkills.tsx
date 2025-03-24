import { FC } from 'react';

const TechnicalSkills: FC = () => {
  return (
    <section className="w-full max-w-3xl mx-auto py-2">
      <h2 className="text-xl font-bold mb-2 text-center sm:text-left">Technical Skills</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
        <div className="p-4 rounded-lg bg-black/[.05] dark:bg-white/[.06]">
          <strong>Languages:</strong> C, JavaScript, TypeScript, Python, Java, Shell
        </div>
        <div className="p-4 rounded-lg bg-black/[.05] dark:bg-white/[.06]">
          <strong>Frameworks:</strong> React, Vue 3, Nuxt 3, Vite, TailwindCSS, Vuetify
        </div>
        <div className="p-4 rounded-lg bg-black/[.05] dark:bg-white/[.06]">
          <strong>Development Tools:</strong> Git, Linux, Shell Scripting
        </div>
        <div className="p-4 rounded-lg bg-black/[.05] dark:bg-white/[.06]">
          <strong>Testing:</strong> Jest, JUnit
        </div>
        <div className="p-4 rounded-lg bg-black/[.05] dark:bg-white/[.06]">
          <strong>Databases:</strong> MongoDB
        </div>
        <div className="p-4 rounded-lg bg-black/[.05] dark:bg-white/[.06]">
          <strong>3D Software:</strong> Autodesk Maya
        </div>
      </div>
    </section>
  );
};

export default TechnicalSkills;
