'use client';

import { useAuth } from '@/modules/auth';
import { LEADERBOARD_CONTROLLER_GET_LEADERBOARD_SCORES_BY_ID_PIVOT } from '@/shared/api/generated/ApiParams';
import { parseCountryRegionParam, type CountryRegionFilterValue } from '@/shared/country-region';
import { leaderboardFilterPreferences } from '@/shared/url-state/persisted-filter-preferences';
import { usePersistedSearch } from '@/shared/url-state/persisted/use-persisted-search';
import type { SearchParamsRecord, SearchParamValue } from '@/shared/url-state/search-params';

type LeaderboardSearchParams = SearchParamsRecord & {
   page: number;
   search?: string;
   scope?: CountryRegionFilterValue | 'country' | 'region';
   pivot?: (typeof LEADERBOARD_CONTROLLER_GET_LEADERBOARD_SCORES_BY_ID_PIVOT)[number];
   highlight?: number;
   tab?: 'leaderboard' | 'rank-request';
};

const defaultLeaderboardSearch: LeaderboardSearchParams = { page: 1 };

function usePersistedLeaderboardSearch(search?: Partial<LeaderboardSearchParams>) {
   const { user } = useAuth();

   return usePersistedSearch<LeaderboardSearchParams>({
      search,
      fallback: defaultLeaderboardSearch,
      parseSearch: parsePersistedLeaderboardSearch,
      storageKey: leaderboardFilterPreferences.storageKey,
      persistedKeys: user ? leaderboardFilterPreferences.persistedKeys : [],
      legacyStorageKeys: leaderboardFilterPreferences.legacyStorageKeys
   });
}

function parsePersistedLeaderboardSearch(search: SearchParamsRecord): LeaderboardSearchParams {
   return {
      page: 1,
      search: typeof search.search === 'string' ? search.search : undefined,
      scope: parseLeaderboardScope(search.scope),
      pivot: isLeaderboardPivot(search.pivot) ? search.pivot : undefined,
      highlight: typeof search.highlight === 'number' ? search.highlight : undefined,
      tab: search.tab === 'rank-request' || search.tab === 'leaderboard' ? search.tab : undefined
   };
}

function parseLeaderboardScope(value: SearchParamValue): LeaderboardSearchParams['scope'] {
   if (value === 'country' || value === 'region') return value;
   return parseCountryRegionParam(value);
}

function isLeaderboardPivot(value: SearchParamValue): value is LeaderboardSearchParams['pivot'] {
   return typeof value === 'string' && (LEADERBOARD_CONTROLLER_GET_LEADERBOARD_SCORES_BY_ID_PIVOT as readonly string[]).includes(value);
}

export { usePersistedLeaderboardSearch };
