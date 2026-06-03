'use client';

import { useEffect, useState, useTransition } from 'react';

import { useRouter } from '@tanstack/react-router';
import { FaChartLine, FaChevronDown, FaCircle, FaGavel, FaMusic, FaStar } from 'react-icons/fa';
import { useTranslations } from 'use-intl';
import { z } from 'zod';

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import type { LeaderboardSearchParams } from '@/modules/maps/detail/map-leaderboard-view/map-leaderboard-view-types';
import { getDisplayLeaderboards } from '@/modules/maps/map-leaderboards';
import { getActiveRankRequestLeaderboardIds } from '@/modules/rank-requests/lib/model';
import type { MapControllerGetMapByIdResponse } from '@/shared/api/generated/ApiParams';
import { Icons } from '@/shared/components/icons';
import { cn, formatNumber } from '@/shared/format/helpers';
import { getDifficultyLabel } from '@/shared/format/strings';
import { getDifficultyTextClass, getDifficultyTintClass } from '@/shared/format/styling';

const selectLeaderboardId = z.coerce.number().int().gt(0);

interface DifficultyItem {
   id: number;
   difficulty: number;
   totalScores?: number;
   dailyScores?: number;
   realm?: {
      leaderboardStatus: string;
      stars: number;
   };
}

interface MapDifficultySelectionProps {
   mapInfo: MapControllerGetMapByIdResponse;
   activeLeaderboardId: number;
   activeGameMode: string;
   linkSearchParams?: LeaderboardSearchParams;
   className?: string;
}

type MapTranslator = ReturnType<typeof useTranslations<'map'>>;

export function MapDifficultySelection({ mapInfo, activeLeaderboardId, activeGameMode, linkSearchParams, className }: MapDifficultySelectionProps) {
   const t = useTranslations('map');
   const router = useRouter();
   const [pendingId, setPendingId] = useState<number>(activeLeaderboardId);
   const [, startTransition] = useTransition();

   const sortedItems: DifficultyItem[] = getDisplayLeaderboards(mapInfo.leaderboards, activeGameMode);
   const activeItem = sortedItems.find((item) => item.id === activeLeaderboardId) ?? sortedItems[0];
   const activeRankRequestLeaderboardIds = getActiveRankRequestLeaderboardIds(mapInfo.rankRequest);

   useEffect(() => {
      setPendingId(activeLeaderboardId);
   }, [activeLeaderboardId]);

   const isLoading = pendingId !== activeLeaderboardId;
   const linkSearch = { ...linkSearchParams, page: linkSearchParams?.page ?? 1 };

   function preloadLeaderboard(leaderboardId: number) {
      void router.preloadRoute({
         to: '/map/$id/difficulty/$leaderboardId',
         params: { id: mapInfo.id, leaderboardId },
         search: linkSearch
      });
   }

   function handleOpenChange(open: boolean) {
      if (!open) return;

      for (const item of sortedItems) {
         if (item.id !== activeLeaderboardId) preloadLeaderboard(item.id);
      }
   }

   function handleValueChange(value: string) {
      const result = selectLeaderboardId.safeParse(value);
      if (!result.success || result.data === activeLeaderboardId) return;

      setPendingId(result.data);
      startTransition(() => {
         void router.navigate({
            to: '/map/$id/difficulty/$leaderboardId',
            params: { id: mapInfo.id, leaderboardId: result.data },
            search: linkSearch
         });
      });
   }

   return (
      <Select value={String(activeLeaderboardId)} onValueChange={handleValueChange} onOpenChange={handleOpenChange} disabled={isLoading}>
         <SelectTrigger
            size="compact"
            className={cn(
               'min-w-0 select-none shadow-none [&_svg.lucide-chevron-down]:hidden',
               getDifficultyTintClass(activeItem.difficulty),
               className
            )}
         >
            <span className="grid min-w-0 flex-1 grid-cols-[1fr_auto] items-center">
               <span className="col-start-1 row-start-1 flex min-w-0 items-center gap-1.5">
                  <DifficultyItemContent
                     item={activeItem}
                     isActive
                     hasActiveRankRequest={activeRankRequestLeaderboardIds.has(activeItem.id)}
                     t={t}
                     tooltipCursorClass="cursor-default"
                     scoreStatsClassName="hidden md:flex"
                  />
               </span>
               <span className="col-start-2 row-start-1 ml-1.5">
                  {isLoading ? <Icons.spinner className="size-3 animate-spin" /> : <FaChevronDown className="size-2.5 shrink-0 opacity-70" />}
               </span>
            </span>
         </SelectTrigger>
         <SelectContent position="popper" align="start">
            <SelectGroup>
               <SelectLabel>{t('difficulty')}</SelectLabel>
               {sortedItems.map((item) => {
                  const isActive = item.id === activeLeaderboardId;

                  return (
                     <SelectItem
                        key={item.id}
                        value={String(item.id)}
                        textValue={getDifficultyLabel(item.difficulty)}
                        onPointerMove={() => !isActive && preloadLeaderboard(item.id)}
                        onFocus={() => !isActive && preloadLeaderboard(item.id)}
                        className="cursor-pointer"
                     >
                        <DifficultyItemContent
                           item={item}
                           isActive={isActive}
                           hasActiveRankRequest={activeRankRequestLeaderboardIds.has(item.id)}
                           t={t}
                        />
                     </SelectItem>
                  );
               })}
            </SelectGroup>
         </SelectContent>
      </Select>
   );
}

function DifficultyItemContent({
   item,
   isActive,
   hasActiveRankRequest,
   t,
   tooltipCursorClass,
   starsClassName,
   scoreStatsClassName,
   showStats = true
}: {
   item: DifficultyItem;
   isActive: boolean;
   hasActiveRankRequest: boolean;
   t: MapTranslator;
   tooltipCursorClass?: string;
   starsClassName?: string;
   scoreStatsClassName?: string;
   showStats?: boolean;
}) {
   const isRanked = item.realm?.leaderboardStatus === 'RANKED';
   const hasStars = isRanked && (item.realm?.stars ?? 0) > 0;

   return (
      <>
         <FaCircle className={cn('size-1.5 shrink-0', getDifficultyTextClass(item.difficulty))} />
         <span className="text-xs">{getDifficultyLabel(item.difficulty)}</span>
         {hasActiveRankRequest && (
            <Tooltip delayDuration={500}>
               <TooltipTrigger asChild>
                  <span className={cn('text-link flex items-center', tooltipCursorClass)} aria-label={t('activeRankRequest')}>
                     <FaGavel className="size-2.5" />
                  </span>
               </TooltipTrigger>
               <TooltipContent>{t('activeRankRequest')}</TooltipContent>
            </Tooltip>
         )}

         {showStats && item.totalScores != null && (
            <span className={cn('ml-auto flex items-center gap-2', isActive ? 'text-foreground/70' : 'text-muted-foreground/60')}>
               {hasStars && (
                  <span className={cn('flex items-center gap-0.5', starsClassName)}>
                     <FaStar className="size-2" />
                     <span className="text-[10px]">{item.realm!.stars.toFixed(2)}</span>
                  </span>
               )}
               <Tooltip delayDuration={1200}>
                  <TooltipTrigger asChild>
                     <span className={cn('flex items-center gap-0.5', scoreStatsClassName, tooltipCursorClass)}>
                        <FaMusic className="size-2" />
                        <span className="text-[10px]">{formatNumber(item.totalScores)}</span>
                     </span>
                  </TooltipTrigger>
                  <TooltipContent>{t('totalScores')}</TooltipContent>
               </Tooltip>
               {(item.dailyScores ?? 0) > 0 && (
                  <Tooltip delayDuration={1200}>
                     <TooltipTrigger asChild>
                        <span className={cn('flex items-center gap-0.5', scoreStatsClassName, tooltipCursorClass)}>
                           <FaChartLine className="size-2" />
                           <span className="text-[10px]">+{formatNumber(item.dailyScores!)}</span>
                        </span>
                     </TooltipTrigger>
                     <TooltipContent>{t('scoresToday')}</TooltipContent>
                  </Tooltip>
               )}
            </span>
         )}
      </>
   );
}
