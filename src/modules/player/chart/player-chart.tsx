'use client';

import { Chart as ChartJS, Filler, Legend, LinearScale, LineController, LineElement, PointElement, Tooltip } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTranslations } from 'use-intl';

import { PlayerChartContext } from './player-chart-context';
import { PlayerChartControls } from './player-chart-controls';
import { PlayerChartStats } from './player-chart-stats';

import type { MetricKey, PlayerChartStats as PlayerChartStatsType } from '@/modules/player/chart/chart-types';
import { usePlayerChart } from '@/modules/player/chart/use-player-chart';
import { DenyahSkeletonOverlay } from '@/modules/player/denyah/denyah-skeleton-overlay';
import type { PlayerControllerGetPlayerHistoryItem } from '@/shared/api/generated/ApiParams';
import { getChartTooltipColors, getLineChartBaseOptions } from '@/shared/components/chart/chart-options';
import { ChartShell } from '@/shared/components/chart/chart-shell';

ChartJS.register(LineController, LinearScale, PointElement, LineElement, Tooltip, Filler, Legend);
ChartJS.defaults.plugins.tooltip.enabled = true;

type PlayerChartProps = {
   playerId: string;
   stats: PlayerChartStatsType;
   history: PlayerControllerGetPlayerHistoryItem[];
   enabledMetrics?: MetricKey[];
};

export function PlayerChart({ playerId, stats, history, enabledMetrics }: PlayerChartProps) {
   const t = useTranslations();
   const chart = usePlayerChart(playerId, stats, history, enabledMetrics);

   return (
      <PlayerChartContext.Provider value={chart}>
         <div className="animate-in fade-in flex flex-col gap-3 duration-300">
            <PlayerChartControls />

            <PlayerChartStats />

            <noscript>
               <style>{`#rank-chart { display: none; }`}</style>
               <div className="bg-card flex justify-center rounded-lg border p-8">
                  <div className="text-muted-foreground text-center">
                     <div className="mb-2 text-3xl">📈</div>
                     <p>{t('player.chartNoJs')}</p>
                     <p className="mt-1 text-sm opacity-70">{t('player.chartEnableJs')}</p>
                  </div>
               </div>
            </noscript>

            <ChartShell id="rank-chart" className="h-72 p-4 shadow-xs">
               <div ref={chart.denyahOverlayRef} className="pointer-events-none absolute top-0 right-0 bottom-0 left-0 z-0" />
               <DenyahSkeletonOverlay
                  rankHistory={chart.sortedHistory}
                  showEyes={chart.activeMetrics.has('rank')}
                  faceOverlayRef={chart.denyahOverlayRef}
               />
               <div
                  ref={chart.pulseRef}
                  className="pointer-events-none absolute z-10"
                  style={{ display: 'none', transform: 'translate(-50%, -50%)' }}
               >
                  <span
                     className="animate-pulse-ring absolute -top-3 -left-3 h-6 w-6 rounded-full"
                     style={{ borderColor: chart.primaryColor, borderWidth: 2 }}
                  />
               </div>
               <Line
                  data={{ labels: chart.labels, datasets: chart.datasets }}
                  plugins={[chart.nowPulsePlugin]}
                  options={{
                     ...getLineChartBaseOptions(),
                     scales: chart.scales,
                     plugins: {
                        title: { display: false },
                        legend: { display: false },
                        tooltip: {
                           enabled: true,
                           ...getChartTooltipColors(chart.chartColors),
                           displayColors: true,
                           callbacks: chart.tooltipCallbacks
                        }
                     }
                  }}
               />
            </ChartShell>
         </div>
      </PlayerChartContext.Provider>
   );
}
