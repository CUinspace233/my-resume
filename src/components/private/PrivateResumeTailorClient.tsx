'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { downloadPdf } from '@/lib/pdfDownload';
import type { JdInsights, ResumeContent, TailoredResumeExportPackage } from '@/types/resume';
import { PrivatePasswordGate, PrivateToolNotConfigured } from './resume-tailor/AccessScreens';
import { DraftHeader } from './resume-tailor/DraftHeader';
import { DraftPreview, EmptyDraftState } from './resume-tailor/DraftPreview';
import { ResumeDraftEditor } from './resume-tailor/ResumeDraftEditor';
import { TailorSidebar } from './resume-tailor/TailorSidebar';
import {
  cloneResume,
  emptyJdInsights,
  getDatedFileName,
  hasJdInsightsContent,
  isTailoredResumeExportPackage,
  readJsonResponse,
} from './resume-tailor/utils';

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
  const localeLoadRequestRef = useRef(0);
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
    const body = await readJsonResponse<{ error?: string }>(
      response,
      'Unable to unlock private tool'
    );
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
    const body = await readJsonResponse<TailorResponse>(
      response,
      'Failed to generate tailored resume'
    );
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
      const body = await readJsonResponse<{
        draftId?: string;
        tailoredResume?: ResumeContent;
        changeSummary?: string[];
        jdInsights?: JdInsights;
        company?: string;
        jdTitle?: string;
        error?: string;
      }>(response, 'Failed to create preview draft');

      if (!response.ok || !body.draftId) {
        throw new Error(body.error ?? 'Failed to create preview draft');
      }

      setDraftId(body.draftId);
      if (body.tailoredResume) setResume(body.tailoredResume);
      if (body.changeSummary) setChangeSummary(body.changeSummary);
      if (body.jdInsights) {
        setJdInsights(hasJdInsightsContent(body.jdInsights) ? body.jdInsights : null);
      }
      setCompany(body.company);
      setJdTitle(body.jdTitle);
      setPreviewVersion(version => version + 1);

      return body.draftId;
    },
    [changeSummary, company, jdInsights, jdTitle, selectedLocale]
  );

  const loadBaseDraftForLocale = async (nextLocale: string) => {
    const requestId = localeLoadRequestRef.current + 1;

    localeLoadRequestRef.current = requestId;
    setError('');
    setIsPreparingPreview(true);
    isCreatingPreviewDraftRef.current = true;

    try {
      const response = await fetch('/api/private/resume-tailor/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale: nextLocale }),
      });
      const body = await readJsonResponse<{
        draftId?: string;
        tailoredResume?: ResumeContent;
        changeSummary?: string[];
        jdInsights?: JdInsights;
        error?: string;
      }>(response, 'Failed to load resume draft');

      if (!response.ok || !body.draftId || !body.tailoredResume) {
        throw new Error(body.error ?? 'Failed to load resume draft');
      }

      if (localeLoadRequestRef.current !== requestId) {
        return;
      }

      setSelectedLocale(nextLocale);
      setDraftId(body.draftId);
      setResume(body.tailoredResume);
      setSkillInputs({});
      setChangeSummary(body.changeSummary ?? []);
      setJdInsights(
        hasJdInsightsContent(body.jdInsights ?? null) ? (body.jdInsights ?? null) : null
      );
      setJdTitle(undefined);
      setCompany(undefined);
      setPreviewVersion(version => version + 1);
    } catch (loadError) {
      if (localeLoadRequestRef.current === requestId) {
        setError(loadError instanceof Error ? loadError.message : 'Failed to load resume draft');
      }
    } finally {
      if (localeLoadRequestRef.current === requestId) {
        isCreatingPreviewDraftRef.current = false;
        setIsPreparingPreview(false);
      }
    }
  };

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
    const body = await readJsonResponse<{ error?: string }>(response, 'Failed to save draft');
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
    return <PrivateToolNotConfigured />;
  }

  if (!hasAccess) {
    return (
      <PrivatePasswordGate
        password={password}
        error={error}
        isAuthenticating={isAuthenticating}
        onPasswordChange={setPassword}
        onSubmit={authenticate}
      />
    );
  }

  return (
    <main className="private-tailor-page min-h-screen bg-[#f3efe7] px-4 py-5 text-[#171717] sm:px-6">
      <div className="pointer-events-none fixed inset-0 opacity-70 [background-image:linear-gradient(rgba(31,29,24,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(31,29,24,0.045)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="relative mx-auto grid max-w-[1520px] gap-5 lg:grid-cols-[430px_minmax(0,1fr)]">
        <TailorSidebar
          selectedLocale={selectedLocale}
          jdText={jdText}
          userInstructions={userInstructions}
          error={error}
          resume={resume}
          jdInsights={jdInsights}
          changeSummary={changeSummary}
          isGenerating={isGenerating}
          isImportingJson={isImportingJson}
          isSaving={isSaving}
          isExporting={isExporting}
          isPreparingPreview={isPreparingPreview}
          jsonImportInputRef={jsonImportInputRef}
          onJdTextChange={setJdText}
          onUserInstructionsChange={setUserInstructions}
          onLocaleChange={nextLocale => void loadBaseDraftForLocale(nextLocale)}
          onGenerateDraft={generateDraft}
          onExportJson={exportJson}
          onImportJson={file => void importJson(file)}
        />

        <section className="grid min-w-0 gap-5">
          {resume ? (
            <>
              <div className="rounded-2xl border border-[#ded6c9] bg-[#fffdf8]/95 p-5 shadow-[0_18px_60px_rgba(51,43,31,0.12)] backdrop-blur">
                <DraftHeader
                  selectedLocale={selectedLocale}
                  isSaving={isSaving}
                  isExporting={isExporting}
                  isImportingJson={isImportingJson}
                  isPreparingPreview={isPreparingPreview}
                  onSaveDraft={saveDraft}
                  onExportJson={exportJson}
                  onExportPdf={exportPdf}
                />

                <ResumeDraftEditor
                  resume={resume}
                  skillInputs={skillInputs}
                  setSkillInputs={setSkillInputs}
                  setResumeDraft={setResumeDraft}
                />
              </div>

              <DraftPreview
                selectedLocale={selectedLocale}
                draftId={draftId}
                previewUrl={previewUrl}
                previewFrameHeight={previewFrameHeight}
                isPreparingPreview={isPreparingPreview}
                onFrameLoad={syncPreviewFrameHeight}
              />
            </>
          ) : (
            <EmptyDraftState selectedLocale={selectedLocale} />
          )}
        </section>
      </div>
    </main>
  );
}
