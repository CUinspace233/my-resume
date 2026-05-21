import { getBaseResume } from '@/lib/messages';

export async function getResumePdfFileNames(locale: string) {
  const resume = await getBaseResume(locale);
  const fileNameBase = resume.pdf?.fileNameBase ?? 'Henrick_Lin_Resume';
  const localizedSuffix = resume.pdf?.localizedSuffix ?? '';
  const now = new Date();
  const fileDate = `${now.getFullYear().toString().slice(-2)}_${String(now.getMonth() + 1).padStart(
    2,
    '0'
  )}_${String(now.getDate()).padStart(2, '0')}`;
  const asciiFileName = `${fileNameBase}_${fileDate}.pdf`;
  const localizedFileName = `${fileNameBase}${localizedSuffix}_${fileDate}.pdf`;

  return {
    asciiFileName,
    localizedFileName,
  };
}
