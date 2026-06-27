import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';

import { Result } from 'better-result';
import type { Chart } from 'chart.js';
import { useTranslations } from 'use-intl';
import { z } from 'zod';

import type { MetricKey, MetricLabel, PlayerChartStats, TimeRange } from '@/modules/player/chart/chart-types';
import { METRIC_KEY_SCHEMA, TIME_RANGE_SCHEMA } from '@/modules/player/chart/chart-types';
import {
   buildPlayerChartDatasets,
   buildPlayerChartMetricStats,
   buildPlayerChartScales,
   getActiveMetricKeys,
   getEstimatedFlags,
   getPlayerChartNowValues,
   getPlayerChartPadding,
   getRankDataValues,
   getSortedPlayerHistory,
   getTimeRangePlayerHistory,
   getVisibleChartDayCount
} from '@/modules/player/chart/player-chart-model';
import { useDenyahOverlay } from '@/modules/player/chart/use-denyah-overlay';
import { useLongPress } from '@/modules/player/chart/use-long-press';
import type { PlayerControllerGetPlayerHistoryItem } from '@/shared/api/generated/ApiParams';
import { useChartColors } from '@/shared/components/chart/use-chart-colors';
import { readStorageJson, writeStorageJson } from '@/shared/result/storage';

const STORAGE_KEY = 'player-chart-prefs:v1';
const DEFAULT_CHART_PREFS: ChartPrefs = { activeMetrics: ['rank'], isShowingEstimated: true, timeRange: '90' };
const DAY_MS = 24 * 60 * 60 * 1000;

interface ChartPrefs {
   activeMetrics: MetricKey[];
   isShowingEstimated: boolean;
   timeRange: TimeRange;
}

const chartPrefsSchema = z.object({
   activeMetrics: z.array(METRIC_KEY_SCHEMA).optional(),
   isShowingEstimated: z.boolean().optional(),
   timeRange: TIME_RANGE_SCHEMA.optional()
});

function loadPrefs() {
   if (typeof window === 'undefined') return DEFAULT_CHART_PREFS;

   const storedPrefs = Result.unwrapOr(readStorageJson(STORAGE_KEY, chartPrefsSchema), null);
   if (!storedPrefs) return DEFAULT_CHART_PREFS;

   return {
      activeMetrics:
         storedPrefs.activeMetrics && storedPrefs.activeMetrics.length > 0 ? storedPrefs.activeMetrics : DEFAULT_CHART_PREFS.activeMetrics,
      isShowingEstimated: storedPrefs.isShowingEstimated ?? DEFAULT_CHART_PREFS.isShowingEstimated,
      timeRange: storedPrefs.timeRange ?? DEFAULT_CHART_PREFS.timeRange
   };
}

const mobileQuery = typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)') : null;
function subscribeIsMobile(cb: () => void) {
   mobileQuery?.addEventListener('change', cb);
   return () => mobileQuery?.removeEventListener('change', cb);
}
function getIsMobile() {
   return mobileQuery?.matches ?? false;
}

type Translator = ReturnType<typeof useTranslations<'player'>>;

function formatDaysAgo(t: Translator, daysAgo: number, short: boolean) {
   if (daysAgo === 0) return t('chartToday');
   if (short) {
      if (daysAgo < 7) return t('chartDaysAgoShort', { days: daysAgo });
      if (daysAgo < 30) return t('chartWeeksAgoShort', { weeks: Math.round(daysAgo / 7) });
      return t('chartMonthsAgoShort', { months: Math.round(daysAgo / 30) });
   }
   if (daysAgo === 1) return t('chartYesterday');
   if (daysAgo === 7) return t('chartOneWeekAgo');
   if (daysAgo === 14) return t('chartTwoWeeksAgo');
   if (daysAgo === 30) return t('chartOneMonthAgo');
   return t('chartDaysAgo', { days: daysAgo });
}

function getDaysAgo(date: Date, now: Date) {
   return Math.max(0, Math.round((now.getTime() - date.getTime()) / DAY_MS));
}

export function usePlayerChart(playerId: string, stats: PlayerChartStats, history: PlayerControllerGetPlayerHistoryItem[]) {
   const t = useTranslations('player');
   const initialPrefs = useRef(loadPrefs()).current;
   const [activeMetrics, setActiveMetrics] = useState<Set<MetricKey>>(() => new Set(initialPrefs.activeMetrics));
   const [isShowingEstimated, setIsShowingEstimated] = useState(initialPrefs.isShowingEstimated);
   const [isInfoOpen, setIsInfoOpen] = useState(false);
   const [timeRange, setTimeRange] = useState<TimeRange>(initialPrefs.timeRange);
   const chartColors = useChartColors();
   const pulseRef = useRef<HTMLDivElement>(null);
   const nowIndexRef = useRef(0);
   const isSingleRef = useRef(true);
   const denyahOverlayRef = useRef<HTMLDivElement>(null);
   const isFirstRender = useRef(true);

   const metricLabels = useMemo<Record<MetricKey, MetricLabel>>(
      () => ({
         rank: { label: t('chartMetricRank'), shortLabel: t('chartMetricRankShort') },
         totalPP: { label: t('chartMetricPP'), shortLabel: t('chartMetricPPShort') },
         averageAccuracy: { label: t('chartMetricAcc'), shortLabel: t('chartMetricAccShort') },
         totalSubmittedPlays: { label: t('chartMetricPlays'), shortLabel: t('chartMetricPlaysShort') }
      }),
      [t]
   );

   const timeRangeLabels = useMemo<Record<TimeRange, string>>(
      () => ({
         '7': t('chartTimeWeek'),
         '30': t('chartTimeMonth'),
         '90': t('chartTime3Months'),
         '180': t('chartTime6Months'),
         all: t('chartTimeAll')
      }),
      [t]
   );

   const formatTooltipValue = useCallback(
      (key: MetricKey, value: number) => {
         switch (key) {
            case 'rank':
               return t('chartTooltipRank', { rank: value.toLocaleString() });
            case 'totalPP':
               return t('chartTooltipPP', { pp: value.toLocaleString(undefined, { maximumFractionDigits: 2 }) });
            case 'averageAccuracy':
               return t('chartTooltipAcc', { acc: value.toFixed(3) });
            case 'totalSubmittedPlays':
               return t('chartTooltipPlays', { plays: value.toLocaleString(undefined, { maximumFractionDigits: 1 }) });
         }
      },
      [t]
   );

   useEffect(() => {
      if (isFirstRender.current) {
         isFirstRender.current = false;
         return;
      }
      const data: Record<string, string | boolean | MetricKey[] | TimeRange> = {
         activeMetrics: Array.from(activeMetrics),
         isShowingEstimated,
         timeRange
      };
      writeStorageJson(STORAGE_KEY, data);
   }, [activeMetrics, isShowingEstimated, timeRange]);

   const handleMetricClick = useCallback((key: MetricKey, isMultiSelect: boolean) => {
      if (!isMultiSelect) {
         setActiveMetrics(new Set([key]));
         return;
      }

      setActiveMetrics((prev) => {
         const next = new Set(prev);
         if (next.has(key)) {
            if (next.size > 1) next.delete(key);
            return next;
         }
         next.add(key);
         return next;
      });
   }, []);

   const { handlePointerDown, handlePointerUp, handlePointerCancel } = useLongPress<MetricKey>(handleMetricClick);

   const fullHistory = useMemo(() => getSortedPlayerHistory(history), [history]);

   const now = useMemo(() => new Date(), []);
   const nowTime = now.getTime();

   const sortedHistory = useMemo(() => {
      return getTimeRangePlayerHistory(fullHistory, timeRange, now);
   }, [fullHistory, timeRange, now]);

   const hasEstimated = useMemo(() => sortedHistory.some((e) => e.estimated), [sortedHistory]);

   const estimatedFlags = useMemo(() => getEstimatedFlags(sortedHistory), [sortedHistory]);

   const nowValues = useMemo(() => getPlayerChartNowValues(stats), [stats]);

   const isMobile = useSyncExternalStore(subscribeIsMobile, getIsMobile, () => false);

   const visibleDays = useMemo(() => getVisibleChartDayCount(sortedHistory, now), [sortedHistory, now]);
   const minTime = sortedHistory.length > 0 ? new Date(sortedHistory[0].createdAt).getTime() : nowTime;
   const maxTime = nowTime;

   const chartPadding = useMemo(() => getPlayerChartPadding(sortedHistory.length + 1), [sortedHistory.length]);

   nowIndexRef.current = chartPadding + sortedHistory.length;

   const labels = useMemo(() => [], []);

   const activeKeys = useMemo(() => getActiveMetricKeys(activeMetrics), [activeMetrics]);
   const isSingle = activeKeys.length === 1;
   isSingleRef.current = isSingle;

   const nowPulsePlugin = useRef({
      id: 'nowPulse',
      afterDraw: (chart: Chart<'line'>) => {
         const el = pulseRef.current;
         if (!el) return;
         if (!isSingleRef.current) {
            el.style.display = 'none';
            return;
         }
         const idx = nowIndexRef.current;
         const meta = chart.getDatasetMeta(0);
         const nowElement = meta.data[idx];
         const nowVal = chart.data.datasets[0]?.data[idx];
         if (!nowElement || nowVal === null || nowVal === undefined) {
            el.style.display = 'none';
            return;
         }
         const canvas = chart.canvas;
         el.style.left = `${nowElement.x + canvas.offsetLeft}px`;
         el.style.top = `${nowElement.y + canvas.offsetTop}px`;
         el.style.display = 'block';
      }
   }).current;

   const datasets = useMemo(() => {
      return buildPlayerChartDatasets({
         activeKeys,
         sortedHistory,
         fullHistory,
         chartColors,
         isSingle,
         estimatedFlags,
         isShowingEstimated,
         nowValues,
         chartPadding,
         nowTime,
         metricLabels
      });
   }, [
      activeKeys,
      sortedHistory,
      fullHistory,
      chartColors,
      isSingle,
      estimatedFlags,
      isShowingEstimated,
      nowValues,
      chartPadding,
      nowTime,
      metricLabels
   ]);

   const scales = useMemo(() => {
      const formatTick = (value: number) => (value === maxTime ? t('chartNow') : formatDaysAgo(t, getDaysAgo(new Date(value), now), isMobile));
      return buildPlayerChartScales({
         activeKeys,
         chartColors,
         isSingle,
         isMobile,
         metricLabels,
         chartLastNDaysLabel: t('chartLastNDays', { days: visibleDays }),
         minTime,
         maxTime,
         formatTick
      });
   }, [activeKeys, chartColors, isSingle, isMobile, t, metricLabels, visibleDays, minTime, maxTime, now]);

   const avgPerDayLabel = t('chartAvgPerDay');

   const metricStats = useMemo(() => {
      return buildPlayerChartMetricStats({
         activeKeys,
         sortedHistory,
         fullHistory,
         isShowingEstimated,
         nowValues,
         nowTime,
         changeLabel: avgPerDayLabel
      });
   }, [activeKeys, sortedHistory, fullHistory, isShowingEstimated, nowValues, nowTime, avgPerDayLabel]);

   const rankDataValues = useMemo(() => getRankDataValues(sortedHistory), [sortedHistory]);

   useDenyahOverlay(playerId, activeMetrics, rankDataValues, denyahOverlayRef);

   const primaryColor = activeKeys.length > 0 ? chartColors.metricBorder[activeKeys[0]] : '#888';

   const tooltipCallbacks = useMemo(
      () => ({
         title: (context: { parsed: { x: number | null } }[]) => {
            const x = context[0]?.parsed.x;
            if (x == null) return '';
            if (x === nowTime) return t('chartNow');
            return formatDaysAgo(t, getDaysAgo(new Date(x), now), false);
         },
         label: (context: { datasetIndex: number; dataIndex: number; parsed: { y: number | null } }) => {
            const key = activeKeys[context.datasetIndex];
            if (!key || context.parsed.y == null) return '';
            const idx = context.dataIndex - chartPadding;
            const isEstimated = key !== 'rank' && idx >= 0 && idx < estimatedFlags.length && estimatedFlags[idx];
            const suffix = isEstimated ? t('chartEstimatedSuffix') : '';
            return formatTooltipValue(key, context.parsed.y) + suffix;
         },
         labelColor: (context: { datasetIndex: number }) => {
            const key = activeKeys[context.datasetIndex];
            const color = key ? chartColors.metricBorder[key] : '#888';
            return { borderColor: color, backgroundColor: color };
         }
      }),
      [activeKeys, chartPadding, estimatedFlags, chartColors.metricBorder, formatTooltipValue, t, now, nowTime]
   );

   return {
      activeMetrics,
      isShowingEstimated,
      setIsShowingEstimated,
      isInfoOpen,
      setIsInfoOpen,
      timeRange,
      setTimeRange,

      handlePointerDown,
      handlePointerUp,
      handlePointerCancel,

      labels,
      datasets,
      scales,
      metricStats,
      activeKeys,
      isSingle,
      hasEstimated,
      sortedHistory,
      chartColors,
      primaryColor,
      nowPulsePlugin,
      tooltipCallbacks,

      metricLabels,
      timeRangeLabels,

      pulseRef,
      denyahOverlayRef
   };
}
