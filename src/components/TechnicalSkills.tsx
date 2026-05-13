import { FC } from 'react';
import { useTranslations } from 'next-intl';
import type { ResumeSkillGroup } from '@/types/resume';

const TechnicalSkills: FC = () => {
  const t = useTranslations('resume.skills');
  const skillGroups = t.raw('groups') as ResumeSkillGroup[];

  return (
    <section className="w-full max-w-3xl mx-auto py-2">
      <h2 className="text-xl font-bold mb-2 text-left">{t('title')}</h2>
      <div className="grid grid-cols-2 gap-1">
        {skillGroups.map(group => (
          <div key={group.id} className="p-2 rounded-lg bg-black/[.05] dark:bg-white/[.06]">
            <div>
              <strong>{group.label}:</strong>
            </div>
            <span className="block">{group.items.join(', ')}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TechnicalSkills;
