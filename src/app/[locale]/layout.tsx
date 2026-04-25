import type { Metadata, Viewport } from 'next';
import IntlProvider from '@/components/IntlProvider';
import { locales, type AppLocale } from '@/i18n/config';
import { notFound } from 'next/navigation';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.cuinspace.com';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Henrick Lin — Full-Stack Engineer',
    description: 'Full-stack engineer at UNSW Sydney. React, Next.js, Python, FastAPI.',
    manifest: '/manifest.json',
    icons: {
      icon: [{ url: '/smallsizeavatar.png', sizes: '16x16', type: 'image/png' }],
      apple: [{ url: '/smallsizeavatar.png', sizes: '192x192', type: 'image/png' }],
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: 'Henrick Lin',
    },
    formatDetection: {
      telephone: false,
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        en: `${BASE_URL}/en`,
        zh: `${BASE_URL}/zh`,
      },
    },
    openGraph: {
      type: 'website',
      siteName: 'Henrick Lin',
      title: 'Henrick Lin — Full-Stack Engineer',
      description: 'Full-stack engineer at UNSW Sydney. React, Next.js, Python, FastAPI.',
      url: `${BASE_URL}/${locale}`,
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
    },
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#ffffff',
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

function isSupportedLocale(locale: string): locale is AppLocale {
  return locales.some(supportedLocale => supportedLocale === locale);
}

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export const dynamicParams = false;

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  // load messages
  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <div lang={locale}>
      <IntlProvider locale={locale} messages={messages} timeZone="UTC">
        {children}
      </IntlProvider>
    </div>
  );
}
