import { z } from 'zod';

export const localeSchema = z.enum(['en', 'de', 'ja', 'zh-CN', 'ru', 'fr', 'pl', 'nl', 'pt-BR', 'zh-TW', 'cs', 'ko']);
export const locales = localeSchema.options;
export type Locale = z.infer<typeof localeSchema>;
export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
   en: 'English',
   de: 'German',
   ja: 'Japanese',
   'zh-CN': 'Chinese Simplified',
   ru: 'Russian',
   fr: 'French',
   pl: 'Polish',
   nl: 'Dutch',
   'pt-BR': 'Portuguese, Brazilian',
   'zh-TW': 'Chinese Traditional',
   cs: 'Czech',
   ko: 'Korean'
};
