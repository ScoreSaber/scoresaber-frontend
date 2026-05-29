import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { buildMapLeaderboardHead, getMapLeaderboardPageData, leaderboardSearchSchema, MapLeaderboardRouteContent } from '../../-leaderboard';

import { isNumber, validateRequest } from '@/shared/url-state/params';

const mapDifficultyParamsSchema = z.object({
   id: isNumber,
   leaderboardId: isNumber
});

export const Route = createFileRoute('/map/$id/difficulty/$leaderboardId')({
   params: {
      parse: (params) => validateRequest(mapDifficultyParamsSchema, params)
   },
   validateSearch: (search) => validateRequest(leaderboardSearchSchema, search),
   loaderDeps: ({ search }) => search,
   loader: ({ params, deps, location }) =>
      getMapLeaderboardPageData({
         data: {
            routeName: 'mapDifficulty',
            mapId: params.id,
            leaderboardId: params.leaderboardId,
            search: deps,
            rawSearch: location.search
         }
      }),
   head: ({ loaderData }) => buildMapLeaderboardHead(loaderData, 'mapDifficulty'),
   component: MapDifficultyRoute
});

function MapDifficultyRoute() {
   const params = Route.useParams();
   const search = Route.useSearch();
   const data = Route.useLoaderData();

   return (
      <MapLeaderboardRouteContent
         input={{
            routeName: 'mapDifficulty',
            mapId: params.id,
            leaderboardId: params.leaderboardId,
            search,
            rawSearch: search
         }}
         data={data}
      />
   );
}
