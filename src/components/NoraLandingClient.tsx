'use client';

import { useLocale, useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const UI = {
  en: {
    navAbout: 'About',
    navExperience: 'Experience',
    navEducation: 'Education',
    navContact: 'Contact',
    viewResume: 'View Resume',
    heroEyebrow: 'Personal Homepage · Shanghai',
    heroLead:
      'Incoming International Business master’s student at Donghua University. I specialize in hands-on execution — coordinating cross-team projects, streamlining operations, and turning plans into measurable results.',
    heroPrimary: 'View Full Resume',
    heroSecondary: 'Get in Touch',
    marqueeItems: [
      'International Business',
      'Operations Execution',
      'Cross-team Collaboration',
      'Data Reconciliation',
      'Project Delivery',
      'Process Optimization',
    ],
    experienceEyebrow: 'Internship Experience',
    experienceHeadline: 'Hands-on execution across four internships',
    educationEyebrow: 'Education',
    educationHeadline: 'Strong academic foundation in international trade',
    campusEyebrow: 'Campus & Summary',
    campusHeadline: 'An execution-first mindset, built through practice',
    summaryLabel: 'Professional Summary',
    contactEyebrow: 'Contact',
    contactHeadline: 'Let’s build something together',
    contactLead:
      'Open to internship and project opportunities in operations, international business, and project coordination.',
    contactResume: 'View Full Resume',
    footerName: 'Nuorigela',
    footerTagline: 'Operations & International Business',
    footerCopyright: '© 2026 Nuorigela. All rights reserved.',
  },
  zh: {
    navAbout: '关于',
    navExperience: '实习',
    navEducation: '教育',
    navContact: '联系',
    viewResume: '查看简历',
    heroEyebrow: '个人主页 · 上海',
    heroLead:
      '东华大学国际商务准硕士。我专注于一线执行——协调跨团队项目、优化运营流程，并把计划转化为可衡量的结果。',
    heroPrimary: '查看完整简历',
    heroSecondary: '联系我',
    marqueeItems: ['国际商务', '运营执行', '跨团队协作', '数据对齐', '项目交付', '流程优化'],
    experienceEyebrow: '实习经历',
    experienceHeadline: '四段实习，打磨扎实的执行力',
    educationEyebrow: '教育背景',
    educationHeadline: '国际贸易领域的扎实学术基础',
    campusEyebrow: '校园与总结',
    campusHeadline: '在实践中养成的执行优先思维',
    summaryLabel: '自我评价',
    contactEyebrow: '联系我',
    contactHeadline: '一起做些有价值的事',
    contactLead: '欢迎运营、国际商务、项目协调方向的实习与项目机会。',
    contactResume: '查看完整简历',
    footerName: '诺日格拉',
    footerTagline: '运营 & 国际商务',
    footerCopyright: '© 2026 诺日格拉 版权所有',
  },
} as const;

type UiKey = keyof (typeof UI)['en'];
type UiStrings = Omit<Record<UiKey, string>, 'marqueeItems'> & {
  marqueeItems: readonly string[];
};

type ExperienceCard = {
  company: string;
  position: string;
  period: string;
  highlight: string;
};

type EducationCard = {
  institution: string;
  program: string;
  period: string;
  highlights: string[];
};

function pickHighlight(description: string, maxLen = 96): string {
  const firstSentence = description.split(/[。；;]/)[0] ?? description;
  if (firstSentence.length <= maxLen) return firstSentence;
  return `${firstSentence.slice(0, maxLen)}…`;
}

export default function NoraLandingClient({ locale: localeProp }: { locale: string }) {
  const locale = (useLocale() || localeProp) as 'en' | 'zh';
  const t = useTranslations('nrglResume');
  const ui: UiStrings = UI[locale] ?? UI.en;

  const experienceItems = t.raw('experience.items') as Array<{
    id: string;
    company: string;
    position: string;
    period: string;
    achievements: Array<{ label: string; description: string }>;
  }>;

  const educationItems = t.raw('education.items') as Array<{
    id: string;
    institution: string;
    program: string;
    period: string;
    details: string[];
  }>;

  const campusItems = t.raw('campus.items') as Array<{
    id: string;
    company: string;
    position: string;
    period: string;
    achievements: Array<{ label: string; description: string }>;
  }>;

  const email = t.raw('personal.items').find((item: { id: string }) => item.id === 'email') as
    | { value: string; href?: string }
    | undefined;
  const phone = t.raw('personal.items').find((item: { id: string }) => item.id === 'phone') as
    | { value: string; href?: string }
    | undefined;

  const resumePath = locale === 'zh' ? '/zh/resume' : '/resume';
  const homePath = locale === 'zh' ? '/zh' : '/';

  const experienceCards: ExperienceCard[] = experienceItems.map(item => ({
    company: item.company,
    position: item.position,
    period: item.period,
    highlight: pickHighlight(item.achievements[0]?.description ?? ''),
  }));

  const educationCards: EducationCard[] = educationItems.map(item => ({
    institution: item.institution,
    program: item.program,
    period: item.period,
    highlights: item.details.slice(0, 2).map(detail => pickHighlight(detail, 120)),
  }));

  const marqueeLine = [...ui.marqueeItems, ...ui.marqueeItems].join('  ·  ');

  return (
    <div className="nora-landing">
      <header className="nora-nav">
        <a href={homePath} className="nora-nav-brand">
          {t('header.name')}
        </a>
        <nav className="nora-nav-links" aria-label="Primary">
          <a href="#experience">{ui.navExperience}</a>
          <a href="#education">{ui.navEducation}</a>
          <a href="#contact">{ui.navContact}</a>
        </nav>
        <div className="nora-nav-actions">
          <LanguageSwitcher />
          <a href={resumePath} className="nora-btn nora-btn--primary nora-btn--sm">
            {ui.viewResume}
          </a>
        </div>
      </header>

      <main>
        <section className="nora-hero">
          <div className="nora-container">
            <p className="nora-eyebrow">{ui.heroEyebrow}</p>
            <h1 className="nora-display">{t('header.name')}</h1>
            <p className="nora-subhead">{ui.heroLead}</p>
            <div className="nora-hero-actions">
              <a href={resumePath} className="nora-btn nora-btn--primary">
                {ui.heroPrimary}
              </a>
              <a href="#contact" className="nora-btn nora-btn--secondary">
                {ui.heroSecondary}
              </a>
            </div>
          </div>
        </section>

        <div className="nora-marquee" aria-hidden="true">
          <div className="nora-marquee-track">
            <span>{marqueeLine}</span>
          </div>
        </div>

        <section id="experience" className="nora-section">
          <div className="nora-container">
            <div className="nora-color-block nora-color-block--lime nora-reveal">
              <p className="nora-eyebrow">{ui.experienceEyebrow}</p>
              <h2 className="nora-headline">{ui.experienceHeadline}</h2>
              <div className="nora-card-grid nora-card-grid--2col">
                {experienceCards.map(card => (
                  <article key={card.company} className="nora-mini-card">
                    <p className="nora-mini-card-meta">{card.period}</p>
                    <h3 className="nora-mini-card-title">{card.company}</h3>
                    <p className="nora-mini-card-sub">{card.position}</p>
                    <p className="nora-mini-card-body">{card.highlight}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="education" className="nora-section">
          <div className="nora-container">
            <div className="nora-color-block nora-color-block--lilac nora-reveal">
              <p className="nora-eyebrow">{ui.educationEyebrow}</p>
              <h2 className="nora-headline">{ui.educationHeadline}</h2>
              <div className="nora-card-grid nora-card-grid--2col">
                {educationCards.map(card => (
                  <article key={card.institution} className="nora-mini-card nora-mini-card--flat">
                    <p className="nora-mini-card-meta">{card.period}</p>
                    <h3 className="nora-mini-card-title">{card.institution}</h3>
                    <p className="nora-mini-card-sub">{card.program}</p>
                    {card.highlights.map(line => (
                      <p key={line} className="nora-mini-card-body">
                        {line}
                      </p>
                    ))}
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="nora-section">
          <div className="nora-container">
            <div className="nora-color-block nora-color-block--cream nora-reveal">
              <p className="nora-eyebrow">{ui.campusEyebrow}</p>
              <h2 className="nora-headline">{ui.campusHeadline}</h2>
              <div className="nora-card-grid nora-card-grid--2col">
                {campusItems.map(item => (
                  <article key={item.id} className="nora-mini-card nora-mini-card--flat">
                    <p className="nora-mini-card-meta">{item.period}</p>
                    <h3 className="nora-mini-card-title">{item.company}</h3>
                    <p className="nora-mini-card-sub">{item.position}</p>
                    <p className="nora-mini-card-body">
                      {pickHighlight(item.achievements[0]?.description ?? '')}
                    </p>
                  </article>
                ))}
                <article className="nora-mini-card nora-mini-card--flat">
                  <p className="nora-mini-card-meta">{ui.summaryLabel}</p>
                  <h3 className="nora-mini-card-title">{t('summary.title')}</h3>
                  <p className="nora-mini-card-body">{pickHighlight(t('summary.body'), 180)}</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="nora-section">
          <div className="nora-container">
            <div className="nora-color-block nora-color-block--navy nora-reveal">
              <p className="nora-eyebrow">{ui.contactEyebrow}</p>
              <h2 className="nora-headline">{ui.contactHeadline}</h2>
              <p className="nora-subhead nora-contact-lead">{ui.contactLead}</p>
              <div className="nora-contact-actions">
                {email && (
                  <a
                    href={email.href ?? `mailto:${email.value}`}
                    className="nora-btn nora-btn--inverse"
                  >
                    {email.value}
                  </a>
                )}
                {phone && (
                  <a
                    href={phone.href ?? `tel:${phone.value}`}
                    className="nora-btn nora-btn--inverse-outline"
                  >
                    {phone.value}
                  </a>
                )}
                <a href={resumePath} className="nora-btn nora-btn--inverse-outline">
                  {ui.contactResume}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="nora-footer">
        <div className="nora-container nora-footer-inner">
          <div>
            <p className="nora-footer-name">{ui.footerName}</p>
            <p className="nora-caption">{ui.footerTagline}</p>
          </div>
          <nav className="nora-footer-links" aria-label="Footer">
            <a href="#experience">{ui.navExperience}</a>
            <a href="#education">{ui.navEducation}</a>
            <a href="#contact">{ui.navContact}</a>
            <a href={resumePath}>{ui.viewResume}</a>
          </nav>
          <p className="nora-caption nora-footer-copy">{ui.footerCopyright}</p>
        </div>
      </footer>

      <style jsx>{`
        .nora-landing {
          --ink: #000000;
          --canvas: #ffffff;
          --inverse-canvas: #000000;
          --inverse-ink: #ffffff;
          --surface-soft: #f7f7f5;
          --hairline: #e6e6e6;
          --block-lime: #dceeb1;
          --block-lilac: #c5b0f4;
          --block-cream: #f4ecd6;
          --block-navy: #1f1d3d;
          --radius-lg: 24px;
          --radius-md: 8px;
          --radius-pill: 50px;
          --space-section: 96px;
          --space-xxl: 48px;
          --space-lg: 24px;
          --space-md: 16px;
          --container: 1280px;
          background: var(--canvas);
          color: var(--ink);
          font-family:
            'Inter',
            -apple-system,
            BlinkMacSystemFont,
            'SF Pro Display',
            'Segoe UI',
            system-ui,
            sans-serif;
          font-weight: 320;
          line-height: 1.45;
          letter-spacing: -0.26px;
          -webkit-font-smoothing: antialiased;
          min-height: 100vh;
        }

        .nora-container {
          width: 100%;
          max-width: var(--container);
          margin: 0 auto;
          padding: 0 var(--space-xxl);
        }

        .nora-eyebrow {
          font-family: 'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace;
          font-size: 18px;
          font-weight: 400;
          line-height: 1.3;
          letter-spacing: 0.54px;
          text-transform: uppercase;
          margin: 0 0 var(--space-md);
        }

        .nora-display {
          font-size: clamp(48px, 7.5vw, 86px);
          font-weight: 340;
          line-height: 1;
          letter-spacing: -1.72px;
          margin: 0 0 var(--space-lg);
        }

        .nora-headline {
          font-size: clamp(24px, 3vw, 26px);
          font-weight: 540;
          line-height: 1.35;
          letter-spacing: -0.26px;
          margin: 0 0 var(--space-xxl);
          max-width: 16em;
        }

        .nora-subhead {
          font-size: clamp(18px, 2.2vw, 26px);
          font-weight: 340;
          line-height: 1.35;
          letter-spacing: -0.26px;
          max-width: 22em;
          margin: 0;
        }

        .nora-caption {
          font-family: 'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace;
          font-size: 12px;
          font-weight: 400;
          line-height: 1;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          margin: 0;
        }

        .nora-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 44px;
          padding: 10px 20px;
          border-radius: var(--radius-pill);
          font-family:
            'Inter',
            -apple-system,
            BlinkMacSystemFont,
            'SF Pro Display',
            'Segoe UI',
            system-ui,
            sans-serif;
          font-size: 20px;
          font-weight: 480;
          line-height: 1.4;
          letter-spacing: -0.1px;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: transform 0.18s cubic-bezier(0.22, 1, 0.36, 1);
          white-space: nowrap;
        }

        .nora-btn:hover {
          transform: translateY(-1px) scale(1.01);
        }

        .nora-btn:active {
          transform: scale(0.99);
        }

        .nora-btn--sm {
          min-height: 36px;
          padding: 8px 16px;
          font-size: 16px;
        }

        .nora-btn--primary {
          background: var(--ink);
          color: var(--canvas);
        }

        .nora-btn--secondary {
          background: var(--canvas);
          color: var(--ink);
          box-shadow: inset 0 0 0 1px var(--ink);
        }

        .nora-btn--inverse {
          background: var(--canvas);
          color: var(--ink);
        }

        .nora-btn--inverse-outline {
          background: transparent;
          color: var(--inverse-ink);
          box-shadow: inset 0 0 0 1px var(--inverse-ink);
        }

        .nora-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          gap: var(--space-lg);
          height: 56px;
          padding: 0 var(--space-xxl);
          background: var(--canvas);
          border-bottom: 1px solid var(--hairline);
        }

        .nora-nav-brand {
          font-weight: 540;
          font-size: 18px;
          text-decoration: none;
          color: var(--ink);
          letter-spacing: -0.26px;
        }

        .nora-nav-links {
          display: flex;
          gap: var(--space-lg);
          margin-left: auto;
        }

        .nora-nav-links a {
          color: var(--ink);
          text-decoration: none;
          font-size: 16px;
          font-weight: 330;
          transition: opacity 0.15s ease;
        }

        .nora-nav-links a:hover {
          opacity: 0.65;
        }

        .nora-nav-actions {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          margin-left: var(--space-lg);
        }

        .nora-hero {
          padding: calc(var(--space-section) * 1.2) 0 var(--space-section);
        }

        .nora-hero-actions {
          display: flex;
          gap: var(--space-md);
          margin-top: var(--space-xxl);
          flex-wrap: wrap;
        }

        .nora-marquee {
          background: var(--inverse-canvas);
          color: var(--inverse-ink);
          height: 36px;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .nora-marquee-track {
          display: flex;
          white-space: nowrap;
          animation: nora-marquee 28s linear infinite;
        }

        .nora-marquee-track span {
          font-family: 'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace;
          font-size: 16px;
          font-weight: 400;
          letter-spacing: 0.54px;
          text-transform: uppercase;
          padding-right: var(--space-xxl);
        }

        @keyframes nora-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .nora-section {
          padding: var(--space-section) 0;
        }

        .nora-section:first-of-type {
          padding-top: var(--space-section);
        }

        .nora-color-block {
          border-radius: var(--radius-lg);
          padding: var(--space-xxl);
        }

        .nora-color-block--lime {
          background: var(--block-lime);
        }

        .nora-color-block--lilac {
          background: var(--block-lilac);
        }

        .nora-color-block--cream {
          background: var(--block-cream);
        }

        .nora-color-block--navy {
          background: var(--block-navy);
          color: var(--inverse-ink);
        }

        .nora-card-grid {
          display: grid;
          gap: var(--space-md);
        }

        .nora-card-grid--2col {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .nora-mini-card {
          background: var(--canvas);
          border-radius: var(--radius-md);
          padding: var(--space-lg);
        }

        .nora-mini-card--flat {
          background: rgba(255, 255, 255, 0.72);
        }

        .nora-color-block--navy .nora-mini-card--flat {
          background: rgba(255, 255, 255, 0.1);
        }

        .nora-mini-card-meta {
          font-family: 'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace;
          font-size: 12px;
          font-weight: 400;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          margin: 0 0 var(--space-md);
          opacity: 0.75;
        }

        .nora-mini-card-title {
          font-size: 24px;
          font-weight: 700;
          line-height: 1.45;
          margin: 0 0 4px;
        }

        .nora-mini-card-sub {
          font-size: 16px;
          font-weight: 480;
          margin: 0 0 var(--space-md);
        }

        .nora-mini-card-body {
          font-size: 16px;
          font-weight: 330;
          line-height: 1.45;
          letter-spacing: -0.14px;
          margin: 0;
        }

        .nora-contact-lead {
          margin-bottom: var(--space-xxl);
        }

        .nora-contact-actions {
          display: flex;
          gap: var(--space-md);
          flex-wrap: wrap;
        }

        .nora-footer {
          padding: var(--space-section) 0;
          border-top: 1px solid var(--hairline);
        }

        .nora-footer-inner {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: var(--space-lg);
          flex-wrap: wrap;
        }

        .nora-footer-name {
          font-size: 32px;
          font-weight: 340;
          letter-spacing: -0.96px;
          line-height: 1.1;
          margin: 0 0 var(--space-md);
        }

        .nora-footer-links {
          display: flex;
          gap: var(--space-lg);
          flex-wrap: wrap;
        }

        .nora-footer-links a {
          color: var(--ink);
          text-decoration: none;
          font-size: 16px;
          font-weight: 330;
        }

        .nora-footer-links a:hover {
          text-decoration: underline;
        }

        .nora-footer-copy {
          margin-left: auto;
        }

        @media (prefers-reduced-motion: reduce) {
          .nora-marquee-track {
            animation: none;
          }
        }

        @media (max-width: 960px) {
          .nora-nav-links {
            display: none;
          }
          .nora-card-grid--2col {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .nora-container {
            padding: 0 var(--space-lg);
          }
          .nora-nav {
            padding: 0 var(--space-lg);
          }
          .nora-hero {
            padding: calc(var(--space-section) * 0.9) 0 calc(var(--space-section) * 0.75);
          }
          .nora-section {
            padding: calc(var(--space-section) * 0.75) 0;
          }
          .nora-color-block {
            border-radius: 0;
            margin: 0 calc(-1 * var(--space-lg));
            padding: var(--space-xxl) var(--space-lg);
          }
          .nora-display {
            letter-spacing: -0.96px;
          }
          .nora-headline {
            margin-bottom: var(--space-lg);
          }
          .nora-btn {
            width: 100%;
          }
          .nora-hero-actions,
          .nora-contact-actions {
            flex-direction: column;
            align-items: stretch;
          }
          .nora-footer-inner {
            flex-direction: column;
            align-items: flex-start;
          }
          .nora-footer-copy {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
}
