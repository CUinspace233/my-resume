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
import { useLocale } from 'next-intl';

export default function Home() {
  const locale = useLocale();

  return (
    <div className="min-h-screen flex flex-col items-center p-8 font-[family-name:var(--font-geist-sans)] bg-gray-100">
      <div className="fixed z-20 top-2 right-2 sm:top-4 sm:right-4 flex items-center gap-1 sm:gap-2">
        <ExportPdfButton />
        <LanguageSwitcher />
        <GithubLink repoUrl="https://github.com/CUinspace233/my-resume" size="responsive" />
        <ThemeToggle />
      </div>

      <ScalableContent baseWidth={793}>
        <main className="bg-white shadow-lg p-[20mm] mt-2 sm:mt-6 mb-8 print:shadow-none print:my-0 text-sm">
          <article className="flex flex-col space-y-3">
            <div className="first-page">
              <Header />
              <div className="mb-2">
                <Education />
              </div>
              <div className="mb-2">
                <Experience />
              </div>
              <div className="mb-2">
                <Projects />
              </div>
            </div>

            <div className="second-page">
              <div className="mt-10 mb-2">
                <Societies />
              </div>
              <TechnicalSkills />
            </div>
          </article>
        </main>
      </ScalableContent>

      <style jsx global>{`
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
            /* Base font size */
            main * {
              font-size: 14px !important;
              line-height: 1.5 !important;
            }
            
            /* Title font size */
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
            
            /* Small font size */
            main .text-xs,
            main .text-xs * {
              font-size: 12px !important;
            }
            
            /* Contact information */
            main header div {
              font-size: 12px !important;
            }
            
            /* List items */
            main li {
              margin-bottom: 3px !important;
            }
            
            /* Spacing adjustment */
            main article {
              gap: 16px !important;
            }
            
            main .mb-2 {
              margin-bottom: 12px !important;
            }
            
            main .mb-3 {
              margin-bottom: 14px !important;
            }
            
            main .space-y-1 > * + * {
              margin-top: 6px !important;
            }
            
            main .space-y-3 > * + * {
              margin-top: 16px !important;
            }
            
            /* Content box padding */
            main .p-2 {
              padding: 10px !important;
            }
            
            /* Second page top spacing */
            main .second-page {
              margin-top: 28px !important;
            }
            
            main .mt-10 {
              margin-top: 28px !important;
            }
            
          `
            : `
            /* English version keep original size */
            main * {
              font-size: 14px !important;
              line-height: 1.5 !important;
            }
            
            main h1 {
              font-size: 24px !important;
            }
            
            main h2 {
              font-size: 20px !important;
            }
            
            main h3 {
              font-size: 16px !important;
            }
            
            main .text-xs,
            main .text-xs * {
              font-size: 12px !important;
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
