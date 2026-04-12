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

    let exportHost: HTMLDivElement | null = null;

    try {
      const [{ toJpeg }, { jsPDF }] = await Promise.all([import('html-to-image'), import('jspdf')]);

      const now = new Date();
      const year = now.getFullYear().toString().slice(-2);
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const dateStr = `${year}_${month}_${day}`;
      const fileName = `Henrick_Lin_Resume${locale}_${dateStr}.pdf`;

      const clone = resumeRoot.cloneNode(true) as HTMLElement;
      clone.style.width = '793px';
      clone.style.maxWidth = '793px';
      clone.style.borderRadius = '0';
      clone.style.margin = '0';
      clone.style.padding = '20mm';
      clone.style.background = '#ffffff';
      clone.style.color = '#171717';
      clone.style.boxShadow = 'none';
      clone.style.transform = 'none';

      exportHost = document.createElement('div');
      exportHost.style.position = 'fixed';
      exportHost.style.left = '-10000px';
      exportHost.style.top = '0';
      exportHost.style.width = '793px';
      exportHost.style.padding = '0';
      exportHost.style.margin = '0';
      exportHost.style.background = '#ffffff';
      exportHost.style.zIndex = '-1';
      exportHost.appendChild(clone);
      document.body.appendChild(exportHost);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const pageMargin = 10;
      const printableWidth = pageWidth - pageMargin * 2;
      const printableHeight = pageHeight - pageMargin * 2;
      const pageSections = Array.from(
        clone.querySelectorAll(':scope > article > .first-page, :scope > article > .second-page')
      ) as HTMLElement[];
      const targets = pageSections.length > 0 ? pageSections : [clone];

      for (const [index, target] of targets.entries()) {
        const imageData = await toJpeg(target, {
          quality: 0.98,
          pixelRatio: 2,
          backgroundColor: '#ffffff',
          cacheBust: true,
          width: 793,
          height: target.scrollHeight,
          style: {
            margin: '0',
            width: '793px',
            maxWidth: '793px',
            background: '#ffffff',
            color: '#171717',
            transform: 'none',
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

      const pdfBlob = pdf.output('blob');
      const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' });

      if (
        typeof navigator !== 'undefined' &&
        'canShare' in navigator &&
        navigator.canShare?.({ files: [pdfFile] })
      ) {
        await navigator.share({
          files: [pdfFile],
          title: fileName,
        });
      } else {
        const blobUrl = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      }
    } catch (error) {
      console.error('Failed to export PDF:', error);
    } finally {
      exportHost?.remove();
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
