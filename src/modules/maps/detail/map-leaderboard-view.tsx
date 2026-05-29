'use client';

import { useAuth } from '@/modules/auth';
import { MapHeaderActions } from '@/modules/maps/detail/map-header-actions';
import { MapLeaderboardContent } from '@/modules/maps/detail/map-leaderboard-view/map-leaderboard-content';
import { MapLeaderboardHero } from '@/modules/maps/detail/map-leaderboard-view/map-leaderboard-hero';
import type { MapLeaderboardViewProps } from '@/modules/maps/detail/map-leaderboard-view/map-leaderboard-view-types';
import { getGameModeFromRawDifficulty } from '@/shared/format/strings';
import { isLeaderboardRanked } from '@/shared/format/styling';
import Permissions from '@/shared/permissions';

export function MapLeaderboardView({
   mapInfo,
   leaderboardInfo,
   leaderboardScores,
   search,
   currentPage,
   currentSearch,
   highlight,
   rankRequest,
   defaultTab,
   buildHref,
   parseSearch
}: MapLeaderboardViewProps) {
   const { user } = useAuth();
   const userPermissions = user?.permissions ?? 0;
   const activeGameMode = getGameModeFromRawDifficulty(leaderboardInfo.difficulty.rawDifficulty);
   const hasMultipleGameModes = new Set(mapInfo.leaderboards.map((lb) => getGameModeFromRawDifficulty(lb.rawDifficulty))).size > 1;

   const hasRankRequest = rankRequest != null;
   const activeTab = defaultTab === 'rank-request' ? 'rank-request' : 'leaderboard';
   const canCreateRequest = Permissions.checkPermissionNumber(userPermissions, Permissions.security.RT | Permissions.security.RTR);
   const canQualify = Permissions.checkPermissionNumber(userPermissions, Permissions.security.NAT);
   const canDeny = Permissions.checkPermissionNumber(userPermissions, Permissions.security.NAT);
   const canReplace = Permissions.checkPermissionNumber(userPermissions, Permissions.security.NAT);
   const canApprove = Permissions.checkPermissionNumber(userPermissions, Permissions.security.ADMIN);
   const canAdmin =
      Permissions.checkPermissionNumber(userPermissions, Permissions.security.ADMIN) ||
      Permissions.checkPermissionNumber(userPermissions, Permissions.security.PANDA);
   const isRanked = isLeaderboardRanked(leaderboardInfo);

   const renderHeaderActions = (tab: typeof activeTab) => (
      <MapHeaderActions
         mapInfo={mapInfo}
         leaderboardId={leaderboardInfo.id}
         isRanked={isRanked}
         hasRankRequest={hasRankRequest}
         requestId={rankRequest?.id}
         canCreateRequest={canCreateRequest}
         canQualify={canQualify}
         canDeny={canDeny}
         canReplace={canReplace}
         canApprove={canApprove}
         canAdmin={canAdmin}
         activeTab={tab}
      />
   );

   return (
      <div className="flex flex-col gap-3">
         <MapLeaderboardHero mapInfo={mapInfo} leaderboardInfo={leaderboardInfo} />

         <div className="flex flex-col gap-3">
            <MapLeaderboardContent
               mapInfo={mapInfo}
               leaderboardInfo={leaderboardInfo}
               leaderboardScores={leaderboardScores}
               search={search}
               currentPage={currentPage}
               currentSearch={currentSearch}
               highlight={highlight}
               rankRequest={rankRequest}
               activeTab={activeTab}
               activeGameMode={activeGameMode}
               hasMultipleGameModes={hasMultipleGameModes}
               userPermissions={userPermissions}
               renderHeaderActions={renderHeaderActions}
               buildHref={buildHref}
               parseSearch={parseSearch}
            />
         </div>
      </div>
   );
}
