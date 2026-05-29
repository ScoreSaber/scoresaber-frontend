import { createFileRoute, getRouteApi, redirect } from '@tanstack/react-router';
import { z } from 'zod';

const mapsRoute = getRouteApi('/maps');
const settingsConnectionsRoute = getRouteApi('/settings/connections');

const homeSearchSchema = z.object({
   accountMergeChallengeId: z.preprocess((val) => (Array.isArray(val) ? val[0] : val), z.string().optional())
});

export const Route = createFileRoute('/')({
   validateSearch: (search) => homeSearchSchema.parse(search),
   loaderDeps: ({ search }) => search,
   loader: ({ deps }) => {
      if (deps.accountMergeChallengeId) {
         throw redirect({ to: settingsConnectionsRoute.id, search: { accountMergeChallengeId: deps.accountMergeChallengeId } });
      }

      throw redirect({ to: mapsRoute.id, search: { page: 1, verified: 'true' } });
   }
});
