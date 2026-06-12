import { createFileRoute, redirect } from '@tanstack/react-router';

import { legacyLeaderboardsSearchParams } from './-redirects';

export const Route = createFileRoute('/(legacy)/leaderboards')({
   validateSearch: (search) => search,
   loaderDeps: ({ search }) => search,
   loader: ({ deps }) => {
      const search = legacyLeaderboardsSearchParams(deps);
      throw redirect({ to: '/maps', search: { ...search, page: search.page && search.page > 1 ? search.page : undefined }, statusCode: 308 });
   }
});
