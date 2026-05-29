import { createServerFn } from '@tanstack/react-start';

import { api } from '@/shared/api/server-api';
import { actionResultVoid } from '@/shared/result/action';

const rankLeaderboardFn = createServerFn({ method: 'POST' })
   .inputValidator((data: { leaderboardId: number; maxPP: number }) => data)
   .handler(({ data }) =>
      actionResultVoid(api.adminLeaderboard.adminLeaderboardControllerRankLeaderboard({ id: data.leaderboardId }, { maxPP: data.maxPP }))
   );

const unrankLeaderboardFn = createServerFn({ method: 'POST' })
   .inputValidator((leaderboardId: number) => leaderboardId)
   .handler(({ data }) => actionResultVoid(api.adminLeaderboard.adminLeaderboardControllerUnrankLeaderboard({ id: data })));

const qualifyLeaderboardFn = createServerFn({ method: 'POST' })
   .inputValidator((leaderboardId: number) => leaderboardId)
   .handler(({ data }) => actionResultVoid(api.adminLeaderboard.adminLeaderboardControllerQualifyLeaderboard({ id: data })));

const loveLeaderboardFn = createServerFn({ method: 'POST' })
   .inputValidator((leaderboardId: number) => leaderboardId)
   .handler(({ data }) => actionResultVoid(api.adminLeaderboard.adminLeaderboardControllerLoveLeaderboard({ id: data })));

const recalculatePPFn = createServerFn({ method: 'POST' })
   .inputValidator((leaderboardId: number) => leaderboardId)
   .handler(({ data }) => actionResultVoid(api.adminLeaderboard.adminLeaderboardControllerRecalculatePP({ id: data })));

const setManualPPFn = createServerFn({ method: 'POST' })
   .inputValidator((data: { leaderboardId: number; maxPP: number }) => data)
   .handler(({ data }) =>
      actionResultVoid(api.adminLeaderboard.adminLeaderboardControllerSetManualPP({ id: data.leaderboardId }, { maxPP: data.maxPP }))
   );

export async function rankLeaderboard(leaderboardId: number, maxPP: number) {
   return rankLeaderboardFn({ data: { leaderboardId, maxPP } });
}

export async function unrankLeaderboard(leaderboardId: number) {
   return unrankLeaderboardFn({ data: leaderboardId });
}

export async function qualifyLeaderboard(leaderboardId: number) {
   return qualifyLeaderboardFn({ data: leaderboardId });
}

export async function loveLeaderboard(leaderboardId: number) {
   return loveLeaderboardFn({ data: leaderboardId });
}

export async function recalculatePP(leaderboardId: number) {
   return recalculatePPFn({ data: leaderboardId });
}

export async function setManualPP(leaderboardId: number, maxPP: number) {
   return setManualPPFn({ data: { leaderboardId, maxPP } });
}
