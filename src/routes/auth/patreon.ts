import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { handlePatreonLogin } from './-oauth';

import { AUTH_CONTROLLER_PATREON_LOGIN_INTENT } from '@/shared/api/generated/ApiParams';
import { optionalSearchParamString, searchParam } from '@/shared/url-state/params';

const patreonLoginSearchSchema = z.object({
   intent: searchParam(z.enum(AUTH_CONTROLLER_PATREON_LOGIN_INTENT).default('link').catch('link')),
   redirectTo: optionalSearchParamString
});

export const Route = createFileRoute('/auth/patreon')({
   validateSearch: (search) => patreonLoginSearchSchema.parse(search),
   server: {
      handlers: {
         GET: ({ request }) => handlePatreonLogin(patreonLoginSearchSchema.parse(Object.fromEntries(new URL(request.url).searchParams)))
      }
   }
});
