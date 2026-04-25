'use client';

import Awards from '@/components/Awards';
import Education from '@/components/Education';
import Experience from '@/components/Experience';
import ExportPdfButton from '@/components/ExportPdfButton';
import GithubLink from '@/components/GithubLink';
import Header from '@/components/Header';
import HomeTransitionLink from '@/components/HomeTransitionLink';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Projects from '@/components/Projects';
import ScalableContent from '@/components/ScalableContent';
import Societies from '@/components/Societies';
import TechnicalSkills from '@/components/TechnicalSkills';
import ThemeToggle from '@/components/ThemeToggle';

type ResumePageClientProps = {
  locale: string;
  isPrintMode: boolean;
};

export default function ResumePageClient({ locale, isPrintMode }: ResumePageClientProps) {
  const fontClass =
    locale === 'zh'
      ? "font-['Noto_Sans_SC','PingFang_SC','Hiragino_Sans_GB','Microsoft_YaHei',sans-serif]"
      : 'font-[family-name:var(--font-geist-sans)]';

  return (
    <div
      className={`resume-page-shell min-h-screen flex flex-col items-center ${fontClass} ${
        isPrintMode
          ? 'bg-white px-0 pb-0 pt-0'
          : 'resume-page-enter bg-gray-100 px-3 pb-8 pt-20 dark:bg-[#2a2a2d] sm:p-8'
      }`}
      data-pdf-mode={isPrintMode ? 'true' : undefined}
    >
      <div
        className={`fixed left-3 top-[max(0.75rem,env(safe-area-inset-top))] z-30 print:hidden sm:left-4 sm:top-4 ${
          isPrintMode ? 'hidden' : ''
        } ${isPrintMode ? '' : 'resume-controls-enter'}`}
      >
        <HomeTransitionLink
          href={`/${locale}`}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-black/10 bg-white/92 px-3.5 text-sm font-medium text-[#171717] shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-md transition-colors hover:bg-white dark:border-white/10 dark:bg-[#171717]/92 dark:text-[#ededed]"
        >
          <span aria-hidden="true">←</span>
          <span>Home</span>
        </HomeTransitionLink>
      </div>

      <div
        className={`fixed right-3 top-[max(0.75rem,env(safe-area-inset-top))] z-30 flex items-center gap-1.5 rounded-2xl border border-black/10 bg-white/82 p-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.12)] backdrop-blur-md dark:border-white/10 dark:bg-[#111111]/86 sm:right-4 sm:top-4 sm:gap-2 sm:bg-transparent sm:p-0 sm:shadow-none ${
          isPrintMode ? 'hidden' : ''
        } ${isPrintMode ? '' : 'resume-controls-enter'}`}
      >
        <ExportPdfButton />
        <LanguageSwitcher />
        <ThemeToggle />
        <GithubLink repoUrl="https://github.com/CUinspace233/my-resume" size="responsive" />
      </div>

      <ScalableContent baseWidth={793} mobileBreakpoint={768}>
        <main
          className={`resume-sheet resume-paper relative w-full max-w-[793px] text-[15px] text-[#171717] ${
            isPrintMode
              ? 'mb-0 mt-0 border-0 bg-white p-[8mm] shadow-none'
              : 'resume-paper-enter mb-8 mt-0 rounded-2xl border border-black/5 bg-white p-4 shadow-[0_12px_36px_rgba(0,0,0,0.12)] dark:border-black/8 dark:bg-[#fcfcfb] sm:mt-10 sm:rounded-none sm:p-6 md:p-[20mm]'
          } print:my-0 print:shadow-none`}
          data-pdf-mode={isPrintMode ? 'true' : undefined}
        >
          <a
            href="https://www.cuinspace.com"
            target="_blank"
            rel="noopener noreferrer"
            className="resume-website-link absolute bottom-2 right-3 text-[10px] text-[#808080] hover:text-[#171717] hover:underline sm:bottom-3 sm:right-4 md:bottom-[8mm] md:right-[20mm]"
          >
            <span>cuinspace.com </span>
            <span className="resume-link-arrow" aria-hidden="true">
              <svg
                viewBox="0 0 12 12"
                className="h-[0.85em] w-[0.85em]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 9L9 3M5 3H9V7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </a>

          <article className="flex flex-col space-y-3">
            <div className="first-page">
              <Header />
              <div className="mb-1">
                <Education />
              </div>
              <div className="mb-1">
                <Experience />
              </div>
              <div className="mb-1">
                <Societies />
              </div>
            </div>

            <div className="second-page">
              <div className="mb-1">
                <Projects />
              </div>
              <div className="mb-2">
                <Awards />
              </div>
              <TechnicalSkills />
            </div>
          </article>
        </main>
      </ScalableContent>

      <style jsx global>{`
        .resume-page-enter {
          animation: resume-page-fade-in 340ms cubic-bezier(0.25, 1, 0.5, 1) both;
        }

        .resume-paper-enter {
          transform-origin: 50% 0%;
          will-change: opacity, transform;
          animation: resume-paper-lift-in 580ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .resume-controls-enter {
          animation: resume-controls-fade-in 420ms cubic-bezier(0.25, 1, 0.5, 1) 140ms both;
        }

        @keyframes resume-page-fade-in {
          from {
            opacity: 0.72;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes resume-paper-lift-in {
          from {
            opacity: 0;
            transform: translateY(34px) scale(0.955);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes resume-controls-fade-in {
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
          .resume-sheet:not([data-pdf-mode='true']) {
            line-height: 1.55;
          }

          .resume-sheet:not([data-pdf-mode='true']) h1 {
            font-size: 1.85rem;
            line-height: 1.15;
            margin-bottom: 0.75rem;
          }

          .resume-sheet:not([data-pdf-mode='true']) h2 {
            font-size: 1.1rem;
            line-height: 1.3;
            margin-bottom: 0.5rem;
          }

          .resume-sheet:not([data-pdf-mode='true']) .text-xs,
          .resume-sheet:not([data-pdf-mode='true']) .text-xs * {
            font-size: 0.88rem !important;
            line-height: 1.45 !important;
          }

          .resume-sheet:not([data-pdf-mode='true']) .text-sm,
          .resume-sheet:not([data-pdf-mode='true']) .text-sm * {
            font-size: 0.98rem;
            line-height: 1.5;
          }

          .resume-sheet:not([data-pdf-mode='true']) ul {
            padding-left: 0.2rem;
          }

          .resume-sheet:not([data-pdf-mode='true']) .grid.grid-cols-2 {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }
        }

        .resume-sheet[data-pdf-mode='true'] {
          font-size: 13.5px;
          line-height: 1.45;
        }

        .resume-sheet[data-pdf-mode='true'] h1 {
          font-size: ${locale === 'zh' ? '25px' : '23px'};
          line-height: ${locale === 'zh' ? '1.3' : '1.2'};
          margin-bottom: ${locale === 'zh' ? '8px' : '6px'};
        }

        .resume-sheet[data-pdf-mode='true'] h2 {
          font-size: ${locale === 'zh' ? '20px' : '19px'};
          line-height: ${locale === 'zh' ? '1.4' : '1.25'};
          margin-bottom: ${locale === 'zh' ? '8px' : '6px'};
        }

        .resume-sheet[data-pdf-mode='true'] h3 {
          font-size: ${locale === 'zh' ? '16px' : '15.5px'};
          line-height: 1.4;
        }

        .resume-sheet[data-pdf-mode='true'] h4 {
          font-size: ${locale === 'zh' ? '15px' : '14.5px'};
          line-height: 1.4;
        }

        .resume-sheet[data-pdf-mode='true'] *,
        .resume-sheet[data-pdf-mode='true'] p,
        .resume-sheet[data-pdf-mode='true'] li {
          line-height: ${locale === 'zh' ? '1.5' : '1.45'};
        }

        .resume-sheet[data-pdf-mode='true'] .text-xs,
        .resume-sheet[data-pdf-mode='true'] .text-xs * {
          font-size: ${locale === 'zh' ? '12px' : '11.5px'} !important;
        }

        .resume-sheet[data-pdf-mode='true'] header div {
          font-size: ${locale === 'zh' ? '12px' : '11.5px'} !important;
        }

        .resume-sheet[data-pdf-mode='true'] article {
          gap: ${locale === 'zh' ? '8px' : '6px'} !important;
        }

        .resume-sheet[data-pdf-mode='true'] li {
          margin-bottom: 2px !important;
        }

        .resume-sheet[data-pdf-mode='true'] .mb-1 {
          margin-bottom: ${locale === 'zh' ? '4px' : '3px'} !important;
        }

        .resume-sheet[data-pdf-mode='true'] .mb-2 {
          margin-bottom: ${locale === 'zh' ? '6px' : '5px'} !important;
        }

        .resume-sheet[data-pdf-mode='true'] .mb-3 {
          margin-bottom: 8px !important;
        }

        .resume-sheet[data-pdf-mode='true'] .space-y-1 > * + * {
          margin-top: ${locale === 'zh' ? '4px' : '3px'} !important;
        }

        .resume-sheet[data-pdf-mode='true'] .space-y-3 > * + * {
          margin-top: ${locale === 'zh' ? '8px' : '6px'} !important;
        }

        .resume-sheet[data-pdf-mode='true'] .second-page {
          margin-top: ${locale === 'zh' ? '64px' : '60px'} !important;
        }

        .resume-sheet[data-pdf-mode='true'] .resume-website-link {
          position: absolute !important;
          bottom: 6mm !important;
          right: 8mm !important;
          font-size: 9px !important;
          color: #808080 !important;
        }

        .resume-link-arrow {
          display: inline-flex;
          vertical-align: -0.08em;
        }

        @media (prefers-reduced-motion: reduce) {
          .resume-page-enter,
          .resume-paper-enter,
          .resume-controls-enter {
            animation-duration: 0.01ms;
            animation-delay: 0ms;
            transform: none;
            will-change: auto;
          }
        }

        @media print {
          @page {
            size: A4;
            margin: 0;
          }

          body {
            margin: 0;
            padding: 0;
            background: white;
            display: block;
            width: 21cm;
            height: 29.7cm;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          div.min-h-screen {
            animation: none !important;
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          main {
            animation: none !important;
            transform: none !important;
            margin: 0 !important;
            padding: 8mm !important;
            display: block;
            width: 21cm;
            box-shadow: none !important;
          }

          .absolute {
            display: none !important;
          }

          .resume-website-link.absolute {
            display: inline !important;
            position: absolute !important;
            bottom: 6mm !important;
            right: 8mm !important;
            font-size: 9px !important;
            color: #808080 !important;
          }

          .resume-website-link.absolute .resume-link-arrow {
            display: inline-flex !important;
          }

          .page-break {
            page-break-after: always;
            height: 0;
            display: block;
          }

          .first-page,
          .second-page {
            display: block;
            margin-top: 0 !important;
          }

          .second-page > * {
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}
