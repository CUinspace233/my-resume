'use client';

import { useCallback } from 'react';
import { FaFilePdf } from 'react-icons/fa6';
import { useTranslations } from 'next-intl';

const ExportPdfButton = () => {
  const t = useTranslations('buttons');

  const handleExportPdf = useCallback(() => {
    // Hide the button and theme toggle
    const exportButton = document.querySelector('.export-pdf-container');
    const themeToggle = document.querySelector('.theme-toggle-container');
    const languageSwitcher = document.querySelector('.language-switcher-container');

    if (exportButton) exportButton.classList.add('hidden');
    if (themeToggle) themeToggle.classList.add('hidden');
    if (languageSwitcher) languageSwitcher.classList.add('hidden');

    // Add print-specific styles for page breaks
    const style = document.createElement('style');
    style.id = 'print-styles';
    style.innerHTML = `
      @media print {
        .print-section {
          page-break-inside: avoid;
          margin-top: 10mm;
        }
        @page {
          margin-top: 15mm;
          margin-bottom: 15mm;
        }
      }
    `;
    document.head.appendChild(style);

    // Use the browser's print function to save as PDF
    window.print();

    // After the print dialog is closed, restore the button visibility and remove styles
    setTimeout(() => {
      if (exportButton) exportButton.classList.remove('hidden');
      if (themeToggle) themeToggle.classList.remove('hidden');
      if (languageSwitcher) languageSwitcher.classList.remove('hidden');
      const printStyles = document.getElementById('print-styles');
      if (printStyles) printStyles.remove();
    }, 500);
  }, []);

  return (
    <div className="export-pdf-container print:hidden">
      <button
        onClick={handleExportPdf}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-md transition-colors text-xs sm:text-sm"
        aria-label="Export as PDF"
      >
        <FaFilePdf className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        <span className="hidden sm:inline">{t('exportPdf')}</span>
      </button>
    </div>
  );
};

export default ExportPdfButton;
