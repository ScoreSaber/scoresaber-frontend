import { createServerFn } from '@tanstack/react-start';

import { api } from '@/shared/api/server-api';
import { actionResultVoid } from '@/shared/result/action';

const approveRequestFn = createServerFn({ method: 'POST' })
   .validator((data: { requestId: number; leaderboardId?: number }) => data)
   .handler(({ data }) => actionResultVoid(api.ranking.rankingControllerApprove({ id: data.requestId }, { leaderboardId: data.leaderboardId })));

export async function approveRequest(requestId: number, leaderboardId?: number) {
   return approveRequestFn({ data: { requestId, leaderboardId } });
}
