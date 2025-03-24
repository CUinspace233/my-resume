import type { Metadata } from 'next';
import '../globals.css';
import IntlProvider from '@/components/IntlProvider';

export const metadata: Metadata = {
  title: "Henrick Lin's Resume",
  description: "Henrick Lin's Resume",
  icons: {
    icon: [{ url: '/smallsizeavatar.png', sizes: '16x16', type: 'image/png' }],
  },
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // 加载消息
  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <html lang={locale}>
      <body>
        <IntlProvider locale={locale} messages={messages}>
          {children}
        </IntlProvider>
      </body>
    </html>
  );
}
