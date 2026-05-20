import { ArrowDownTrayIcon, ArrowLeftIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { PanelHeader } from './EditorPrimitives';

export function DraftHeader({
  selectedLocale,
  isSaving,
  isExporting,
  isImportingJson,
  isPreparingPreview,
  onSaveDraft,
  onExportJson,
  onExportPdf,
}: {
  selectedLocale: string;
  isSaving: boolean;
  isExporting: boolean;
  isImportingJson: boolean;
  isPreparingPreview: boolean;
  onSaveDraft: () => void;
  onExportJson: () => void;
  onExportPdf: () => void;
}) {
  const actionsDisabled = isSaving || isExporting || isImportingJson || isPreparingPreview;

  return (
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#ebe5dc] pb-5">
      <PanelHeader
        eyebrow="Editable draft"
        title="Review and adjust text"
        icon={<DocumentTextIcon className="h-5 w-5" aria-hidden="true" />}
      />
      <div className="flex flex-wrap gap-2">
        <Link
          href={`/${selectedLocale}/resume`}
          className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#d9d2c6] bg-white px-4 text-sm font-semibold text-[#4f493f] shadow-sm transition hover:border-[#bdb4a5]"
        >
          <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
          Resume page
        </Link>
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={actionsDisabled}
          className="h-11 cursor-pointer rounded-xl border border-[#d9d2c6] bg-white px-4 text-sm font-semibold text-[#4f493f] shadow-sm transition hover:border-[#bdb4a5] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : isPreparingPreview ? 'Preparing...' : 'Save preview'}
        </button>
        <button
          type="button"
          onClick={onExportJson}
          disabled={actionsDisabled}
          className="flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-[#d9d2c6] bg-white px-4 text-sm font-semibold text-[#4f493f] shadow-sm transition hover:border-[#bdb4a5] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ArrowDownTrayIcon className="h-4 w-4" aria-hidden="true" />
          Export JSON
        </button>
        <button
          type="button"
          onClick={onExportPdf}
          disabled={actionsDisabled}
          className="flex h-11 cursor-pointer items-center gap-2 rounded-xl bg-[#2474d7] px-4 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(36,116,215,0.25)] transition hover:-translate-y-0.5 hover:bg-[#1d63bd] disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-50"
        >
          <ArrowDownTrayIcon
            className={`h-4 w-4 ${isExporting ? 'animate-pulse' : ''}`}
            aria-hidden="true"
          />
          {isExporting ? 'Exporting...' : 'Export PDF'}
        </button>
      </div>
    </div>
  );
}
