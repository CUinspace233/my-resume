import { getNrglResume } from '@/lib/messages';

export async function getNrglResumePdfFileNames(locale: string) {
  const resume = await getNrglResume(locale);
  const now = new Date();
  const fileDate = `${now.getFullYear().toString().slice(-2)}_${String(now.getMonth() + 1).padStart(
    2,
    '0'
  )}_${String(now.getDate()).padStart(2, '0')}`;
  const asciiFileName = `${resume.pdf.fileNameBase}_${fileDate}.pdf`;
  const localizedFileName = `${resume.pdf.fileNameBase}${resume.pdf.localizedSuffix}_${fileDate}.pdf`;

  return {
    asciiFileName,
    localizedFileName,
  };
}
