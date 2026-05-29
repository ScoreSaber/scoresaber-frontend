import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getCookie } from '@tanstack/react-start/server';
import { z } from 'zod';

import { RankingsFilters } from '@/modules/rankings/rankings-filters';
import { RankingsTable } from '@/modules/rankings/rankings-table';
import {
   PLAYER_CONTROLLER_GET_PLAYERS_PIVOT,
   PLAYER_CONTROLLER_GET_PLAYERS_SORT,
   PLAYER_CONTROLLER_GET_PLAYERS_SORT_DIRECTION
} from '@/shared/api/generated/ApiParams';
import { api } from '@/shared/api/server-api';
import { PageError } from '@/shared/components/error/page-error';
import { PaginationArrows } from '@/shared/components/pagination';
import { countryRegionSearchSchema, formatCountryRegionParam } from '@/shared/country-region';
import { isSteamPlayer } from '@/shared/format/helpers';
import { pageApiData } from '@/shared/result/api';
import { isNumber } from '@/shared/url-state/params';
import { rankingFilterPreferences } from '@/shared/url-state/persisted-filter-preferences';
import { applyPersistedSearchParams, readPersistedSearchStorage } from '@/shared/url-state/persisted-search';
import { normalizeSearchRecord, stringifyUrlSearch } from '@/shared/url-state/search-serializer';
import { updateSearchParams } from '@/shared/url-state/update-search-params';
import { SetPageBackground } from '@/shell/background/page-background-provider';

const isPageNumber = z.preprocess((val) => {
   if (val == null || val === '') return 1;
   return val;
}, isNumber);

const rankingsSearchSchema = z.object({
   page: isPageNumber,
   search: z.string().min(3).max(64).optional(),
   countries: countryRegionSearchSchema,
   sort: z.enum(PLAYER_CONTROLLER_GET_PLAYERS_SORT).optional(),
   sortDirection: z.enum(PLAYER_CONTROLLER_GET_PLAYERS_SORT_DIRECTION).optional(),
   pivot: z.enum(PLAYER_CONTROLLER_GET_PLAYERS_PIVOT).optional(),
   includeInactive: z.enum(['true', 'false']).optional(),
   highlight: z.string().optional()
});

type RankingsSearchParams = Partial<z.output<typeof rankingsSearchSchema>>;

type RankingsRouteInput = {
   search: RankingsSearchParams;
   rawSearch: Record<string, unknown>;
};

const getRankingsPageData = createServerFn({ method: 'GET' })
   .inputValidator((data: RankingsRouteInput) => data)
   .handler(async ({ data }) => {
      const token = getCookie('token');
      const rawSearchParams = normalizeSearchRecord(data.rawSearch);
      const effectiveSearchParams = await applyPersistedSearchParams<RankingsSearchParams>({
         searchParams: rawSearchParams,
         parseSearch: parseRankingsSearch,
         storageKey: rankingFilterPreferences.storageKey,
         persistedKeys: token && token !== 'null' ? rankingFilterPreferences.authPersistedKeys : rankingFilterPreferences.persistedKeys
      });
      const searchParams = rankingsSearchSchema.parse({ ...data.search, ...effectiveSearchParams });
      const persistedStorage = await readPersistedSearchStorage(rankingFilterPreferences.storageKey);
      const result = await pageApiData(
         api.player.playerControllerGetPlayers({
            page: searchParams.page,
            search: searchParams.search,
            countries: formatCountryRegionParam(searchParams.countries),
            sort: searchParams.sort,
            sortDirection: searchParams.sortDirection,
            pivot: searchParams.pivot,
            includeInactive: searchParams.includeInactive ?? 'false'
         })
      );

      return { result, searchParams, persistedStorage };
   });

export const Route = createFileRoute('/rankings')({
   validateSearch: (search) => rankingsSearchSchema.parse(search),
   loaderDeps: ({ search }) => search,
   loader: ({ deps, location }) => getRankingsPageData({ data: { search: deps, rawSearch: location.search } }),
   component: RankingsRoute
});

function RankingsRoute() {
   const data = Route.useLoaderData();
   const { result, searchParams, persistedStorage } = data;

   if (!result.ok) return <PageError status={result.status} />;

   const response = result.data;
   const players = response.data;
   const meta = response.metadata;
   const bgCandidates = players.filter((p) => isSteamPlayer(p.id)).map((p) => p.avatar);
   const getPageHref = (page: number) => buildRankingsHref(updateSearchParams(searchParams, { page: page > 1 ? page : undefined }));

   return (
      <div className="relative flex-1 overflow-hidden">
         {bgCandidates.length > 0 && <SetPageBackground src={bgCandidates[0]} candidates={bgCandidates} />}

         <div className="app-container relative z-10 flex flex-col gap-4 p-4 md:p-8">
            <RankingsFilters
               currentPage={searchParams.page}
               totalPages={meta.totalPages}
               includeInactive={searchParams.includeInactive === 'true'}
               search={searchParams}
               buildHref={buildRankingsHref}
               parseSearch={parseRankingsSearch}
               initialFiltersOpen={persistedStorage.filtersOpen === 'true'}
            />

            <RankingsTable
               players={players}
               countryFiltered={!!searchParams.countries}
               currentSort={searchParams.sort}
               currentSortDirection={searchParams.sortDirection}
               currentPage={searchParams.page}
               currentPivot={searchParams.pivot}
               highlight={searchParams.highlight}
               search={searchParams}
               buildHref={buildRankingsHref}
            />

            {meta.totalPages > 1 && searchParams.pivot !== 'player' && (
               <PaginationArrows currentPage={searchParams.page} totalPages={meta.totalPages} getPageHref={getPageHref} />
            )}
         </div>
      </div>
   );
}

function buildRankingsHref(search?: RankingsSearchParams) {
   return `/rankings${stringifyUrlSearch(search ?? {})}`;
}

function parseRankingsSearch(search: Record<string, unknown>) {
   return rankingsSearchSchema.safeParse({ page: 1, ...search }).data ?? null;
}
