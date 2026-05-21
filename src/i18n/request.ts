import { getRequestConfig } from 'next-intl/server';
import { getAppMessages } from '@/lib/messages';

export default getRequestConfig(async ({ locale }) => {
  return {
    locale: locale as string,
    messages: await getAppMessages(locale as string),
  };
});
