'use client';

import { type ReactNode, type TouchEvent as ReactTouchEvent, useEffect, useRef, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { Bomb, Grid3X3, Loader2, Scissors, Target, Zap } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { HandAccuracyRing } from './hand-accuracy-ring';
import { HitScoreValue } from './hit-score-value';

import { Button } from '@/components/ui/button';

import { api } from '@/shared/api/ApiInstance';
import type { ScoreControllerGetScoreStatsResponse } from '@/shared/api/generated/ApiParams';
import { dynamic } from '@/shared/components/dynamic';
import { Stat } from '@/shared/components/stat';
import { cn, formatNumber } from '@/shared/format/helpers';
import { queryApiData } from '@/shared/result/api';

export function ScoreStatsDetail({ scoreId, fullCombo, onLoadedAction }: ScoreStatsDetailProps) {
   const t = useTranslations();
   const [chartView, setChartView] = useState<ChartView>('basic');
   const chartSwipeRef = useRef<HTMLDivElement>(null);
   const touchStartRef = useRef<{ x: number; y: number; locked: boolean } | null>(null);
   const {
      data: stats,
      isLoading,
      isError
   } = useQuery({
      queryKey: ['scoreStats', scoreId],
      queryFn: () => queryApiData(api.score.scoreControllerGetScoreStats({ id: scoreId }))
   });

   useEffect(() => {
      if (stats) {
         requestAnimationFrame(() => onLoadedAction?.());
      }
   }, [stats]);

   useEffect(() => {
      const chartSwipe = chartSwipeRef.current;
      if (!chartSwipe) return;

      const handleTouchMove = (event: globalThis.TouchEvent) => {
         const start = touchStartRef.current;
         const touch = event.touches[0];
         if (!start || !touch) return;

         const deltaX = touch.clientX - start.x;
         const deltaY = touch.clientY - start.y;
         const isHorizontalSwipe = Math.abs(deltaX) > SWIPE_LOCK_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY) * 0.75;

         if (start.locked || isHorizontalSwipe) {
            start.locked = true;
            event.preventDefault();
         }
      };

      chartSwipe.addEventListener('touchmove', handleTouchMove, { passive: false });
      return () => chartSwipe.removeEventListener('touchmove', handleTouchMove);
   }, []);

   if (isLoading) {
      return (
         <div className="flex min-h-32 items-center justify-center">
            <Loader2 className="text-muted-foreground/40 size-6 animate-spin" />
         </div>
      );
   }

   if (isError || !stats) return null;

   const accuracyContent = <ScoreAccuracyOverview stats={stats} fullCombo={fullCombo} />;
   const basicChart = stats.scoreGraph.length > 0 ? <ScoreAccuracyChart scoreGraph={stats.scoreGraph} endTime={stats.endTime} /> : null;
   const timelineChart = <ScoreAccuracyTimelineChart timeline={stats.accuracyTimeline} />;
   const distributionChart = <ScoreAccuracyDistributionChart distribution={stats.accuracyDistribution} />;
   const desktopCharts = [chartPage('basic', basicChart), chartPage('advanced', timelineChart)].filter((chart) => chart.chart != null);
   const mobileCharts = [chartPage('basic', basicChart), chartPage('advanced', timelineChart), chartPage('distribution', distributionChart)].filter(
      (chart) => chart.chart != null
   );

   const handleTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
      const touch = event.touches[0];
      touchStartRef.current = touch ? { x: touch.clientX, y: touch.clientY, locked: false } : null;
   };

   const handleTouchEnd = (event: ReactTouchEvent<HTMLDivElement>) => {
      const endX = event.changedTouches[0]?.clientX;
      const start = touchStartRef.current;
      if (!start || endX == null) return;

      const delta = endX - start.x;
      if (Math.abs(delta) >= SWIPE_THRESHOLD) {
         const currentPage = CHART_VIEWS.indexOf(chartView);
         const nextPage = delta < 0 ? Math.min(currentPage + 1, CHART_VIEWS.length - 1) : Math.max(currentPage - 1, 0);
         setChartView(CHART_VIEWS[nextPage]);
      }
      touchStartRef.current = null;
   };

   const chartSwitcher = (views: readonly ChartView[]) => {
      const activeIndex = Math.max(0, views.indexOf(chartView));

      return (
         <div className="mt-3 flex items-center justify-center">
            <div className="relative flex h-8 items-center">
               <span
                  className="absolute top-0 left-0 z-0 flex size-8 items-center justify-center transition-transform duration-300 ease-out"
                  style={{ transform: `translateX(${activeIndex * 2}rem)` }}
               >
                  <span className="bg-foreground size-2 rounded-full" />
               </span>
               {views.map((view) => (
                  <Button
                     key={view}
                     type="button"
                     variant="ghost"
                     size="icon-xs"
                     className="relative z-10 size-8 cursor-pointer rounded-full p-0 hover:bg-transparent active:scale-[0.96]"
                     aria-label={t('score.showStatsPage', {
                        page: view === 'basic' ? t('score.basicPage') : view === 'advanced' ? t('score.advancedPage') : t('score.distributionPage')
                     })}
                     onClick={() => setChartView(view)}
                  >
                     <span
                        className={cn(
                           'bg-muted-foreground/35 size-1.5 rounded-full transition-[opacity,scale] duration-300 ease-out',
                           chartView === view && 'scale-0 opacity-0'
                        )}
                     />
                  </Button>
               ))}
            </div>
         </div>
      );
   };

   return (
      <div className="animate-in fade-in flex flex-col gap-3 duration-300">
         {accuracyContent}

         <div className="hidden gap-3 lg:grid lg:grid-cols-2">
            <div>
               <ChartPageStack activeView={chartView} charts={desktopCharts} />
               {chartSwitcher(['basic', 'advanced'])}
            </div>
            {distributionChart}
         </div>

         <div
            ref={chartSwipeRef}
            className="flex touch-pan-y flex-col gap-3 overscroll-x-contain lg:hidden"
            style={{ WebkitOverflowScrolling: 'touch' }}
         >
            <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
               <ChartPageStack activeView={chartView} charts={mobileCharts} />
               {chartSwitcher(['basic', 'advanced', 'distribution'])}
            </div>
         </div>
      </div>
   );
}

interface ScoreStatsDetailProps {
   scoreId: number;
   fullCombo: boolean;
   onLoadedAction?: () => void;
}

const GRID_ROWS = [
   [0, 1, 2, 3],
   [4, 5, 6, 7],
   [8, 9, 10, 11]
];

type ChartView = 'basic' | 'advanced' | 'distribution';

const SWIPE_THRESHOLD = 40;
const SWIPE_LOCK_THRESHOLD = 8;
const CHART_VIEWS: ChartView[] = ['basic', 'advanced', 'distribution'];
const ScoreAccuracyChart = dynamic(() => import('./chart/score-accuracy-chart').then((mod) => mod.ScoreAccuracyChart), {
   loading: () => <ChartSkeleton />
});
const ScoreAccuracyTimelineChart = dynamic(() => import('./chart/score-replay-analysis-charts').then((mod) => mod.ScoreAccuracyTimelineChart), {
   loading: () => <ChartSkeleton />
});
const ScoreAccuracyDistributionChart = dynamic(
   () => import('./chart/score-replay-analysis-charts').then((mod) => mod.ScoreAccuracyDistributionChart),
   {
      loading: () => <ChartSkeleton />
   }
);

function chartPage(view: ChartView, chart: ReactNode) {
   return { view, chart };
}

function ChartSkeleton() {
   return (
      <div className="bg-card flex h-56 items-center justify-center rounded-lg border sm:h-64">
         <Loader2 className="text-muted-foreground/40 size-6 animate-spin" />
      </div>
   );
}

function formatHandPair(left: number, right: number, leftLabel: string, rightLabel: string) {
   return `${formatNumber(left)}${leftLabel} / ${formatNumber(right)}${rightLabel}`;
}

function GridAccuracy({ grid }: { grid: ScoreControllerGetScoreStatsResponse['gridCutDetails']['grid'] }) {
   const t = useTranslations();
   if (grid.length < 12) return null;

   const scores = grid
      .slice(0, 12)
      .filter((c) => c.count > 0)
      .map((c) => c.avgScore);
   if (scores.length === 0) return null;

   const min = Math.min(...scores);
   const max = Math.max(...scores);
   const range = max - min || 1;

   return (
      <div className="flex flex-col items-center gap-1.5">
         <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
            <Grid3X3 className="size-3" />
            <span>{t('score.gridAccuracy')}</span>
         </div>
         <div className="grid grid-cols-4 gap-1 rounded-md sm:gap-0.5">
            {GRID_ROWS.map((row) =>
               row.map((gridIndex) => {
                  const cell = grid[gridIndex];
                  if (cell.count === 0) {
                     return (
                        <div key={gridIndex} className="flex h-8 w-11 items-center justify-center rounded-sm text-[10px] opacity-30 sm:h-7 sm:w-9">
                           --
                        </div>
                     );
                  }
                  const t = (cell.avgScore - min) / range;
                  const r = Math.round(180 - t * 130);
                  const g = Math.round(80 + t * 120);
                  const b = Math.round(80 - t * 30);
                  return (
                     <div
                        key={gridIndex}
                        className="flex h-8 w-11 items-center justify-center rounded-sm text-[10px] font-semibold sm:h-7 sm:w-9"
                        style={{
                           backgroundColor: `rgba(${r}, ${g}, ${b}, 0.15)`,
                           color: `rgb(${r}, ${g}, ${b})`
                        }}
                     >
                        <HitScoreValue value={cell.avgScore} decimals={1} className="size-full rounded-sm" />
                     </div>
                  );
               })
            )}
         </div>
      </div>
   );
}

function ScoreAccuracyOverview({ stats, fullCombo }: { stats: ScoreControllerGetScoreStatsResponse; fullCombo: boolean }) {
   const t = useTranslations();
   const leftLabel = t('score.leftShort');
   const rightLabel = t('score.rightShort');

   return (
      <div className="flex min-w-0 flex-col gap-4">
         <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-center sm:gap-8">
            <div className="flex items-start justify-center gap-4 self-stretch sm:contents">
               <HandAccuracyRing side="left" accuracy={stats.accLeft} averageCut={stats.leftAverageCut} timeDependence={stats.leftTimeDependence} />

               <div className="sm:order-2">
                  <HandAccuracyRing
                     side="right"
                     accuracy={stats.accRight}
                     averageCut={stats.rightAverageCut}
                     timeDependence={stats.rightTimeDependence}
                  />
               </div>
            </div>

            <div className="flex flex-col items-center gap-2 sm:order-1">
               <GridAccuracy grid={stats.gridCutDetails.grid} />
            </div>
         </div>

         <div className="flex flex-wrap items-center justify-center gap-1.5">
            {stats.leftMiss + stats.rightMiss > 0 && (
               <Stat icon={Target} label={t('score.misses')} className="gap-1.5 px-2 py-0.5 text-[11px]">
                  {formatHandPair(stats.leftMiss, stats.rightMiss, leftLabel, rightLabel)}
               </Stat>
            )}
            {stats.leftBadCuts + stats.rightBadCuts > 0 && (
               <Stat icon={Scissors} label={t('score.badCuts')} className="gap-1.5 px-2 py-0.5 text-[11px]">
                  {formatHandPair(stats.leftBadCuts, stats.rightBadCuts, leftLabel, rightLabel)}
               </Stat>
            )}
            {stats.leftBombs + stats.rightBombs > 0 && (
               <Stat icon={Bomb} label={t('score.bombs')} className="gap-1.5 px-2 py-0.5 text-[11px]">
                  {formatHandPair(stats.leftBombs, stats.rightBombs, leftLabel, rightLabel)}
               </Stat>
            )}
            {stats.max115Streak != null && (
               <Stat icon={Zap} label={t('score.streak115')} className="gap-1.5 px-2 py-0.5 text-[11px]">
                  {formatNumber(stats.max115Streak)}
               </Stat>
            )}
            {!fullCombo && (
               <Stat icon={Target} label={t('score.estFcAccuracy')} className="gap-1.5 px-2 py-0.5 text-[11px]">
                  {Number.isFinite(stats.fcAcc) ? `${(stats.fcAcc * 100).toFixed(2)}%` : '--'}
               </Stat>
            )}
         </div>
      </div>
   );
}

function ChartPageStack({ activeView, charts }: { activeView: ChartView; charts: Array<{ view: ChartView; chart: ReactNode }> }) {
   const currentView = charts.some((chart) => chart.view === activeView) ? activeView : charts[0]?.view;
   const activeIndex = Math.max(
      0,
      charts.findIndex((chart) => chart.view === currentView)
   );

   return (
      <div className="relative h-56 overflow-hidden rounded-lg sm:h-64">
         {charts.map(({ view, chart }, index) => {
            const offset = index - activeIndex;
            return (
               <div
                  key={view}
                  className={cn(
                     'absolute inset-0 transition-[opacity,transform,filter] duration-300 ease-out will-change-[opacity,transform,filter]',
                     view === currentView ? 'z-10 opacity-100 blur-0' : 'pointer-events-none z-0 opacity-0 blur-[2px]'
                  )}
                  style={{ transform: `translateX(${offset * 1.5}rem) scale(${view === currentView ? 1 : 0.985})` }}
               >
                  {chart}
               </div>
            );
         })}
      </div>
   );
}
