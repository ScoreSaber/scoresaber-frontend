import { buildMapLeaderboardLocation, parseLeaderboardSearch, type getMapLeaderboardPageData } from './-leaderboard';

import { MapLeaderboardView } from '@/modules/maps/detail/map-leaderboard-view';
import type { LeaderboardSearchParams } from '@/modules/maps/detail/map-leaderboard-view/map-leaderboard-view-types';
import { PageError } from '@/shared/components/error/page-error';
import { SetPageBackground } from '@/shell/background/page-background-provider';

export function MapLeaderboardRouteContent({
   input,
   data
}: {
   input: { routeName: 'map' | 'mapDifficulty'; mapId: number };
   data: Awaited<ReturnType<typeof getMapLeaderboardPageData>>;
}) {
   const { result, searchParams } = data;

   if (!result.ok) return <PageError status={result.status} />;

   const currentPage = searchParams.page ?? 1;
   const { mapInfo, leaderboard, leaderboardScores, leaderboardId } = result.data;
   const buildLocation = (search?: LeaderboardSearchParams) =>
      buildMapLeaderboardLocation({ routeName: input.routeName, mapId: input.mapId, leaderboardId, search });

   return (
      <div className="relative flex-1 overflow-hidden">
         <SetPageBackground src={mapInfo.coverUrl} />
         <div className="app-container relative z-10 p-4 md:p-8">
            <MapLeaderboardView
               routeName={input.routeName}
               mapInfo={mapInfo}
               leaderboard={leaderboard}
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
