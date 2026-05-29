import { createServerFn } from '@tanstack/react-start';
import { getCookie } from '@tanstack/react-start/server';
import { z } from 'zod';

import { MapLeaderboardView } from '@/modules/maps/detail/map-leaderboard-view';
import type { LeaderboardSearchParams } from '@/modules/maps/detail/map-leaderboard-view/map-leaderboard-view-types';
import { getDisplayLeaderboards } from '@/modules/maps/map-leaderboards';
import { getDefaultMapLeaderboardId, getRankRequestDisplayStatus, getRankRequestStatusLabel } from '@/modules/rank-requests/lib/model';
import { LEADERBOARD_CONTROLLER_GET_LEADERBOARD_SCORES_BY_ID_PIVOT, type MapControllerGetMapByIdResponse } from '@/shared/api/generated/ApiParams';
import { api } from '@/shared/api/server-api';
import { PageError } from '@/shared/components/error/page-error';
import { countryRegionSearchSchema, formatCountryRegionParam } from '@/shared/country-region';
import { formatStars } from '@/shared/format/helpers';
import { getDifficultyLabel, getDifficultyShortLabel } from '@/shared/format/strings';
import { getStatusLabel } from '@/shared/format/styling';
import { optionalApiData, pageApiData, pageDataOk } from '@/shared/result/api';
import { isNumber } from '@/shared/url-state/params';
import { leaderboardFilterPreferences } from '@/shared/url-state/persisted-filter-preferences';
import { applyPersistedSearchParams } from '@/shared/url-state/persisted-search';
import { normalizeSearchRecord, stringifyUrlSearch } from '@/shared/url-state/search-serializer';
import { SetPageBackground } from '@/shell/background/page-background-provider';

const isPageNumber = z.preprocess((val) => {
   if (val == null || val === '') return 1;
   return val;
}, isNumber);

export const leaderboardSearchSchema = z.object({
   page: isPageNumber,
   search: z.string().optional(),
   scope: countryRegionSearchSchema,
   pivot: z.enum(LEADERBOARD_CONTROLLER_GET_LEADERBOARD_SCORES_BY_ID_PIVOT).optional(),
   highlight: isNumber.optional(),
   tab: z.enum(['leaderboard', 'rank-request']).optional()
});

type MapLeaderboardRouteName = 'map' | 'mapDifficulty';
type MapLeaderboard = MapControllerGetMapByIdResponse['leaderboards'][number];
type MapLeaderboardSearch = z.output<typeof leaderboardSearchSchema>;

type MapLeaderboardRouteInput = {
   mapId: number;
   routeName: MapLeaderboardRouteName;
   search: MapLeaderboardSearch;
   rawSearch: Record<string, unknown>;
   leaderboardId?: number;
};

export const getMapLeaderboardPageData = createServerFn({ method: 'GET' })
   .inputValidator((data: MapLeaderboardRouteInput) => data)
   .handler(async ({ data }) => {
      const rawSearchParams = normalizeSearchRecord(data.rawSearch);
      const token = getCookie('token');
      const effectiveSearchParams = await applyPersistedSearchParams<LeaderboardSearchParams>({
         searchParams: rawSearchParams,
         parseSearch: parseLeaderboardSearch,
         storageKey: leaderboardFilterPreferences.storageKey,
         persistedKeys: leaderboardFilterPreferences.persistedKeys,
         enabled: Boolean(token && token !== 'null')
      });
      const searchParams = leaderboardSearchSchema.parse({ ...data.search, ...effectiveSearchParams });
      const result = await loadMapLeaderboardPageData({
         mapId: data.mapId,
         leaderboardId: data.leaderboardId,
         searchParams
      });

      return { result, searchParams };
   });

export function MapLeaderboardRouteContent({
   input,
   data
}: {
   input: MapLeaderboardRouteInput;
   data: Awaited<ReturnType<typeof getMapLeaderboardPageData>>;
}) {
   const { result, searchParams } = data;

   if (!result.ok) return <PageError status={result.status} />;

   const currentPage = searchParams.page ?? 1;
   const { mapInfo, leaderboardInfo, leaderboardScores, leaderboardId: activeLeaderboardId } = result.data;
   const buildHref = (search?: LeaderboardSearchParams) =>
      buildMapLeaderboardHref({ routeName: input.routeName, mapId: input.mapId, leaderboardId: activeLeaderboardId, search });

   return (
      <div className="relative flex-1 overflow-hidden">
         <SetPageBackground src={mapInfo.coverUrl} />
         <div className="app-container relative z-10 p-4 md:p-8">
            <MapLeaderboardView
               mapInfo={mapInfo}
               leaderboardInfo={leaderboardInfo}
               leaderboardScores={leaderboardScores}
               search={searchParams}
               currentPage={currentPage}
               currentSearch={searchParams.search}
               highlight={searchParams.highlight}
               rankRequest={mapInfo.rankRequest}
               defaultTab={searchParams.tab}
               buildHref={buildHref}
               parseSearch={parseLeaderboardSearch}
            />
         </div>
      </div>
   );
}

function buildMapLeaderboardHref({
   routeName,
   mapId,
   leaderboardId,
   search
}: {
   routeName: MapLeaderboardRouteName;
   mapId: number;
   leaderboardId: number;
   search?: LeaderboardSearchParams;
}) {
   const path = routeName === 'map' ? `/map/${mapId}` : `/map/${mapId}/difficulty/${leaderboardId}`;
   return `${path}${stringifyUrlSearch(search ?? {})}`;
}

function parseLeaderboardSearch(search: Record<string, unknown>) {
   return leaderboardSearchSchema.safeParse({ page: 1, ...search }).data ?? null;
}

export function buildMapLeaderboardHead(
   loaderData: Awaited<ReturnType<typeof getMapLeaderboardPageData>> | undefined,
   routeName: MapLeaderboardRouteName
) {
   const title = buildMapLeaderboardTitle(loaderData, routeName);
   const description = buildMapLeaderboardDescription(loaderData, routeName);
   const image = loaderData?.result.ok ? loaderData.result.data.mapInfo.coverUrl : undefined;

   return {
      meta: [
         { title: title === 'ScoreSaber' ? 'ScoreSaber!' : `${title} | ScoreSaber!` },
         ...(description ? [{ name: 'description', content: description }] : []),
         { property: 'og:title', content: title },
         ...(description ? [{ property: 'og:description', content: description }] : []),
         { property: 'og:site_name', content: 'Map - ScoreSaber' },
         { property: 'og:type', content: 'website' },
         ...(image ? [{ property: 'og:image', content: image }] : []),
         { name: 'twitter:card', content: 'summary' },
         { name: 'twitter:title', content: title },
         ...(description ? [{ name: 'twitter:description', content: description }] : []),
         ...(image ? [{ name: 'twitter:image', content: image }] : []),
         { name: 'twitter:site', content: '@ScoreSaber' }
      ]
   };
}

async function loadMapLeaderboardPageData({
   mapId,
   leaderboardId,
   searchParams
}: {
   mapId: number;
   leaderboardId?: number;
   searchParams: MapLeaderboardSearch;
}) {
   const page = searchParams.page ?? 1;
   const mapResult = await pageApiData(api.map.mapControllerGetMapById({ id: mapId }));
   if (!mapResult.ok) return mapResult;

   const mapInfo = mapResult.data;
   const activeLeaderboardId = leaderboardId ?? getDefaultMapLeaderboardId(mapInfo, searchParams.tab);

   const [leaderboardInfoResult, leaderboardScores] = await Promise.all([
      pageApiData(api.leaderboard.leaderboardControllerGetLeaderboardById({ id: activeLeaderboardId })),
      optionalApiData(
         api.leaderboard.leaderboardControllerGetLeaderboardScoresById({
            id: activeLeaderboardId,
            page,
            search: searchParams.search,
            scope: formatCountryRegionParam(searchParams.scope),
            pivot: searchParams.pivot
         })
      )
   ]);

   if (!leaderboardInfoResult.ok) return leaderboardInfoResult;

   return pageDataOk({
      mapInfo,
      leaderboardInfo: leaderboardInfoResult.data,
      leaderboardScores,
      leaderboardId: activeLeaderboardId
   });
}

function buildMapLeaderboardTitle(loaderData: Awaited<ReturnType<typeof getMapLeaderboardPageData>> | undefined, routeName: MapLeaderboardRouteName) {
   if (!loaderData?.result.ok) return 'Map';

   const { mapInfo, leaderboardInfo } = loaderData.result.data;
   if (routeName === 'map') return mapInfo.songName;

   const hasStars = leaderboardInfo.realm.leaderboardStatus !== 'UNRANKED' && leaderboardInfo.realm.stars > 0;
   const difficultyName = getDifficultyLabel(leaderboardInfo.difficulty.difficulty);
   return hasStars ? `${mapInfo.songName} | ${difficultyName} (${formatStars(leaderboardInfo.realm.stars)})` : mapInfo.songName;
}

function buildMapLeaderboardDescription(
   loaderData: Awaited<ReturnType<typeof getMapLeaderboardPageData>> | undefined,
   routeName: MapLeaderboardRouteName
) {
   if (!loaderData?.result.ok) return undefined;

   const { mapInfo, leaderboardInfo, leaderboardId } = loaderData.result.data;
   const rankRequest = loaderData.searchParams.tab === 'rank-request' ? mapInfo.rankRequest : null;
   const requestStatus = rankRequest ? getRankRequestDisplayStatus(rankRequest, leaderboardId) : null;
   const statusLabel =
      rankRequest && requestStatus
         ? `${rankRequest.requestType === 'UNRANK' ? 'Unrank Request' : 'Rank Request'}: ${getRankRequestStatusLabel(requestStatus)}`
         : getStatusLabel(leaderboardInfo.realm.leaderboardStatus);

   return buildMapEmbedDescription({
      songAuthorName: mapInfo.songAuthorName,
      levelAuthorName: mapInfo.levelAuthorName,
      bpm: mapInfo.bpm,
      statusLabel,
      difficultyStars: routeName === 'map' && !rankRequest ? buildDifficultyStarsLine(mapInfo.leaderboards) : undefined
   });
}

function buildDifficultyStarsLine(leaderboards: MapLeaderboard[]) {
   const rankedLeaderboards = getDisplayLeaderboards(leaderboards, undefined, false).filter(
      (leaderboard) => leaderboard.realm.leaderboardStatus !== 'UNRANKED' && leaderboard.realm.stars > 0
   );

   if (rankedLeaderboards.length === 0) return undefined;

   return rankedLeaderboards
      .map((leaderboard) => `${getDifficultyShortLabel(leaderboard.difficulty)}: ${formatStars(leaderboard.realm.stars)}`)
      .join(' ');
}

function buildMapEmbedDescription({
   songAuthorName,
   levelAuthorName,
   bpm,
   statusLabel,
   difficultyStars
}: {
   songAuthorName: string;
   levelAuthorName: string;
   bpm: number;
   statusLabel: string;
   difficultyStars?: string;
}) {
   return [`by ${songAuthorName}`, `mapped by ${levelAuthorName}`, statusLabel, ...(difficultyStars ? [difficultyStars] : []), `BPM: ${bpm}`].join(
      '\n'
   );
}
