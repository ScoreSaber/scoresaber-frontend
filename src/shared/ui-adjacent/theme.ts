import { z } from 'zod';

export const THEME_STORAGE_KEY = 'theme';
export const THEME_COOKIE_NAME = 'theme';
export const THEME_MEDIA_QUERY = '(prefers-color-scheme: dark)';
const themeSchema = z.enum(['light', 'dark', 'system']);
export const themes = themeSchema.options;

export type Theme = z.infer<typeof themeSchema>;
export type ResolvedTheme = 'light' | 'dark';

export function parseTheme(value: string | null | undefined): Theme {
   return themeSchema.catch('system').parse(value);
}

export function parseServerTheme(value: string | null | undefined): ResolvedTheme | undefined {
   if (value === 'light' || value === 'dark') return value;
}
