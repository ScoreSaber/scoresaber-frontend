'use client';

import { Loader2 } from 'lucide-react';

import type { PlayerChartStats } from '@/modules/player/chart/chart-types';
import type { PlayerControllerGetPlayerHistoryItem } from '@/shared/api/generated/ApiParams';
import { dynamic } from '@/shared/components/dynamic';

export function PlayerChartLazy({ playerId, stats, history }: PlayerChartLazyProps) {
   return (
      <div className="min-h-100">
         <PlayerChart playerId={playerId} stats={stats} history={history} />
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
};
