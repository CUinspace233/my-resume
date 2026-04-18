export function getResumePdfFileNames(locale: string) {
  const now = new Date();
  const fileDate = `${now.getFullYear().toString().slice(-2)}_${String(now.getMonth() + 1).padStart(
    2,
    '0'
  )}_${String(now.getDate()).padStart(2, '0')}`;
  const asciiFileName = `Henrick_Lin_Resume_${fileDate}.pdf`;
  const localizedFileName =
    locale === 'zh' ? `Henrick_Lin_Resume_中文_${fileDate}.pdf` : asciiFileName;

  return {
    asciiFileName,
    localizedFileName,
  };
}
