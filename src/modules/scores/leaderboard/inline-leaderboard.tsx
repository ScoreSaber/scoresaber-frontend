'use client';

import { useEffect, useRef, useState } from 'react';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';

import { LeaderboardScoresTable } from '@/modules/scores/leaderboard/leaderboard-scores-table';
import { api } from '@/shared/api/ApiInstance';
import type { LeaderboardControllerGetLeaderboardByIdResponse } from '@/shared/api/generated/ApiParams';
import { Icons } from '@/shared/components/icons';
import { rankToPage } from '@/shared/format/helpers';
import { queryApiData } from '@/shared/result/api';

const mapDifficultyRoute = getRouteApi('/map/$id/difficulty/$leaderboardId');

interface InlineLeaderboardProps {
   leaderboardId: number;
   leaderboard: LeaderboardControllerGetLeaderboardByIdResponse;
   mapId: number;
   playerRank: number;
   playerScoreId: number;
   onReadyAction?: () => void;
   unstyled?: boolean;
}

const PAGE_SIZE = 6;

export function InlineLeaderboard({
   leaderboardId,
   leaderboard,
   mapId,
   playerRank,
   playerScoreId,
   onReadyAction,
   unstyled = false
}: InlineLeaderboardProps) {
   const t = useTranslations();
   const initialPage = rankToPage(playerRank, PAGE_SIZE);
   const [page, setPage] = useState(initialPage);
   const containerRef = useRef<HTMLDivElement>(null);
   const readyFiredRef = useRef(false);

   const { data, isLoading, isError, isPlaceholderData } = useQuery({
      queryKey: ['inlineLeaderboard', leaderboardId, page],
      queryFn: () =>
         queryApiData(
            api.leaderboard.leaderboardControllerGetLeaderboardScoresById({
               id: leaderboardId,
               page,
               limit: PAGE_SIZE
            })
         ),
      placeholderData: keepPreviousData
   });

   const scores = data?.data ?? null;
   const totalPages = data?.metadata.totalPages ?? 1;

   // notify parent when first load completes
   useEffect(() => {
      if (!isLoading && !readyFiredRef.current) {
         readyFiredRef.current = true;
         onReadyAction?.();
      }
   }, [isLoading]);

   function handlePageChange(newPage: number) {
      setPage(newPage);
   }

   return (
      <div ref={containerRef} className={unstyled ? undefined : 'bg-secondary/30 rounded border p-3'}>
         {isLoading && !scores ? (
            <div className="flex items-center justify-center py-8">
               <Icons.spinner className="text-muted-foreground size-6 animate-spin" />
            </div>
         ) : isError ? (
            <p className="text-destructive py-4 text-center text-sm">{t('leaderboard.failedToLoad')}</p>
         ) : scores && scores.length > 0 ? (
            <div className={isPlaceholderData ? 'pointer-events-none opacity-50 transition-opacity' : 'transition-opacity'}>
               <LeaderboardScoresTable scores={scores} leaderboard={leaderboard} highlight={playerScoreId} showHistory={false} />
               <div className="mt-2 flex items-center justify-center gap-2">
                  {totalPages > 1 && (
                     <>
                        <Button
                           variant="secondary"
                           size="icon-sm"
                           disabled={page <= 1 || isPlaceholderData}
                           onClick={() => handlePageChange(page - 1)}
                           className="cursor-pointer"
                        >
                           <ChevronLeft data-icon />
                        </Button>
                        <span className="text-muted-foreground text-sm tabular-nums">
                           {page} / {totalPages}
                        </span>
                        <Button
                           variant="secondary"
                           size="icon-sm"
                           disabled={page >= totalPages || isPlaceholderData}
                           onClick={() => handlePageChange(page + 1)}
                           className="cursor-pointer"
                        >
                           <ChevronRight data-icon />
                        </Button>
                     </>
                  )}
                  <mapDifficultyRoute.Link
                     params={{ id: mapId, leaderboardId }}
                     search={{
                        page: rankToPage(playerRank, 12),
                        highlight: playerScoreId
                     }}
                     className="text-muted-foreground hover:text-foreground ml-auto inline-flex cursor-pointer items-center gap-1 text-xs transition-colors"
                  >
                     {t('leaderboard.viewFullLeaderboard')}
                     <ExternalLink className="size-3" />
                  </mapDifficultyRoute.Link>
               </div>
            </div>
         ) : (
            <p className="text-muted-foreground py-4 text-center text-sm">{t('leaderboard.noScoresFound')}</p>
         )}
      </div>
   );
}
