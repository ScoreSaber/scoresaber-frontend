import '@tanstack/react-start/server-only';

import { Result, TaggedError } from 'better-result';
import * as z from 'zod';

import { createGithubJsonFetcher } from '@/shared/result/github';

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

class QuestReleasesError extends TaggedError('QuestReleasesError')<{
   message: string;
   status: number | null;
   cause: unknown;
}>() {}

const fetchGithubReleases = createGithubJsonFetcher(
   RELEASES_URL,
   githubReleasesSchema,
   ({ message, status, cause }) => new QuestReleasesError({ message, status, cause }),
   'github releases fetch'
);

export async function fetchQuestReleases() {
   const result = await fetchGithubReleases();
   return Result.map(result, toQuestReleases);
}

function toQuestReleases(releases: z.infer<typeof githubReleasesSchema>) {
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
}
