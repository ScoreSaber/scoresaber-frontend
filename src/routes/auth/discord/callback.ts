import { createFileRoute } from '@tanstack/react-router';

import { handleDiscordCallback } from '../-oauth';
export const Route = createFileRoute('/auth/discord/callback')({
   server: {
      handlers: {
         GET: ({ request }) => handleDiscordCallback(request)
      }
   }
});
