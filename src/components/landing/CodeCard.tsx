'use client';

import { type CSSProperties, useEffect, useRef, useState } from 'react';
import { NOAH_GROUP_URL, NOAH_LINK_COLOR } from './NoahGroupLink';

const MAX_TILT = 8;

const INITIAL_VISUAL_STATE = {
  tilt: { rx: 0, ry: 0 },
  pointer: { x: 50, y: 50 },
  background: { x: 50, y: 50 },
  pointerFromCenter: 0,
  effectIntensity: 0,
};

type HoloStyle = CSSProperties & {
  '--pointer-x': string;
  '--pointer-y': string;
  '--background-x': string;
  '--background-y': string;
  '--pointer-from-center': number;
  '--effect-intensity': number;
};

type CodeToken = {
  text: string;
  color: string;
  href?: string;
};

type CodeLine = {
  indent?: number;
  tokens: CodeToken[];
};

export default function CodeCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visualState, setVisualState] = useState(INITIAL_VISUAL_STATE);
  const [hovered, setHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncReducedMotion = () => setReducedMotion(mediaQuery.matches);

    syncReducedMotion();
    mediaQuery.addEventListener('change', syncReducedMotion);

    return () => mediaQuery.removeEventListener('change', syncReducedMotion);
  }, []);

  const lines: CodeLine[] = [
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
        { text: '"@ ', color: '#a8cc8c' },
        { text: 'Noah Holdings', color: NOAH_LINK_COLOR, href: NOAH_GROUP_URL },
        { text: ' · Full-Stack Engineer"', color: '#a8cc8c' },
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

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pointer = {
      x: round(clamp(((e.clientX - rect.left) / rect.width) * 100)),
      y: round(clamp(((e.clientY - rect.top) / rect.height) * 100)),
    };
    const center = {
      x: pointer.x - 50,
      y: pointer.y - 50,
    };

    setVisualState({
      tilt: {
        rx: round((center.y / 50) * MAX_TILT * -1),
        ry: round((center.x / 50) * MAX_TILT),
      },
      pointer,
      background: {
        x: mapRange(pointer.x, 0, 100, 37, 63),
        y: mapRange(pointer.y, 0, 100, 33, 67),
      },
      pointerFromCenter: getPointerDistanceFromCenter(pointer.x, pointer.y),
      effectIntensity: 1,
    });
  };

  const handlePointerLeave = () => {
    setHovered(false);
    setVisualState(INITIAL_VISUAL_STATE);
  };

  const transform = reducedMotion
    ? undefined
    : `perspective(1000px) rotateX(${visualState.tilt.rx}deg) rotateY(${visualState.tilt.ry}deg) scale(${hovered ? 1.01 : 1})`;

  const boxShadow =
    hovered && !reducedMotion
      ? '0px 0px 0px 1px rgba(255,255,255,0.14), 0px 8px 40px rgba(0,0,0,0.60)'
      : '0px 0px 0px 1px rgba(255,255,255,0.10), 0px 4px 24px rgba(0,0,0,0.40)';

  const holoStyle: HoloStyle = {
    '--pointer-x': `${visualState.pointer.x}%`,
    '--pointer-y': `${visualState.pointer.y}%`,
    '--background-x': `${visualState.background.x}%`,
    '--background-y': `${visualState.background.y}%`,
    '--pointer-from-center': visualState.pointerFromCenter,
    '--effect-intensity': reducedMotion ? 0.08 : visualState.effectIntensity,
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-xl overflow-hidden"
      style={{
        ...holoStyle,
        background: '#0d0d0d',
        boxShadow,
        transform,
        transition: reducedMotion
          ? 'box-shadow 200ms ease-out'
          : 'transform 120ms ease-out, box-shadow 200ms ease-out',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={handlePointerLeave}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              -28deg,
              rgba(255, 91, 79, 0.28) 0%,
              rgba(222, 29, 141, 0.24) 8%,
              rgba(10, 114, 239, 0.26) 16%,
              rgba(119, 247, 212, 0.22) 24%,
              rgba(255, 189, 46, 0.18) 32%,
              rgba(255, 91, 79, 0.28) 40%
            ),
            repeating-linear-gradient(
              126deg,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 0.26) 3.5%,
              rgba(13, 13, 13, 0.44) 7%,
              rgba(255, 255, 255, 0.08) 10.5%,
              rgba(255, 255, 255, 0) 15%
            ),
            radial-gradient(
              farthest-corner circle at var(--pointer-x) var(--pointer-y),
              rgba(255, 255, 255, 0.44) 0%,
              rgba(119, 247, 212, 0.2) 18%,
              rgba(222, 29, 141, 0.16) 42%,
              rgba(10, 114, 239, 0.08) 68%,
              transparent 100%
            )
          `,
          backgroundBlendMode: 'screen, overlay, soft-light',
          backgroundPosition:
            'var(--background-x) var(--background-y), var(--background-x) var(--background-y), var(--pointer-x) var(--pointer-y)',
          backgroundSize: '420% 420%, 260% 260%, 180% 180%',
          filter:
            'brightness(calc((var(--pointer-from-center) * 0.42) + 0.62)) contrast(1.55) saturate(1.2)',
          mixBlendMode: 'color-dodge',
          opacity:
            'calc((0.11 * var(--effect-intensity)) + (var(--effect-intensity) * var(--pointer-from-center) * 0.2))',
          transition: 'opacity 240ms ease, filter 240ms ease',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          backgroundImage: `
            radial-gradient(
              farthest-corner circle at var(--pointer-x) var(--pointer-y),
              rgba(255, 255, 255, 0.68) 0%,
              rgba(255, 255, 255, 0.26) 14%,
              rgba(10, 114, 239, 0.08) 38%,
              rgba(0, 0, 0, 0.7) 100%
            )
          `,
          mixBlendMode: 'hard-light',
          opacity:
            'calc((0.06 * var(--effect-intensity)) + (var(--effect-intensity) * var(--pointer-from-center) * 0.24))',
          transition: 'opacity 220ms ease',
        }}
      />

      {/* Window chrome */}
      <div
        className="relative z-20 flex items-center gap-1.5 px-4 py-3"
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
      <div className="relative z-20 px-4 py-4 overflow-x-auto">
        <pre className="font-[family-name:var(--font-geist-mono)] text-[13px] leading-6">
          {lines.map((line, i) => (
            <div key={i} className="flex">
              <span className="select-none w-8 text-right pr-3 text-[#333] text-[11px] leading-6 shrink-0">
                {i + 1}
              </span>
              <span style={{ paddingLeft: `${(line.indent ?? 0) * 16}px` }}>
                {(line.tokens ?? []).map((token, j) =>
                  token.href ? (
                    <a
                      key={j}
                      href={token.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: token.color, textDecoration: 'none' }}
                    >
                      {token.text}
                    </a>
                  ) : (
                    <span key={j} style={{ color: token.color }}>
                      {token.text}
                    </span>
                  )
                )}
              </span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}

function mapRange(value: number, fromMin: number, fromMax: number, toMin: number, toMax: number) {
  const progress = (value - fromMin) / (fromMax - fromMin);
  return round(toMin + progress * (toMax - toMin));
}

function clamp(value: number, min = 0, max = 100) {
  return Math.min(Math.max(value, min), max);
}

function round(value: number, precision = 3) {
  return Number(value.toFixed(precision));
}

function getPointerDistanceFromCenter(x: number, y: number) {
  return round(clamp(Math.hypot(x - 50, y - 50) / 50, 0, 1));
}
