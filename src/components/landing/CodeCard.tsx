'use client';

import { useEffect, useRef, useState } from 'react';

const MAX_TILT = 8;

export default function CodeCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [hovered, setHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const lines = [
    {
      tokens: [
        { text: 'const ', color: '#de1d8d' },
        { text: 'me', color: '#ededed' },
        { text: ' = {', color: '#a1a1a1' },
      ],
    },
    {
      indent: 1,
      tokens: [
        { text: 'name', color: '#0a72ef' },
        { text: ': ', color: '#a1a1a1' },
        { text: '"Henrick Lin"', color: '#a8cc8c' },
        { text: ',', color: '#a1a1a1' },
      ],
    },
    {
      indent: 1,
      tokens: [
        { text: 'role', color: '#0a72ef' },
        { text: ': ', color: '#a1a1a1' },
        { text: '"Full-Stack Engineer"', color: '#a8cc8c' },
        { text: ',', color: '#a1a1a1' },
      ],
    },
    {
      indent: 1,
      tokens: [
        { text: 'education', color: '#0a72ef' },
        { text: ': ', color: '#a1a1a1' },
        { text: '"UNSW CS · iGPA 4.0"', color: '#a8cc8c' },
        { text: ',', color: '#a1a1a1' },
      ],
    },
    {
      indent: 1,
      tokens: [
        { text: 'stack', color: '#0a72ef' },
        { text: ': [', color: '#a1a1a1' },
      ],
    },
    {
      indent: 2,
      tokens: [
        { text: '"React"', color: '#a8cc8c' },
        { text: ', ', color: '#a1a1a1' },
        { text: '"Next.js"', color: '#a8cc8c' },
        { text: ', ', color: '#a1a1a1' },
        { text: '"Vue 3"', color: '#a8cc8c' },
        { text: ',', color: '#a1a1a1' },
      ],
    },
    {
      indent: 2,
      tokens: [
        { text: '"Python"', color: '#a8cc8c' },
        { text: ', ', color: '#a1a1a1' },
        { text: '"FastAPI"', color: '#a8cc8c' },
        { text: ', ', color: '#a1a1a1' },
        { text: '"Docker"', color: '#a8cc8c' },
        { text: ',', color: '#a1a1a1' },
      ],
    },
    {
      indent: 2,
      tokens: [
        { text: '"PostgreSQL"', color: '#a8cc8c' },
        { text: ', ', color: '#a1a1a1' },
        { text: '"MongoDB"', color: '#a8cc8c' },
      ],
    },
    { indent: 1, tokens: [{ text: '],', color: '#a1a1a1' }] },
    {
      indent: 1,
      tokens: [
        { text: 'currently', color: '#0a72ef' },
        { text: ': ', color: '#a1a1a1' },
        { text: '"@ Cool AI · AIGC / Full-Stack Engineer"', color: '#a8cc8c' },
        { text: ',', color: '#a1a1a1' },
      ],
    },
    {
      indent: 1,
      tokens: [
        { text: 'open_to', color: '#0a72ef' },
        { text: ': ', color: '#a1a1a1' },
        { text: '"Grad roles · 2026"', color: '#a8cc8c' },
        { text: ',', color: '#a1a1a1' },
      ],
    },
    {
      indent: 1,
      tokens: [
        { text: 'response_time', color: '#0a72ef' },
        { text: ': ', color: '#a1a1a1' },
        { text: '"< 24h"', color: '#a8cc8c' },
      ],
    },
    { tokens: [{ text: '}', color: '#a1a1a1' }] },
    { tokens: [] },
    { tokens: [{ text: '// gmforzh@gmail.com', color: '#444' }] },
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -ny * MAX_TILT * 2, ry: nx * MAX_TILT * 2 });
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setTilt({ rx: 0, ry: 0 });
  };

  const transform = reducedMotion
    ? undefined
    : `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${hovered ? 1.01 : 1})`;

  const boxShadow =
    hovered && !reducedMotion
      ? '0px 0px 0px 1px rgba(255,255,255,0.14), 0px 8px 40px rgba(0,0,0,0.60)'
      : '0px 0px 0px 1px rgba(255,255,255,0.10), 0px 4px 24px rgba(0,0,0,0.40)';

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-xl overflow-hidden"
      style={{
        background: '#0d0d0d',
        boxShadow,
        transform,
        transition: 'transform 120ms ease-out, box-shadow 200ms ease-out',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Window chrome */}
      <div
        className="flex items-center gap-1.5 px-4 py-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[#a8cc8c] opacity-80" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] opacity-80" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840] opacity-80" />
        <span className="ml-3 font-[family-name:var(--font-geist-mono)] text-[11px] text-[#666] uppercase tracking-wider">
          me.ts
        </span>
      </div>

      {/* Code body */}
      <div className="px-4 py-4 overflow-x-auto">
        <pre className="font-[family-name:var(--font-geist-mono)] text-[13px] leading-6">
          {lines.map((line, i) => (
            <div key={i} className="flex">
              <span className="select-none w-8 text-right pr-3 text-[#333] text-[11px] leading-6 shrink-0">
                {i + 1}
              </span>
              <span style={{ paddingLeft: `${(line.indent ?? 0) * 16}px` }}>
                {(line.tokens ?? []).map((token, j) => (
                  <span key={j} style={{ color: token.color }}>
                    {token.text}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}
