import { useMemo } from 'react';

import { createFileRoute, redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { useTranslations } from 'use-intl';
import { z } from 'zod';

import type { HomeNewsFeed } from '@/modules/home/actions/news';
import { getHomeNewsFeed } from '@/modules/home/actions/news.server';
import { BeatSaberPageBackground } from '@/modules/home/beat-saber-background';
import { HeroSection } from '@/modules/home/hero-section';
import { HomeColumn, HomeColumnLink } from '@/modules/home/home-column';
import { HOME_BANNER_SRC, HOME_TRENDING_MAP_SEARCH, TOP_PLAYER_COUNT, TRENDING_MAP_COUNT } from '@/modules/home/home-constants';
import { InstallSection } from '@/modules/home/install-section';
import { NewsColumn, NewsSocialLinks } from '@/modules/home/news-column';
import { RankedBatchSection } from '@/modules/home/ranked-batch-section';
import { TopPlayersColumn } from '@/modules/home/top-players-column';
import { TrendingMapsColumn } from '@/modules/home/trending-maps-column';
import type { MapControllerGetMapListingsDataItem, PlayerControllerGetPlayersDataItem } from '@/shared/api/generated/ApiParams';
import { api } from '@/shared/api/server-api';
import { optionalApi } from '@/shared/result/api';
import { buildSeoHead } from '@/shared/seo/metadata';
import { SetPageBackground } from '@/shell/background/page-background-provider';

const homeSearchSchema = z.object({
   accountMergeChallengeId: z.preprocess((val) => (Array.isArray(val) ? val[0] : val), z.string().optional())
});

type HomePageData = {
   topPlayers: PlayerControllerGetPlayersDataItem[];
   trendingMaps: MapControllerGetMapListingsDataItem[];
   news: HomeNewsFeed;
};

const getHomePageData = createServerFn({ method: 'GET' }).handler(async (): Promise<HomePageData> => {
   const [playersResponse, mapsResponse, news] = await Promise.all([
      optionalApi(
         api.player
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
         api.map
            .mapControllerGetMapListings({
               page: HOME_TRENDING_MAP_SEARCH.page,
               limit: TRENDING_MAP_COUNT,
               status: [HOME_TRENDING_MAP_SEARCH.status],
               verified: HOME_TRENDING_MAP_SEARCH.verified,
               sortBy: HOME_TRENDING_MAP_SEARCH.sortBy,
               sortDirection: HOME_TRENDING_MAP_SEARCH.sortDirection
            })
            .then((response) => response.data)
      ),
      getHomeNewsFeed()
   ]);

   return {
      topPlayers: playersResponse?.data ?? [],
      trendingMaps: mapsResponse?.data ?? [],
      news
   };
});

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
   head: () =>
      buildSeoHead({
         title: 'Home',
         description: 'The original leaderboard system for Beat Saber custom songs, built for competitive players worldwide',
         path: '/',
         image: HOME_BANNER_SRC,
         twitterCard: 'summary_large_image'
      }),
   component: HomeRoute
});

function HomeRoute() {
   const data = Route.useLoaderData();
   const t = useTranslations('home');
   const bgCandidates = useMemo(() => [HOME_BANNER_SRC, ...data.trendingMaps.map((map) => map.coverUrl).filter(Boolean)], [data.trendingMaps]);

   return (
      <div className="dark bg-background text-foreground relative flex-1 overflow-hidden">
         <SetPageBackground src={HOME_BANNER_SRC} candidates={bgCandidates} />
         <BeatSaberPageBackground />

         <HeroSection />

         <div className="relative z-10 mx-auto flex w-full max-w-[1180px] flex-col gap-14 px-4 pt-0 pb-16 sm:px-6 lg:px-10">
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

            <section>
               <RankedBatchSection video={data.news.latestRankedBatchVideo} />
            </section>

            <InstallSection />
         </div>
      </div>
   );
}
