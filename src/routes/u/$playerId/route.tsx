import { useEffect } from 'react';

import { createFileRoute, linkOptions } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { FaTrophy } from 'react-icons/fa';
import { useTranslations } from 'use-intl';
import { z } from 'zod';

import { Separator } from '@/components/ui/separator';

import { readAuthCookie } from '@/modules/auth/actions/session.server';
import { PlayerChartLazy as PlayerChart } from '@/modules/player/chart/player-chart-lazy';
import { PlayerActions } from '@/modules/player/operations/player-actions';
import { PlayerBioSection } from '@/modules/player/profile/player-bio-section';
import { PlayerProfileHeader } from '@/modules/player/profile/player-profile-header';
import { PlayerScoresList } from '@/modules/player/profile/player-scores-list';
import { PlayerScoresToolbar } from '@/modules/player/profile/player-scores-toolbar';
import { versionedAvatarUrl } from '@/modules/player/shared/player-avatar';
import type { PlayerControllerGetPlayerScoresSort } from '@/shared/api/generated/ApiParams';
import { api, publicApi } from '@/shared/api/server-api';
import { NotFoundCard } from '@/shared/components/error/not-found-card';
import { PageError } from '@/shared/components/error/page-error';
import { formatAccuracy, formatNumber, formatPP } from '@/shared/format/helpers';
import { optionalApiData, pageApiData } from '@/shared/result/api';
import { hasRichTextContent, sanitizeRichTextHtml } from '@/shared/rich-text/server';
import { buildSeoHead } from '@/shared/seo/metadata';
import { isPageNumber, isPlayerId, isVanitySlug, ScoreEnum, validateRequest } from '@/shared/url-state/params';
import type { SearchParamsRecord } from '@/shared/url-state/search-params';
import { updateSearchParams } from '@/shared/url-state/update-search-params';
import { SetPageBackground } from '@/shell/background/page-background-provider';

const playerParamsSchema = z.object({
   playerId: z.string().refine((value) => isPlayerId.safeParse(value).success || isVanitySlug.safeParse(value.toLowerCase()).success)
});

const playerSearchSchema = z.object({
   sort: ScoreEnum.optional(),
   page: isPageNumber.optional(),
   search: z.string().min(3).max(64).optional()
});

type PlayerProfileSearch = SearchParamsRecord & {
   sort?: PlayerControllerGetPlayerScoresSort;
   page?: number;
   search?: string;
};

type PlayerProfileRouteInput = {
   playerId: string;
   search: PlayerProfileSearch;
};

type ParsePlayerSearch = (search: Record<string, unknown>) => PlayerProfileSearch | null;

const getPlayerProfilePageData = createServerFn({ method: 'GET' })
   .inputValidator((data: PlayerProfileRouteInput) => data)
   .handler(async ({ data }) => {
      const numericId = isPlayerId.safeParse(data.playerId);
      const token = readAuthCookie();
      const aliasApi = token ? api : publicApi;
      const playerResult = numericId.success
         ? await pageApiData(publicApi.player.playerControllerGetPlayer({ id: numericId.data.toString() }))
         : await pageApiData(publicApi.player.playerControllerGetPlayerByVanity({ slug: data.playerId.toLowerCase() }));

      if (!playerResult.ok) {
         return {
            result: playerResult,
            scores: null,
            history: null,
            aliases: [],
            sanitizedBio: '',
            hasBioContent: false
         };
      }

      const apiPlayerId = playerResult.data.id;
      const bio = playerResult.data.bio ?? '';
      const sanitizedBio = sanitizeRichTextHtml(bio);

      const [scores, history, aliases] = await Promise.all([
         optionalApiData(
            publicApi.player.playerControllerGetPlayerScores({
               id: apiPlayerId,
               limit: 8,
               page: data.search.page ?? 1,
               sort: data.search.sort ?? 'top',
               search: data.search.search
            })
         ),
         optionalApiData(publicApi.player.playerControllerGetPlayerHistory({ id: apiPlayerId })),
         optionalApiData(aliasApi.playerAlias.playerAliasControllerGetAliases({ id: apiPlayerId }))
      ]);

      return {
         result: playerResult,
         scores,
         history,
         aliases: aliases ?? [],
         sanitizedBio,
         hasBioContent: hasRichTextContent(sanitizedBio)
      };
   });

export const Route = createFileRoute('/u/$playerId')({
   params: {
      parse: (params) => validateRequest(playerParamsSchema, params)
   },
   validateSearch: (search) => validateRequest(playerSearchSchema, search),
   loaderDeps: ({ search }) => search,
   loader: ({ params, deps }) =>
      getPlayerProfilePageData({
         data: {
            playerId: params.playerId.toString(),
            search: deps
         }
      }),
   head: ({ loaderData }) => buildPlayerProfileHead(loaderData),
   notFoundComponent: () => <NotFoundCard titleKey="playerNotFound" descriptionKey="playerNotFoundDesc" />,
   component: PlayerRoute
});

function PlayerRoute() {
   const params = Route.useParams();
   const search = Route.useSearch();
   const data = Route.useLoaderData();

   return (
      <PlayerProfileRouteContent
         input={{
            playerId: params.playerId.toString(),
            search
         }}
         parseSearch={parsePlayerSearch}
         data={data}
      />
   );
}

function parsePlayerSearch(search: Record<string, unknown>) {
   return playerSearchSchema.safeParse({ page: 1, ...search }).data ?? null;
}

function PlayerProfileRouteContent({
   input,
   parseSearch,
   data
}: {
   input: PlayerProfileRouteInput;
   parseSearch: ParsePlayerSearch;
   data: Awaited<ReturnType<typeof getPlayerProfilePageData>>;
}) {
   const { result, scores, history, aliases, sanitizedBio, hasBioContent } = data;

   useVanityBrowserUrl(result.ok ? result.data.vanity : null);

   if (!result.ok) return <PageError status={result.status} />;

   const player = result.data;

   return (
      <div className="relative flex-1 overflow-hidden">
         <SetPageBackground src={player.avatar} />
         <div className="app-container relative z-10 p-4 md:p-8">
            <PlayerProfileHeader
               player={player}
               aliases={aliases}
               actions={
                  <PlayerActions playerId={player.id} playerBanned={player.banned} playerPermissions={player.permissions} playerRole={player.role} />
               }
            >
               {player.banned ? (
                  <div className="py-6 text-center">
                     <Separator variant="gradient" className="via-destructive/15 mb-4" />
                     <p className="text-muted-foreground text-sm">This player&apos;s profile is not available.</p>
                  </div>
               ) : null}

               {!player.banned && !player.inactive && history && history.length > 0 && (
                  <div className="py-4">
                     <Separator variant="gradient" className="mb-4" />
                     <PlayerChart
                        playerId={player.id}
                        stats={{
                           rank: player.stats.rank,
                           totalPP: player.stats.totalPP,
                           averageAccuracy: player.stats.averageAccuracy,
                           totalSubmittedPlays: player.stats.totalSubmittedPlays
                        }}
                        history={history}
                     />
                  </div>
               )}

               {!player.banned && (
                  <PlayerBioSection bio={player.bio ?? ''} sanitizedBio={sanitizedBio} hasBioContent={hasBioContent} playerId={player.id} />
               )}

               {!player.banned && scores && (
                  <PlayerScoresSection
                     playerId={input.playerId}
                     scores={scores}
                     page={input.search.page ?? 1}
                     sort={input.search.sort ?? 'top'}
                     search={input.search.search}
                     hasScores={player.stats.totalSubmittedPlays > 0}
                     hasContentAbove={!player.inactive || hasBioContent}
                     parseSearch={parseSearch}
                  />
               )}
            </PlayerProfileHeader>
         </div>
      </div>
   );
}

export function buildPlayerProfileHead(loaderData: Awaited<ReturnType<typeof getPlayerProfilePageData>> | undefined) {
   if (!loaderData?.result.ok) return playerProfileHead('Profile');

   const player = loaderData.result.data;
   const { stats } = player;
   const globalRank = `${String.fromCodePoint(0x1f30d)} #${formatNumber(stats.rank)} Global`;
   const countryRank = `${getFlagEmoji(player.country)} #${formatNumber(stats.countryRank)} ${player.country.toUpperCase()}`;

   return playerProfileHead(`${player.name}'s Profile`, {
      ogTitle: `${player.name}'s profile`,
      image: versionedAvatarUrl(player.avatar, player.avatarVersion),
      path: `/u/${player.id}`,
      noindex: player.banned,
      description: [
         `${globalRank} / ${countryRank}`,
         `Performance Points: ${formatPP(stats.totalPP)}pp`,
         `Average Ranked Accuracy: ${formatAccuracy(stats.averageAccuracy)}`,
         `Replay Views: ${formatNumber(stats.totalReplayViews)}`
      ].join('\n')
   });
}

function getFlagEmoji(countryCode: string) {
   return countryCode.toLowerCase().replace(/[a-z]/g, (char) => {
      const codePoint = char.codePointAt(0);
      return codePoint ? String.fromCodePoint(codePoint - 97 + 0x1f1e6) : '';
   });
}

function useVanityBrowserUrl(vanity: string | null) {
   useEffect(() => {
      if (!vanity) return;

      const nextPathname = `/u/${vanity}`;
      if (window.location.pathname === nextPathname) return;

      window.history.replaceState(window.history.state, '', `${nextPathname}${window.location.search}${window.location.hash}`);
   }, [vanity]);
}

function PlayerScoresSection({
   playerId,
   scores,
   page,
   sort,
   search,
   hasScores,
   hasContentAbove,
   parseSearch
}: {
   playerId: string;
   scores: NonNullable<Awaited<ReturnType<typeof getPlayerProfilePageData>>['scores']>;
   page: number;
   sort: PlayerControllerGetPlayerScoresSort;
   search?: string;
   hasScores: boolean;
   hasContentAbove: boolean;
   parseSearch: ParsePlayerSearch;
}) {
   const t = useTranslations();
   const currentSearch: PlayerProfileSearch = { sort, page, search };
   const buildLocation = (nextSearch?: Partial<PlayerProfileSearch>) => buildPlayerLocation(playerId, nextSearch);
   const getPageLocation = (nextPage: number) => buildLocation(updateSearchParams(currentSearch, { page: nextPage > 1 ? nextPage : undefined }));

   const hasNoScoresAtAll = !hasScores;

   return (
      <div className="pb-3">
         {hasContentAbove && <Separator variant="gradient" className="mb-4" />}
         {!hasNoScoresAtAll && (
            <div className="mb-4 flex justify-center">
               <PlayerScoresToolbar search={currentSearch} buildLocation={buildLocation} parseSearch={parseSearch} />
            </div>
         )}
         {scores.data.length > 0 ? (
            <PlayerScoresList
               playerScores={scores.data}
               totalItems={scores.metadata.totalItems}
               pageSize={scores.metadata.itemsPerPage}
               currentPage={page}
               getPageLocation={getPageLocation}
            />
         ) : (
            <div className="text-muted-foreground flex flex-col items-center gap-2 py-16">
               <FaTrophy className="size-8 opacity-20" />
               <p className="text-sm font-medium">{hasNoScoresAtAll ? t('player.noScoresYet') : t('player.noScoresFound')}</p>
               <p className="text-xs opacity-60">{hasNoScoresAtAll ? t('player.noScoresYetDesc') : t('player.adjustSearch')}</p>
            </div>
         )}
      </div>
   );
}

function buildPlayerLocation(playerId: string, search?: Partial<PlayerProfileSearch>) {
   return linkOptions({ to: '/u/$playerId', params: { playerId }, search: normalizePlayerLocationSearch(search) });
}

function normalizePlayerLocationSearch(search?: Partial<PlayerProfileSearch>) {
   const { sort = 'top', page = 1, ...rest } = search ?? {};
   return {
      sort: sort === 'top' ? undefined : sort,
      page: page > 1 ? page : undefined,
      ...rest
   };
}

function playerProfileHead(
   title: string,
   options: {
      ogTitle?: string;
      description?: string;
      image?: string;
      path?: string;
      noindex?: boolean;
   } = {}
) {
   return buildSeoHead({
      title,
      description: options.description,
      path: options.path,
      image: options.image,
      imageAlt: options.ogTitle ?? title,
      twitterCard: 'summary',
      noindex: options.noindex
   });
}
