import type { Metadata, Viewport } from 'next';
import IntlProvider from '@/components/IntlProvider';
import { locales } from '@/i18n/config';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
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
  openGraph: {
    type: 'website',
    siteName: 'Henrick Lin',
    title: 'Henrick Lin — Full-Stack Engineer',
    description: 'Full-stack engineer at UNSW Sydney. React, Next.js, Python, FastAPI.',
  },
};

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

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export const dynamicParams = false;

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  // load messages
  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <IntlProvider locale={locale} messages={messages} timeZone="UTC">
      {children}
    </IntlProvider>
  );
}
