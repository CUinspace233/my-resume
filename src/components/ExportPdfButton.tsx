'use client';

import { useCallback, useState } from 'react';
import { FaFilePdf } from 'react-icons/fa6';
import { LuLoaderCircle } from 'react-icons/lu';
import { useLocale, useTranslations } from 'next-intl';
import { downloadPdf } from '@/lib/pdfDownload';

const getResumePdfFileName = (baseName: string, localeSuffix: string) => {
  const date = new Date();

  return `${baseName}${localeSuffix}_${date
    .getFullYear()
    .toString()
    .slice(-2)}_${String(date.getMonth() + 1).padStart(2, '0')}_${String(date.getDate()).padStart(
    2,
    '0'
  )}.pdf`;
};

const ExportPdfButton = () => {
  const locale = useLocale();
  const t = useTranslations('common.actions');
  const pdf = useTranslations('resume.pdf');
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPdf = useCallback(async () => {
    const fileName = getResumePdfFileName(pdf('fileNameBase'), pdf('localizedSuffix'));
    const exportUrl = `/api/resume-pdf?locale=${locale}`;
    const mobileExportUrl = `/api/resume-pdf/${encodeURIComponent(fileName)}?locale=${locale}`;

    await downloadPdf({
      exportUrl,
      fileName,
      mobileExportUrl,
      setIsExporting,
      onError: error => console.error('Failed to export PDF:', error),
    });
  }, [locale, pdf]);

  return (
    <div className="export-pdf-container print:hidden">
      <button
        type="button"
        id="export-pdf-button"
        onClick={handleExportPdf}
        disabled={isExporting}
        className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#171717] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-black disabled:cursor-wait disabled:opacity-70 sm:px-3.5"
        aria-label={t('exportPdfAria')}
        aria-busy={isExporting}
      >
        {isExporting ? (
          <LuLoaderCircle className="h-4 w-4 animate-spin sm:h-[18px] sm:w-[18px]" />
        ) : (
          <FaFilePdf className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
        )}
        <span className={isExporting ? 'inline' : 'hidden md:inline'}>
          {isExporting ? t('exportingPdf') : t('exportPdf')}
        </span>
      </button>
    </div>
  );
};

export default ExportPdfButton;
