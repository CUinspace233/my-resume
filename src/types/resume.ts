export type ResumeProject = {
  id: string;
  title: string;
  repoUrl?: string;
  repoName?: string;
  technologies: string[];
  description: string[];
  projectUrl?: string;
  siteName?: string;
  imageUrl?: string;
  period?: string;
};

export type ResumeExperienceItem = {
  id: string;
  company: string;
  position: string;
  period: string;
  achievements?: string[];
  projects?: ResumeProject[];
};

export type ResumeSocietyItem = {
  id: string;
  organization: string;
  position: string;
  achievements: string[];
  period: string;
  repoUrl: string;
  repoDescription: string;
  societyWebsiteUrl: string;
  societyWebsiteDescription: string;
};

export type ResumeAwardItem = {
  id: string;
  place: string;
  award: string;
  period: string;
  link: string;
};

export type ResumeSkillGroup = {
  id: string;
  label: string;
  items: string[];
};

export type ResumeUiContent = {
  home: string;
  websiteLabel: string;
};

export type ResumePdfContent = {
  fileNameBase: string;
  localizedSuffix: string;
};

export type ResumeHeaderContent = {
  name: string;
  email: string;
  emailHref: string;
  githubUrl: string;
  githubLabel: string;
  linkedinUrl: string;
  linkedinLabel: string;
};

export type ResumeEducationContent = {
  id: string;
  title: string;
  university: string;
  degree: string;
  period: string;
  relevantCourses: string;
  courses: string;
};

export type ResumeSection<T> = {
  title: string;
  items: T[];
};

export type ResumeExperienceContent = ResumeSection<ResumeExperienceItem> & {
  projectsLabel: string;
};

export type ResumeSkillsContent = {
  title: string;
  groups: ResumeSkillGroup[];
};

export type ResumeContent = {
  ui: ResumeUiContent;
  pdf: ResumePdfContent;
  header: ResumeHeaderContent;
  education: ResumeEducationContent;
  experience: ResumeExperienceContent;
  societies: ResumeSection<ResumeSocietyItem>;
  projects: ResumeSection<ResumeProject>;
  awards: ResumeSection<ResumeAwardItem>;
  skills: ResumeSkillsContent;
};

export type JdInsights = {
  roleKeywords: string[];
  requiredSkills: string[];
  matchNotes: string[];
  gapNotes: string[];
};

export type TailoredResumeDraft = {
  id: string;
  locale: string;
  resume: ResumeContent;
  createdAt: number;
  expiresAt: number;
  jdTitle?: string;
  company?: string;
  changeSummary: string[];
  jdInsights: JdInsights;
};

export type ResumeTailorRequest = {
  locale: string;
  jdText: string;
  userInstructions?: string;
};

export type ResumeTailorResponse = {
  draftId: string;
  tailoredResume: ResumeContent;
  changeSummary: string[];
  jdInsights: JdInsights;
};
