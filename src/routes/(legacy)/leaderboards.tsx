import { createFileRoute, getRouteApi, redirect } from '@tanstack/react-router';

import { legacyLeaderboardsSearchParams } from './-redirects';

const mapsRoute = getRouteApi('/maps');

export const Route = createFileRoute('/(legacy)/leaderboards')({
   validateSearch: (search) => search,
   loaderDeps: ({ search }) => search,
   loader: ({ deps }) => {
      const search = legacyLeaderboardsSearchParams(deps);
      throw redirect({ to: mapsRoute.id, search: { ...search, page: search.page ?? 1, verified: search.verified ?? 'true' }, statusCode: 308 });
   }
});
