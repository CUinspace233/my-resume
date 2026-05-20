import type { ReactNode } from 'react';

export function TextField({
  label,
  value,
  onChange,
  rows = 2,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="group grid gap-2 text-xs font-semibold text-[#55524b]">
      <span className="flex items-center justify-between gap-3">
        <span>{label}</span>
        <span className="font-[family-name:var(--font-geist-mono)] text-[10px] font-normal uppercase tracking-[0.16em] text-[#aaa49a]">
          editable
        </span>
      </span>
      <textarea
        value={value}
        onChange={event => onChange(event.target.value)}
        rows={rows}
        className="min-h-11 resize-y rounded-lg border border-[#ddd8cf] bg-white px-3 py-2.5 text-sm leading-6 text-[#1b1a17] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] outline-none transition group-hover:border-[#c8c1b6] focus:border-[#2474d7] focus:ring-4 focus:ring-[#2474d7]/10"
      />
    </label>
  );
}

export function PanelHeader({
  eyebrow,
  title,
  icon,
}: {
  eyebrow: string;
  title: string;
  icon: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#e4ded2] bg-[#fbfaf7] text-[#2f6f73] shadow-sm">
        {icon}
      </div>
      <div>
        <p className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.24em] text-[#8d877d]">
          {eyebrow}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#171612]">{title}</h1>
      </div>
    </div>
  );
}

export function EditorGroup({
  title,
  meta,
  children,
}: {
  title: string;
  meta?: string;
  children: ReactNode;
}) {
  return (
    <section className="grid content-start gap-3 rounded-xl border border-[#ebe5dc] bg-[#fbfaf7] p-4 shadow-[0_1px_0_rgba(255,255,255,0.8)]">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold text-[#25231e]">{title}</h3>
        {meta && (
          <p className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.16em] text-[#9b9489]">
            {meta}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}
