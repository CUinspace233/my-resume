'use client';

import { NextIntlClientProvider } from 'next-intl';
import { ReactNode } from 'react';

export default function IntlProvider({
  locale,
  messages,
  children,
  timeZone = 'UTC',
}: {
  locale: string;
  messages: Record<string, unknown>;
  children: ReactNode;
  timeZone?: string;
}) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone={timeZone}>
      {children}
    </NextIntlClientProvider>
  );
}
