import { linkOptions } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

import { readAuthCookie } from '@/modules/auth/actions/session.server';
import { MapLeaderboardView } from '@/modules/maps/detail/map-leaderboard-view';
import type { LeaderboardSearchParams } from '@/modules/maps/detail/map-leaderboard-view/map-leaderboard-view-types';
import { getDisplayLeaderboards } from '@/modules/maps/map-leaderboards';
import { getDefaultMapLeaderboardId, getRankRequestDisplayStatus, getRankRequestStatusLabel } from '@/modules/rank-requests/lib/model';
import { LEADERBOARD_CONTROLLER_GET_LEADERBOARD_SCORES_BY_ID_PIVOT, type MapControllerGetMapByIdResponse } from '@/shared/api/generated/ApiParams';
import { api, publicApi } from '@/shared/api/server-api';
import { PageError } from '@/shared/components/error/page-error';
import { countryRegionSearchSchema, formatCountryRegionParam } from '@/shared/country-region';
import { formatStars } from '@/shared/format/helpers';
import { getDifficultyLabel, getDifficultyShortLabel } from '@/shared/format/strings';
import { getStatusLabel } from '@/shared/format/styling';
import { optionalApiData, pageApiData, pageDataOk } from '@/shared/result/api';
import { buildSeoHead } from '@/shared/seo/metadata';
import { isNumber, isPageNumber } from '@/shared/url-state/params';
import { leaderboardFilterPreferences } from '@/shared/url-state/persisted-filter-preferences';
import { applyPersistedSearchParams } from '@/shared/url-state/persisted-search';
import type { SearchParamsRecord } from '@/shared/url-state/search-params';
import { normalizeSearchRecord } from '@/shared/url-state/search-serializer';
import { SetPageBackground } from '@/shell/background/page-background-provider';

export const leaderboardSearchSchema = z.object({
   page: isPageNumber,
   search: z.string().optional(),
   scope: z.enum(['country', 'region']).or(countryRegionSearchSchema),
   pivot: z.enum(LEADERBOARD_CONTROLLER_GET_LEADERBOARD_SCORES_BY_ID_PIVOT).optional(),
   highlight: isNumber.optional(),
   tab: z.enum(['leaderboard', 'insights', 'rank-request']).optional()
});

type MapLeaderboardRouteName = 'map' | 'mapDifficulty';
type MapLeaderboard = MapControllerGetMapByIdResponse['leaderboards'][number];
type MapLeaderboardSearch = z.output<typeof leaderboardSearchSchema>;

type MapLeaderboardRouteInput = {
   mapId: number;
   routeName: MapLeaderboardRouteName;
   search: MapLeaderboardSearch;
   rawSearch: SearchParamsRecord;
   leaderboardId?: number;
};

export const getMapLeaderboardPageData = createServerFn({ method: 'GET' })
   .inputValidator((data: MapLeaderboardRouteInput) => data)
   .handler(async ({ data }) => {
      const rawSearchParams = normalizeSearchRecord(data.rawSearch);
      const token = readAuthCookie();
      const effectiveSearchParams = await applyPersistedSearchParams<LeaderboardSearchParams>({
         searchParams: rawSearchParams,
         parseSearch: parseLeaderboardSearch,
         storageKey: leaderboardFilterPreferences.storageKey,
         persistedKeys: leaderboardFilterPreferences.persistedKeys,
         enabled: Boolean(token)
      });
      const searchParams = normalizeViewerScopeSearch(leaderboardSearchSchema.parse({ ...data.search, ...effectiveSearchParams }), Boolean(token));
      const result = await loadMapLeaderboardPageData({
         mapId: data.mapId,
         leaderboardId: data.leaderboardId,
         searchParams,
         hasSession: Boolean(token)
      });

      return { result, searchParams };
   });

export function MapLeaderboardRouteContent({
   input,
   data
}: {
   input: { routeName: MapLeaderboardRouteName; mapId: number };
   data: Awaited<ReturnType<typeof getMapLeaderboardPageData>>;
}) {
   const { result, searchParams } = data;

   if (!result.ok) return <PageError status={result.status} />;

   const currentPage = searchParams.page ?? 1;
   const { mapInfo, leaderboardInfo, leaderboardScores, leaderboardId: activeLeaderboardId } = result.data;
   const buildLocation = (search?: LeaderboardSearchParams) =>
      buildMapLeaderboardLocation({ routeName: input.routeName, mapId: input.mapId, leaderboardId: activeLeaderboardId, search });

   return (
      <div className="relative flex-1 overflow-hidden">
         <SetPageBackground src={mapInfo.coverUrl} />
         <div className="app-container relative z-10 p-4 md:p-8">
            <MapLeaderboardView
               routeName={input.routeName}
               mapInfo={mapInfo}
               leaderboardInfo={leaderboardInfo}
               leaderboardScores={leaderboardScores}
               search={searchParams}
               currentPage={currentPage}
               currentSearch={searchParams.search}
               highlight={searchParams.highlight}
               rankRequest={mapInfo.rankRequest}
               defaultTab={searchParams.tab}
               buildLocation={buildLocation}
               parseSearch={parseLeaderboardSearch}
            />
         </div>
      </div>
   );
}

function buildMapLeaderboardLocation({
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
   const routeSearch = normalizeMapLeaderboardLocationSearch(search);

   if (routeName === 'map') {
      return linkOptions({ to: '/map/$id', params: { id: mapId }, search: routeSearch });
   }

   return linkOptions({ to: '/map/$id/difficulty/$leaderboardId', params: { id: mapId, leaderboardId }, search: routeSearch });
}

function normalizeMapLeaderboardLocationSearch(search?: LeaderboardSearchParams) {
   const { page = 1, ...rest } = search ?? {};
   return { page, ...rest };
}

function parseLeaderboardSearch(search: SearchParamsRecord) {
   return leaderboardSearchSchema.safeParse({ page: 1, ...search }).data ?? null;
}

function normalizeViewerScopeSearch(searchParams: MapLeaderboardSearch, hasSession: boolean) {
   if (hasSession || (searchParams.scope !== 'country' && searchParams.scope !== 'region')) return searchParams;

   const globalSearchParams = { ...searchParams };
   delete globalSearchParams.scope;
   return globalSearchParams;
}

export function buildMapLeaderboardHead(
   loaderData: Awaited<ReturnType<typeof getMapLeaderboardPageData>> | undefined,
   routeName: MapLeaderboardRouteName
) {
   const title = buildMapLeaderboardTitle(loaderData, routeName);
   const description = buildMapLeaderboardDescription(loaderData, routeName);
   const data = loaderData?.result.ok ? loaderData.result.data : null;
   const path =
      data && routeName === 'map' ? `/map/${data.mapInfo.id}` : data ? `/map/${data.mapInfo.id}/difficulty/${data.leaderboardId}` : undefined;

   return buildSeoHead({
      title,
      description,
      path,
      image: data?.mapInfo.coverUrl,
      imageAlt: data ? `${data.mapInfo.songName} cover art` : undefined,
      twitterCard: 'summary'
   });
}

async function loadMapLeaderboardPageData({
   mapId,
   leaderboardId,
   searchParams,
   hasSession
}: {
   mapId: number;
   leaderboardId?: number;
   searchParams: MapLeaderboardSearch;
   hasSession: boolean;
}) {
   const page = searchParams.page ?? 1;
   const mapApi = hasSession ? api : publicApi;
   const scoreApi = searchParams.pivot || searchParams.scope === 'country' || searchParams.scope === 'region' ? api : publicApi;
   const mapResult = await pageApiData(mapApi.map.mapControllerGetMapById({ id: mapId }));
   if (!mapResult.ok) return mapResult;

   const mapInfo = mapResult.data;
   const activeLeaderboardId =
      leaderboardId ?? getDefaultMapLeaderboardId(mapInfo, searchParams.tab === 'rank-request' ? 'rank-request' : 'leaderboard');

   const shouldLoadScores = searchParams.tab !== 'insights' && (searchParams.tab !== 'rank-request' || mapInfo.rankRequest == null);
   const [leaderboardInfoResult, leaderboardScores] = await Promise.all([
      pageApiData(publicApi.leaderboard.leaderboardControllerGetLeaderboardById({ id: activeLeaderboardId })),
      shouldLoadScores
         ? optionalApiData(
              scoreApi.leaderboard.leaderboardControllerGetLeaderboardScoresById({
                 id: activeLeaderboardId,
                 page,
                 search: searchParams.search,
                 scope: formatCountryRegionParam(searchParams.scope),
                 pivot: searchParams.pivot
              })
           )
         : null
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
