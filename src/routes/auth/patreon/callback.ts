import { createFileRoute } from '@tanstack/react-router';

import { handlePatreonCallback } from '../-oauth';
export const Route = createFileRoute('/auth/patreon/callback')({
   server: {
      handlers: {
         GET: ({ request }) => handlePatreonCallback(request)
      }
   }
});
