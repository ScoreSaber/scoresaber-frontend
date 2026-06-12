'use client';

import type { ComponentProps } from 'react';

import { getRouteApi } from '@tanstack/react-router';

import { useAuth } from '@/modules/auth';
import {
   MAP_CONTROLLER_GET_MAP_LISTINGS_SORT_BY,
   MAP_CONTROLLER_GET_MAP_LISTINGS_SORT_DIRECTION,
   PLAYER_CONTROLLER_GET_PLAYERS_PIVOT
} from '@/shared/api/generated/ApiParams';
import { parseCountryRegionParam, type CountryRegionFilterValue } from '@/shared/country-region';
import { mapFilterPreferences, rankingFilterPreferences, rankRequestFilterPreferences } from '@/shared/url-state/persisted-filter-preferences';
import { usePersistedSearch } from '@/shared/url-state/persisted/use-persisted-search';
import type { SearchParamsRecord, SearchParamValue } from '@/shared/url-state/search-params';
import type { AppNavRoute } from '@/shell/nav-data';

type MapsRouteSearch = SearchParamsRecord & {
   page?: number;
   verified?: 'true' | 'false';
   sortBy?: (typeof MAP_CONTROLLER_GET_MAP_LISTINGS_SORT_BY)[number];
   sortDirection?: (typeof MAP_CONTROLLER_GET_MAP_LISTINGS_SORT_DIRECTION)[number];
   status?: string;
};

type RankingsRouteSearch = SearchParamsRecord & {
   page: number;
   includeInactive?: 'true' | 'false';
   countries?: CountryRegionFilterValue;
   pivot?: (typeof PLAYER_CONTROLLER_GET_PLAYERS_PIVOT)[number];
};

type RankRequestsRouteSearch = SearchParamsRecord & {
   page: number;
   hideDownvoted?: true;
};

const defaultMapsSearch: MapsRouteSearch = {};
const defaultRankingsSearch: RankingsRouteSearch = { page: 1 };
const defaultRankRequestsSearch: RankRequestsRouteSearch = { page: 1 };
const homeRoute = getRouteApi('/');
const mapsRoute = getRouteApi('/maps');
const questRoute = getRouteApi('/quest');
const rankingsRoute = getRouteApi('/rankings');
const rankRequestsRoute = getRouteApi('/ranking/requests');
const teamRoute = getRouteApi('/team');

type NavLinkProps = Omit<ComponentProps<'a'>, 'href'> & {
   route: AppNavRoute;
};

export function NavLink({ route, ...props }: NavLinkProps) {
   const { user } = useAuth();
   const mapsSearch = usePersistedSearch<MapsRouteSearch>({
      fallback: defaultMapsSearch,
      parseSearch: parseMapsSearch,
      storageKey: mapFilterPreferences.storageKey,
      persistedKeys: mapFilterPreferences.persistedKeys
   });
   const rankingsSearch = usePersistedSearch<RankingsRouteSearch>({
      fallback: defaultRankingsSearch,
      parseSearch: parseRankingsSearch,
      storageKey: rankingFilterPreferences.storageKey,
      persistedKeys: user ? rankingFilterPreferences.authPersistedKeys : rankingFilterPreferences.persistedKeys,
      legacyStorageKeys: rankingFilterPreferences.legacyStorageKeys
   });
   const rankRequestsSearch = usePersistedSearch<RankRequestsRouteSearch>({
      fallback: defaultRankRequestsSearch,
      parseSearch: parseRankRequestsSearch,
      storageKey: rankRequestFilterPreferences.storageKey,
      persistedKeys: rankRequestFilterPreferences.persistedKeys
   });

   if (route === 'maps') return <mapsRoute.Link {...props} search={mapsSearch} />;
   if (route === 'rankings') return <rankingsRoute.Link {...props} search={rankingsSearch} />;
   if (route === 'rankRequests') return <rankRequestsRoute.Link {...props} search={rankRequestsSearch} />;
   if (route === 'questInstaller') return <questRoute.Link {...props} search={{ step: 1 }} />;
   if (route === 'team') return <teamRoute.Link {...props} />;

   return <homeRoute.Link {...props} />;
}

function parseMapsSearch(search: SearchParamsRecord): MapsRouteSearch {
   return {
      page: typeof search.page === 'number' && search.page > 1 ? search.page : undefined,
      verified: search.verified === 'false' ? 'false' : undefined,
      sortBy: isMapSortBy(search.sortBy) ? search.sortBy : undefined,
      sortDirection: isMapSortDirection(search.sortDirection) ? search.sortDirection : undefined,
      status: typeof search.status === 'string' ? search.status : undefined
   };
}

function parseRankingsSearch(search: SearchParamsRecord): RankingsRouteSearch {
   return {
      page: 1,
      includeInactive: search.includeInactive === 'true' || search.includeInactive === 'false' ? search.includeInactive : undefined,
      countries: parseCountryRegionParam(search.countries),
      pivot: isRankingsPivot(search.pivot) ? search.pivot : undefined
   };
}

function parseRankRequestsSearch(search: SearchParamsRecord): RankRequestsRouteSearch {
   return {
      page: 1,
      hideDownvoted: search.hideDownvoted === true || search.hideDownvoted === 'true' ? true : undefined
   };
}

function isMapSortBy(value: SearchParamValue): value is MapsRouteSearch['sortBy'] {
   return typeof value === 'string' && (MAP_CONTROLLER_GET_MAP_LISTINGS_SORT_BY as readonly string[]).includes(value);
}

function isMapSortDirection(value: SearchParamValue): value is MapsRouteSearch['sortDirection'] {
   return typeof value === 'string' && (MAP_CONTROLLER_GET_MAP_LISTINGS_SORT_DIRECTION as readonly string[]).includes(value);
}

function isRankingsPivot(value: SearchParamValue): value is RankingsRouteSearch['pivot'] {
   return typeof value === 'string' && (PLAYER_CONTROLLER_GET_PLAYERS_PIVOT as readonly string[]).includes(value);
}
