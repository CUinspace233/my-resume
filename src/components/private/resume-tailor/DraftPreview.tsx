import { ArrowLeftIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import type { CSSProperties } from 'react';

export function DraftPreview({
  selectedLocale,
  draftId,
  previewUrl,
  previewFrameHeight,
  isPreparingPreview,
  onFrameLoad,
}: {
  selectedLocale: string;
  draftId: string | null;
  previewUrl: string;
  previewFrameHeight: number;
  isPreparingPreview: boolean;
  onFrameLoad: (iframe: HTMLIFrameElement) => void;
}) {
  if (!draftId && !isPreparingPreview) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-[#ded6c9] bg-[#fffdf8] shadow-[0_18px_60px_rgba(51,43,31,0.12)]">
      <div className="flex items-center justify-between border-b border-[#ebe5dc] px-5 py-4">
        <div>
          <p className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.2em] text-[#8d877d]">
            PDF preview
          </p>
          <h2 className="mt-1 text-base font-semibold text-[#24211c]">Export layout check</h2>
        </div>
        <span className="rounded-full border border-[#d9d2c6] bg-white px-3 py-1 text-xs font-semibold text-[#625b51]">
          {selectedLocale.toUpperCase()}
        </span>
      </div>
      {draftId ? (
        <iframe
          key={previewUrl}
          title="Tailored resume preview"
          src={previewUrl}
          onLoad={event => onFrameLoad(event.currentTarget)}
          style={
            {
              '--preview-frame-height': `${previewFrameHeight}px`,
            } as CSSProperties
          }
          className="pointer-events-none h-[var(--preview-frame-height)] w-full bg-[#f7f4ee] md:pointer-events-auto md:h-[900px]"
        />
      ) : (
        <div className="grid h-[360px] place-items-center bg-[#f7f4ee] text-sm font-semibold text-[#625b51]">
          Preparing preview...
        </div>
      )}
    </div>
  );
}

export function EmptyDraftState({ selectedLocale }: { selectedLocale: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#cfc7ba] bg-[#fffdf8]/80 p-5 shadow-[0_18px_60px_rgba(51,43,31,0.08)]">
      <div className="flex justify-end">
        <Link
          href={`/${selectedLocale}/resume`}
          className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#d9d2c6] bg-white px-4 text-sm font-semibold text-[#4f493f] shadow-sm transition hover:border-[#bdb4a5]"
        >
          <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
          Resume page
        </Link>
      </div>
      <div className="grid min-h-[440px] place-items-center text-center">
        <div className="max-w-sm">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-[#e4ded2] bg-white text-[#2f6f73] shadow-sm">
            <DocumentTextIcon className="h-7 w-7" aria-hidden="true" />
          </div>
          <h2 className="mt-5 text-xl font-semibold text-[#24211c]">No tailored draft yet</h2>
          <p className="mt-2 text-sm leading-6 text-[#686156]">
            Paste a JD, choose the resume language, then generate a temporary draft to review and
            export.
          </p>
        </div>
      </div>
    </div>
  );
}
