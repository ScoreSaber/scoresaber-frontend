'use client';

import { type ReactNode } from 'react';

import { getRouteApi } from '@tanstack/react-router';
import { FaCheck, FaExchangeAlt, FaHourglassHalf, FaTimes, FaTrophy } from 'react-icons/fa';
import { useTranslations } from 'use-intl';

import { MapLeaderboardFilters } from './map-leaderboard-filters';
import type { LeaderboardScores, MapLeaderboardRouteName, MapLeaderboardTab, RankRequest } from './map-leaderboard-view-types';
import { MapRankRequestDetails } from './map-rank-request-details';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { MapDifficultySelection } from '@/modules/maps/detail/map-difficulty-selection';
import { MapGameModeSelection } from '@/modules/maps/detail/map-game-mode-selection';
import type { LeaderboardSearchParams } from '@/modules/maps/detail/map-leaderboard-view/map-leaderboard-view-types';
import { getRankRequestDisplayStatus } from '@/modules/rank-requests/lib/model';
import { LeaderboardScoresTable } from '@/modules/scores/leaderboard/leaderboard-scores-table';
import type { LeaderboardControllerGetLeaderboardByIdResponse, MapControllerGetMapByIdResponse } from '@/shared/api/generated/ApiParams';
import { Pagination } from '@/shared/components/pagination';
import { cn } from '@/shared/format/helpers';
import type { SearchParamsRecord } from '@/shared/url-state/search-params';
import { updateSearchParams } from '@/shared/url-state/update-search-params';

type RankRequestStatus = RankRequest['approvalStatus'];

const rankRequestStatusIcon: Record<RankRequestStatus, { icon: typeof FaCheck; className: string }> = {
   APPROVED: { icon: FaCheck, className: 'bg-status-success' },
   PENDING: { icon: FaHourglassHalf, className: 'bg-score-pp' },
   QUALIFIED: { icon: FaHourglassHalf, className: 'bg-score-pp' },
   DENIED: { icon: FaTimes, className: 'bg-destructive' },
   REPLACED: { icon: FaExchangeAlt, className: 'bg-score-pp' }
};

const tabLinkClass =
   '!h-7 w-8 cursor-pointer gap-1.5 border px-0 text-xs shadow-none md:!h-auto md:w-auto md:px-2.5 md:py-1.5 data-[state=active]:pointer-events-none data-[state=active]:border-transparent data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:border-border data-[state=inactive]:bg-secondary/35 data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-secondary/60 data-[state=inactive]:hover:text-foreground dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground';

const mapRoute = getRouteApi('/map/$id');
const mapDifficultyRoute = getRouteApi('/map/$id/difficulty/$leaderboardId');

export function MapLeaderboardContent({
   mapInfo,
   routeName,
   leaderboardInfo,
   leaderboardScores,
   search,
   currentPage,
   currentSearch,
   highlight,
   rankRequest,
   activeTab,
   activeGameMode,
   hasMultipleGameModes,
   userPermissions,
   renderHeaderActions,
   buildHref,
   parseSearch
}: MapLeaderboardContentProps) {
   const t = useTranslations();
   const tRR = useTranslations();
   const isUnrank = rankRequest?.requestType === 'UNRANK';

   function getTabSearch(tab: MapLeaderboardTab) {
      return parseSearch(
         updateSearchParams(search, {
            tab: tab === 'rank-request' ? 'rank-request' : undefined
         })
      );
   }

   if (!rankRequest) {
      return (
         <>
            <div className="flex items-center gap-1.5 overflow-x-auto md:overflow-visible">
               <DifficultyToolbar
                  mapInfo={mapInfo}
                  leaderboardInfo={leaderboardInfo}
                  hasMultipleGameModes={hasMultipleGameModes}
                  activeGameMode={activeGameMode}
                  search={search}
               />
               <Separator orientation="vertical" variant="gradient" size="toolbar" className="hidden md:block" />
               <MapLeaderboardFilters currentSearch={currentSearch} search={search} buildHref={buildHref} parseSearch={parseSearch} />
               <div className="ml-auto shrink-0">{renderHeaderActions(activeTab)}</div>
            </div>
            <Separator variant="fade" />
            <ScoresList
               leaderboardInfo={leaderboardInfo}
               leaderboardScores={leaderboardScores}
               currentPage={currentPage}
               highlight={highlight}
               search={search}
               buildHref={buildHref}
            />
         </>
      );
   }

   const rankRequestTabStatus = getRankRequestDisplayStatus(rankRequest, leaderboardInfo.id);

   return (
      <div className="flex flex-col gap-3">
         {/* toolbar: tabs + dropdowns */}
         <Separator variant="fade" className="md:hidden" />
         <div className="flex items-center gap-1.5 overflow-x-auto md:overflow-visible">
            <div className="shrink-0 md:order-1">
               <DifficultyToolbar
                  mapInfo={mapInfo}
                  leaderboardInfo={leaderboardInfo}
                  hasMultipleGameModes={hasMultipleGameModes}
                  activeGameMode={activeGameMode}
                  activeTab={activeTab}
                  search={search}
               />
            </div>
            <Separator orientation="vertical" variant="gradient" size="toolbar" className="hidden md:order-2 md:block" />
            <div className="text-muted-foreground flex w-fit shrink-0 flex-wrap items-center gap-1.5 bg-transparent md:order-3 md:w-auto md:justify-start">
               <MapTabLink
                  routeName={routeName}
                  mapId={mapInfo.id}
                  leaderboardId={leaderboardInfo.id}
                  search={getTabSearch('leaderboard')}
                  active={activeTab === 'leaderboard'}
                  ariaLabel={t('map.leaderboard')}
               >
                  <FaTrophy className="size-2.5" />
                  <span className="hidden md:inline">{t('map.leaderboard')}</span>
               </MapTabLink>
               <MapTabLink
                  routeName={routeName}
                  mapId={mapInfo.id}
                  leaderboardId={leaderboardInfo.id}
                  search={getTabSearch('rank-request')}
                  active={activeTab === 'rank-request'}
                  ariaLabel={isUnrank ? tRR('rankRequest.unrankRequest') : t('map.rankRequest')}
                  className={isUnrank ? 'data-[state=active]:text-destructive' : undefined}
               >
                  <RankRequestStatusIcon status={rankRequestTabStatus} />
                  <span className="hidden md:inline">{isUnrank ? tRR('rankRequest.unrankRequest') : t('map.rankRequest')}</span>
               </MapTabLink>
            </div>
            {activeTab !== 'rank-request' && (
               <>
                  <Separator orientation="vertical" variant="gradient" size="toolbar" className="md:order-4" />
                  <div className="shrink-0 md:order-5">
                     <MapLeaderboardFilters currentSearch={currentSearch} search={search} buildHref={buildHref} parseSearch={parseSearch} />
                  </div>
               </>
            )}
            <div className="ml-auto shrink-0 md:order-6">{renderHeaderActions(activeTab)}</div>
         </div>
         <Separator variant="fade" className="hidden md:block" />

         {activeTab === 'leaderboard' && (
            <div className="mt-0">
               <ScoresList
                  leaderboardInfo={leaderboardInfo}
                  leaderboardScores={leaderboardScores}
                  currentPage={currentPage}
                  highlight={highlight}
                  search={search}
                  buildHref={buildHref}
               />
            </div>
         )}

         {activeTab === 'rank-request' && (
            <div className="mt-0">
               <MapRankRequestDetails leaderboardInfo={leaderboardInfo} rankRequest={rankRequest} userPermissions={userPermissions} />
            </div>
         )}
      </div>
   );
}

function MapTabLink({
   routeName,
   mapId,
   leaderboardId,
   search,
   active,
   ariaLabel,
   className,
   children
}: {
   routeName: MapLeaderboardRouteName;
   mapId: number;
   leaderboardId: number;
   search: LeaderboardSearchParams | null;
   active: boolean;
   ariaLabel: string;
   className?: string;
   children: ReactNode;
}) {
   return (
      <Button asChild variant="filter" size="filter" data-state={active ? 'active' : 'inactive'} className={cn(tabLinkClass, className)}>
         {routeName === 'map' ? (
            <mapRoute.Link
               params={{ id: mapId }}
               search={search ?? { page: 1 }}
               resetScroll={false}
               aria-label={ariaLabel}
               aria-current={active ? 'page' : undefined}
            >
               {children}
            </mapRoute.Link>
         ) : (
            <mapDifficultyRoute.Link
               params={{ id: mapId, leaderboardId }}
               search={search ?? { page: 1 }}
               resetScroll={false}
               aria-label={ariaLabel}
               aria-current={active ? 'page' : undefined}
            >
               {children}
            </mapDifficultyRoute.Link>
         )}
      </Button>
   );
}

function RankRequestStatusIcon({ status }: { status: RankRequestStatus }) {
   const t = useTranslations();
   const config = rankRequestStatusIcon[status];
   const Icon = config.icon;
   const label =
      status === 'APPROVED'
         ? t('rankRequest.statusApproved')
         : status === 'DENIED'
           ? t('rankRequest.statusDenied')
           : status === 'REPLACED'
             ? t('rankRequest.statusReplaced')
             : t('rankRequest.statusInProgress');

   return (
      <Tooltip delayDuration={400}>
         <TooltipTrigger asChild>
            <span
               className={cn('inline-flex size-4 shrink-0 items-center justify-center rounded-full text-white', config.className)}
               aria-label={label}
            >
               <Icon className="size-2" />
            </span>
         </TooltipTrigger>
         <TooltipContent>{label}</TooltipContent>
      </Tooltip>
   );
}

function DifficultyToolbar({
   mapInfo,
   leaderboardInfo,
   hasMultipleGameModes,
   activeGameMode,
   activeTab,
   search
}: {
   mapInfo: MapControllerGetMapByIdResponse;
   leaderboardInfo: LeaderboardControllerGetLeaderboardByIdResponse;
   hasMultipleGameModes: boolean;
   activeGameMode: string;
   activeTab?: MapLeaderboardTab;
   search: LeaderboardSearchParams;
}) {
   const switchSearch: LeaderboardSearchParams = {
      search: search.search,
      scope: search.scope,
      pivot: search.pivot,
      tab: activeTab === 'rank-request' ? activeTab : search.tab
   };
   const linkSearchParams = Object.values(switchSearch).some((value) => value != null) ? switchSearch : undefined;

   return (
      <div className="flex min-w-0 items-center gap-1.5">
         <MapDifficultySelection
            mapInfo={mapInfo}
            activeLeaderboardId={leaderboardInfo.id}
            activeGameMode={activeGameMode}
            linkSearchParams={linkSearchParams}
            className="w-auto max-w-36 md:max-w-none"
         />
         {hasMultipleGameModes && <MapGameModeSelection mapInfo={mapInfo} activeGameMode={activeGameMode} linkSearchParams={linkSearchParams} />}
      </div>
   );
}

function ScoresList({
   leaderboardInfo,
   leaderboardScores,
   currentPage,
   highlight,
   search,
   buildHref
}: {
   leaderboardInfo: LeaderboardControllerGetLeaderboardByIdResponse;
   leaderboardScores: LeaderboardScores;
   currentPage: number;
   highlight?: number;
   search: LeaderboardSearchParams;
   buildHref: (search?: LeaderboardSearchParams) => string;
}) {
   const t = useTranslations();
   const isScoped = !!search.scope || !!search.search || !!search.pivot;

   if (!leaderboardScores || leaderboardScores.data.length === 0) {
      return (
         <div className="text-muted-foreground flex flex-col items-center gap-2 py-16">
            <FaTrophy className="size-8 opacity-20" />
            <p className="text-sm font-medium">{isScoped ? t('map.noScoresFound') : t('map.noScoresYet')}</p>
            <p className="text-xs opacity-60">{isScoped ? t('map.adjustFilters') : t('map.beFirstScore')}</p>
         </div>
      );
   }

   const getPageHref = (page: number) => buildHref(updateSearchParams(search, { page: page > 1 ? page : undefined }));

   return (
      <div className="flex flex-col gap-3">
         <LeaderboardScoresTable
            scores={leaderboardScores.data}
            leaderboard={leaderboardInfo}
            highlight={highlight}
            scopedPage={isScoped ? currentPage : undefined}
            scopedPageSize={isScoped ? leaderboardScores.metadata.itemsPerPage : undefined}
         />
         <div className="flex justify-center">
            <Pagination
               currentPage={currentPage}
               totalItems={leaderboardScores.metadata.totalItems}
               pageSize={leaderboardScores.metadata.itemsPerPage}
               getPageHref={getPageHref}
            />
         </div>
      </div>
   );
}

interface MapLeaderboardContentProps {
   mapInfo: MapControllerGetMapByIdResponse;
   routeName: MapLeaderboardRouteName;
   leaderboardInfo: LeaderboardControllerGetLeaderboardByIdResponse;
   leaderboardScores: LeaderboardScores;
   search: LeaderboardSearchParams;
   currentPage: number;
   currentSearch?: string;
   highlight?: number;
   rankRequest?: RankRequest | null;
   activeTab: MapLeaderboardTab;
   activeGameMode: string;
   hasMultipleGameModes: boolean;
   userPermissions: number;
   renderHeaderActions: (activeTab: MapLeaderboardTab) => ReactNode;
   buildHref: (search?: LeaderboardSearchParams) => string;
   parseSearch: (search: SearchParamsRecord) => LeaderboardSearchParams | null;
}
