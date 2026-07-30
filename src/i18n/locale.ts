import { defaultLocale, locales, type AppLocale } from './config';

export function isSupportedLocale(locale: string | undefined): locale is AppLocale {
  return locales.some(supportedLocale => supportedLocale === locale);
}

export function getPreferredLocale(acceptLanguage: string | null): AppLocale {
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

export function resolveLocalePreference(
  savedLocale: string | undefined,
  acceptLanguage: string | null
): AppLocale {
  if (isSupportedLocale(savedLocale)) {
    return savedLocale;
  }

  return getPreferredLocale(acceptLanguage);
}
