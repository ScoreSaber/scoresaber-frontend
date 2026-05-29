import { createServerFn } from '@tanstack/react-start';
import { setCookie } from '@tanstack/react-start/server';

import { defaultLocale, localeSchema } from '@/i18n/config';

const setLocaleSchema = localeSchema.catch(defaultLocale);

export const setLocale = createServerFn({ method: 'POST' })
   .inputValidator((locale: string) => setLocaleSchema.parse(locale))
   .handler(({ data: locale }) => {
      setCookie('locale', locale, {
         path: '/',
         maxAge: 60 * 60 * 24 * 365,
         sameSite: 'lax'
      });
   });
