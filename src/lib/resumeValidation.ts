import type {
  ResumeContent,
  ResumeExperienceItem,
  ResumeProject,
  ResumeSocietyItem,
} from '@/types/resume';

function sameIds(left: Array<{ id: string }>, right: Array<{ id: string }>) {
  return left.map(item => item.id).join('|') === right.map(item => item.id).join('|');
}

function assertSameIds(
  path: string,
  base: Array<{ id: string }>,
  candidate: Array<{ id: string }>
) {
  if (!sameIds(base, candidate)) {
    throw new Error(`AI output changed ids at ${path}`);
  }
}

function assertAllowedIds(
  path: string,
  base: Array<{ id: string }>,
  candidate: Array<{ id: string }>
) {
  const baseIds = new Set(base.map(item => item.id));
  const changedIds = candidate
    .map(item => item.id)
    .filter(id => !baseIds.has(id) && !id.startsWith('ai-'));

  if (changedIds.length > 0) {
    throw new Error(`AI output added unsupported ids at ${path}: ${changedIds.join(', ')}`);
  }
}

function assertSameValue(path: string, base: unknown, candidate: unknown) {
  const normalizedBase = base === undefined ? null : base;
  const normalizedCandidate = candidate === undefined ? null : candidate;

  if (JSON.stringify(normalizedBase) !== JSON.stringify(normalizedCandidate)) {
    throw new Error(`AI output changed protected field ${path}`);
  }
}

function validateProject(path: string, base: ResumeProject, candidate: ResumeProject) {
  assertSameValue(`${path}.id`, base.id, candidate.id);
  assertSameValue(`${path}.repoUrl`, base.repoUrl, candidate.repoUrl);
  assertSameValue(`${path}.repoName`, base.repoName, candidate.repoName);
  assertSameValue(`${path}.projectUrl`, base.projectUrl, candidate.projectUrl);
  assertSameValue(`${path}.siteName`, base.siteName, candidate.siteName);
  assertSameValue(`${path}.imageUrl`, base.imageUrl, candidate.imageUrl);
  assertSameValue(`${path}.period`, base.period, candidate.period);
}

function validateExperienceItem(
  path: string,
  base: ResumeExperienceItem,
  candidate: ResumeExperienceItem
) {
  assertSameValue(`${path}.id`, base.id, candidate.id);
  assertSameValue(`${path}.company`, base.company, candidate.company);
  assertSameValue(`${path}.period`, base.period, candidate.period);
  assertSameIds(`${path}.projects`, base.projects ?? [], candidate.projects ?? []);
  (base.projects ?? []).forEach((project, index) => {
    validateProject(
      `${path}.projects[${project.id}]`,
      project,
      candidate.projects?.[index] as ResumeProject
    );
  });
}

function validateSociety(path: string, base: ResumeSocietyItem, candidate: ResumeSocietyItem) {
  assertSameValue(`${path}.id`, base.id, candidate.id);
  assertSameValue(`${path}.period`, base.period, candidate.period);
  assertSameValue(`${path}.repoUrl`, base.repoUrl, candidate.repoUrl);
  assertSameValue(`${path}.societyWebsiteUrl`, base.societyWebsiteUrl, candidate.societyWebsiteUrl);
}

export function validateTailoredResume(base: ResumeContent, candidate: ResumeContent) {
  assertSameValue('ui', base.ui, candidate.ui);
  assertSameValue('pdf', base.pdf, candidate.pdf);
  assertSameValue('header.emailHref', base.header.emailHref, candidate.header.emailHref);
  assertSameValue('header.githubUrl', base.header.githubUrl, candidate.header.githubUrl);
  assertSameValue('header.linkedinUrl', base.header.linkedinUrl, candidate.header.linkedinUrl);
  assertSameValue('education.id', base.education.id, candidate.education.id);
  assertSameValue('education.period', base.education.period, candidate.education.period);
  assertSameIds('experience.items', base.experience.items, candidate.experience.items);
  assertSameIds('societies.items', base.societies.items, candidate.societies.items);
  assertSameIds('projects.items', base.projects.items, candidate.projects.items);
  assertSameIds('awards.items', base.awards.items, candidate.awards.items);
  assertAllowedIds('skills.groups', base.skills.groups, candidate.skills.groups);

  base.experience.items.forEach((item, index) => {
    validateExperienceItem(`experience.items[${item.id}]`, item, candidate.experience.items[index]);
  });

  base.societies.items.forEach((item, index) => {
    validateSociety(`societies.items[${item.id}]`, item, candidate.societies.items[index]);
  });

  base.projects.items.forEach((project, index) => {
    validateProject(`projects.items[${project.id}]`, project, candidate.projects.items[index]);
  });

  base.awards.items.forEach((award, index) => {
    assertSameValue(`awards.items[${award.id}]`, award, candidate.awards.items[index]);
  });
}
