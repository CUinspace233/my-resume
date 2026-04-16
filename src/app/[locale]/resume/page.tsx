'use client';

import Header from '@/components/Header';
import Education from '@/components/Education';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import TechnicalSkills from '@/components/TechnicalSkills';
import Societies from '@/components/Societies';
import ThemeToggle from '@/components/ThemeToggle';
import ExportPdfButton from '@/components/ExportPdfButton';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ScalableContent from '@/components/ScalableContent';
import GithubLink from '@/components/GithubLink';
import Awards from '@/components/Awards';
import { useLocale } from 'next-intl';
import Link from 'next/link';

export default function ResumePage() {
  const locale = useLocale();

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 px-3 pb-8 pt-20 font-[family-name:var(--font-geist-sans)] dark:bg-[#2a2a2d] sm:p-8">
      {/* Back link */}
      <div className="fixed left-3 top-[max(0.75rem,env(safe-area-inset-top))] z-30 print:hidden sm:left-4 sm:top-4">
        <Link
          href={`/${locale}`}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-black/10 bg-white/92 px-3.5 text-sm font-medium text-[#171717] shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-md transition-colors hover:bg-white dark:border-white/10 dark:bg-[#171717]/92 dark:text-[#ededed]"
        >
          <span aria-hidden="true">←</span>
          <span>Home</span>
        </Link>
      </div>

      <div className="fixed right-3 top-[max(0.75rem,env(safe-area-inset-top))] z-30 flex items-center gap-1.5 rounded-2xl border border-black/10 bg-white/82 p-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.12)] backdrop-blur-md dark:border-white/10 dark:bg-[#111111]/86 sm:right-4 sm:top-4 sm:gap-2 sm:bg-transparent sm:p-0 sm:shadow-none">
        <ExportPdfButton />
        <LanguageSwitcher />
        <ThemeToggle />
        <GithubLink repoUrl="https://github.com/CUinspace233/my-resume" size="responsive" />
      </div>

      <ScalableContent baseWidth={793} mobileBreakpoint={768}>
        <main className="resume-sheet resume-paper w-full max-w-[793px] rounded-2xl border border-black/5 bg-white p-4 text-[15px] text-[#171717] shadow-[0_12px_36px_rgba(0,0,0,0.12)] mt-0 mb-8 dark:border-black/8 dark:bg-[#fcfcfb] dark:text-[#171717] sm:mt-10 sm:rounded-none sm:p-6 sm:text-sm md:p-[20mm] print:shadow-none print:my-0">
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
              <div className="mb-1">
                <Projects />
              </div>
            </div>

            <div className="second-page">
              <div className="mb-2">
                <Awards />
              </div>
              <TechnicalSkills />
            </div>
          </article>
        </main>
      </ScalableContent>

      <style jsx global>{`
        .resume-sheet[data-pdf-export='true'] {
          font-size: 1.14rem;
          line-height: 1.58;
        }

        .resume-sheet[data-pdf-export='true'] h1 {
          font-size: 2.2rem;
          line-height: 1.1;
          margin-bottom: 0.76rem;
        }

        .resume-sheet[data-pdf-export='true'] h2 {
          font-size: 1.42rem;
          line-height: 1.25;
          margin-bottom: 0.52rem;
        }

        .resume-sheet[data-pdf-export='true'] h3 {
          font-size: 1.18rem;
          line-height: 1.32;
        }

        .resume-sheet[data-pdf-export='true'] h4 {
          font-size: 1.08rem;
          line-height: 1.32;
        }

        .resume-sheet[data-pdf-export='true'] p,
        .resume-sheet[data-pdf-export='true'] li,
        .resume-sheet[data-pdf-export='true'] a {
          font-size: 1.08rem;
        }

        .resume-sheet[data-pdf-export='true'] .text-xs,
        .resume-sheet[data-pdf-export='true'] .text-xs * {
          font-size: 1rem !important;
          line-height: 1.46 !important;
        }

        .resume-sheet[data-pdf-export='true'] .text-sm,
        .resume-sheet[data-pdf-export='true'] .text-sm * {
          font-size: 1.12rem;
          line-height: 1.52;
        }

        @media screen and (max-width: 767px) {
          .resume-sheet:not([data-pdf-export='true']) {
            line-height: 1.55;
          }

          .resume-sheet:not([data-pdf-export='true']) h1 {
            font-size: 1.85rem;
            line-height: 1.15;
            margin-bottom: 0.75rem;
          }

          .resume-sheet:not([data-pdf-export='true']) h2 {
            font-size: 1.1rem;
            line-height: 1.3;
            margin-bottom: 0.5rem;
          }

          .resume-sheet:not([data-pdf-export='true']) .text-xs,
          .resume-sheet:not([data-pdf-export='true']) .text-xs * {
            font-size: 0.88rem !important;
            line-height: 1.45 !important;
          }

          .resume-sheet:not([data-pdf-export='true']) .text-sm,
          .resume-sheet:not([data-pdf-export='true']) .text-sm * {
            font-size: 0.98rem;
            line-height: 1.5;
          }

          .resume-sheet:not([data-pdf-export='true']) ul {
            padding-left: 0.2rem;
          }

          .resume-sheet:not([data-pdf-export='true']) .grid.grid-cols-2 {
            grid-template-columns: 1fr;
            gap: 0.5rem;
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
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          main {
            margin: 0 !important;
            padding: 8mm !important;
            display: block;
            width: 21cm;
            box-shadow: none !important;
          }

          ${locale === 'zh'
            ? `
            main * {
              font-size: 14px !important;
              line-height: 1.5 !important;
            }
            main h1 {
              font-size: 25px !important;
              margin-bottom: 8px !important;
              line-height: 1.3 !important;
            }
            main h2 {
              font-size: 20px !important;
              margin-bottom: 8px !important;
              line-height: 1.4 !important;
            }
            main h3 {
              font-size: 16px !important;
              line-height: 1.4 !important;
            }
            main h4 {
              font-size: 15px !important;
              line-height: 1.4 !important;
            }
            main .text-xs,
            main .text-xs * {
              font-size: 12px !important;
            }
            main header div {
              font-size: 12px !important;
            }
            main li {
              margin-bottom: 2px !important;
            }
            main article {
              gap: 8px !important;
            }
            main .mb-1 {
              margin-bottom: 4px !important;
            }
            main .mb-2 {
              margin-bottom: 6px !important;
            }
            main .mb-3 {
              margin-bottom: 8px !important;
            }
            main .space-y-1 > * + * {
              margin-top: 4px !important;
            }
            main .space-y-3 > * + * {
              margin-top: 8px !important;
            }
            main .p-2 {
              padding: 10px !important;
            }
            main .second-page {
              margin-top: 28px !important;
            }
            main .mt-10 {
              margin-top: 28px !important;
            }
          `
            : `
            main * {
              font-size: 13.5px !important;
              line-height: 1.45 !important;
            }
            main h1 {
              font-size: 23px !important;
              margin-bottom: 6px !important;
            }
            main h2 {
              font-size: 19px !important;
              margin-bottom: 6px !important;
            }
            main h3 {
              font-size: 15.5px !important;
            }
            main .text-xs,
            main .text-xs * {
              font-size: 11.5px !important;
            }
            main article {
              gap: 6px !important;
            }
            main .mb-1 {
              margin-bottom: 3px !important;
            }
            main .mb-2 {
              margin-bottom: 5px !important;
            }
            main li {
              margin-bottom: 2px !important;
            }
            main .space-y-1 > * + * {
              margin-top: 3px !important;
            }
            main .space-y-3 > * + * {
              margin-top: 6px !important;
            }
            main .second-page {
              margin-top: 26px !important;
            }
          `}

          .absolute {
            display: none !important;
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
