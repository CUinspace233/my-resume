export type ResumeBullet = {
  id: string;
  text: string;
};

export type ResumeProject = {
  id: string;
  title: string;
  repoUrl?: string;
  repoName?: string;
  technologies: string[];
  description: ResumeBullet[];
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
  achievements?: ResumeBullet[];
  projects?: ResumeProject[];
};

export type ResumeSocietyItem = {
  id: string;
  organization: string;
  position: string;
  achievements: ResumeBullet[];
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
