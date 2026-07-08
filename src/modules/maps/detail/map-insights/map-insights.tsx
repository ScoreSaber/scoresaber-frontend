'use client';

import { useQuery } from '@tanstack/react-query';
import { CalendarClock, History } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { PlayStatsHeatmap } from './play-stats-heatmap';

import { Separator } from '@/components/ui/separator';

import { api } from '@/shared/api/ApiInstance';
import { Icons } from '@/shared/components/icons';
import { queryApiData } from '@/shared/result/api';

const MIN_PLAYS = 5;

interface MapInsightsProps {
   leaderboardId: number;
}

export function MapInsights({ leaderboardId }: MapInsightsProps) {
   const t = useTranslations();

   const { data, isLoading, isError } = useQuery({
      queryKey: ['leaderboardPlayStats', leaderboardId],
      queryFn: () => queryApiData(api.leaderboard.leaderboardControllerGetLeaderboardPlayStatsById({ id: leaderboardId }))
   });

   if (isLoading) {
      return (
         <div className="flex items-center justify-center py-20">
            <Icons.spinner className="text-muted-foreground size-6 animate-spin" />
         </div>
      );
   }

   if (isError) {
      return <p className="text-destructive py-20 text-center text-sm">{t('leaderboard.failedToLoad')}</p>;
   }

   if (!data || data.totalPlays < MIN_PLAYS) {
      return (
         <div className="text-muted-foreground flex flex-col items-center gap-2 py-20 text-center">
            <CalendarClock className="size-8 opacity-20" />
            <p className="text-sm font-medium">{t('map.insightsNoStats')}</p>
            <p className="text-xs opacity-60">{t('map.insightsNoStatsHint')}</p>
         </div>
      );
   }

   return (
      <div className="grid items-start gap-y-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] lg:gap-x-6">
         <section className="flex min-w-0 flex-col gap-4">
            <PlayStatsHeatmap stats={data} />
         </section>

         <section className="flex min-w-0 flex-col gap-4">
            <h2 className="text-muted-foreground text-xs font-semibold">{t('map.insightsTimeline')}</h2>
            <Separator />
            <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 py-12">
               <History className="size-8 opacity-20" />
               <p className="animate-pulse text-sm font-medium opacity-60">{t('map.insightsComingSoon')}</p>
            </div>
         </section>
      </div>
   );
}
