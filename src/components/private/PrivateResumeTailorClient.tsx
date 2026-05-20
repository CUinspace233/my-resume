'use client';

import {
  ArrowLeftIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  LanguageIcon,
  PlusIcon,
  SparklesIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { downloadPdf } from '@/lib/pdfDownload';
import type { JdInsights, ResumeContent, TailoredResumeExportPackage } from '@/types/resume';

type Props = {
  locale: string;
  hasInitialAccess: boolean;
  passwordConfigured: boolean;
  baseResume: ResumeContent | null;
};

type TailorResponse = {
  draftId: string;
  tailoredResume: ResumeContent;
  changeSummary: string[];
  jdInsights: JdInsights;
  jdTitle?: string;
  company?: string;
  error?: string;
};

const emptyJdInsights: JdInsights = {
  roleKeywords: [],
  requiredSkills: [],
  matchNotes: [],
  gapNotes: [],
};

function cloneResume(resume: ResumeContent) {
  return JSON.parse(JSON.stringify(resume)) as ResumeContent;
}

function listToText(items?: string[]) {
  return (items ?? []).join('\n');
}

function textToList(value: string) {
  return value
    .split('\n')
    .map(item => item.trim())
    .filter(Boolean);
}

function csvToList(value: string) {
  return value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
}

function createSkillGroupId(groups: ResumeContent['skills']['groups']) {
  const existingIds = new Set(groups.map(group => group.id));
  let index = groups.length + 1;
  let id = `ai-skill-group-${index}`;

  while (existingIds.has(id)) {
    index += 1;
    id = `ai-skill-group-${index}`;
  }

  return id;
}

function slugifyFilePart(value?: string) {
  const slug = value
    ?.normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .slice(0, 48);

  return slug || 'JD';
}

function getDatedFileName(company?: string, jdTitle?: string) {
  const now = new Date();
  const fileDate = `${now.getFullYear().toString().slice(-2)}_${String(now.getMonth() + 1).padStart(
    2,
    '0'
  )}_${String(now.getDate()).padStart(2, '0')}`;
  const target = slugifyFilePart(company ?? jdTitle);

  return `Henrick_Lin_Resume_Tailored_${target}_${fileDate}.json`;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === 'string');
}

function isJdInsights(value: unknown): value is JdInsights {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as Partial<JdInsights>;

  return (
    isStringArray(candidate.roleKeywords) &&
    isStringArray(candidate.requiredSkills) &&
    isStringArray(candidate.matchNotes) &&
    isStringArray(candidate.gapNotes)
  );
}

function isTailoredResumeExportPackage(value: unknown): value is TailoredResumeExportPackage {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as Partial<TailoredResumeExportPackage>;

  return (
    candidate.type === 'resume-tailor-draft' &&
    candidate.version === 1 &&
    typeof candidate.locale === 'string' &&
    Boolean(candidate.resume) &&
    isStringArray(candidate.changeSummary) &&
    isJdInsights(candidate.jdInsights) &&
    (candidate.company == null || typeof candidate.company === 'string') &&
    (candidate.jdTitle == null || typeof candidate.jdTitle === 'string')
  );
}

function TextField({
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

function PanelHeader({
  eyebrow,
  title,
  icon,
}: {
  eyebrow: string;
  title: string;
  icon: React.ReactNode;
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

function EditorGroup({
  title,
  meta,
  children,
}: {
  title: string;
  meta?: string;
  children: React.ReactNode;
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

export default function PrivateResumeTailorClient({
  locale,
  hasInitialAccess,
  passwordConfigured,
  baseResume,
}: Props) {
  const [selectedLocale, setSelectedLocale] = useState(locale);
  const [hasAccess, setHasAccess] = useState(hasInitialAccess);
  const [isPasswordConfigured, setIsPasswordConfigured] = useState(passwordConfigured);
  const [password, setPassword] = useState('');
  const [jdText, setJdText] = useState('');
  const [userInstructions, setUserInstructions] = useState('');
  const [draftId, setDraftId] = useState<string | null>(null);
  const [resume, setResume] = useState<ResumeContent | null>(baseResume);
  const [skillInputs, setSkillInputs] = useState<Record<string, string>>({});
  const [changeSummary, setChangeSummary] = useState<string[]>([]);
  const [jdInsights, setJdInsights] = useState<JdInsights | null>(null);
  const [jdTitle, setJdTitle] = useState<string | undefined>();
  const [company, setCompany] = useState<string | undefined>();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImportingJson, setIsImportingJson] = useState(false);
  const [isPreparingPreview, setIsPreparingPreview] = useState(false);
  const [error, setError] = useState('');
  const [previewVersion, setPreviewVersion] = useState(0);
  const [previewFrameHeight, setPreviewFrameHeight] = useState(2200);
  const isCreatingPreviewDraftRef = useRef(false);
  const jsonImportInputRef = useRef<HTMLInputElement | null>(null);
  const previewResizeObserverRef = useRef<ResizeObserver | null>(null);

  const previewUrl = useMemo(() => {
    if (!draftId) return '';
    return `/${selectedLocale}/private/resume-tailor/preview/${draftId}?v=${previewVersion}`;
  }, [draftId, selectedLocale, previewVersion]);

  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      const response = await fetch('/api/private/resume-tailor/login');
      const body = (await response.json().catch(() => null)) as {
        hasAccess?: boolean;
        passwordConfigured?: boolean;
      } | null;

      if (!isMounted || !body) return;
      setHasAccess(Boolean(body.hasAccess));
      setIsPasswordConfigured(Boolean(body.passwordConfigured));
    }

    loadSession();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    isCreatingPreviewDraftRef.current = false;
  }, [selectedLocale]);

  useEffect(() => {
    return () => {
      previewResizeObserverRef.current?.disconnect();
    };
  }, []);

  const setResumeDraft = (updater: (draft: ResumeContent) => void) => {
    setResume(current => {
      if (!current) return current;
      const next = cloneResume(current);
      updater(next);
      return next;
    });
  };

  const authenticate = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsAuthenticating(true);

    const response = await fetch('/api/private/resume-tailor/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const body = await response.json();
    setIsAuthenticating(false);

    if (!response.ok) {
      setError(body.error ?? 'Unable to unlock private tool');
      return;
    }

    setHasAccess(true);
  };

  const generateDraft = async () => {
    setError('');
    setIsGenerating(true);

    const response = await fetch('/api/private/resume-tailor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locale: selectedLocale, jdText, userInstructions }),
    });
    const body = (await response.json()) as TailorResponse;
    setIsGenerating(false);

    if (!response.ok) {
      setError(body.error ?? 'Failed to generate tailored resume');
      return;
    }

    setDraftId(body.draftId);
    setResume(body.tailoredResume);
    setSkillInputs({});
    setChangeSummary(body.changeSummary);
    setJdInsights(body.jdInsights);
    setJdTitle(body.jdTitle);
    setCompany(body.company);
    setPreviewVersion(version => version + 1);
  };

  const createPreviewDraft = useCallback(
    async (
      resumeDraft: ResumeContent,
      options?: {
        locale?: string;
        changeSummary?: string[];
        jdInsights?: JdInsights;
        company?: string;
        jdTitle?: string;
      }
    ) => {
      const draftLocale = options?.locale ?? selectedLocale;
      const response = await fetch('/api/private/resume-tailor/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale: draftLocale,
          resume: resumeDraft,
          changeSummary: options?.changeSummary ?? changeSummary,
          jdInsights: options?.jdInsights ?? jdInsights ?? emptyJdInsights,
          company: options?.company ?? company,
          jdTitle: options?.jdTitle ?? jdTitle,
        }),
      });
      const body = (await response.json()) as {
        draftId?: string;
        tailoredResume?: ResumeContent;
        changeSummary?: string[];
        jdInsights?: JdInsights;
        company?: string;
        jdTitle?: string;
        error?: string;
      };

      if (!response.ok || !body.draftId) {
        throw new Error(body.error ?? 'Failed to create preview draft');
      }

      setDraftId(body.draftId);
      if (body.tailoredResume) setResume(body.tailoredResume);
      if (body.changeSummary) setChangeSummary(body.changeSummary);
      if (body.jdInsights) setJdInsights(body.jdInsights);
      setCompany(body.company);
      setJdTitle(body.jdTitle);
      setPreviewVersion(version => version + 1);

      return body.draftId;
    },
    [changeSummary, company, jdInsights, jdTitle, selectedLocale]
  );

  useEffect(() => {
    if (!hasAccess || !resume || draftId || isCreatingPreviewDraftRef.current) return;

    let isMounted = true;
    isCreatingPreviewDraftRef.current = true;
    setIsPreparingPreview(true);

    createPreviewDraft(resume)
      .catch(createError => {
        if (!isMounted) return;
        setError(createError instanceof Error ? createError.message : 'Failed to prepare preview');
      })
      .finally(() => {
        if (isMounted) {
          isCreatingPreviewDraftRef.current = false;
          setIsPreparingPreview(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [createPreviewDraft, draftId, hasAccess, resume]);

  const saveDraft = async () => {
    if (!resume) return false;
    setError('');
    setIsSaving(true);

    if (!draftId) {
      try {
        const nextDraftId = await createPreviewDraft(resume);
        setIsSaving(false);
        return nextDraftId;
      } catch (saveError) {
        setIsSaving(false);
        setError(saveError instanceof Error ? saveError.message : 'Failed to save draft');
        return false;
      }
    }

    const response = await fetch(`/api/private/resume-tailor/draft/${draftId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resume }),
    });
    const body = await response.json();
    setIsSaving(false);

    if (!response.ok) {
      setError(body.error ?? 'Failed to save draft');
      return false;
    }

    setPreviewVersion(version => version + 1);
    return draftId;
  };

  const exportPdf = async () => {
    setIsExporting(true);
    setError('');

    const exportDraftId = await saveDraft();
    if (!exportDraftId) {
      setIsExporting(false);
      return;
    }

    const exportUrl = `/api/private/resume-tailor/pdf?locale=${selectedLocale}&draftId=${exportDraftId}`;

    await downloadPdf({
      exportUrl,
      fileName: 'Henrick_Lin_Resume.pdf',
      setIsExporting,
      onError: exportError => {
        setError(exportError instanceof Error ? exportError.message : 'Failed to export PDF');
      },
    });
  };

  const exportJson = async () => {
    if (!resume) return;

    setError('');

    const savedDraftId = await saveDraft();
    if (!savedDraftId) return;

    const exportPackage: TailoredResumeExportPackage = {
      type: 'resume-tailor-draft',
      version: 1,
      exportedAt: new Date().toISOString(),
      locale: selectedLocale,
      resume,
      changeSummary,
      jdInsights: jdInsights ?? emptyJdInsights,
      company,
      jdTitle,
    };
    const blob = new Blob([JSON.stringify(exportPackage, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = getDatedFileName(company, jdTitle);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const importJson = async (file: File) => {
    setError('');
    setIsImportingJson(true);

    try {
      const parsed = JSON.parse(await file.text()) as unknown;

      if (!isTailoredResumeExportPackage(parsed)) {
        throw new Error('Invalid tailored resume JSON file');
      }

      if (!['en', 'zh'].includes(parsed.locale)) {
        throw new Error('Unsupported resume locale in JSON file');
      }

      const importedDraftId = await createPreviewDraft(parsed.resume, {
        locale: parsed.locale,
        changeSummary: parsed.changeSummary,
        jdInsights: parsed.jdInsights,
        company: parsed.company ?? undefined,
        jdTitle: parsed.jdTitle ?? undefined,
      });

      setSelectedLocale(parsed.locale);
      setDraftId(importedDraftId);
      setResume(parsed.resume);
      setSkillInputs({});
      setChangeSummary(parsed.changeSummary);
      setJdInsights(parsed.jdInsights);
      setCompany(parsed.company ?? undefined);
      setJdTitle(parsed.jdTitle ?? undefined);
      setPreviewVersion(version => version + 1);
    } catch (importError) {
      setError(importError instanceof Error ? importError.message : 'Failed to import JSON');
    } finally {
      setIsImportingJson(false);
      if (jsonImportInputRef.current) {
        jsonImportInputRef.current.value = '';
      }
    }
  };

  const syncPreviewFrameHeight = useCallback((iframe: HTMLIFrameElement) => {
    const documentElement = iframe.contentDocument?.documentElement;
    const body = iframe.contentDocument?.body;

    if (!documentElement || !body) return;

    const updateFrameHeight = () => {
      setPreviewFrameHeight(Math.ceil(Math.max(documentElement.scrollHeight, body.scrollHeight)));
    };

    previewResizeObserverRef.current?.disconnect();
    previewResizeObserverRef.current = new ResizeObserver(updateFrameHeight);
    previewResizeObserverRef.current.observe(documentElement);
    previewResizeObserverRef.current.observe(body);

    updateFrameHeight();
    window.setTimeout(updateFrameHeight, 250);
  }, []);

  if (!isPasswordConfigured) {
    return (
      <main className="private-tailor-page min-h-screen bg-[#f6f4ef] p-6 text-[#171717]">
        <div className="mx-auto max-w-xl rounded-lg border border-black/10 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold">Private tool is not configured</h1>
          <p className="mt-2 text-sm text-[#666]">
            Set PRIVATE_RESUME_PASSWORD before using this page.
          </p>
        </div>
      </main>
    );
  }

  if (!hasAccess) {
    return (
      <main className="private-tailor-page grid min-h-screen place-items-center bg-[#f6f4ef] p-6 text-[#171717]">
        <form
          onSubmit={authenticate}
          className="w-full max-w-sm rounded-lg border border-black/10 bg-white p-6 shadow-sm"
        >
          <h1 className="text-xl font-semibold">Private Resume Tailor</h1>
          <p className="mt-2 text-sm text-[#666]">Enter the private password to continue.</p>
          <input
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            className="mt-5 h-11 w-full rounded-md border border-black/10 px-3 text-sm outline-none focus:border-[#0a72ef]"
            autoComplete="current-password"
          />
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={isAuthenticating}
            className="mt-5 h-11 w-full cursor-pointer rounded-md bg-[#171717] px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isAuthenticating ? 'Checking...' : 'Unlock'}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="private-tailor-page min-h-screen bg-[#f3efe7] px-4 py-5 text-[#171717] sm:px-6">
      <div className="pointer-events-none fixed inset-0 opacity-70 [background-image:linear-gradient(rgba(31,29,24,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(31,29,24,0.045)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="relative mx-auto grid max-w-[1520px] gap-5 lg:grid-cols-[430px_minmax(0,1fr)]">
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
              onChange={event => setJdText(event.target.value)}
              rows={12}
              className="resize-y rounded-xl border border-[#d9d2c6] bg-white px-4 py-3 text-sm font-normal leading-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] outline-none transition placeholder:text-[#aaa49a] focus:border-[#2474d7] focus:ring-4 focus:ring-[#2474d7]/10"
              placeholder="Paste the JD here..."
            />
          </label>

          <label className="mt-4 grid gap-2 text-sm font-semibold text-[#24211c]">
            Optional instructions
            <textarea
              value={userInstructions}
              onChange={event => setUserInstructions(event.target.value)}
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
                      setSelectedLocale(option.code);
                      setDraftId(null);
                      setResume(null);
                      setSkillInputs({});
                      setChangeSummary([]);
                      setJdInsights(null);
                      setJdTitle(undefined);
                      setCompany(undefined);
                      setError('');
                    }}
                    className={`h-10 cursor-pointer rounded-lg text-sm font-semibold transition ${
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
            onClick={generateDraft}
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
              onClick={exportJson}
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
                if (file) void importJson(file);
              }}
            />
          </div>

          {jdInsights && (
            <div className="mt-5 grid gap-4 rounded-2xl border border-[#e4ded2] bg-[#f8f5ef] p-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-[#2f6f73]" aria-hidden="true" />
                <h2 className="font-semibold text-[#24211c]">JD insights</h2>
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-geist-mono)] text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8d877d]">
                  Role keywords
                </h3>
                <p className="mt-1 leading-6 text-[#625b51]">
                  {jdInsights.roleKeywords.join(', ')}
                </p>
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-geist-mono)] text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8d877d]">
                  Required skills
                </h3>
                <p className="mt-1 leading-6 text-[#625b51]">
                  {jdInsights.requiredSkills.join(', ')}
                </p>
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

        <section className="grid min-w-0 gap-5">
          {resume ? (
            <>
              <div className="rounded-2xl border border-[#ded6c9] bg-[#fffdf8]/95 p-5 shadow-[0_18px_60px_rgba(51,43,31,0.12)] backdrop-blur">
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
                      onClick={saveDraft}
                      disabled={isSaving || isExporting || isImportingJson || isPreparingPreview}
                      className="h-11 cursor-pointer rounded-xl border border-[#d9d2c6] bg-white px-4 text-sm font-semibold text-[#4f493f] shadow-sm transition hover:border-[#bdb4a5] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSaving
                        ? 'Saving...'
                        : isPreparingPreview
                          ? 'Preparing...'
                          : 'Save preview'}
                    </button>
                    <button
                      type="button"
                      onClick={exportJson}
                      disabled={isSaving || isExporting || isImportingJson || isPreparingPreview}
                      className="flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-[#d9d2c6] bg-white px-4 text-sm font-semibold text-[#4f493f] shadow-sm transition hover:border-[#bdb4a5] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <ArrowDownTrayIcon className="h-4 w-4" aria-hidden="true" />
                      Export JSON
                    </button>
                    <button
                      type="button"
                      onClick={exportPdf}
                      disabled={isSaving || isExporting || isImportingJson || isPreparingPreview}
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

                <div className="mt-5 grid items-start gap-5 xl:grid-cols-[minmax(320px,0.9fr)_minmax(380px,1.1fr)]">
                  <div className="grid content-start gap-3">
                    <EditorGroup title="Profile" meta="header + education">
                      <TextField
                        label="Header name"
                        value={resume.header.name}
                        onChange={value =>
                          setResumeDraft(draft => void (draft.header.name = value))
                        }
                      />
                      <TextField
                        label="Education degree"
                        value={resume.education.degree}
                        onChange={value =>
                          setResumeDraft(draft => void (draft.education.degree = value))
                        }
                      />
                      <TextField
                        label="Relevant courses"
                        value={resume.education.courses}
                        rows={3}
                        onChange={value =>
                          setResumeDraft(draft => void (draft.education.courses = value))
                        }
                      />
                    </EditorGroup>

                    <EditorGroup title="Skills" meta={`${resume.skills.groups.length} groups`}>
                      {resume.skills.groups.map(group => (
                        <div
                          key={group.id}
                          className="grid gap-3 rounded-xl border border-[#e4ded2] bg-white p-3 shadow-sm"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.16em] text-[#9b9489]">
                              {group.id.startsWith('ai-') ? 'AI group' : 'Resume group'}
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                setResumeDraft(draft => {
                                  draft.skills.groups = draft.skills.groups.filter(
                                    item => item.id !== group.id
                                  );
                                });
                                setSkillInputs(current => {
                                  const next = { ...current };
                                  delete next[group.id];
                                  return next;
                                });
                              }}
                              className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                              aria-label={`Delete ${group.label}`}
                            >
                              <TrashIcon className="h-3.5 w-3.5" aria-hidden="true" />
                              Delete
                            </button>
                          </div>
                          <TextField
                            label="Group name"
                            value={group.label}
                            onChange={value =>
                              setResumeDraft(draft => {
                                const target = draft.skills.groups.find(
                                  item => item.id === group.id
                                );
                                if (target) target.label = value;
                              })
                            }
                          />
                          <TextField
                            label="Skills"
                            value={skillInputs[group.id] ?? group.items.join(', ')}
                            onChange={value => {
                              setSkillInputs(current => ({ ...current, [group.id]: value }));
                              setResumeDraft(draft => {
                                const target = draft.skills.groups.find(
                                  item => item.id === group.id
                                );
                                if (target) target.items = csvToList(value);
                              });
                            }}
                          />
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          const id = createSkillGroupId(resume.skills.groups);
                          setResumeDraft(draft => {
                            draft.skills.groups.push({
                              id,
                              label: 'New skill group',
                              items: [],
                            });
                          });
                          setSkillInputs(current => ({ ...current, [id]: '' }));
                        }}
                        className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#c8c1b6] bg-white/70 text-sm font-semibold text-[#4f493f] transition hover:border-[#2f6f73] hover:text-[#2f6f73]"
                      >
                        <PlusIcon className="h-4 w-4" aria-hidden="true" />
                        Add skill group
                      </button>
                    </EditorGroup>
                  </div>

                  <div className="grid content-start gap-3">
                    {resume.experience.items.map(item => (
                      <EditorGroup key={item.id} title={item.company} meta="experience">
                        <TextField
                          label="Position"
                          value={item.position}
                          onChange={value =>
                            setResumeDraft(draft => {
                              const target = draft.experience.items.find(
                                entry => entry.id === item.id
                              );
                              if (target) target.position = value;
                            })
                          }
                        />
                        {item.achievements && (
                          <TextField
                            label="Achievements"
                            value={listToText(item.achievements)}
                            rows={4}
                            onChange={value =>
                              setResumeDraft(draft => {
                                const target = draft.experience.items.find(
                                  entry => entry.id === item.id
                                );
                                if (target) target.achievements = textToList(value);
                              })
                            }
                          />
                        )}
                        {item.projects?.map(project => (
                          <TextField
                            key={project.id}
                            label={`${project.title}: bullets`}
                            value={listToText(project.description)}
                            rows={5}
                            onChange={value =>
                              setResumeDraft(draft => {
                                const target = draft.experience.items
                                  .find(entry => entry.id === item.id)
                                  ?.projects?.find(entry => entry.id === project.id);
                                if (target) target.description = textToList(value);
                              })
                            }
                          />
                        ))}
                      </EditorGroup>
                    ))}
                    <EditorGroup title="Projects" meta={`${resume.projects.items.length} items`}>
                      {resume.projects.items.map(project => (
                        <TextField
                          key={project.id}
                          label={`${project.title}: bullets`}
                          value={listToText(project.description)}
                          rows={5}
                          onChange={value =>
                            setResumeDraft(draft => {
                              const target = draft.projects.items.find(
                                entry => entry.id === project.id
                              );
                              if (target) target.description = textToList(value);
                            })
                          }
                        />
                      ))}
                    </EditorGroup>
                    <EditorGroup title="Activities" meta={`${resume.societies.items.length} items`}>
                      {resume.societies.items.map(item => (
                        <TextField
                          key={item.id}
                          label={`${item.organization}: achievements`}
                          value={listToText(item.achievements)}
                          rows={4}
                          onChange={value =>
                            setResumeDraft(draft => {
                              const target = draft.societies.items.find(
                                entry => entry.id === item.id
                              );
                              if (target) target.achievements = textToList(value);
                            })
                          }
                        />
                      ))}
                    </EditorGroup>
                  </div>
                </div>
              </div>

              {(draftId || isPreparingPreview) && (
                <div className="overflow-hidden rounded-2xl border border-[#ded6c9] bg-[#fffdf8] shadow-[0_18px_60px_rgba(51,43,31,0.12)]">
                  <div className="flex items-center justify-between border-b border-[#ebe5dc] px-5 py-4">
                    <div>
                      <p className="font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.2em] text-[#8d877d]">
                        PDF preview
                      </p>
                      <h2 className="mt-1 text-base font-semibold text-[#24211c]">
                        Export layout check
                      </h2>
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
                      onLoad={event => syncPreviewFrameHeight(event.currentTarget)}
                      style={
                        {
                          '--preview-frame-height': `${previewFrameHeight}px`,
                        } as React.CSSProperties
                      }
                      className="pointer-events-none h-[var(--preview-frame-height)] w-full bg-[#f7f4ee] md:pointer-events-auto md:h-[900px]"
                    />
                  ) : (
                    <div className="grid h-[360px] place-items-center bg-[#f7f4ee] text-sm font-semibold text-[#625b51]">
                      Preparing preview...
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="grid min-h-[520px] place-items-center rounded-2xl border border-dashed border-[#cfc7ba] bg-[#fffdf8]/80 p-8 text-center shadow-[0_18px_60px_rgba(51,43,31,0.08)]">
              <div className="max-w-sm">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-[#e4ded2] bg-white text-[#2f6f73] shadow-sm">
                  <DocumentTextIcon className="h-7 w-7" aria-hidden="true" />
                </div>
                <h2 className="mt-5 text-xl font-semibold text-[#24211c]">No tailored draft yet</h2>
                <p className="mt-2 text-sm leading-6 text-[#686156]">
                  Paste a JD, choose the resume language, then generate a temporary draft to review
                  and export.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
