import { createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';

const homeSearchSchema = z.object({
   accountMergeChallengeId: z.preprocess((val) => (Array.isArray(val) ? val[0] : val), z.string().optional())
});

export const Route = createFileRoute('/')({
   validateSearch: (search) => homeSearchSchema.parse(search),
   loaderDeps: ({ search }) => search,
   loader: ({ deps }) => {
      if (deps.accountMergeChallengeId) {
         throw redirect({ to: '/settings/connections', search: { accountMergeChallengeId: deps.accountMergeChallengeId } });
      }

      throw redirect({ to: '/maps', search: { page: 1, verified: 'true' } });
   }
});
