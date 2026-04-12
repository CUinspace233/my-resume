'use client';

import { useCallback } from 'react';
import { FaFilePdf } from 'react-icons/fa6';
import { useTranslations, useLocale } from 'next-intl';

const ExportPdfButton = () => {
  const t = useTranslations('buttons');
  let locale = useLocale();
  if (locale === 'en') {
    locale = '';
  } else {
    locale = '_中文';
  }

  const handleExportPdf = useCallback(() => {
    // Generate date string in YY_MM_DD format
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateStr = `${year}_${month}_${day}`;

    // Set document title for PDF filename
    const originalTitle = document.title;
    document.title = `Henrick_Lin_Resume${locale}_${dateStr}`;

    // Hide the button and theme toggle
    const exportButton = document.querySelector('.export-pdf-container');
    const themeToggle = document.querySelector('.theme-toggle-container');
    const languageSwitcher = document.querySelector('.language-switcher-container');

    if (exportButton) exportButton.classList.add('hidden');
    if (themeToggle) themeToggle.classList.add('hidden');
    if (languageSwitcher) languageSwitcher.classList.add('hidden');

    // Restore the visibility of the button and theme toggle
    const restore = () => {
      document.title = originalTitle;
      if (exportButton) exportButton.classList.remove('hidden');
      if (themeToggle) themeToggle.classList.remove('hidden');
      if (languageSwitcher) languageSwitcher.classList.remove('hidden');
      window.removeEventListener('afterprint', restore);
    };

    window.addEventListener('afterprint', restore);

    // Add print-specific styles for page breaks
    // const style = document.createElement('style');
    // style.id = 'print-styles';
    // style.innerHTML = `
    //   @media print {
    //     .print-section {
    //       page-break-inside: avoid;
    //       margin-top: 10mm;
    //     }
    //     @page {
    //       margin-top: 15mm;
    //       margin-bottom: 15mm;
    //     }
    //   }
    // `;
    // document.head.appendChild(style);

    // Use the browser's print function to save as PDF
    window.print();

    // After the print dialog is closed, restore the button visibility and remove styles
    // const printStyles = document.getElementById('print-styles');
    // if (printStyles) printStyles.remove();
  }, [locale]);

  return (
    <div className="export-pdf-container print:hidden">
      <button
        type="button"
        id="export-pdf-button"
        onClick={handleExportPdf}
        className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#171717] px-3 sm:px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-black cursor-pointer"
        aria-label="Export as PDF"
      >
        <FaFilePdf className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
        <span className="hidden md:inline">{t('exportPdf')}</span>
      </button>
    </div>
  );
};

export default ExportPdfButton;
