import { getDefaultLeaderboardId } from '@/modules/maps/map-leaderboards';
import type { MapControllerGetMapByIdResponse } from '@/shared/api/generated/ApiParams';

type RankRequest = NonNullable<MapControllerGetMapByIdResponse['rankRequest']>;
type RankRequestDifficulty = RankRequest['difficulties'][number];
type RankRequestStatus = RankRequest['approvalStatus'];
type RankRequestTab = 'leaderboard' | 'rank-request';

const activeRankRequestStatuses = new Set<RankRequestStatus>(['PENDING', 'QUALIFIED']);

function isActiveRankRequestStatus(status: RankRequestStatus) {
   return activeRankRequestStatuses.has(status);
}

function getRankRequestDifficulty(rankRequest: RankRequest, leaderboardId: number) {
   return rankRequest.difficulties.find((difficulty) => difficulty.leaderboard.id === leaderboardId);
}

function getRankRequestDisplayStatus(rankRequest: RankRequest, leaderboardId: number) {
   if (!isActiveRankRequestStatus(rankRequest.approvalStatus)) return rankRequest.approvalStatus;

   return getRankRequestDifficulty(rankRequest, leaderboardId)?.approvalStatus ?? rankRequest.approvalStatus;
}

// embed only copy for metadata; don't use in UI since it is not localized
function getRankRequestStatusLabel(status: RankRequestStatus) {
   switch (status) {
      case 'APPROVED':
         return 'Approved';
      case 'DENIED':
         return 'Denied';
      case 'REPLACED':
         return 'Replaced';
      case 'PENDING':
      case 'QUALIFIED':
         return 'In progress';
   }
}

function isActiveRankRequest(rankRequest?: RankRequest | null): rankRequest is RankRequest {
   return rankRequest != null && isActiveRankRequestStatus(rankRequest.approvalStatus);
}

function getActiveRankRequestLeaderboardIds(rankRequest?: RankRequest | null) {
   if (!isActiveRankRequest(rankRequest)) return new Set<number>();

   return new Set(rankRequest.difficulties.map((difficulty) => difficulty.leaderboard.id));
}

function getDefaultRankRequestLeaderboardId(rankRequest?: RankRequest | null) {
   const rankRequestLeaderboards =
      rankRequest?.difficulties.map((difficulty) => ({
         id: difficulty.leaderboard.id,
         difficulty: difficulty.leaderboard.difficulty.difficulty,
         rawDifficulty: difficulty.leaderboard.difficulty.rawDifficulty
      })) ?? [];

   if (rankRequestLeaderboards.length === 0) return null;

   return getDefaultLeaderboardId(rankRequestLeaderboards);
}

function getDefaultMapLeaderboardId(mapInfo: MapControllerGetMapByIdResponse, tab?: RankRequestTab) {
   if (tab === 'rank-request') {
      return getDefaultRankRequestLeaderboardId(mapInfo.rankRequest) ?? getDefaultLeaderboardId(mapInfo.leaderboards);
   }

   return getDefaultLeaderboardId(mapInfo.leaderboards);
}

function getRankRequestQualifyGate(
   rankRequest: RankRequest | null | undefined,
   { leaderboardId, selectedOnly = false, now }: { leaderboardId: number; selectedOnly?: boolean; now: number }
) {
   const targetDifficulties = rankRequest?.difficulties.filter((difficulty) => !selectedOnly || difficulty.leaderboard.id === leaderboardId) ?? [];
   const isLessThanMonthOld = rankRequest ? isRequestLessThanMonthOld(rankRequest.createdAt, now) : false;
   const missingRtVoteDiffs = targetDifficulties.filter((difficulty) => difficulty.rtVotes.upvotes < 3 || difficulty.rtVotes.downvotes > 0);
   const missingQatUpvoteDiffs = isLessThanMonthOld ? targetDifficulties.filter((difficulty) => difficulty.qatVotes.upvotes === 0) : [];

   return {
      targetDifficulties,
      isLessThanMonthOld,
      missingRtVoteDiffs,
      missingQatUpvoteDiffs,
      disabled: missingRtVoteDiffs.length > 0 || missingQatUpvoteDiffs.length > 0
   };
}

function isRequestLessThanMonthOld(createdAt: string, now: number) {
   const queuedForOneMonthAt = new Date(createdAt);
   queuedForOneMonthAt.setMonth(queuedForOneMonthAt.getMonth() + 1);
   return now < queuedForOneMonthAt.getTime();
}

export type { RankRequest, RankRequestDifficulty, RankRequestStatus };
export {
   getActiveRankRequestLeaderboardIds,
   getDefaultMapLeaderboardId,
   getDefaultRankRequestLeaderboardId,
   getRankRequestDifficulty,
   getRankRequestDisplayStatus,
   getRankRequestStatusLabel,
   getRankRequestQualifyGate,
   isActiveRankRequest
};
