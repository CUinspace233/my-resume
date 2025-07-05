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

export default function Home() {
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
