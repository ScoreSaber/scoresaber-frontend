import '@tanstack/react-start/server-only';

import { Result, TaggedError } from 'better-result';
import * as z from 'zod';

const GITHUB_REPO = 'ScoreSaber/quest-mod';
const RELEASES_URL = `https://api.github.com/repos/${GITHUB_REPO}/releases`;

const githubAssetSchema = z.object({
   id: z.number(),
   name: z.string(),
   size: z.number(),
   content_type: z.string(),
   browser_download_url: z.url()
});

const githubReleaseSchema = z.object({
   id: z.number(),
   tag_name: z.string(),
   name: z.string().nullable().optional(),
   body: z.string().nullable().optional(),
   draft: z.boolean(),
   prerelease: z.boolean(),
   published_at: z.string().nullable().optional(),
   html_url: z.url(),
   assets: z.array(githubAssetSchema)
});

const githubReleasesSchema = z.array(githubReleaseSchema);

export type QuestRelease = {
   tag: string;
   modVersion: string;
   bsGameVersion: string;
   qmodAssetId: number;
   qmodAssetUrl: string;
   qmodSize: number;
   publishedAt: string | null;
   prerelease: boolean;
   changelog: string;
   htmlUrl: string;
};

const BS_MARKER = /<!--\s*bs:\s*([^\s>][^>]*?)\s*-->/i;

export class QuestReleasesError extends TaggedError('QuestReleasesError')<{
   message: string;
   status: number | null;
   cause: unknown;
}>() {}

export function fetchQuestReleases() {
   return Result.tryPromise({
      try: async () => {
         const headers: Record<string, string> = {
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28'
         };
         if (process.env.GITHUB_TOKEN) {
            headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
         }

         const response = await fetch(RELEASES_URL, {
            headers
         });

         if (!response.ok) {
            throw new QuestReleasesError({
               message: `github releases fetch failed: ${response.status}`,
               status: response.status,
               cause: null
            });
         }

         const releases = githubReleasesSchema.parse(await response.json());

         return releases
            .filter((r) => !r.draft)
            .flatMap((release) => {
               const bsGameVersion = release.body?.match(BS_MARKER)?.[1]?.trim() ?? null;
               const qmodAsset = release.assets.find((a) => a.name.toLowerCase().endsWith('.qmod'));
               if (!bsGameVersion || !qmodAsset) return [];

               return [
                  {
                     tag: release.tag_name,
                     modVersion: release.tag_name.replace(/^v/i, ''),
                     bsGameVersion,
                     qmodAssetId: qmodAsset.id,
                     qmodAssetUrl: qmodAsset.browser_download_url,
                     qmodSize: qmodAsset.size,
                     publishedAt: release.published_at ?? null,
                     prerelease: release.prerelease,
                     changelog: release.body?.replace(BS_MARKER, '').trim() ?? '',
                     htmlUrl: release.html_url
                  }
               ];
            });
      },
      catch: (cause) =>
         cause instanceof QuestReleasesError
            ? cause
            : new QuestReleasesError({
                 message: cause instanceof Error ? cause.message : 'failed to load releases',
                 status: null,
                 cause
              })
   });
}
