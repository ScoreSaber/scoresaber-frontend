import { createFileRoute, getRouteApi, redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';

import { parseLegacyRouteId } from '@/routes/(legacy)/-redirects';
import { api } from '@/shared/api/server-api';
import { optionalApiData } from '@/shared/result/api';

const mapRoute = getRouteApi('/map/$id');
const mapDifficultyRoute = getRouteApi('/map/$id/difficulty/$leaderboardId');
const rankRequestsRoute = getRouteApi('/ranking/requests');

const getRankRequestRedirect = createServerFn({ method: 'GET' })
   .inputValidator((data: { requestId?: string }) => data)
   .handler(async ({ data }) => {
      const id = parseLegacyRouteId(data.requestId);
      if (!id) return { name: 'rankRequests' } as const;

      const request = await optionalApiData(api.ranking.rankingControllerGetRequestById({ id }));
      if (!request) return { name: 'rankRequests' } as const;

      const leaderboard = request.difficulties[0]?.leaderboard;
      if (!leaderboard) return { name: 'map', id: request.map.id } as const;

      return { name: 'mapDifficulty', id: request.map.id, leaderboardId: leaderboard.id } as const;
   });

export const Route = createFileRoute('/ranking/request/$requestId')({
   loader: async ({ params }) => {
      const target = await getRankRequestRedirect({ data: { requestId: params.requestId } });

      if (target.name === 'rankRequests') {
         throw redirect({ to: rankRequestsRoute.id, search: { page: 1 }, statusCode: 301 });
      }

      if (target.name === 'map') {
         throw redirect({ to: mapRoute.id, params: { id: target.id }, search: { page: 1, tab: 'rank-request' }, statusCode: 301 });
      }

      throw redirect({
         to: mapDifficultyRoute.id,
         params: { id: target.id, leaderboardId: target.leaderboardId },
         search: { page: 1, tab: 'rank-request' },
         statusCode: 301
      });
   },
   component: RankingRequestRoute
});

function RankingRequestRoute() {
   return null;
}
