'use client';

import { useTranslations } from 'next-intl';

const TECH = [
  'TypeScript',
  'Python',
  'React',
  'Next.js',
  'Vue 3',
  'Nuxt 3',
  'FastAPI',
  'SQLAlchemy',
  'PostgreSQL',
  'MongoDB',
  'Docker',
  'GitHub Actions',
  'Tailwind CSS',
  'SQLite',
  'Zustand',
  'Redis',
];

export default function TechStackGrid() {
  const t = useTranslations('landing.techStack');

  return (
    <section
      className="px-6 py-12 max-w-[1200px] mx-auto"
      style={{ borderTop: '1px solid #ebebeb' }}
    >
      <h2
        className="font-[family-name:var(--font-geist-mono)] text-[11px] font-medium uppercase tracking-widest mb-6"
        style={{ color: '#808080' }}
      >
        {t('label')}
      </h2>
      <div className="flex flex-wrap gap-2">
        {TECH.map(tech => (
          <span
            key={tech}
            className="font-[family-name:var(--font-geist-mono)] text-[11px] font-medium uppercase tracking-wider text-[#171717] dark:text-[#ededed] px-3 py-1.5 rounded-full"
            style={{ boxShadow: 'var(--ring-border-light)' }}
          >
            {tech}
          </span>
        ))}
      </div>
    </section>
  );
}
