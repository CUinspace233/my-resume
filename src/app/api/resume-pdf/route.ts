import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { launchPdfBrowser } from '@/lib/pdfBrowser';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VALID_LOCALES = new Set(['en', 'zh']);

export async function GET(request: NextRequest) {
  const localeParam = request.nextUrl.searchParams.get('locale') ?? 'en';
  const locale = VALID_LOCALES.has(localeParam) ? localeParam : 'en';
  let browser = null;

  try {
    browser = await launchPdfBrowser();
    const page = await browser.newPage({
      viewport: {
        width: 1280,
        height: 1810,
      },
    });

    const resumeUrl = new URL(`/${locale}/resume`, request.nextUrl.origin);
    resumeUrl.searchParams.set('print', '1');
    resumeUrl.searchParams.set('pdf', '1');

    await page.goto(resumeUrl.toString(), {
      waitUntil: 'networkidle',
    });
    await page.emulateMedia({
      media: 'print',
    });
    await page.waitForLoadState('networkidle');
    await page.evaluate(async () => {
      await document.fonts.ready;
    });

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

    const now = new Date();
    const fileDate = `${now.getFullYear().toString().slice(-2)}_${String(
      now.getMonth() + 1
    ).padStart(2, '0')}_${String(now.getDate()).padStart(2, '0')}`;
    const asciiFileName = `Henrick_Lin_Resume_${fileDate}.pdf`;
    const localizedFileName =
      locale === 'zh' ? `Henrick_Lin_Resume_中文_${fileDate}.pdf` : asciiFileName;

    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${asciiFileName}"; filename*=UTF-8''${encodeURIComponent(localizedFileName)}`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  } finally {
    await browser?.close();
  }
}
