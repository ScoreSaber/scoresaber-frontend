import { createServerFn } from '@tanstack/react-start';

import { api } from '@/shared/api/server-api';
import { actionResultVoid } from '@/shared/result/action';

const qualifyRequestFn = createServerFn({ method: 'POST' })
   .validator((data: { requestId: number; leaderboardId?: number }) => data)
   .handler(({ data }) => actionResultVoid(api.ranking.rankingControllerQualify({ id: data.requestId }, { leaderboardId: data.leaderboardId })));

const denyRequestFn = createServerFn({ method: 'POST' })
   .validator((data: { requestId: number; leaderboardId?: number }) => data)
   .handler(({ data }) => actionResultVoid(api.ranking.rankingControllerDeny({ id: data.requestId }, { leaderboardId: data.leaderboardId })));

const replaceRankRequestFn = createServerFn({ method: 'POST' })
   .validator((data: { requestId: number; mapId: number; description: string; leaderboardIds: number[] }) => data)
   .handler(({ data }) =>
      actionResultVoid(
         api.ranking.rankingControllerReplaceRequest(
            { id: data.requestId },
            { mapId: data.mapId, description: data.description, leaderboardIds: data.leaderboardIds }
         )
      )
   );

export async function qualifyRequest(requestId: number, leaderboardId?: number) {
   return qualifyRequestFn({ data: { requestId, leaderboardId } });
}

export async function denyRequest(requestId: number, leaderboardId?: number) {
   return denyRequestFn({ data: { requestId, leaderboardId } });
}

export async function replaceRankRequest(requestId: number, mapId: number, description: string, leaderboardIds: number[]) {
   return replaceRankRequestFn({ data: { requestId, mapId, description, leaderboardIds } });
}
