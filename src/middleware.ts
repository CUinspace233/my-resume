import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { defaultLocale, locales, preferredLocaleCookieName } from './i18n/config';

const NORA_HOST = 'nora.cuinspace.com';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  localeDetection: true,
  localeCookie: false,
});

function isSupportedLocale(locale: string | undefined): locale is (typeof locales)[number] {
  return locales.some(supportedLocale => supportedLocale === locale);
}

function getHost(request: NextRequest) {
  return request.headers.get('host')?.split(':')[0]?.toLowerCase() ?? '';
}

function redirectWithSearch(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  return NextResponse.redirect(url, 301);
}

function rewriteWithSearch(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  return NextResponse.rewrite(url);
}

function handleNoraHost(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/' || pathname === '/en' || pathname === '/en/') {
    return rewriteWithSearch(request, '/en/nora');
  }

  if (pathname === '/zh' || pathname === '/zh/') {
    return rewriteWithSearch(request, '/zh/nora');
  }

  if (pathname === '/nora' || pathname === '/en/nora') {
    return redirectWithSearch(request, '/');
  }

  if (pathname === '/zh/nora') {
    return redirectWithSearch(request, '/zh');
  }

  if (pathname === '/en/resume' || pathname === '/nrgl/resume' || pathname === '/en/nrgl/resume') {
    return redirectWithSearch(request, '/resume');
  }

  if (pathname === '/zh/nrgl/resume') {
    return redirectWithSearch(request, '/zh/resume');
  }

  if (pathname === '/resume') {
    return rewriteWithSearch(request, '/en/nrgl/resume');
  }

  if (pathname === '/zh/resume') {
    return rewriteWithSearch(request, '/zh/nrgl/resume');
  }

  return new NextResponse(null, { status: 404 });
}

export default function middleware(request: NextRequest) {
  const host = getHost(request);
  const isNoraHost = host === NORA_HOST;

  if (isNoraHost) {
    return handleNoraHost(request);
  }

  const isLocalHost = host === 'localhost' || host === '127.0.0.1';

  if (!isLocalHost && /^\/(en\/|zh\/)?(nrgl\/resume|nora)(\/|$)/.test(request.nextUrl.pathname)) {
    return new NextResponse(null, { status: 404 });
  }

  const savedLocale = request.cookies.get(preferredLocaleCookieName)?.value;

  if (request.nextUrl.pathname === '/' && isSupportedLocale(savedLocale)) {
    const localePath = savedLocale === defaultLocale ? '/' : `/${savedLocale}`;
    return NextResponse.redirect(new URL(localePath, request.url));
  }

  const response = intlMiddleware(request);

  if (/^\/(en|zh)\/private(\/|$)/.test(request.nextUrl.pathname)) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
