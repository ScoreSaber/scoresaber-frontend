import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { handleDiscordLogin } from './-oauth';

import { AUTH_CONTROLLER_DISCORD_LOGIN_INTENT } from '@/shared/api/generated/ApiParams';
import { optionalSearchParamString, searchParam } from '@/shared/url-state/params';

const discordLoginSearchSchema = z.object({
   intent: searchParam(z.enum(AUTH_CONTROLLER_DISCORD_LOGIN_INTENT).default('link').catch('link')),
   redirectTo: optionalSearchParamString
});

export const Route = createFileRoute('/auth/discord')({
   validateSearch: (search) => discordLoginSearchSchema.parse(search),
   server: {
      handlers: {
         GET: ({ request }) => handleDiscordLogin(discordLoginSearchSchema.parse(Object.fromEntries(new URL(request.url).searchParams)))
      }
   }
});
