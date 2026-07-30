export type NrglPersonalItem = {
  id: string;
  label: string;
  value: string;
  href?: string;
};

export type NrglEducationItem = {
  id: string;
  institution: string;
  program: string;
  period: string;
  details: string[];
};

export type NrglExperienceItem = {
  id: string;
  company: string;
  position: string;
  period: string;
  achievements: {
    label: string;
    description: string;
  }[];
};

export type NrglResumeContent = {
  ui: {
    home: string;
    photoAlt: string;
  };
  pdf: {
    fileNameBase: string;
    localizedSuffix: string;
  };
  header: {
    name: string;
    eyebrow: string;
  };
  personal: {
    title: string;
    items: NrglPersonalItem[];
  };
  education: {
    title: string;
    items: NrglEducationItem[];
  };
  experience: {
    title: string;
    items: NrglExperienceItem[];
  };
  campus: {
    title: string;
    items: NrglExperienceItem[];
  };
  summary: {
    title: string;
    body: string;
  };
};
