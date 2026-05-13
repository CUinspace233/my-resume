type ResumePdfMessages = {
  resume?: {
    pdf?: {
      fileNameBase?: string;
      localizedSuffix?: string;
    };
  };
};

export async function getResumePdfFileNames(locale: string) {
  const messages = (await import(`../../messages/${locale}.json`)).default as ResumePdfMessages;
  const fileNameBase = messages.resume?.pdf?.fileNameBase ?? 'Henrick_Lin_Resume';
  const localizedSuffix = messages.resume?.pdf?.localizedSuffix ?? '';
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
