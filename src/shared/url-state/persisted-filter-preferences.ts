export const mapFilterPreferences = {
   storageKey: 'map-filter-preferences',
   persistedKeys: ['sortBy', 'sortDirection', 'status']
} as const;

export const rankingFilterPreferences = {
   storageKey: 'ranking-filter-preferences',
   pivotStorageKey: 'ranking-filter-pivot',
   persistedKeys: ['includeInactive', 'countries'],
   authPersistedKeys: ['includeInactive', 'countries', 'pivot'],
   legacyStorageKeys: { pivot: 'ranking-filter-pivot' }
} as const;

export const rankRequestFilterPreferences = {
   storageKey: 'rank-request-filter-preferences',
   persistedKeys: ['hideDownvoted']
} as const;

export const leaderboardFilterPreferences = {
   storageKey: 'leaderboard-filter-pivot',
   persistedKeys: ['pivot', 'scope'],
   legacyStorageKeys: { pivot: 'leaderboard-filter-pivot' }
} as const;

const leaderboardPersonalizationParams: ReadonlySet<string> = new Set(['page', 'search', 'scope', 'pivot', 'highlight']);

export function isLeaderboardPersonalizationParam(key: string) {
   return leaderboardPersonalizationParams.has(key);
}
