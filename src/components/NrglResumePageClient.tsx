'use client';

import ExportPdfButton from '@/components/ExportPdfButton';
import HomeTransitionLink from '@/components/HomeTransitionLink';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ScalableContent from '@/components/ScalableContent';
import ThemeToggle from '@/components/ThemeToggle';
import type { NrglEducationItem, NrglExperienceItem, NrglPersonalItem } from '@/types/nrglResume';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

type NrglResumePageClientProps = {
  locale: string;
  isPrintMode: boolean;
  showPhoto: boolean;
  showTradeExperience: boolean;
};

function EducationSection({ items, title }: { items: NrglEducationItem[]; title: string }) {
  return (
    <section className="mx-auto w-full max-w-3xl">
      <h2 className="text-xl font-bold">{title}</h2>
      {items.map(item => (
        <article key={item.id} className="mb-1 rounded-lg bg-black/[.05] p-2">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg font-semibold">{item.institution}</h3>
            <span className="shrink-0 text-xs text-gray-600 dark:text-gray-400">{item.period}</span>
          </div>
          <p className={item.details.length > 0 ? 'mb-2 text-sm' : 'text-sm'}>{item.program}</p>
          {item.details.length > 0 && (
            <div className="space-y-1 text-xs">
              {item.details.map(detail => (
                <p key={detail}>{detail}</p>
              ))}
            </div>
          )}
        </article>
      ))}
    </section>
  );
}

function ExperienceSection({
  items,
  locale,
  title,
}: {
  items: NrglExperienceItem[];
  locale: string;
  title: string;
}) {
  return (
    <section className="mx-auto w-full max-w-3xl">
      <h2 className="text-xl font-bold">{title}</h2>
      {items.map(item => (
        <article key={item.id} className="nrgl-experience-item mb-2 rounded-lg bg-black/[.05] p-2">
          <div className="mb-1 flex items-start justify-between gap-4">
            <h3 className="text-lg font-semibold">
              {item.position} – {item.company}
            </h3>
            <p className="shrink-0 text-xs text-gray-600 dark:text-gray-400">{item.period}</p>
          </div>
          <ul className="list-inside list-disc space-y-1 text-xs">
            {item.achievements.map(achievement => (
              <li key={`${item.id}-${achievement.label}`}>
                <strong className="font-semibold">
                  {achievement.label}
                  {locale === 'zh' ? '：' : ': '}
                </strong>
                {achievement.description}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  );
}

export default function NrglResumePageClient({
  locale,
  isPrintMode,
  showPhoto,
  showTradeExperience,
}: NrglResumePageClientProps) {
  const t = useTranslations('nrglResume');
  const [photoVisible, setPhotoVisible] = useState(showPhoto);
  const personalItems = t.raw('personal.items') as NrglPersonalItem[];
  const educationItems = t.raw('education.items') as NrglEducationItem[];
  const allExperienceItems = t.raw('experience.items') as NrglExperienceItem[];
  const experienceItems = showTradeExperience
    ? allExperienceItems
    : allExperienceItems.filter(item => item.id !== 'fanken-trade-assistant');
  const campusItems = t.raw('campus.items') as NrglExperienceItem[];
  const headerItems = personalItems.filter(item => item.id !== 'graduation-school');
  const fontClass =
    locale === 'zh'
      ? "font-['Noto_Sans_SC','PingFang_SC','Hiragino_Sans_GB','Microsoft_YaHei',sans-serif]"
      : 'font-[family-name:var(--font-geist-sans)]';

  return (
    <div
      className={`resume-page-shell nrgl-resume-shell min-h-screen flex-col items-center ${fontClass} ${
        isPrintMode
          ? 'flex bg-white px-0 pb-0 pt-0'
          : 'resume-page-enter flex bg-gray-100 px-3 pb-8 pt-20 dark:bg-[#2a2a2d] sm:p-8'
      }`}
      data-pdf-mode={isPrintMode ? 'true' : undefined}
    >
      <div
        className={`fixed left-3 top-[max(0.75rem,env(safe-area-inset-top))] z-30 print:hidden sm:left-4 sm:top-4 ${
          isPrintMode ? 'hidden' : 'resume-controls-enter'
        }`}
      >
        <HomeTransitionLink
          href={`/${locale}`}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-black/10 bg-white/92 px-3.5 text-sm font-medium text-[#171717] shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-md transition-colors hover:bg-white dark:border-white/10 dark:bg-[#171717]/92 dark:text-[#ededed]"
        >
          <span aria-hidden="true">←</span>
          <span>{t('ui.home')}</span>
        </HomeTransitionLink>
      </div>

      <div
        className={`fixed right-6 top-[max(0.75rem,env(safe-area-inset-top))] z-30 flex max-w-[calc(100vw-3rem)] items-center gap-1.5 overflow-visible rounded-2xl border border-black/10 bg-white/82 py-1.5 pl-1.5 pr-3 shadow-[0_12px_32px_rgba(0,0,0,0.12)] backdrop-blur-md dark:border-white/10 dark:bg-[#111111]/86 sm:right-6 sm:top-4 sm:gap-2 sm:bg-transparent sm:p-0 sm:shadow-none ${
          isPrintMode ? 'hidden' : 'resume-controls-enter'
        }`}
      >
        <ExportPdfButton
          additionalSearchParams={showTradeExperience ? { trade: '1' } : undefined}
          exportPath="/api/nrgl-resume-pdf"
          pdfNamespace="nrglResume.pdf"
        />
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <ScalableContent baseWidth={793} mobileBreakpoint={768}>
        <main
          className={`resume-sheet resume-paper nrgl-resume-paper relative w-full max-w-[793px] text-[15px] text-[#171717] ${
            isPrintMode
              ? 'mb-0 mt-0 border-0 bg-white p-[8mm] shadow-none'
              : 'resume-paper-enter mb-8 mt-0 rounded-2xl border border-black/5 bg-white p-4 shadow-[0_12px_36px_rgba(0,0,0,0.12)] dark:border-black/8 dark:bg-[#fcfcfb] sm:mt-10 sm:rounded-none sm:p-6 md:p-[20mm]'
          } print:my-0 print:shadow-none`}
          data-pdf-mode={isPrintMode ? 'true' : undefined}
          data-single-page={showTradeExperience ? undefined : 'true'}
        >
          <article className="flex flex-col space-y-3">
            <header className="mx-auto mb-3 w-full max-w-3xl">
              <div
                className={
                  photoVisible ? 'grid grid-cols-[minmax(0,1fr)_72px] items-start gap-4' : undefined
                }
              >
                <div className="min-w-0">
                  <h1 className="mb-2 text-2xl font-bold">{t('header.name')}</h1>
                  <div className="flex flex-wrap gap-x-1.5 gap-y-0.5 text-xs">
                    {headerItems.map((item, index) => (
                      <span key={item.id} className="contents">
                        {index > 0 && <span className="text-gray-400">|</span>}
                        <span className="whitespace-nowrap">
                          <strong className="font-semibold">
                            {item.label}
                            {locale === 'zh' ? '：' : ': '}
                          </strong>
                          {item.href ? (
                            <a href={item.href} className="hover:underline">
                              {item.value}
                            </a>
                          ) : (
                            item.value
                          )}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
                {photoVisible && (
                  <Image
                    src="/nrgl/profile.jpg"
                    alt={t('ui.photoAlt')}
                    width={150}
                    height={200}
                    priority
                    unoptimized
                    onError={() => setPhotoVisible(false)}
                    className="h-24 w-[72px] justify-self-end rounded-sm object-cover object-top"
                  />
                )}
              </div>
            </header>

            <EducationSection items={educationItems} title={t('education.title')} />
            <ExperienceSection
              items={experienceItems}
              locale={locale}
              title={t('experience.title')}
            />
            <ExperienceSection items={campusItems} locale={locale} title={t('campus.title')} />

            <section className="mx-auto w-full max-w-3xl">
              <h2 className="text-xl font-bold">{t('summary.title')}</h2>
              <div className="rounded-lg bg-black/[.05] p-2">
                <p
                  className="text-xs leading-relaxed"
                  style={locale === 'zh' ? { textIndent: '2em' } : undefined}
                >
                  {t('summary.body')}
                </p>
              </div>
            </section>
          </article>
        </main>
      </ScalableContent>

      <style jsx global>{`
        .nrgl-resume-shell.resume-page-enter {
          animation: nrgl-page-fade-in 340ms cubic-bezier(0.25, 1, 0.5, 1) both;
        }

        .nrgl-resume-shell .resume-paper-enter {
          transform-origin: 50% 0%;
          will-change: opacity, transform;
          animation: nrgl-paper-lift-in 580ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .nrgl-resume-shell .resume-controls-enter {
          animation: nrgl-controls-fade-in 420ms cubic-bezier(0.25, 1, 0.5, 1) 140ms both;
        }

        @keyframes nrgl-page-fade-in {
          from {
            opacity: 0.72;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes nrgl-paper-lift-in {
          from {
            opacity: 0;
            transform: translateY(34px) scale(0.955);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes nrgl-controls-fade-in {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media screen and (max-width: 767px) {
          .nrgl-resume-paper:not([data-pdf-mode='true']) {
            line-height: 1.55;
          }

          .nrgl-resume-paper:not([data-pdf-mode='true']) h1 {
            font-size: 1.85rem;
            line-height: 1.15;
            margin-bottom: 0.75rem;
          }

          .nrgl-resume-paper:not([data-pdf-mode='true']) h2 {
            font-size: 1.1rem;
            line-height: 1.3;
            margin-bottom: 0.5rem;
          }

          .nrgl-resume-paper:not([data-pdf-mode='true']) .text-xs,
          .nrgl-resume-paper:not([data-pdf-mode='true']) .text-xs * {
            font-size: 0.88rem !important;
            line-height: 1.45 !important;
          }

          .nrgl-resume-paper:not([data-pdf-mode='true']) .text-sm,
          .nrgl-resume-paper:not([data-pdf-mode='true']) .text-sm * {
            font-size: 0.98rem;
            line-height: 1.5;
          }

          .nrgl-resume-paper:not([data-pdf-mode='true']) ul {
            padding-left: 0.2rem;
          }
        }

        .nrgl-resume-paper[data-pdf-mode='true'] {
          font-size: 13.5px;
          line-height: 1.45;
        }

        .nrgl-resume-paper[data-pdf-mode='true'] h1 {
          font-size: ${locale === 'zh' ? '25px' : '23px'};
          line-height: ${locale === 'zh' ? '1.3' : '1.2'};
          margin-bottom: ${locale === 'zh' ? '8px' : '6px'};
        }

        .nrgl-resume-paper[data-pdf-mode='true'] h2 {
          font-size: ${locale === 'zh' ? '20px' : '19px'};
          line-height: ${locale === 'zh' ? '1.4' : '1.25'};
          margin-bottom: ${locale === 'zh' ? '8px' : '6px'};
        }

        .nrgl-resume-paper[data-pdf-mode='true'] h3 {
          font-size: ${locale === 'zh' ? '16px' : '15.5px'};
          line-height: 1.4;
        }

        .nrgl-resume-paper[data-pdf-mode='true'] *,
        .nrgl-resume-paper[data-pdf-mode='true'] p,
        .nrgl-resume-paper[data-pdf-mode='true'] li {
          line-height: ${locale === 'zh' ? '1.5' : '1.45'};
        }

        .nrgl-resume-paper[data-pdf-mode='true'] .text-xs,
        .nrgl-resume-paper[data-pdf-mode='true'] .text-xs * {
          font-size: ${locale === 'zh' ? '12px' : '11.5px'} !important;
        }

        .nrgl-resume-paper[data-pdf-mode='true'] article {
          gap: ${locale === 'zh' ? '8px' : '6px'} !important;
        }

        .nrgl-resume-paper[data-pdf-mode='true'] li {
          margin-bottom: 2px !important;
        }

        .nrgl-resume-paper[data-pdf-mode='true'][data-single-page='true'] {
          font-size: ${locale === 'zh' ? '12.5px' : '10.35px'};
          line-height: ${locale === 'zh' ? '1.46' : '1.3'};
        }

        .nrgl-resume-paper[data-pdf-mode='true'][data-single-page='true'] > article {
          gap: ${locale === 'zh' ? '0' : '2px'} !important;
        }

        .nrgl-resume-paper[data-pdf-mode='true'][data-single-page='true'] > article > header {
          margin-bottom: ${locale === 'zh' ? '9px' : '7px'} !important;
        }

        .nrgl-resume-paper[data-pdf-mode='true'][data-single-page='true'] h1 {
          margin-bottom: 4px !important;
          font-size: ${locale === 'zh' ? '26.2px' : '22.4px'};
          line-height: 1.18;
        }

        .nrgl-resume-paper[data-pdf-mode='true'][data-single-page='true'] h2 {
          margin-bottom: 2px !important;
          font-size: ${locale === 'zh' ? '21px' : '18px'};
          line-height: 1.25;
        }

        .nrgl-resume-paper[data-pdf-mode='true'][data-single-page='true'] h3 {
          font-size: ${locale === 'zh' ? '15.9px' : '13.8px'};
          line-height: 1.3;
        }

        .nrgl-resume-paper[data-pdf-mode='true'][data-single-page='true'] section > article,
        .nrgl-resume-paper[data-pdf-mode='true'][data-single-page='true'] section:last-child > div {
          margin-bottom: ${locale === 'zh' ? '0' : '1px'} !important;
          padding: ${locale === 'zh' ? '4px 6px' : '5px 6px'} !important;
        }

        .nrgl-resume-paper[data-pdf-mode='true'][data-single-page='true']
          .nrgl-experience-item:not(:last-child) {
          margin-bottom: ${locale === 'zh' ? '5px' : '4px'} !important;
        }

        .nrgl-resume-paper[data-pdf-mode='true'][data-single-page='true'] .text-xs,
        .nrgl-resume-paper[data-pdf-mode='true'][data-single-page='true'] .text-xs * {
          font-size: ${locale === 'zh' ? '11.8px' : '9.7px'} !important;
          line-height: ${locale === 'zh' ? '1.46' : '1.3'} !important;
        }

        .nrgl-resume-paper[data-pdf-mode='true'][data-single-page='true'] .text-sm,
        .nrgl-resume-paper[data-pdf-mode='true'][data-single-page='true'] .text-sm * {
          font-size: ${locale === 'zh' ? '12.5px' : '10.35px'} !important;
          line-height: ${locale === 'zh' ? '1.42' : '1.34'} !important;
        }

        .nrgl-resume-paper[data-pdf-mode='true'][data-single-page='true'] li {
          margin-bottom: 0 !important;
        }

        @media (prefers-reduced-motion: reduce) {
          .nrgl-resume-shell.resume-page-enter,
          .nrgl-resume-shell .resume-paper-enter,
          .nrgl-resume-shell .resume-controls-enter {
            animation-duration: 0.01ms;
            animation-delay: 0ms;
            transform: none;
            will-change: auto;
          }
        }

        @media print {
          @page {
            size: A4;
            margin: 8mm 0 0;
          }

          .nrgl-resume-paper {
            padding-top: 0 !important;
          }

          .nrgl-resume-paper[data-single-page='true'] {
            padding-top: ${locale === 'zh' ? '4mm' : '2mm'} !important;
          }

          .nrgl-resume-paper section > article,
          .nrgl-resume-paper > article > header,
          .nrgl-resume-paper > article > section:last-child {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .nrgl-resume-paper h2 {
            break-after: avoid;
            page-break-after: avoid;
          }
        }
      `}</style>
    </div>
  );
}
