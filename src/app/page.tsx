import { redirect } from 'next/navigation';
import { cookies, headers } from 'next/headers';
import { defaultLocale, locales, preferredLocaleCookieName, type AppLocale } from '@/i18n/config';

function isSupportedLocale(locale: string | undefined): locale is AppLocale {
  return locales.some(supportedLocale => supportedLocale === locale);
}

function getPreferredLocale(acceptLanguage: string | null): AppLocale {
  const requestedLocales =
    acceptLanguage
      ?.split(',')
      .map((entry, index) => {
        const [languageRange, ...parameters] = entry.trim().toLowerCase().split(';');
        const quality = parameters
          .map(parameter => parameter.trim())
          .find(parameter => parameter.startsWith('q='))
          ?.slice(2);

        return {
          locale: languageRange,
          quality: quality ? Number(quality) : 1,
          index,
        };
      })
      .filter(({ locale, quality }) => locale && locale !== '*' && Number.isFinite(quality))
      .sort((a, b) => b.quality - a.quality || a.index - b.index) ?? [];

  for (const { locale } of requestedLocales) {
    const exactMatch = locales.find(supportedLocale => supportedLocale.toLowerCase() === locale);
    if (exactMatch) return exactMatch;

    const baseLanguage = locale.split('-')[0];
    const baseMatch = locales.find(supportedLocale => supportedLocale === baseLanguage);
    if (baseMatch) return baseMatch;
  }

  return defaultLocale;
}

export default async function Home() {
  const cookieStore = await cookies();
  const savedLocale = cookieStore.get(preferredLocaleCookieName)?.value;

  if (isSupportedLocale(savedLocale)) {
    redirect(`/${savedLocale}`);
  }

  const headersList = await headers();
  redirect(`/${getPreferredLocale(headersList.get('accept-language'))}`);
}
