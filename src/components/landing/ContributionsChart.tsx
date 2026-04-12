'use client';

export default function ContributionsChart() {
  return (
    <section
      className="px-6 py-16 max-w-[1200px] mx-auto"
      style={{ borderTop: '1px solid #ebebeb' }}
    >
      <p
        className="font-[family-name:var(--font-geist-mono)] text-[11px] font-medium uppercase tracking-widest mb-6"
        style={{ color: '#808080' }}
      >
        GitHub Contributions
      </p>
      <div
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
