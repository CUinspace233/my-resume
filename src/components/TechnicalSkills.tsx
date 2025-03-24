import { FC } from 'react';
import { useTranslations } from 'next-intl';

const TechnicalSkills: FC = () => {
  const t = useTranslations('sections.skills');

  return (
    <section className="w-full max-w-3xl mx-auto py-2">
      <h2 className="text-xl font-bold mb-2 text-center sm:text-left">{t('title')}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
        <div className="p-4 rounded-lg bg-black/[.05] dark:bg-white/[.06]">
          <strong>{t('languages')}:</strong> C, JavaScript, TypeScript, Python, Java, Shell
        </div>
        <div className="p-4 rounded-lg bg-black/[.05] dark:bg-white/[.06]">
          <strong>{t('frameworks')}:</strong> React, Vue 3, Nuxt 3, Vite, TailwindCSS, Vuetify
        </div>
        <div className="p-4 rounded-lg bg-black/[.05] dark:bg-white/[.06]">
          <strong>{t('devTools')}:</strong> Git, Linux, Shell Scripting
        </div>
        <div className="p-4 rounded-lg bg-black/[.05] dark:bg-white/[.06]">
          <strong>{t('testing')}:</strong> Jest, JUnit
        </div>
        <div className="p-4 rounded-lg bg-black/[.05] dark:bg-white/[.06]">
          <strong>{t('databases')}:</strong> MongoDB
        </div>
        <div className="p-4 rounded-lg bg-black/[.05] dark:bg-white/[.06]">
          <strong>{t('3dSoftware')}:</strong> Autodesk Maya
        </div>
      </div>
    </section>
  );
};

export default TechnicalSkills;
