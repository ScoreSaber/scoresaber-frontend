import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { handleSteamLogin } from './-oauth';

import { AUTH_CONTROLLER_STEAM_LOGIN_INTENT } from '@/shared/api/generated/ApiParams';

const searchParamString = z.preprocess((val) => (Array.isArray(val) ? val[0] : val), z.string().optional());

const steamLoginSearchSchema = z.object({
   intent: z.preprocess((val) => (Array.isArray(val) ? val[0] : val), z.enum(AUTH_CONTROLLER_STEAM_LOGIN_INTENT).default('login').catch('login')),
   returnUrl: searchParamString,
   redirectTo: searchParamString
});

export const Route = createFileRoute('/auth/steam')({
   server: {
      handlers: {
         GET: ({ request }) => handleSteamLogin(request, steamLoginSearchSchema.parse(Object.fromEntries(new URL(request.url).searchParams)))
      }
   }
});
