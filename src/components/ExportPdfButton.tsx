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
      const isMobileExport = window.innerWidth < 768;
      const exportBaseWidth = isMobileExport ? 700 : 793;
      const exportPadding = isMobileExport ? '4.5mm' : '5mm';

      const now = new Date();
      const year = now.getFullYear().toString().slice(-2);
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const dateStr = `${year}_${month}_${day}`;
      const fileName = `Henrick_Lin_Resume${locale}_${dateStr}.pdf`;

      const clone = resumeRoot.cloneNode(true) as HTMLElement;
      clone.setAttribute('data-pdf-export', 'true');
      clone.style.width = `${exportBaseWidth}px`;
      clone.style.maxWidth = `${exportBaseWidth}px`;
      clone.style.boxSizing = 'border-box';
      clone.style.borderRadius = '0';
      clone.style.margin = '0';
      clone.style.padding = exportPadding;
      clone.style.background = '#ffffff';
      clone.style.color = '#171717';
      clone.style.boxShadow = 'none';
      clone.style.transform = 'none';
      clone.style.webkitTextSizeAdjust = '100%';

      const cloneArticle = clone.querySelector(':scope > article') as HTMLElement | null;
      if (cloneArticle) {
        cloneArticle.style.width = '100%';
      }

      exportHost = document.createElement('div');
      exportHost.style.position = 'fixed';
      exportHost.style.left = '-10000px';
      exportHost.style.top = '0';
      exportHost.style.width = `${exportBaseWidth}px`;
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
      const pageMargin = isMobileExport ? 0.5 : 1;
      const printableWidth = pageWidth - pageMargin * 2;
      const printableHeight = pageHeight - pageMargin * 2;
      const websiteUrl = 'https://www.cuinspace.com';
      const websiteLabel = 'cuinspace.com';
      const websiteRightInset = isMobileExport ? 4.5 : 5;
      const websiteBottomInset = 4;
      const pageSections = Array.from(
        clone.querySelectorAll(':scope > article > .first-page, :scope > article > .second-page')
      ) as HTMLElement[];
      const targets = pageSections.length > 0 ? pageSections : [clone];
      const exportWidth = clone.clientWidth;

      for (const [index, target] of targets.entries()) {
        const pageFrame = document.createElement('div');
        pageFrame.style.width = `${exportWidth}px`;
        pageFrame.style.boxSizing = 'border-box';
        pageFrame.style.margin = '0';
        pageFrame.style.background = '#ffffff';
        pageFrame.style.color = '#171717';
        pageFrame.style.overflow = 'hidden';

        const pageContent = target.cloneNode(true) as HTMLElement;
        pageContent.setAttribute('data-pdf-export', 'true');
        pageContent.style.width = '100%';
        pageContent.style.boxSizing = 'border-box';
        pageContent.style.margin = '0';
        pageContent.style.padding = exportPadding;
        pageContent.style.background = '#ffffff';
        pageContent.style.transform = 'none';
        pageContent.style.webkitTextSizeAdjust = '100%';

        pageFrame.appendChild(pageContent);

        exportHost.appendChild(pageFrame);

        const imageData = await toJpeg(pageFrame, {
          quality: 0.98,
          pixelRatio: 2,
          backgroundColor: '#ffffff',
          cacheBust: true,
          width: exportWidth,
          height: pageFrame.scrollHeight,
          style: {
            margin: '0',
            width: `${exportWidth}px`,
            background: '#ffffff',
            color: '#171717',
            transform: 'none',
            webkitTextSizeAdjust: '100%',
          },
        });

        const imageProps = pdf.getImageProperties(imageData);
        const widthScale = printableWidth / imageProps.width;
        const heightScale = printableHeight / imageProps.height;
        const scale = Math.min(widthScale, heightScale);
        const imageWidth = imageProps.width * scale;
        const imageHeight = imageProps.height * scale;
        const x = pageMargin + (printableWidth - imageWidth) / 2;
        const y = pageMargin;

        if (index > 0) {
          pdf.addPage();
        }

        pdf.addImage(imageData, 'JPEG', x, y, imageWidth, imageHeight, undefined, 'FAST');
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(128, 128, 128);

        const websiteTextWidth = pdf.getTextWidth(websiteLabel);
        const websiteX = pageWidth - pageMargin - websiteRightInset - websiteTextWidth;
        const websiteY = pageHeight - pageMargin - websiteBottomInset;

        pdf.textWithLink(websiteLabel, websiteX, websiteY, { url: websiteUrl });
        pageFrame.remove();
      }

      const pdfBlob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);
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
