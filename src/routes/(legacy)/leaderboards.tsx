import { createFileRoute, redirect } from '@tanstack/react-router';

import { legacyLeaderboardsSearchParams } from './-redirects';

export const Route = createFileRoute('/(legacy)/leaderboards')({
   validateSearch: (search) => search,
   loaderDeps: ({ search }) => search,
   loader: ({ deps }) => {
      const search = legacyLeaderboardsSearchParams(deps);
      throw redirect({ to: '/maps', search: { ...search, page: search.page ?? 1, verified: search.verified ?? 'true' }, statusCode: 308 });
   }
});
