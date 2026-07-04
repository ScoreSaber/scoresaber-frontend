'use client';

import { useEffect, useRef, useState } from 'react';

import { Loader2 } from 'lucide-react';

import type { MetricKey, PlayerChartStats } from '@/modules/player/chart/chart-types';
import type { PlayerControllerGetPlayerHistoryItem } from '@/shared/api/generated/ApiParams';
import { dynamic } from '@/shared/components/dynamic';

export function PlayerChartLazy({ playerId, stats, history, enabledMetrics }: PlayerChartLazyProps) {
   const containerRef = useRef<HTMLDivElement>(null);
   const [shouldLoad, setShouldLoad] = useState(false);

   useEffect(() => {
      if (shouldLoad) return;

      const container = containerRef.current;
      if (!container || !('IntersectionObserver' in window)) {
         setShouldLoad(true);
         return;
      }

      const observer = new IntersectionObserver(
         ([entry]) => {
            if (entry?.isIntersecting) {
               setShouldLoad(true);
               observer.disconnect();
            }
         },
         { rootMargin: '200px' }
      );

      observer.observe(container);

      return () => observer.disconnect();
   }, [shouldLoad]);

   return (
      <div ref={containerRef} className="min-h-100">
         {shouldLoad ? <PlayerChart playerId={playerId} stats={stats} history={history} enabledMetrics={enabledMetrics} /> : <ChartSkeleton />}
      </div>
   );
}

function ChartSkeleton() {
   return (
      <div className="flex min-h-100 items-center justify-center">
         <Loader2 className="text-muted-foreground/40 size-6 animate-spin" />
      </div>
   );
}

const PlayerChart = dynamic(() => import('@/modules/player/chart/player-chart').then((mod) => mod.PlayerChart), {
   ssr: false,
   loading: () => <ChartSkeleton />
});

type PlayerChartLazyProps = {
   playerId: string;
   stats: PlayerChartStats;
   history: PlayerControllerGetPlayerHistoryItem[];
   enabledMetrics?: MetricKey[];
};
