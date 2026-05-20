import type { JdInsights, ResumeContent, TailoredResumeExportPackage } from '@/types/resume';

export const emptyJdInsights: JdInsights = {
  roleKeywords: [],
  requiredSkills: [],
  matchNotes: [],
  gapNotes: [],
};

export function cloneResume(resume: ResumeContent) {
  return JSON.parse(JSON.stringify(resume)) as ResumeContent;
}

export function listToText(items?: string[]) {
  return (items ?? []).join('\n');
}

export function textToList(value: string) {
  return value
    .split('\n')
    .map(item => item.trim())
    .filter(Boolean);
}

export function csvToList(value: string) {
  return value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
}

export function createSkillGroupId(groups: ResumeContent['skills']['groups']) {
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

export function getDatedFileName(company?: string, jdTitle?: string) {
  const now = new Date();
  const fileDate = `${now.getFullYear().toString().slice(-2)}_${String(now.getMonth() + 1).padStart(
    2,
    '0'
  )}_${String(now.getDate()).padStart(2, '0')}`;
  const target = slugifyFilePart(company ?? jdTitle);

  return `Henrick_Lin_Resume_Tailored_${target}_${fileDate}.json`;
}

export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === 'string');
}

export function isJdInsights(value: unknown): value is JdInsights {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as Partial<JdInsights>;

  return (
    isStringArray(candidate.roleKeywords) &&
    isStringArray(candidate.requiredSkills) &&
    isStringArray(candidate.matchNotes) &&
    isStringArray(candidate.gapNotes)
  );
}

export function hasJdInsightsContent(value: JdInsights | null) {
  return Boolean(
    value &&
      (value.roleKeywords.length > 0 ||
        value.requiredSkills.length > 0 ||
        value.matchNotes.length > 0 ||
        value.gapNotes.length > 0)
  );
}

export function isTailoredResumeExportPackage(
  value: unknown
): value is TailoredResumeExportPackage {
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

export async function readJsonResponse<T>(response: Response, fallbackError: string): Promise<T> {
  const text = await response.text();

  if (!text) {
    return {} as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return {
      error: response.ok ? fallbackError : `${fallbackError}: ${text}`,
    } as T;
  }
}
