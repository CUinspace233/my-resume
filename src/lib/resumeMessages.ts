import type { ResumeContent } from '@/types/resume';

type ResumeMessages = {
  resume: ResumeContent;
};

export async function getResumeMessages(locale: string) {
  return (await import(`../../messages/${locale}.json`)).default as ResumeMessages;
}

export async function getBaseResume(locale: string) {
  const messages = await getResumeMessages(locale);
  return messages.resume;
}
