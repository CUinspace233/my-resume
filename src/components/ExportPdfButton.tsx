'use client';

import { useCallback, useState } from 'react';
import { FaFilePdf } from 'react-icons/fa6';
import { useTranslations, useLocale } from 'next-intl';

const ExportPdfButton = () => {
  const t = useTranslations('buttons');
  const [isExporting, setIsExporting] = useState(false);
  let locale = useLocale();
  if (locale === 'en') {
    locale = '';
  } else {
    locale = '_中文';
  }

  const handleExportPdf = useCallback(async () => {
    const resumeRoot = document.querySelector('.resume-paper') as HTMLElement | null;
    if (!resumeRoot) return;

    setIsExporting(true);

    try {
      const [{ toJpeg }, { jsPDF }] = await Promise.all([import('html-to-image'), import('jspdf')]);

      const now = new Date();
      const year = now.getFullYear().toString().slice(-2);
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const dateStr = `${year}_${month}_${day}`;
      const fileName = `Henrick_Lin_Resume${locale}_${dateStr}.pdf`;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const pageMargin = 8;
      const printableWidth = pageWidth - pageMargin * 2;
      const printableHeight = pageHeight - pageMargin * 2;
      const pageSections = Array.from(
        resumeRoot.querySelectorAll(
          ':scope > article > .first-page, :scope > article > .second-page'
        )
      ) as HTMLElement[];
      const targets = pageSections.length > 0 ? pageSections : [resumeRoot];

      for (const [index, target] of targets.entries()) {
        const imageData = await toJpeg(target, {
          quality: 0.98,
          pixelRatio: Math.min(window.devicePixelRatio || 2, 2),
          backgroundColor: '#ffffff',
          cacheBust: true,
          width: target.scrollWidth,
          height: target.scrollHeight,
          style: {
            margin: '0',
          },
        });

        const imageProps = pdf.getImageProperties(imageData);
        const widthRatio = printableWidth / imageProps.width;
        const heightRatio = printableHeight / imageProps.height;
        const scale = Math.min(widthRatio, heightRatio);
        const imageWidth = imageProps.width * scale;
        const imageHeight = imageProps.height * scale;
        const x = pageMargin + (printableWidth - imageWidth) / 2;
        const y = pageMargin;

        if (index > 0) {
          pdf.addPage();
        }

        pdf.addImage(imageData, 'JPEG', x, y, imageWidth, imageHeight, undefined, 'FAST');
      }

      pdf.save(fileName);
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
        className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#171717] px-3 sm:px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-black disabled:cursor-wait disabled:opacity-70 cursor-pointer"
        aria-label="Export as PDF"
      >
        <FaFilePdf className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
        <span className="hidden md:inline">{isExporting ? 'Exporting…' : t('exportPdf')}</span>
      </button>
    </div>
  );
};

export default ExportPdfButton;
