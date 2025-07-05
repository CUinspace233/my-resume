import { FC } from 'react';
import { useTranslations } from 'next-intl';

const TechnicalSkills: FC = () => {
  const t = useTranslations('sections.skills');

  return (
    <section className="w-full max-w-3xl mx-auto py-2">
      <h2 className="text-xl font-bold mb-2 text-left">{t('title')}</h2>
      <div className="grid grid-cols-2 gap-1">
        <div className="p-2 rounded-lg bg-black/[.05] dark:bg-white/[.06]">
          <div>
            <strong>{t('languages')}:</strong>
          </div>
          <span className="block">C, JavaScript, TypeScript, Python, Java, Shell</span>
        </div>
        <div className="p-2 rounded-lg bg-black/[.05] dark:bg-white/[.06]">
          <div>
            <strong>{t('frontend_frameworks') || 'Frontend frameworks'}:</strong>
          </div>
          <span className="block">React, Vue 3, Nuxt 3, Vite, TailwindCSS</span>
        </div>
        <div className="p-2 rounded-lg bg-black/[.05] dark:bg-white/[.06]">
          <div>
            <strong>{t('backend_frameworks') || 'Backend frameworks'}:</strong>
          </div>
          <span className="block">FastAPI, SQLAlchemy, Express</span>
        </div>
        <div className="p-2 rounded-lg bg-black/[.05] dark:bg-white/[.06]">
          <div>
            <strong>{t('devTools')}:</strong>
          </div>
          <span className="block">Git, Linux, Shell Scripting</span>
        </div>
        <div className="p-2 rounded-lg bg-black/[.05] dark:bg-white/[.06]">
          <div>
            <strong>{t('testing')}:</strong>
          </div>
          <span className="block">Jest, JUnit, Cypress</span>
        </div>
        <div className="p-2 rounded-lg bg-black/[.05] dark:bg-white/[.06]">
          <div>
            <strong>{t('databases')}:</strong>
          </div>
          <span className="block">PostgreSQL, MongoDB, MySQL, SQLite</span>
        </div>
        <div className="p-2 rounded-lg bg-black/[.05] dark:bg-white/[.06]">
          <div>
            <strong>{t('3dSoftware')}:</strong>
          </div>
          <span className="block">Autodesk Maya</span>
        </div>
      </div>
    </section>
  );
};

export default TechnicalSkills;
