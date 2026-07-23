import { getCookie, getRequestHeaders } from '@tanstack/react-start/server';

import csCzMessages from '../../messages/cs-CZ.json';
import deDeMessages from '../../messages/de-DE.json';
import enMessages from '../../messages/en.json';
import esEsMessages from '../../messages/es-ES.json';
import fiFiMessages from '../../messages/fi-FI.json';
import frFrMessages from '../../messages/fr-FR.json';
import itItMessages from '../../messages/it-IT.json';
import jaJpMessages from '../../messages/ja-JP.json';
import koKrMessages from '../../messages/ko-KR.json';
import nlNlMessages from '../../messages/nl-NL.json';
import plPlMessages from '../../messages/pl-PL.json';
import ptBrMessages from '../../messages/pt-BR.json';
import ruRuMessages from '../../messages/ru-RU.json';
import svSeMessages from '../../messages/sv-SE.json';
import zhCnMessages from '../../messages/zh-CN.json';
import zhTwMessages from '../../messages/zh-TW.json';

import { defaultLocale, locales, parseLocale, type Locale } from '@/i18n/config';
import { mergeMessages, selectMessages, type Messages } from '@/shared/i18n/messages';
import type { TranslationNamespace } from '@/shared/i18n/route-namespaces';

type AcceptedLocale = {
   value: string;
   quality: number;
};

const MIN_AUTO_LOCALE_COMPLETION = 0.35;

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
   'es-ES': esEsMessages,
   'sv-SE': svSeMessages,
   'fi-FI': fiFiMessages
};

const totalMessageCount = countMessages(enMessages);
const localeCompletion = new Map<Locale, number>();
for (const locale of locales) {
   localeCompletion.set(locale, locale === defaultLocale ? 1 : countTranslatedMessages(enMessages, localeMessages[locale]) / totalMessageCount);
}

export async function getLocale(): Promise<Locale> {
   const cookieLocale = getCookie('locale');
   if (cookieLocale) return parseLocale(cookieLocale);

   return getAcceptedLocale(getRequestHeaders().get('accept-language')) ?? defaultLocale;
}

export function getMessages(locale: Locale, namespaces: readonly TranslationNamespace[]): Messages {
   const messages = selectMessages(enMessages, namespaces);
   return locale === defaultLocale ? messages : mergeMessages(messages, selectMessages(localeMessages[locale], namespaces));
}

export function getVisibleLocales(): Locale[] {
   return locales.filter((locale) => locale === defaultLocale || hasMessages(localeMessages[locale]));
}

function hasMessages(value: string | Messages): boolean {
   return typeof value === 'string' ? value.trim().length > 0 : Object.values(value).some(hasMessages);
}

function getAcceptedLocale(header: string | null): Locale | null {
   for (const { value } of parseAcceptedLocales(header)) {
      const locale = matchLocale(value);
      if (locale && (localeCompletion.get(locale) ?? 0) >= MIN_AUTO_LOCALE_COMPLETION) return locale;
   }

   return null;
}

function parseAcceptedLocales(header: string | null): AcceptedLocale[] {
   if (!header) return [];

   return header
      .split(',')
      .map((part) => {
         const [value, ...params] = part.trim().split(';');
         const quality = params
            .map((param) => param.trim())
            .find((param) => param.startsWith('q='))
            ?.slice(2);

         return {
            value,
            quality: quality ? Number(quality) : 1
         };
      })
      .filter((locale) => locale.value && Number.isFinite(locale.quality) && locale.quality > 0)
      .sort((a, b) => b.quality - a.quality);
}

function matchLocale(value: string): Locale | null {
   const requested = value.toLowerCase();
   const exact = locales.find((locale) => locale.toLowerCase() === requested);
   if (exact) return exact;

   if (requested.startsWith('zh-hans')) return 'zh-CN';
   if (requested.startsWith('zh-hant')) return 'zh-TW';

   const language = requested.split('-')[0];
   return locales.find((locale) => locale.toLowerCase() === language || locale.toLowerCase().startsWith(`${language}-`)) ?? null;
}

function countMessages(value: string | Messages): number {
   return typeof value === 'string' ? 1 : Object.values(value).reduce((total, next) => total + countMessages(next), 0);
}

function countTranslatedMessages(base: string | Messages, override: string | Messages | undefined): number {
   if (typeof base === 'string') return typeof override === 'string' && override.trim() ? 1 : 0;
   if (!override || typeof override === 'string') return 0;

   return Object.entries(base).reduce((total, [key, value]) => total + countTranslatedMessages(value, override[key]), 0);
}
