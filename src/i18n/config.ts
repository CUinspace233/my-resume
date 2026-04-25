export const locales = ['en', 'zh'] as const;
export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = 'en';
export const preferredLocaleCookieName = 'preferredLocale';
