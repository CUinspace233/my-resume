import type { Metadata } from 'next';
import '../globals.css';
import IntlProvider from '@/components/IntlProvider';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: "Henrick Lin's Resume",
  description: "Henrick Lin's Resume",
  manifest: '/manifest.json',
  icons: {
    icon: [{ url: '/smallsizeavatar.png', sizes: '16x16', type: 'image/png' }],
    apple: [{ url: '/smallsizeavatar.png', sizes: '192x192', type: 'image/png' }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: "Henrick Lin's Resume",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: "Henrick Lin's Resume",
    title: "Henrick Lin's Resume",
    description: "Henrick Lin's Resume",
  },
  themeColor: '#000000',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;

  const validLocales = ['en', 'zh'];
  if (!validLocales.includes(locale)) {
    notFound();
  }

  // load messages
  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <html lang={locale}>
      <body>
        <IntlProvider locale={locale} messages={messages} timeZone="UTC">
          {children}
        </IntlProvider>
      </body>
    </html>
  );
}
