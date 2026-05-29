import { getCookie } from '@tanstack/react-start/server';

import { defaultLocale, localeSchema, type Locale } from '@/i18n/config';

type Messages = Record<string, unknown>;

const requestLocaleSchema = localeSchema.catch(defaultLocale);

export async function getLocale(): Promise<Locale> {
   return requestLocaleSchema.parse(getCookie('locale'));
}

export async function getMessages(): Promise<Messages> {
   const locale = await getLocale();
   return (await import(`../../messages/${locale}.json`)).default;
}

export async function getTranslations(namespace?: string) {
   const messages = await getMessages();
   const scoped = namespace ? getPath(messages, namespace) : messages;

   return (key: string, values?: Record<string, unknown>) => {
      const value = getPath(scoped, key);
      if (typeof value !== 'string') return key;
      if (!values) return value;

      return Object.entries(values).reduce((next, [name, replacement]) => next.replaceAll(`{${name}}`, String(replacement)), value);
   };
}

export function getRequestConfig<T>(callback: () => T) {
   return callback;
}

function getPath(source: unknown, path: string) {
   return path.split('.').reduce<unknown>((current, segment) => {
      if (typeof current !== 'object' || current == null || !(segment in current)) return undefined;
      return (current as Record<string, unknown>)[segment];
   }, source);
}
