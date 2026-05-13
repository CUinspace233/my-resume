'use client';

type PdfDownloadOptions = {
  exportUrl: string;
  fileName: string;
  setIsExporting: (isExporting: boolean) => void;
  mobileExportUrl?: string;
  onError?: (error: unknown) => void;
};

function getResponseFileName(contentDisposition: string | null, fallbackFileName: string) {
  if (!contentDisposition) return fallbackFileName;

  const encodedMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (encodedMatch?.[1]) {
    return decodeURIComponent(encodedMatch[1]);
  }

  const quotedMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
  return quotedMatch?.[1] ?? fallbackFileName;
}

export function isMobileBrowser() {
  return (
    typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
  );
}

export async function downloadPdf({
  exportUrl,
  fileName,
  setIsExporting,
  mobileExportUrl = exportUrl,
  onError,
}: PdfDownloadOptions) {
  const shouldUseMobileFlow = isMobileBrowser();

  setIsExporting(true);

  try {
    if (shouldUseMobileFlow) {
      const clearExporting = () => {
        setIsExporting(false);
        window.removeEventListener('pagehide', clearExporting);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };

      const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
          clearExporting();
        }
      };

      window.addEventListener('pagehide', clearExporting, { once: true });
      document.addEventListener('visibilitychange', handleVisibilityChange);

      // Mobile browsers may show a download/preview prompt without leaving the page.
      // Clear the loading state after a short grace period if no navigation happened.
      window.setTimeout(() => {
        if (document.visibilityState === 'visible') {
          clearExporting();
        }
      }, 4000);

      requestAnimationFrame(() => {
        window.location.assign(mobileExportUrl);
      });
      return;
    }

    const response = await fetch(exportUrl);

    if (!response.ok) {
      throw new Error(`Failed to export PDF: ${response.status}`);
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = getResponseFileName(response.headers.get('content-disposition'), fileName);
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  } catch (error) {
    onError?.(error);
  } finally {
    if (!shouldUseMobileFlow) {
      setIsExporting(false);
    }
  }
}
