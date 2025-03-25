import type { Metadata } from 'next';
import '../globals.css';
import IntlProvider from '@/components/IntlProvider';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: "Henrick Lin's Resume",
  description: "Henrick Lin's Resume",
  icons: {
    icon: [{ url: '/smallsizeavatar.png', sizes: '16x16', type: 'image/png' }],
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

  return (
    <html lang={locale}>
      <body>
        <IntlProvider locale={locale} messages={{}}>
          {children}
        </IntlProvider>
      </body>
    </html>
  );
}
