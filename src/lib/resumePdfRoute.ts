import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { launchPdfBrowser } from '@/lib/pdfBrowser';
import { getResumePdfFileNames } from '@/lib/resumePdf';

const VALID_LOCALES = new Set(['en', 'zh']);

function getPdfOrigin(request: NextRequest) {
  const forwardedProto = request.headers.get('x-forwarded-proto');
  const forwardedHost = request.headers.get('x-forwarded-host');

  if (forwardedProto && forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  if (request.nextUrl.origin) {
    return request.nextUrl.origin;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return request.nextUrl.origin;
}

export async function handleResumePdfRequest(request: NextRequest) {
  const localeParam = request.nextUrl.searchParams.get('locale') ?? 'en';
  const locale = VALID_LOCALES.has(localeParam) ? localeParam : 'en';
  let browser = null;
  let pageUrl = '';
  let pageTitle = '';

  try {
    browser = await launchPdfBrowser();
    const context = await browser.newContext({
      serviceWorkers: 'block',
      viewport: {
        width: 1280,
        height: 1810,
      },
    });
    const page = await context.newPage();
    page.setDefaultNavigationTimeout(20000);
    page.setDefaultTimeout(20000);

    const resumeUrl = new URL(`/${locale}/resume`, getPdfOrigin(request));
    resumeUrl.searchParams.set('print', '1');
    resumeUrl.searchParams.set('pdf', '1');

    await page.goto(resumeUrl.toString(), {
      waitUntil: 'domcontentloaded',
    });
    await page.emulateMedia({
      media: 'print',
    });
    await page.waitForSelector('.resume-paper', {
      state: 'attached',
    });
    await page.evaluate(async () => {
      await document.fonts.ready;
    });
    await page.waitForTimeout(150);
    pageUrl = page.url();
    pageTitle = await page.title();

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: '0',
        right: '0',
        bottom: '0',
        left: '0',
      },
    });

    const { asciiFileName, localizedFileName } = getResumePdfFileNames(locale);

    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${asciiFileName}"; filename*=UTF-8''${encodeURIComponent(localizedFileName)}`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Failed to generate PDF:', {
      error,
      origin: getPdfOrigin(request),
      locale,
      pageUrl,
      pageTitle,
    });
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  } finally {
    await browser?.close();
  }
}
