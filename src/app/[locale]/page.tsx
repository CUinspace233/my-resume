'use client';

import Header from '@/components/Header';
import Education from '@/components/Education';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import TechnicalSkills from '@/components/TechnicalSkills';
import Leadership from '@/components/Societies';
import ThemeToggle from '@/components/ThemeToggle';
import ExportPdfButton from '@/components/ExportPdfButton';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center p-8 font-[family-name:var(--font-geist-sans)] bg-gray-100">
      <div className="absolute top-4 right-4 flex items-center gap-4">
        <ExportPdfButton />
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
      <main className="w-[210mm] bg-white shadow-lg p-[20mm] my-8 print:shadow-none print:my-0 print:p-[12mm] text-sm">
        <article className="flex flex-col space-y-3">
          <div className="first-page">
            <Header />
            <Education />
            <Experience />
            <TechnicalSkills />
          </div>

          <div className="page-break"></div>

          <div className="second-page">
            <Projects />
            <Leadership />
          </div>
        </article>
      </main>

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

          /* Add styles to remove gray background when printing */
          div.min-h-screen {
            background: white !important;
          }

          main {
            margin: 0;
            padding: 12mm !important;
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
          }

          .second-page > * {
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}
