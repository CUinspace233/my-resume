import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  LanguageIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import type { RefObject } from 'react';
import type { JdInsights, ResumeContent } from '@/types/resume';
import { PanelHeader } from './EditorPrimitives';
import { hasJdInsightsContent } from './utils';

export function TailorSidebar({
  selectedLocale,
  jdText,
  userInstructions,
  error,
  resume,
  jdInsights,
  changeSummary,
  isGenerating,
  isImportingJson,
  isSaving,
  isExporting,
  isPreparingPreview,
  jsonImportInputRef,
  onJdTextChange,
  onUserInstructionsChange,
  onLocaleChange,
  onGenerateDraft,
  onExportJson,
  onImportJson,
}: {
  selectedLocale: string;
  jdText: string;
  userInstructions: string;
  error: string;
  resume: ResumeContent | null;
  jdInsights: JdInsights | null;
  changeSummary: string[];
  isGenerating: boolean;
  isImportingJson: boolean;
  isSaving: boolean;
  isExporting: boolean;
  isPreparingPreview: boolean;
  jsonImportInputRef: RefObject<HTMLInputElement | null>;
  onJdTextChange: (value: string) => void;
  onUserInstructionsChange: (value: string) => void;
  onLocaleChange: (locale: string) => void;
  onGenerateDraft: () => void;
  onExportJson: () => void;
  onImportJson: (file: File) => void;
}) {
  return (
    <section className="self-start rounded-2xl border border-[#ded6c9] bg-[#fffdf8]/95 p-5 shadow-[0_18px_60px_rgba(51,43,31,0.12)] backdrop-blur lg:sticky lg:top-5 lg:max-h-[calc(100vh-2.5rem)] lg:overflow-y-auto lg:overscroll-contain">
      <PanelHeader
        eyebrow="Private JD Tool"
        title="Tailor resume for one export"
        icon={<SparklesIcon className="h-5 w-5" aria-hidden="true" />}
      />
      <p className="mt-4 text-sm leading-6 text-[#686156]">
        Paste a job description. The public resume JSON is not changed; this creates a temporary
        draft for preview and PDF export.
      </p>

      <label className="mt-6 grid gap-2 text-sm font-semibold text-[#24211c]">
        <span className="flex items-center justify-between">
          Job description
          <span className="font-[family-name:var(--font-geist-mono)] text-[10px] font-normal uppercase tracking-[0.16em] text-[#9c9487]">
            {jdText.trim().length} chars
          </span>
        </span>
        <textarea
          value={jdText}
          onChange={event => onJdTextChange(event.target.value)}
          rows={12}
          className="resize-y rounded-xl border border-[#d9d2c6] bg-white px-4 py-3 text-sm font-normal leading-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] outline-none transition placeholder:text-[#aaa49a] focus:border-[#2474d7] focus:ring-4 focus:ring-[#2474d7]/10"
          placeholder="Paste the JD here..."
        />
      </label>

      <label className="mt-4 grid gap-2 text-sm font-semibold text-[#24211c]">
        Optional instructions
        <textarea
          value={userInstructions}
          onChange={event => onUserInstructionsChange(event.target.value)}
          rows={4}
          className="resize-y rounded-xl border border-[#d9d2c6] bg-white px-4 py-3 text-sm font-normal leading-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] outline-none transition placeholder:text-[#aaa49a] focus:border-[#2474d7] focus:ring-4 focus:ring-[#2474d7]/10"
          placeholder="Example: emphasize FastAPI and React, keep bullets concise."
        />
      </label>

      <fieldset className="mt-4 grid gap-2 text-sm font-semibold text-[#24211c]">
        <legend className="flex items-center gap-2">
          <LanguageIcon className="h-4 w-4 text-[#2f6f73]" aria-hidden="true" />
          Resume language
        </legend>
        <div className="grid grid-cols-2 gap-1 rounded-xl border border-[#e4ded2] bg-[#eee8df] p-1">
          {[
            { code: 'en', label: 'English' },
            { code: 'zh', label: '中文' },
          ].map(option => {
            const active = selectedLocale === option.code;

            return (
              <button
                key={option.code}
                type="button"
                onClick={() => {
                  if (!active) onLocaleChange(option.code);
                }}
                disabled={
                  isGenerating || isImportingJson || isSaving || isExporting || isPreparingPreview
                }
                className={`h-10 cursor-pointer rounded-lg text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  active
                    ? 'bg-white text-[#171717] shadow-sm'
                    : 'text-[#6d665c] hover:bg-white/50 hover:text-[#171717]'
                }`}
                aria-pressed={active}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      {error && (
        <div className="mt-4 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <ExclamationTriangleIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>{error}</p>
        </div>
      )}

      <button
        type="button"
        onClick={onGenerateDraft}
        disabled={isGenerating || isImportingJson || jdText.trim().length < 50}
        className="mt-5 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#171717] px-4 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(23,23,23,0.18)] transition hover:-translate-y-0.5 hover:bg-black disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-50"
      >
        <SparklesIcon className="h-4 w-4" aria-hidden="true" />
        {isGenerating ? 'Generating...' : 'Generate tailored draft'}
      </button>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => jsonImportInputRef.current?.click()}
          disabled={isGenerating || isImportingJson || isSaving || isExporting}
          className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#d9d2c6] bg-white px-3 text-sm font-semibold text-[#4f493f] shadow-sm transition hover:border-[#2f6f73] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ArrowUpTrayIcon
            className={`h-4 w-4 ${isImportingJson ? 'animate-pulse' : ''}`}
            aria-hidden="true"
          />
          {isImportingJson ? 'Importing...' : 'Import JSON'}
        </button>
        <button
          type="button"
          onClick={onExportJson}
          disabled={!resume || isGenerating || isImportingJson || isSaving || isExporting}
          className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#d9d2c6] bg-white px-3 text-sm font-semibold text-[#4f493f] shadow-sm transition hover:border-[#2f6f73] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ArrowDownTrayIcon className="h-4 w-4" aria-hidden="true" />
          Export JSON
        </button>
        <input
          ref={jsonImportInputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={event => {
            const file = event.target.files?.[0];
            if (file) onImportJson(file);
          }}
        />
      </div>

      {hasJdInsightsContent(jdInsights) && jdInsights && (
        <div className="mt-5 grid gap-4 rounded-2xl border border-[#e4ded2] bg-[#f8f5ef] p-4 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="h-4 w-4 text-[#2f6f73]" aria-hidden="true" />
            <h2 className="font-semibold text-[#24211c]">JD insights</h2>
          </div>
          <div>
            <h3 className="font-[family-name:var(--font-geist-mono)] text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8d877d]">
              Role keywords
            </h3>
            <p className="mt-1 leading-6 text-[#625b51]">{jdInsights.roleKeywords.join(', ')}</p>
          </div>
          <div>
            <h3 className="font-[family-name:var(--font-geist-mono)] text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8d877d]">
              Required skills
            </h3>
            <p className="mt-1 leading-6 text-[#625b51]">{jdInsights.requiredSkills.join(', ')}</p>
          </div>
          <div>
            <h3 className="font-[family-name:var(--font-geist-mono)] text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8d877d]">
              Change summary
            </h3>
            <ul className="mt-2 list-disc space-y-1 pl-4 leading-6 text-[#625b51]">
              {changeSummary.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
