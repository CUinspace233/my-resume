'use client';

import { useTranslations } from 'next-intl';

interface CardData {
  type: 'internship' | 'project' | 'activity';
  company: string;
  role: string;
  period: string;
  description: string;
  tech: string[];
  url?: string;
  repoUrl?: string;
}

const ACCENT: Record<string, string> = {
  internship: '#0a72ef',
  project: '#ff5b4f',
  activity: '#de1d8d',
};

function FeatureCard({ card, typeLabel }: { card: CardData; typeLabel: string }) {
  const accent = ACCENT[card.type];

  return (
    <div
      className="flex flex-col gap-4 p-5 rounded-lg bg-white dark:bg-[#111] transition-shadow hover:shadow-lg"
      style={{ boxShadow: 'var(--card-shadow)' }}
    >
      {/* Eyebrow */}
      <div className="flex items-center gap-2">
        <span
          className="font-[family-name:var(--font-geist-mono)] text-[10px] font-medium uppercase tracking-widest px-2 py-0.5 rounded-full"
          style={{
            color: accent,
            background: `${accent}14`,
          }}
        >
          {typeLabel}
        </span>
        <span
          className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-wider"
          style={{ color: '#808080' }}
        >
          {card.period}
        </span>
      </div>

      {/* Title */}
      <div>
        <h3
          className="font-[family-name:var(--font-geist-sans)] font-semibold text-[#171717] dark:text-[#ededed] leading-snug mb-1"
          style={{ fontSize: '18px', letterSpacing: '-0.03em' }}
        >
          {card.company}
        </h3>
        <p
          className="font-[family-name:var(--font-geist-sans)] text-sm font-medium"
          style={{ color: '#4d4d4d' }}
        >
          {card.role}
        </p>
      </div>

      {/* Description */}
      <p
        className="font-[family-name:var(--font-geist-sans)] text-sm leading-relaxed flex-1"
        style={{ color: '#4d4d4d' }}
      >
        {card.description}
      </p>

      {/* Tech pills */}
      <div className="flex flex-wrap gap-1.5">
        {card.tech.map(t => (
          <span
            key={t}
            className="font-[family-name:var(--font-geist-mono)] text-[10px] font-medium uppercase tracking-wider text-[#666] dark:text-[#888] px-2 py-0.5 rounded-full"
            style={{ boxShadow: '0px 0px 0px 1px rgb(235,235,235)' }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* Links */}
      {(card.url || card.repoUrl) && (
        <div className="flex gap-3 pt-1">
          {card.url && (
            <a
              href={card.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-[family-name:var(--font-geist-sans)] text-xs font-medium transition-colors"
              style={{ color: '#0072f5' }}
            >
              Visit ↗
            </a>
          )}
          {card.repoUrl && (
            <a
              href={card.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-[family-name:var(--font-geist-sans)] text-xs font-medium transition-colors"
              style={{ color: '#0072f5' }}
            >
              GitHub ↗
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function FeatureCards() {
  const t = useTranslations('landing.features');
  const exp = useTranslations('sections.experience');
  const proj = useTranslations('sections.projects');
  const soc = useTranslations('sections.societies');

  const expData = exp.raw('experienceData') as Array<{
    company: string;
    position: string;
    period: string;
    projects?: Array<{ title: string; technologies: string[]; projectUrl?: string; description: string[] }>;
    achievements?: string[];
  }>;

  const projData = proj.raw('projectsData') as Array<{
    title: string;
    period: string;
    technologies: string[];
    repoUrl?: string;
    projectUrl?: string;
    description: string[];
  }>;

  const socData = soc.raw('societiesData') as Array<{
    organization: string;
    position: string;
    period: string;
    achievements: string[];
    repoUrl?: string;
    societyWebsiteUrl?: string;
  }>;

  const typeLabels = {
    internship: t('typeLabel.internship'),
    project: t('typeLabel.project'),
    activity: t('typeLabel.activity'),
  };

  const cards: CardData[] = [
    // Cool AI internship
    {
      type: 'internship',
      company: expData[1]?.company ?? 'Cool AI',
      role: expData[1]?.position ?? '',
      period: expData[1]?.period ?? '',
      description: expData[1]?.achievements?.[0] ?? '',
      tech: ['Python', 'FastAPI', 'Docker', 'Multimodal AI'],
    },
    // Graviti internship
    {
      type: 'internship',
      company: expData[0]?.company ?? 'Graviti',
      role: expData[0]?.position ?? '',
      period: expData[0]?.period ?? '',
      description: expData[0]?.projects?.[0]?.description?.[0] ?? '',
      tech: expData[0]?.projects?.[0]?.technologies?.slice(0, 5) ?? [],
      url: expData[0]?.projects?.[0]?.projectUrl,
    },
    // MockMate project
    {
      type: 'project',
      company: projData[0]?.title ?? 'MockMate',
      role: '',
      period: projData[0]?.period ?? '',
      description: projData[0]?.description?.[0] ?? '',
      tech: projData[0]?.technologies?.slice(0, 6) ?? [],
      repoUrl: projData[0]?.repoUrl,
      url: 'https://mockmate.cuinspace.com',
    },
    // AISoc Discord bot
    {
      type: 'activity',
      company: socData[0]?.organization ?? 'UNSW AISoc',
      role: socData[0]?.position ?? '',
      period: socData[0]?.period ?? '',
      description: socData[0]?.achievements?.[0] ?? '',
      tech: ['Next.js 15', 'FastAPI', 'PostgreSQL', 'Discord Bot'],
      repoUrl: socData[0]?.repoUrl,
      url: socData[0]?.societyWebsiteUrl,
    },
  ];

  return (
    <section id="projects" className="px-6 py-16 max-w-[1200px] mx-auto">
      <p
        className="font-[family-name:var(--font-geist-mono)] text-[11px] font-medium uppercase tracking-widest mb-8"
        style={{ color: '#808080' }}
      >
        {t('label')}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((card, i) => (
          <FeatureCard key={i} card={card} typeLabel={typeLabels[card.type]} />
        ))}
      </div>
    </section>
  );
}
