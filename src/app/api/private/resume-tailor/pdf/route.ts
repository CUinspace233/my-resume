import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { launchPdfBrowser } from '@/lib/pdfBrowser';
import {
  createNoIndexHeaders,
  privateResumeCookieName,
  requestHasPrivateResumeAccess,
  unauthorizedPrivateJson,
} from '@/lib/privateAuth';
import { getTailoredResumeDraft } from '@/lib/tailoredResumeStore';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function getOrigin(request: NextRequest) {
  const forwardedProto = request.headers.get('x-forwarded-proto');
  const forwardedHost = request.headers.get('x-forwarded-host');

  if (forwardedProto && forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  return request.nextUrl.origin;
}

function slugifyFilePart(value?: string) {
  const slug = value
    ?.normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .slice(0, 48);

  return slug || 'JD';
}

function getTailoredFileName(draft: { company?: string; jdTitle?: string }) {
  const now = new Date();
  const fileDate = `${now.getFullYear().toString().slice(-2)}_${String(now.getMonth() + 1).padStart(
    2,
    '0'
  )}_${String(now.getDate()).padStart(2, '0')}`;
  const target = slugifyFilePart(draft.company ?? draft.jdTitle);
  return `Henrick_Lin_Resume_Tailored_${target}_${fileDate}.pdf`;
}

export async function GET(request: NextRequest) {
  if (!requestHasPrivateResumeAccess(request)) {
    return unauthorizedPrivateJson();
  }

  const draftId = request.nextUrl.searchParams.get('draftId');
  const locale = request.nextUrl.searchParams.get('locale') ?? 'en';

  if (!draftId) {
    return NextResponse.json(
      { error: 'Missing draftId' },
      { status: 400, headers: createNoIndexHeaders() }
    );
  }

  const draft = await getTailoredResumeDraft(draftId);

  if (!draft || draft.locale !== locale) {
    return NextResponse.json(
      { error: 'Draft not found or expired' },
      { status: 404, headers: createNoIndexHeaders() }
    );
  }

  let browser = null;

  try {
    browser = await launchPdfBrowser();
    const origin = getOrigin(request);
    const context = await browser.newContext({
      serviceWorkers: 'block',
      viewport: {
        width: 1280,
        height: 1810,
      },
    });
    const accessCookie = request.cookies.get(privateResumeCookieName);

    if (accessCookie) {
      await context.addCookies([
        {
          name: privateResumeCookieName,
          value: accessCookie.value,
          url: origin,
          httpOnly: true,
          sameSite: 'Lax',
        },
      ]);
    }

    const page = await context.newPage();
    page.setDefaultNavigationTimeout(20000);
    page.setDefaultTimeout(20000);

    const previewUrl = new URL(`/${locale}/private/resume-tailor/preview/${draftId}`, origin);
    previewUrl.searchParams.set('pdf', '1');

    await page.goto(previewUrl.toString(), {
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

    const fileName = getTailoredFileName(draft);

    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: createNoIndexHeaders({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'no-store',
      }),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to generate tailored PDF',
      },
      { status: 500, headers: createNoIndexHeaders() }
    );
  } finally {
    await browser?.close();
  }
}
