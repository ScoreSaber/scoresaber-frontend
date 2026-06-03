import { createFileRoute } from '@tanstack/react-router';
import { Result } from 'better-result';

import { fetchQuestReleases, type QuestRelease } from '@/modules/quest/lib/releases';

export const Route = createFileRoute('/quest/download')({
   server: {
      handlers: {
         GET: ({ request }) => downloadQuestRelease(request)
      }
   }
});

async function downloadQuestRelease(request: Request) {
   const tag = new URL(request.url).searchParams.get('tag');
   if (!tag) {
      return Response.json({ error: 'missing tag' }, { status: 400 });
   }

   const releasesResult = await fetchQuestReleases();
   return Result.match(releasesResult, {
      ok: (releases) => streamReleaseAsset(releases, tag),
      err: async () => Response.json({ error: 'failed to load releases' }, { status: 502 })
   });
}

async function streamReleaseAsset(releases: QuestRelease[], tag: string) {
   const release = releases.find((r) => r.tag === tag) ?? null;
   if (!release) {
      return Response.json({ error: 'unknown release tag' }, { status: 404 });
   }

   const assetResult = await Result.tryPromise(() =>
      fetch(release.qmodAssetUrl, {
         cache: 'no-store',
         redirect: 'follow'
      })
   );
   if (Result.isError(assetResult)) {
      return Response.json({ error: 'failed to fetch release asset' }, { status: 502 });
   }

   const assetResponse = assetResult.value;
   if (!assetResponse.ok || !assetResponse.body) {
      return Response.json({ error: 'failed to fetch release asset' }, { status: 502 });
   }

   return new Response(assetResponse.body, {
      status: 200,
      headers: {
         'Content-Type': 'application/octet-stream',
         'Content-Length': assetResponse.headers.get('content-length') ?? '',
         'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400'
      }
   });
}
