'use client';

import { useEffect, useRef } from 'react';

interface Props {
  contributionsCount: number | null;
}

export default function ContributionsChartClient({ contributionsCount }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollToRight = () => {
      el.scrollLeft = el.scrollWidth - el.clientWidth;
    };

    scrollToRight();
    window.addEventListener('resize', scrollToRight);
    return () => window.removeEventListener('resize', scrollToRight);
  }, []);

  return (
    <section
      className="px-6 py-16 max-w-[1200px] mx-auto"
      style={{ borderTop: '1px solid #ebebeb' }}
    >
      <div className="mb-6">
        <h2
          className="font-[family-name:var(--font-geist-mono)] text-[11px] font-medium uppercase tracking-widest"
          style={{ color: '#808080' }}
        >
          GitHub Contributions
        </h2>
        {contributionsCount !== null && (
          <p
            className="font-[family-name:var(--font-geist-mono)] text-[11px] mt-1"
            style={{ color: '#808080' }}
          >
            <span className="font-bold text-sm" style={{ color: '#0a72ef' }}>
              {contributionsCount.toLocaleString()}
            </span>{' '}
            contributions in the last year
          </p>
        )}
      </div>
      <div
        ref={scrollRef}
        className="p-4 rounded-lg overflow-x-auto"
        style={{ boxShadow: 'var(--card-shadow)' }}
      >
        <img
          src="https://ghchart.rshah.org/0a72ef/CUinspace233"
          alt="GitHub contribution chart for CUinspace233"
          className="w-full min-w-[600px]"
          style={{ imageRendering: 'crisp-edges' }}
        />
      </div>
    </section>
  );
}
