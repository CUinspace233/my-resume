import { redirect } from 'next/navigation';
import { cookies, headers } from 'next/headers';
import { preferredLocaleCookieName } from '@/i18n/config';
import { resolveLocalePreference } from '@/i18n/locale';

export default async function Home() {
  const cookieStore = await cookies();
  const headersList = await headers();
  const locale = resolveLocalePreference(
    cookieStore.get(preferredLocaleCookieName)?.value,
    headersList.get('accept-language')
  );

  redirect(`/${locale}`);
}
