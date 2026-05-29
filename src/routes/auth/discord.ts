import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { handleDiscordLogin } from './-oauth';

import { AUTH_CONTROLLER_DISCORD_LOGIN_INTENT } from '@/shared/api/generated/ApiParams';

const searchParamString = z.preprocess((val) => (Array.isArray(val) ? val[0] : val), z.string().optional());

const discordLoginSearchSchema = z.object({
   intent: z.preprocess((val) => (Array.isArray(val) ? val[0] : val), z.enum(AUTH_CONTROLLER_DISCORD_LOGIN_INTENT).default('link').catch('link')),
   redirectTo: searchParamString
});

export const Route = createFileRoute('/auth/discord')({
   server: {
      handlers: {
         GET: ({ request }) => handleDiscordLogin(discordLoginSearchSchema.parse(Object.fromEntries(new URL(request.url).searchParams)))
      }
   }
});
