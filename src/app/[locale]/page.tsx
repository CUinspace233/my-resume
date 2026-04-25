import SiteNav from '@/components/landing/SiteNav';
import Hero from '@/components/landing/Hero';
import TechStackGrid from '@/components/landing/TechStackGrid';
import FeatureCards from '@/components/landing/FeatureCards';
import MetricTiles from '@/components/landing/MetricTiles';
import ContributionsChart from '@/components/landing/ContributionsChart';
import AboutBand from '@/components/landing/AboutBand';

export default function Home() {
  return (
    <div className="landing-page-shell min-h-screen bg-white dark:bg-[#0a0a0a] font-[family-name:var(--font-geist-sans)]">
      <SiteNav />

      <Hero />

      <TechStackGrid />

      <FeatureCards />

      <MetricTiles />

      <ContributionsChart />

      <AboutBand />

      {/* Footer */}
      <footer
        className="px-6 py-8 max-w-[1200px] mx-auto flex items-center justify-between flex-wrap gap-4"
        style={{ borderTop: '1px solid #ebebeb' }}
      >
        <span
          className="font-[family-name:var(--font-geist-sans)] text-xs"
          style={{ color: '#808080' }}
        >
          Henrick Lin · UNSW Computer Science
        </span>
        <div className="flex gap-4">
          <a
            href="https://github.com/CUinspace233"
            target="_blank"
            rel="noopener noreferrer"
            className="font-[family-name:var(--font-geist-sans)] text-xs hover:underline"
            style={{ color: '#808080' }}
          >
            GitHub ↗
          </a>
          <a
            href="https://www.linkedin.com/in/henrick-lin-8a2043325/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-[family-name:var(--font-geist-sans)] text-xs hover:underline"
            style={{ color: '#808080' }}
          >
            LinkedIn ↗
          </a>
          <a
            href="mailto:gmforzh@gmail.com"
            className="font-[family-name:var(--font-geist-sans)] text-xs hover:underline"
            style={{ color: '#808080' }}
          >
            gmforzh@gmail.com
          </a>
        </div>
      </footer>
    </div>
  );
}
