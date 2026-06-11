import { createFileRoute, redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';

import { legacyLeaderboardSearchParams, parseLegacyRouteId } from '../-redirects';

import { api } from '@/shared/api/server-api';
import { optionalApiData } from '@/shared/result/api';

const getLegacyLeaderboardRedirect = createServerFn({ method: 'GET' })
   .inputValidator((data: { leaderboardId?: string; search: Record<string, unknown> }) => data)
   .handler(async ({ data }) => {
      const id = parseLegacyRouteId(data.leaderboardId);
      if (!id) return { name: 'maps' } as const;

      const leaderboard = await optionalApiData(api.leaderboard.leaderboardControllerGetLeaderboardById({ id }));
      if (!leaderboard) return { name: 'maps' } as const;

      return {
         name: 'mapDifficulty',
         id: leaderboard.map.id,
         leaderboardId: leaderboard.id,
         search: legacyLeaderboardSearchParams(data.search)
      } as const;
   });

export const Route = createFileRoute('/(legacy)/leaderboard/$leaderboardId')({
   validateSearch: (search) => search,
   loaderDeps: ({ search }) => search,
   loader: async ({ params, deps }) => {
      const target = await getLegacyLeaderboardRedirect({ data: { leaderboardId: params.leaderboardId, search: deps } });

      if (target.name === 'maps') {
         throw redirect({ to: '/maps', search: { page: 1, verified: 'true' }, statusCode: 308 });
      }

      throw redirect({
         to: '/map/$id/difficulty/$leaderboardId',
         params: { id: target.id, leaderboardId: target.leaderboardId },
         search: { page: 1, ...target.search },
         statusCode: 308
      });
   }
});
