import { createFileRoute, redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { useTranslations } from 'use-intl';
import { z } from 'zod';

import type { HomeBswcPromo } from '@/modules/home/actions/bswc';
import { getHomeBswcPromo } from '@/modules/home/actions/bswc.server';
import type { HomeNewsFeed } from '@/modules/home/actions/news';
import { getHomeNewsFeed } from '@/modules/home/actions/news.server';
import { BeatSaberPageBackground } from '@/modules/home/beat-saber-background';
import { BswcPromoSection } from '@/modules/home/bswc-promo-section';
import { HeroSection } from '@/modules/home/hero-section';
import { HomeColumn, HomeColumnLink } from '@/modules/home/home-column';
import { HOME_TRENDING_MAP_SEARCH, TOP_PLAYER_COUNT, TRENDING_MAP_COUNT } from '@/modules/home/home-constants';
import { InstallSection } from '@/modules/home/install-section';
import { NewsColumn, NewsSocialLinks } from '@/modules/home/news-column';
import { RankedBatchSection } from '@/modules/home/ranked-batch-section';
import { TopPlayersColumn } from '@/modules/home/top-players-column';
import { TrendingMapsColumn } from '@/modules/home/trending-maps-column';
import type { MapControllerGetMapListingsDataItem, PlayerControllerGetPlayersDataItem } from '@/shared/api/generated/ApiParams';
import { publicApi } from '@/shared/api/server-api';
import { optionalApi } from '@/shared/result/api';
import { buildSeoHead } from '@/shared/seo/metadata';

const optionalSearchString = z.preprocess((val) => (Array.isArray(val) ? val[0] : val), z.string().optional());
const BSWC_PROMO_PRIORITY_WINDOW_MS = 24 * 60 * 60 * 1000;
const HOME_AGGREGATES_CACHE_MS = 60 * 1000;
const HOME_AGGREGATES_RETRY_MS = 15 * 1000;

const homeSearchSchema = z.object({
   accountMergeChallengeId: optionalSearchString,
   bswcLive: optionalSearchString
});

type HomePageData = {
   topPlayers: PlayerControllerGetPlayersDataItem[];
   trendingMaps: MapControllerGetMapListingsDataItem[];
   news: HomeNewsFeed;
   bswc: HomeBswcPromo | null;
   prioritizeBswc: boolean;
};

type HomeAggregates = Pick<HomePageData, 'topPlayers' | 'trendingMaps'>;

let cachedHomeAggregates: { expiresAt: number; data: HomeAggregates } | null = null;
let pendingHomeAggregatesRefresh: Promise<HomeAggregates> | null = null;

const getHomePageData = createServerFn({ method: 'GET' }).handler(async (): Promise<HomePageData> => {
   const [aggregates, news, bswc] = await Promise.all([getHomeAggregates(), getHomeNewsFeed(), getHomeBswcPromo()]);

   return {
      ...aggregates,
      news,
      bswc,
      prioritizeBswc:
         bswc?.liveMatch != null || (bswc?.nextMatch != null && Date.parse(bswc.nextMatch.startsAt) <= Date.now() + BSWC_PROMO_PRIORITY_WINDOW_MS)
   };
});

async function getHomeAggregates() {
   if (cachedHomeAggregates && cachedHomeAggregates.expiresAt > Date.now()) return cachedHomeAggregates.data;

   if (!pendingHomeAggregatesRefresh) {
      pendingHomeAggregatesRefresh = refreshHomeAggregates().finally(() => {
         pendingHomeAggregatesRefresh = null;
      });
   }

   // retain stale data during refresh, but let the first request populate the page normally
   return cachedHomeAggregates?.data ?? pendingHomeAggregatesRefresh;
}

async function refreshHomeAggregates(): Promise<HomeAggregates> {
   const [playersResponse, mapsResponse] = await Promise.all([
      optionalApi(
         publicApi.player
            .playerControllerGetPlayers({
               page: 1,
               limit: TOP_PLAYER_COUNT,
               includeInactive: 'false',
               sort: 'rank',
               sortDirection: 'asc'
            })
            .then((response) => response.data)
      ),
      optionalApi(
         publicApi.map
            .mapControllerGetMapListings({
               page: 1,
               limit: TRENDING_MAP_COUNT,
               status: [HOME_TRENDING_MAP_SEARCH.status],
               verified: 'true',
               sortBy: HOME_TRENDING_MAP_SEARCH.sortBy,
               sortDirection: HOME_TRENDING_MAP_SEARCH.sortDirection
            })
            .then((response) => response.data)
      )
   ]);
   const data = {
      topPlayers: playersResponse?.data ?? [],
      trendingMaps: mapsResponse?.data ?? []
   };

   cachedHomeAggregates = {
      expiresAt: Date.now() + (playersResponse || mapsResponse ? HOME_AGGREGATES_CACHE_MS : HOME_AGGREGATES_RETRY_MS),
      data
   };

   return data;
}

export const Route = createFileRoute('/')({
   validateSearch: (search) => homeSearchSchema.parse(search),
   loaderDeps: ({ search }) => search,
   loader: ({ deps }) => {
      if (deps.accountMergeChallengeId) {
         throw redirect({ to: '/settings/connections', search: { accountMergeChallengeId: deps.accountMergeChallengeId } });
      }

      return getHomePageData();
   },
   staleTime: 60 * 1000,
   head: () => {
      const head = buildSeoHead({
         title: 'Home',
         description: 'The original leaderboard system for Beat Saber custom songs, built for competitive players worldwide',
         path: '/'
      });

      // X rejects video CDN requests that include a non-X referer
      return {
         ...head,
         meta: [...head.meta, { name: 'referrer', content: 'no-referrer' }]
      };
   },
   component: HomeRoute
});

function HomeRoute() {
   const data = Route.useLoaderData();
   const search = Route.useSearch();
   const t = useTranslations('home');
   const previewBswcLive = search.bswcLive === '1';
   const showBswcFirst = previewBswcLive || data.prioritizeBswc;

   return (
      <div className="dark bg-background text-foreground relative flex-1 overflow-hidden">
         <BeatSaberPageBackground />

         <HeroSection />

         <div className="relative z-10 mx-auto flex w-full max-w-[1180px] flex-col gap-14 px-4 pt-0 pb-16 sm:px-6 lg:px-10">
            {showBswcFirst && (
               <section>
                  <BswcPromoSection promo={data.bswc} previewLive={previewBswcLive} />
               </section>
            )}

            <section className="grid items-stretch gap-4 lg:grid-cols-[minmax(18rem,1.45fr)_minmax(0,1fr)_minmax(19rem,1.08fr)]">
               <HomeColumn title={t('sections.news')} action={<NewsSocialLinks />}>
                  <NewsColumn posts={data.news.posts} />
               </HomeColumn>

               <HomeColumn
                  title={t('sections.topPlayers')}
                  action={
                     <HomeColumnLink to="/rankings" search={{ page: 1 }}>
                        {t('sections.rankings')}
                     </HomeColumnLink>
                  }
               >
                  <TopPlayersColumn players={data.topPlayers} />
               </HomeColumn>

               <HomeColumn
                  title={t('sections.trendingMaps')}
                  action={
                     <HomeColumnLink to="/maps" search={HOME_TRENDING_MAP_SEARCH}>
                        {t('sections.browse')}
                     </HomeColumnLink>
                  }
               >
                  <TrendingMapsColumn maps={data.trendingMaps} />
               </HomeColumn>
            </section>

            {!showBswcFirst && (
               <section>
                  <BswcPromoSection promo={data.bswc} previewLive={previewBswcLive} />
               </section>
            )}

            <section>
               <RankedBatchSection video={data.news.latestRankedBatchVideo} />
            </section>

            <InstallSection />
         </div>
      </div>
   );
}
