import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { defaultLocale, locales, preferredLocaleCookieName } from './i18n/config';

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

export default function middleware(request: NextRequest) {
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
