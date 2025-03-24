import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './src/i18n/config';

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
  defaultLocale,

  // Locales that are considered similar (for example `en-US` and `en`)
  localeDetection: true,
});

export const config = {
  // Match all pathnames except for
  // - files with extensions (e.g. favicon.ico)
  // - API routes
  // - _next (Next.js internals)
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
