import { getCookie } from '@tanstack/react-start/server';

import csMessages from '../../messages/cs.json';
import deMessages from '../../messages/de.json';
import enMessages from '../../messages/en.json';
import frMessages from '../../messages/fr.json';
import jaMessages from '../../messages/ja.json';
import koMessages from '../../messages/ko.json';
import nlMessages from '../../messages/nl.json';
import plMessages from '../../messages/pl.json';
import ptBrMessages from '../../messages/pt-BR.json';
import ruMessages from '../../messages/ru.json';
import zhCnMessages from '../../messages/zh-CN.json';
import zhTwMessages from '../../messages/zh-TW.json';

import { defaultLocale, locales, localeSchema, type Locale } from '@/i18n/config';

type Messages = Record<string, string | Messages>;

const localeMessages: Record<Locale, Messages> = {
   en: enMessages,
   de: deMessages,
   ja: jaMessages,
   'zh-CN': zhCnMessages,
   ru: ruMessages,
   fr: frMessages,
   pl: plMessages,
   nl: nlMessages,
   'pt-BR': ptBrMessages,
   'zh-TW': zhTwMessages,
   cs: csMessages,
   ko: koMessages
};

export async function getLocale(): Promise<Locale> {
   return localeSchema.catch(defaultLocale).parse(getCookie('locale'));
}

export async function getMessages(): Promise<Messages> {
   const locale = await getLocale();
   return locale === defaultLocale ? enMessages : mergeMessages(enMessages, localeMessages[locale]);
}

export function getVisibleLocales(): Locale[] {
   return locales.filter((locale) => locale === defaultLocale || hasMessages(localeMessages[locale]));
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

function getPath(source: string | Messages | undefined, path: string) {
   return path
      .split('.')
      .reduce<string | Messages | undefined>((current, segment) => (typeof current === 'string' ? undefined : current?.[segment]), source);
}

function mergeMessages(base: Messages, override: Messages): Messages {
   return Object.fromEntries(Object.entries(base).map(([key, value]) => [key, mergeMessage(value, override[key])]));
}

function mergeMessage(base: string | Messages, override: string | Messages | undefined) {
   if (typeof base === 'string') return typeof override === 'string' ? override : base;
   return mergeMessages(base, (override ?? {}) as Messages);
}

function hasMessages(value: string | Messages): boolean {
   return typeof value === 'string' ? value.trim().length > 0 : Object.values(value).some(hasMessages);
}
