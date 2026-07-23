import { z } from 'zod';

import type { Locale } from '@/i18n/config';

export const translationNamespaceSchema = z.enum([
   'common',
   'error',
   'nav',
   'sidebar',
   'login',
   'search',
   'legal',
   'home',
   'live',
   'map',
   'player',
   'score',
   'leaderboard',
   'settings',
   'supporterGate',
   'comments',
   'rankRequest',
   'richTextEditor',
   'rankings',
   'quest',
   'support',
   'team',
   'oauth'
]);

export type TranslationNamespace = z.infer<typeof translationNamespaceSchema>;

const globalNamespaces: TranslationNamespace[] = ['common', 'error', 'nav', 'sidebar', 'search', 'legal', 'home'];

const routeNamespaces: [prefix: string, namespaces: TranslationNamespace[]][] = [
   ['/live', ['live', 'map', 'player', 'score', 'leaderboard']],
   ['/settings', ['settings', 'supporterGate', 'quest', 'login']],
   ['/map', ['map', 'leaderboard', 'score', 'player', 'comments', 'rankRequest', 'richTextEditor']],
   ['/maps', ['map', 'leaderboard', 'score', 'player']],
   ['/u', ['player', 'score', 'leaderboard', 'comments', 'supporterGate', 'settings']],
   ['/ranking/request', ['rankRequest', 'comments', 'richTextEditor', 'player', 'map']],
   ['/ranking/requests', ['rankRequest', 'player', 'map']],
   ['/rankings', ['rankings', 'player']],
   ['/leaderboards', ['leaderboard', 'map', 'score', 'player']],
   ['/leaderboard', ['leaderboard', 'map', 'score', 'player']],
   ['/quest', ['quest', 'settings', 'login']],
   ['/support', ['support']],
   ['/team', ['team']],
   ['/oauth', ['oauth']],
   ['/auth', ['oauth']],
   ['/login', ['login']],
   ['/', ['map', 'player', 'leaderboard', 'score', 'rankings']]
];

export const rootShellQueryKey: readonly string[] = ['root-shell'];
export const routeMessagesQueryKeyPrefix: readonly string[] = ['root-messages'];

export function getRouteNamespaces(pathname: string): TranslationNamespace[] {
   const route = routeNamespaces.find(([prefix]) => pathname === prefix || pathname.startsWith(`${prefix}/`));
   return [...new Set([...globalNamespaces, ...(route?.[1] ?? [])])];
}

export function getRouteMessagesQueryKey(locale: Locale, namespaces: readonly TranslationNamespace[]): readonly string[] {
   return [...routeMessagesQueryKeyPrefix, locale, ...namespaces];
}
