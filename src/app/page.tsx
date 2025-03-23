import Header from '@/components/Header';
import Education from '@/components/Education';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import TechnicalSkills from '@/components/TechnicalSkills';
import Leadership from '@/components/Leadership';
import ThemeToggle from '@/components/ThemeToggle';
import ExportPdfButton from '@/components/ExportPdfButton';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center p-8 font-[family-name:var(--font-geist-sans)] bg-gray-100">
      <div className="absolute top-4 right-4 flex items-center gap-4">
        <ExportPdfButton />
        <ThemeToggle />
      </div>
      <main className="w-[210mm] bg-white shadow-lg p-[20mm] my-8 print:shadow-none print:my-0 print:p-[12mm] text-sm">
        <div className="flex flex-col gap-[12px]">
          <div className="print-section">
            <Header />
            <Education />
          </div>
          <div className="print-section">
            <Experience />
            <TechnicalSkills />
          </div>
          <div className="print-section">
            <Projects />
            <Leadership />
          </div>
        </div>
      </main>
    </div>
  );
}
