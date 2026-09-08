import { createFileRoute, linkOptions } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { useTranslations } from 'use-intl';
import { z } from 'zod';

import { Separator } from '@/components/ui/separator';

import { RankRequestCard } from '@/modules/rank-requests/rank-request-card';
import { RankRequestFilters } from '@/modules/rank-requests/rank-request-filters';
import { publicApi } from '@/shared/api/server-api';
import { PageError } from '@/shared/components/error/page-error';
import { Pagination } from '@/shared/components/pagination';
import { pageApiData } from '@/shared/result/api';
import { buildSeoHead } from '@/shared/seo/metadata';
import { isPageNumber } from '@/shared/url-state/params';
import { rankRequestFilterPreferences } from '@/shared/url-state/persisted-filter-preferences';
import { applyPersistedSearchParams } from '@/shared/url-state/persisted-search';
import type { SearchParamsRecord } from '@/shared/url-state/search-params';
import { normalizeSearchRecord } from '@/shared/url-state/search-serializer';
import { updateSearchParams } from '@/shared/url-state/update-search-params';
import { SetPageBackground } from '@/shell/background/page-background-provider';

const QUEUE_TOP_COUNT = 6;

const rankRequestsSearchSchema = z.object({
   page: isPageNumber,
   search: z.string().min(3).max(64).optional(),
   hideDownvoted: z
      .literal('true')
      .transform((): true => true)
      .optional()
});

type RankRequestsSearchParams = Partial<z.output<typeof rankRequestsSearchSchema>>;

type RankRequestsRouteInput = {
   search: RankRequestsSearchParams;
   rawSearch: SearchParamsRecord;
};

const getRankRequestsPageData = createServerFn({ method: 'GET' })
   .validator((data: RankRequestsRouteInput) => data)
   .handler(async ({ data }) => {
      const rawSearchParams = normalizeSearchRecord(data.rawSearch);
      const effectiveSearchParams = await applyPersistedSearchParams<RankRequestsSearchParams>({
         searchParams: rawSearchParams,
         parseSearch: parseRankRequestsSearch,
         storageKey: rankRequestFilterPreferences.storageKey,
         persistedKeys: rankRequestFilterPreferences.persistedKeys
      });
      const searchParams = rankRequestsSearchSchema.parse({ ...data.search, ...effectiveSearchParams });
      const result = await pageApiData(
         publicApi.ranking.rankingControllerGetRequests({
            page: searchParams.page,
            limit: 24
         })
      );

      if (!result.ok) return { result, searchParams, bgCover: null };

      const requests = searchParams.hideDownvoted
         ? result.data.data.filter((r) => r.totalRtVotes.downvotes === 0 && r.totalQatVotes.downvotes === 0)
         : result.data.data;
      const requestsWithCovers = requests.filter((r) => r.map.coverUrl);
      const bgCover = requestsWithCovers.length > 0 ? requestsWithCovers[Math.floor(Math.random() * requestsWithCovers.length)].map.coverUrl : null;

      return { result, searchParams, bgCover };
   });

export const Route = createFileRoute('/ranking/requests')({
   validateSearch: (search) => rankRequestsSearchSchema.parse(search),
   loaderDeps: ({ search }) => search,
   loader: ({ deps, location }) => getRankRequestsPageData({ data: { search: deps, rawSearch: location.search } }),
   head: () =>
      buildSeoHead({
         title: 'Rank Requests',
         description: 'Review ScoreSaber rank requests for Beat Saber maps',
         path: '/ranking/requests'
      }),
   component: RankRequestsRoute
});

function RankRequestsRoute() {
   const t = useTranslations('rankRequest');
   const data = Route.useLoaderData();
   const { result, searchParams, bgCover } = data;

   if (!result.ok) return <PageError status={result.status} />;

   const response = result.data;
   const requests = searchParams.hideDownvoted
      ? response.data.filter((r) => r.totalRtVotes.downvotes === 0 && r.totalQatVotes.downvotes === 0)
      : response.data;
   const meta = response.metadata;
   const isFirstPage = searchParams.page === 1;
   const topRequests = isFirstPage ? requests.slice(0, QUEUE_TOP_COUNT) : [];
   const restRequests = isFirstPage ? requests.slice(QUEUE_TOP_COUNT) : requests;
   const queueOffset = isFirstPage ? 0 : (searchParams.page - 1) * meta.itemsPerPage;
   const getPageLocation = (page: number) => buildRankRequestsLocation(updateSearchParams(searchParams, { page: page > 1 ? page : undefined }));

   return (
      <div className="relative flex-1 overflow-hidden">
         {bgCover && <SetPageBackground src={bgCover} />}

         <div className="app-container relative z-10 flex flex-col gap-4 p-4 md:p-8">
            <RankRequestFilters
               currentPage={searchParams.page}
               totalPages={meta.totalPages}
               currentHideDownvoted={searchParams.hideDownvoted}
               search={searchParams}
               buildLocation={buildRankRequestsLocation}
               parseSearch={parseRankRequestsSearch}
            />

            {topRequests.length > 0 && (
               <section className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                     <h2 className="text-score-pp text-sm font-semibold tracking-wide uppercase">{t('upNext')}</h2>
                     <Separator variant="fade" className="flex-1" />
                  </div>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                     {topRequests.map((request, idx) => (
                        <RankRequestCard key={request.id} request={request} queuePosition={idx + 1} />
                     ))}
                  </div>
               </section>
            )}

            {restRequests.length > 0 && (
               <section className="flex flex-col gap-2">
                  {topRequests.length > 0 && (
                     <div className="flex items-center gap-3 pt-2">
                        <h2 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">{t('openRequests')}</h2>
                        <Separator variant="fade" className="flex-1" />
                     </div>
                  )}
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                     {restRequests.map((request, idx) => (
                        <RankRequestCard key={request.id} request={request} queuePosition={queueOffset + topRequests.length + idx + 1} />
                     ))}
                  </div>
               </section>
            )}

            {requests.length === 0 && (
               <div className="text-muted-foreground flex flex-col items-center gap-2 py-16">
                  <p className="text-sm font-medium">{t('noRequestsFound')}</p>
               </div>
            )}

            {meta.totalPages > 1 && (
               <div className="flex justify-center">
                  <Pagination
                     currentPage={searchParams.page}
                     totalItems={meta.totalItems}
                     pageSize={meta.itemsPerPage}
                     getPageLocation={getPageLocation}
                     scroll={false}
                  />
               </div>
            )}
         </div>
      </div>
   );
}

function buildRankRequestsLocation(search?: RankRequestsSearchParams) {
   return linkOptions({ to: '/ranking/requests', search: normalizeRankRequestsLocationSearch(search) });
}

function normalizeRankRequestsLocationSearch(search?: RankRequestsSearchParams) {
   const { page = 1, ...rest } = search ?? {};
   return { page, ...rest };
}

function parseRankRequestsSearch(search: SearchParamsRecord) {
   return rankRequestsSearchSchema.safeParse({ page: 1, ...search }).data ?? null;
}
