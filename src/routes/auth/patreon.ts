import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { handlePatreonLogin } from './-oauth';

import { AUTH_CONTROLLER_PATREON_LOGIN_INTENT } from '@/shared/api/generated/ApiParams';

const searchParamString = z.preprocess((val) => (Array.isArray(val) ? val[0] : val), z.string().optional());

const patreonLoginSearchSchema = z.object({
   intent: z.preprocess((val) => (Array.isArray(val) ? val[0] : val), z.enum(AUTH_CONTROLLER_PATREON_LOGIN_INTENT).default('link').catch('link')),
   redirectTo: searchParamString
});

export const Route = createFileRoute('/auth/patreon')({
   validateSearch: (search) => patreonLoginSearchSchema.parse(search),
   server: {
      handlers: {
         GET: ({ request }) => handlePatreonLogin(patreonLoginSearchSchema.parse(Object.fromEntries(new URL(request.url).searchParams)))
      }
   }
});
