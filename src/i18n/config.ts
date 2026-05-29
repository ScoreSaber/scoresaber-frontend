import { z } from 'zod';

export const localeSchema = z.enum(['en', 'nl']);
export const locales = localeSchema.options;
export type Locale = z.infer<typeof localeSchema>;
export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
   en: 'English',
   nl: 'Nederlands'
};
