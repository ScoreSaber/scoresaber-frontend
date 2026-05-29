import { createFileRoute } from '@tanstack/react-router';

import { buildMapLeaderboardHead, getMapLeaderboardPageData, leaderboardSearchSchema, MapLeaderboardRouteContent } from './-leaderboard';

import { validateRequest } from '@/shared/url-state/params';

export const Route = createFileRoute('/map/$id/')({
   validateSearch: (search) => validateRequest(leaderboardSearchSchema, search),
   loaderDeps: ({ search }) => search,
   loader: ({ params, deps, location }) =>
      getMapLeaderboardPageData({
         data: {
            routeName: 'map',
            mapId: params.id,
            search: deps,
            rawSearch: location.search
         }
      }),
   head: ({ loaderData }) => buildMapLeaderboardHead(loaderData, 'map'),
   component: MapRoute
});

function MapRoute() {
   const params = Route.useParams();
   const search = Route.useSearch();
   const data = Route.useLoaderData();

   return (
      <MapLeaderboardRouteContent
         input={{
            routeName: 'map',
            mapId: params.id,
            search,
            rawSearch: search
         }}
         data={data}
      />
   );
}
