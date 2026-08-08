import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { handleSteamLogin } from './-oauth';

import { AUTH_CONTROLLER_STEAM_LOGIN_INTENT } from '@/shared/api/generated/ApiParams';
import { optionalSearchParamString, searchParam } from '@/shared/url-state/params';

const steamLoginSearchSchema = z.object({
   intent: searchParam(z.enum(AUTH_CONTROLLER_STEAM_LOGIN_INTENT).default('login').catch('login')),
   returnUrl: optionalSearchParamString,
   redirectTo: optionalSearchParamString
});

export const Route = createFileRoute('/auth/steam')({
   validateSearch: (search) => steamLoginSearchSchema.parse(search),
   server: {
      handlers: {
         GET: ({ request }) => handleSteamLogin(request, steamLoginSearchSchema.parse(Object.fromEntries(new URL(request.url).searchParams)))
      }
   }
});
