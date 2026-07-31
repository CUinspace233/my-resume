'use client';

import { useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import './nora-landing.css';

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
    footerName: 'Nora',
    footerTagline: 'Operations & International Business',
    footerCopyright: '© 2026 Nora. All rights reserved.',
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

  useEffect(() => {
    const root = document.documentElement;
    const { body } = document;
    const previousBodyBackground = body.style.background;
    const previousBodyColor = body.style.color;

    root.classList.remove('dark');
    root.style.colorScheme = 'light';
    body.style.background = '#ffffff';
    body.style.color = '#000000';

    return () => {
      root.style.colorScheme = '';
      body.style.background = previousBodyBackground;
      body.style.color = previousBodyColor;
    };
  }, []);

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

  const repeatedItems = [
    ...ui.marqueeItems,
    ...ui.marqueeItems,
    ...ui.marqueeItems,
    ...ui.marqueeItems,
  ];
  const marqueeLine = `${repeatedItems.join('  ·  ')}  ·  `;

  return (
    <div className="nora-landing">
      <header className="nora-nav">
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
            <span aria-hidden="true">{marqueeLine}</span>
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
    </div>
  );
}
