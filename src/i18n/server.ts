import { getCookie } from '@tanstack/react-start/server';

import csCzMessages from '../../messages/cs-CZ.json';
import deDeMessages from '../../messages/de-DE.json';
import enMessages from '../../messages/en.json';
import esEsMessages from '../../messages/es-ES.json';
import frFrMessages from '../../messages/fr-FR.json';
import itItMessages from '../../messages/it-IT.json';
import jaJpMessages from '../../messages/ja-JP.json';
import koKrMessages from '../../messages/ko-KR.json';
import nlNlMessages from '../../messages/nl-NL.json';
import plPlMessages from '../../messages/pl-PL.json';
import ptBrMessages from '../../messages/pt-BR.json';
import ruRuMessages from '../../messages/ru-RU.json';
import zhCnMessages from '../../messages/zh-CN.json';
import zhTwMessages from '../../messages/zh-TW.json';

import { defaultLocale, locales, parseLocale, type Locale } from '@/i18n/config';

type Messages = Record<string, string | Messages>;

const localeMessages: Record<Locale, Messages> = {
   en: enMessages,
   'de-DE': deDeMessages,
   'ja-JP': jaJpMessages,
   'zh-CN': zhCnMessages,
   'ru-RU': ruRuMessages,
   'fr-FR': frFrMessages,
   'pl-PL': plPlMessages,
   'nl-NL': nlNlMessages,
   'pt-BR': ptBrMessages,
   'zh-TW': zhTwMessages,
   'cs-CZ': csCzMessages,
   'ko-KR': koKrMessages,
   'it-IT': itItMessages,
   'es-ES': esEsMessages
};

export async function getLocale(): Promise<Locale> {
   return parseLocale(getCookie('locale'));
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
   if (typeof base === 'string') return typeof override === 'string' && override.trim() ? override : base;
   return mergeMessages(base, (override ?? {}) as Messages);
}

function hasMessages(value: string | Messages): boolean {
   return typeof value === 'string' ? value.trim().length > 0 : Object.values(value).some(hasMessages);
}
