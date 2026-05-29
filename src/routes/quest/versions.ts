import { createFileRoute } from '@tanstack/react-router';
import { Result } from 'better-result';

import { fetchQuestReleases } from '@/modules/quest/lib/releases';

export const Route = createFileRoute('/quest/versions')({
   server: {
      handlers: {
         GET: () => listQuestVersions()
      }
   }
});

async function listQuestVersions() {
   const result = await fetchQuestReleases();
   return Result.match(result, {
      ok: (releases): Response =>
         Response.json(
            { releases },
            {
               headers: {
                  'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600'
               }
            }
         ),
      err: (): Response => Response.json({ error: 'failed to load quest releases' }, { status: 502 })
   });
}
