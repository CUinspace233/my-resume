import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { locales, defaultLocale, preferredLocaleCookieName } from './src/i18n/config';

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales,

  // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
  defaultLocale,

  // Locales that are considered similar (for example `en-US` and `en`)
  localeDetection: true,

  // Always respect the browser's current Accept-Language header on unprefixed routes.
  localeCookie: false,
});

function isSupportedLocale(locale: string | undefined): locale is (typeof locales)[number] {
  return locales.some(supportedLocale => supportedLocale === locale);
}

export default function middleware(request: NextRequest) {
  const savedLocale = request.cookies.get(preferredLocaleCookieName)?.value;

  if (request.nextUrl.pathname === '/' && isSupportedLocale(savedLocale)) {
    return NextResponse.redirect(new URL(`/${savedLocale}`, request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - files with extensions (e.g. favicon.ico)
  // - API routes
  // - _next (Next.js internals)
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
