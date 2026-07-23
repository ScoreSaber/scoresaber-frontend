export const globalNamespaces = ['common', 'error', 'nav', 'sidebar', 'login', 'search', 'legal'] as const;

const routeNamespaces = [
   { prefix: '/live', namespaces: ['live', 'map', 'player', 'score', 'leaderboard'] },
   { prefix: '/settings', namespaces: ['settings', 'supporterGate'] },
   { prefix: '/map', namespaces: ['map', 'leaderboard', 'score', 'player', 'comments', 'rankRequest', 'richTextEditor'] },
   { prefix: '/maps', namespaces: ['map', 'leaderboard', 'score', 'player'] },
   { prefix: '/u', namespaces: ['player', 'score', 'leaderboard', 'comments'] },
   { prefix: '/ranking/request', namespaces: ['rankRequest', 'comments', 'richTextEditor', 'player', 'map'] },
   { prefix: '/ranking/requests', namespaces: ['rankRequest', 'player', 'map'] },
   { prefix: '/rankings', namespaces: ['rankings', 'player'] },
   { prefix: '/leaderboards', namespaces: ['leaderboard', 'map', 'score', 'player'] },
   { prefix: '/leaderboard', namespaces: ['leaderboard', 'map', 'score', 'player'] },
   { prefix: '/quest', namespaces: ['quest'] },
   { prefix: '/support', namespaces: ['support'] },
   { prefix: '/team', namespaces: ['team'] },
   { prefix: '/legal', namespaces: ['legal'] },
   { prefix: '/oauth', namespaces: ['oauth'] },
   { prefix: '/auth', namespaces: ['oauth'] },
   { prefix: '/login', namespaces: ['login'] },
   { prefix: '/', namespaces: ['home', 'map', 'player', 'leaderboard', 'score'] }
] as const;

export type TranslationNamespace = (typeof globalNamespaces)[number] | (typeof routeNamespaces)[number]['namespaces'][number];

export function getRouteNamespaces(pathname: string): TranslationNamespace[] {
   const route = routeNamespaces.find(({ prefix }) => pathname === prefix || pathname.startsWith(`${prefix}/`));
   return [...new Set([...globalNamespaces, ...(route?.namespaces ?? [])])];
}
