import { createServerFn } from '@tanstack/react-start';
import { setCookie } from '@tanstack/react-start/server';

import { parseLocale } from '@/i18n/config';

export const setLocale = createServerFn({ method: 'POST' })
   .inputValidator((locale: string) => parseLocale(locale))
   .handler(({ data: locale }) => {
      setCookie('locale', locale, {
         path: '/',
         maxAge: 60 * 60 * 24 * 365,
         sameSite: 'lax'
      });
   });
