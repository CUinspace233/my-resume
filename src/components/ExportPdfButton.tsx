'use client';

import { useCallback, useState } from 'react';
import { FaFilePdf } from 'react-icons/fa6';
import { LuLoaderCircle } from 'react-icons/lu';
import { useLocale, useTranslations } from 'next-intl';

const ExportPdfButton = () => {
  const locale = useLocale();
  const t = useTranslations('buttons');
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPdf = useCallback(async () => {
    const exportUrl = `/api/resume-pdf?locale=${locale}`;
    const isMobileBrowser =
      typeof navigator !== 'undefined' &&
      /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

    setIsExporting(true);

    try {
      if (isMobileBrowser) {
        window.location.assign(exportUrl);
        return;
      }

      const response = await fetch(exportUrl);

      if (!response.ok) {
        throw new Error(`Failed to export PDF: ${response.status}`);
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const date = new Date();
      const localeSuffix = locale === 'zh' ? '_中文' : '';
      const fileName = `Henrick_Lin_Resume${localeSuffix}_${date
        .getFullYear()
        .toString()
        .slice(-2)}_${String(date.getMonth() + 1).padStart(2, '0')}_${String(
        date.getDate()
      ).padStart(2, '0')}.pdf`;

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      link.rel = 'noopener';
      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch (error) {
      console.error('Failed to export PDF:', error);
    } finally {
      setIsExporting(false);
    }
  }, [locale]);

  return (
    <div className="export-pdf-container print:hidden">
      <button
        type="button"
        id="export-pdf-button"
        onClick={handleExportPdf}
        disabled={isExporting}
        className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#171717] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-black disabled:cursor-wait disabled:opacity-70 sm:px-3.5"
        aria-label="Export as PDF"
        aria-busy={isExporting}
      >
        {isExporting ? (
          <LuLoaderCircle className="h-4 w-4 animate-spin sm:h-[18px] sm:w-[18px]" />
        ) : (
          <FaFilePdf className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
        )}
        <span className="hidden md:inline">{isExporting ? 'Exporting…' : t('exportPdf')}</span>
      </button>
    </div>
  );
};

export default ExportPdfButton;
