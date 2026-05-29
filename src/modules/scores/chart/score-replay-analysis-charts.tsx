'use client';

import {
   BarController,
   BarElement,
   CategoryScale,
   Chart as ChartJS,
   Filler,
   LinearScale,
   LineController,
   LineElement,
   PointElement,
   Tooltip
} from 'chart.js';
import { Chart, Line } from 'react-chartjs-2';
import { useTranslations } from 'use-intl';

import {
   buildAccuracyDistributionModel,
   buildAccuracyTimelineModel,
   formatTooltipPercent,
   getDisplayCount,
   scorePercent
} from '@/modules/scores/chart/score-chart-model';
import type { ScoreControllerGetScoreStatsResponse } from '@/shared/api/generated/ApiParams';
import { getBarLineChartBaseOptions, getChartTooltipColors, getLineChartBaseOptions } from '@/shared/components/chart/chart-options';
import { ChartShell } from '@/shared/components/chart/chart-shell';
import { useChartColors } from '@/shared/components/chart/use-chart-colors';

ChartJS.register(LineController, BarController, LinearScale, CategoryScale, PointElement, LineElement, BarElement, Tooltip, Filler);

type AccuracyTimeline = ScoreControllerGetScoreStatsResponse['accuracyTimeline'];
type AccuracyDistribution = ScoreControllerGetScoreStatsResponse['accuracyDistribution'];

const PREDICTED_COLOR = '250, 204, 21';
const LEFT_COLOR = '239, 68, 68';
const RIGHT_COLOR = '59, 130, 246';
const LEFT_LIGHT_COLOR = '254, 202, 202';
const RIGHT_LIGHT_COLOR = '191, 219, 254';
const barDatasetType = 'bar';
const lineDatasetType = 'line';

export function ScoreAccuracyTimelineChart({ timeline }: { timeline: AccuracyTimeline }) {
   const t = useTranslations();
   const chartColors = useChartColors();

   if (timeline.times.length === 0 || timeline.total.actual.length === 0) return null;

   const { labels, scoreRange } = buildAccuracyTimelineModel(timeline);

   return (
      <ChartShell className="h-56 p-3 sm:h-64">
         <Line
            data={{
               labels,
               datasets: [
                  {
                     label: t('score.predicted'),
                     data: timeline.total.fullSwing,
                     borderColor: `rgba(${PREDICTED_COLOR}, 0.95)`,
                     backgroundColor: `rgba(${PREDICTED_COLOR}, 0.08)`,
                     borderDash: [5, 5],
                     borderWidth: 2,
                     pointRadius: 0,
                     pointHoverRadius: 4,
                     tension: 0.35
                  },
                  {
                     label: t('score.scoreLine'),
                     data: timeline.total.actual,
                     borderColor: 'rgba(235, 235, 235, 0.95)',
                     backgroundColor: 'rgba(235, 235, 235, 0.08)',
                     borderWidth: 2,
                     pointRadius: 0,
                     pointHoverRadius: 4,
                     tension: 0.35
                  },
                  {
                     label: t('score.leftAccuracy'),
                     data: timeline.left.actual,
                     borderColor: `rgba(${LEFT_COLOR}, 0.95)`,
                     backgroundColor: `rgba(${LEFT_COLOR}, 0.08)`,
                     borderWidth: 2,
                     pointRadius: 0,
                     pointHoverRadius: 4,
                     tension: 0.35
                  },
                  {
                     label: t('score.rightAccuracy'),
                     data: timeline.right.actual,
                     borderColor: `rgba(${RIGHT_COLOR}, 0.95)`,
                     backgroundColor: `rgba(${RIGHT_COLOR}, 0.08)`,
                     borderWidth: 2,
                     pointRadius: 0,
                     pointHoverRadius: 4,
                     tension: 0.35
                  },
                  {
                     label: t('score.leftFullSwing'),
                     data: timeline.left.fullSwing,
                     borderColor: `rgba(${LEFT_LIGHT_COLOR}, 0.85)`,
                     borderWidth: 1.5,
                     pointRadius: 0,
                     pointHoverRadius: 3,
                     tension: 0.35
                  },
                  {
                     label: t('score.rightFullSwing'),
                     data: timeline.right.fullSwing,
                     borderColor: `rgba(${RIGHT_LIGHT_COLOR}, 0.85)`,
                     borderWidth: 1.5,
                     pointRadius: 0,
                     pointHoverRadius: 3,
                     tension: 0.35
                  }
               ]
            }}
            options={{
               ...getLineChartBaseOptions(),
               scales: {
                  x: {
                     ticks: {
                        maxTicksLimit: 10,
                        color: chartColors.axisText,
                        font: { size: 10 }
                     },
                     grid: { color: chartColors.grid }
                  },
                  y: {
                     min: scoreRange.min,
                     max: scoreRange.max,
                     ticks: {
                        color: chartColors.axisText,
                        font: { size: 10 }
                     },
                     grid: { color: chartColors.grid }
                  }
               },
               plugins: {
                  legend: { display: false },
                  tooltip: {
                     ...getChartTooltipColors(chartColors),
                     callbacks: {
                        label: (ctx) => {
                           const score = Number(ctx.parsed.y);
                           return t('score.timelineTooltip', {
                              label: ctx.dataset.label ?? '',
                              score: score.toFixed(1),
                              accuracy: scorePercent(score).toFixed(2)
                           });
                        }
                     }
                  }
               }
            }}
         />
      </ChartShell>
   );
}

export function ScoreAccuracyDistributionChart({ distribution }: { distribution: AccuracyDistribution }) {
   const t = useTranslations();
   const chartColors = useChartColors();

   const model = buildAccuracyDistributionModel(distribution);
   if (!model) return null;

   const {
      buckets,
      labels,
      leftCountTotal,
      rightCountTotal,
      leftValuesAreRatios,
      rightValuesAreRatios,
      leftPercent,
      rightPercent,
      leftTd,
      rightTd,
      timingPlot,
      maxPercent,
      maxTd
   } = model;
   const leftCountLabel = t('score.leftCount');
   const rightCountLabel = t('score.rightCount');
   const timingLabel = t('score.timing');

   return (
      <ChartShell className="h-56 p-3 sm:h-64">
         <Chart
            type="bar"
            data={{
               labels,
               datasets: [
                  {
                     type: barDatasetType,
                     label: t('score.leftCount'),
                     data: leftPercent,
                     yAxisID: 'percent',
                     backgroundColor: `rgba(${LEFT_COLOR}, 0.85)`,
                     borderColor: `rgba(${LEFT_COLOR}, 1)`,
                     borderWidth: 0,
                     order: 3
                  },
                  {
                     type: barDatasetType,
                     label: t('score.rightCount'),
                     data: rightPercent,
                     yAxisID: 'percent',
                     backgroundColor: `rgba(${RIGHT_COLOR}, 0.85)`,
                     borderColor: `rgba(${RIGHT_COLOR}, 1)`,
                     borderWidth: 0,
                     order: 3
                  },
                  {
                     type: lineDatasetType,
                     label: t('score.leftTd'),
                     data: leftTd,
                     yAxisID: 'td',
                     borderColor: `rgba(${LEFT_COLOR}, 1)`,
                     backgroundColor: `rgba(${LEFT_COLOR}, 0.12)`,
                     borderWidth: 2,
                     pointRadius: 2,
                     spanGaps: true,
                     tension: 0.35,
                     order: 1
                  },
                  {
                     type: lineDatasetType,
                     label: t('score.rightTd'),
                     data: rightTd,
                     yAxisID: 'td',
                     borderColor: `rgba(${RIGHT_COLOR}, 1)`,
                     backgroundColor: `rgba(${RIGHT_COLOR}, 0.12)`,
                     borderWidth: 2,
                     pointRadius: 2,
                     spanGaps: true,
                     tension: 0.35,
                     order: 1
                  },
                  {
                     type: lineDatasetType,
                     label: t('score.timing'),
                     data: timingPlot,
                     yAxisID: 'td',
                     borderColor: 'rgba(235, 235, 235, 0.8)',
                     backgroundColor: 'rgba(235, 235, 235, 0.1)',
                     borderWidth: 2,
                     pointRadius: 2,
                     spanGaps: true,
                     tension: 0.35,
                     order: 0
                  }
               ]
            }}
            options={{
               ...getBarLineChartBaseOptions(),
               scales: {
                  x: {
                     stacked: false,
                     ticks: {
                        color: chartColors.axisText,
                        font: { size: 10 }
                     },
                     grid: { color: chartColors.grid }
                  },
                  td: {
                     type: 'linear',
                     position: 'left',
                     min: 0,
                     max: maxTd * 1.15,
                     ticks: {
                        color: chartColors.axisText,
                        font: { size: 10 }
                     },
                     grid: { color: chartColors.grid }
                  },
                  percent: {
                     type: 'linear',
                     position: 'right',
                     min: 0,
                     max: maxPercent * 1.15,
                     ticks: {
                        callback: (value) => `${Number(value).toFixed(1)}%`,
                        color: chartColors.axisText,
                        font: { size: 10 }
                     },
                     grid: { drawOnChartArea: false }
                  }
               },
               plugins: {
                  legend: { display: false },
                  tooltip: {
                     ...getChartTooltipColors(chartColors),
                     callbacks: {
                        label: (ctx) => {
                           const bucket = buckets[ctx.dataIndex] ?? Number(ctx.label);
                           const label = ctx.dataset.label ?? '';
                           const value = Number(ctx.parsed.y);
                           if (label === leftCountLabel || label === rightCountLabel) {
                              const isLeft = label === leftCountLabel;
                              const bucketValue = isLeft ? (distribution.leftCount[bucket] ?? 0) : (distribution.rightCount[bucket] ?? 0);
                              const count = isLeft
                                 ? getDisplayCount(bucketValue, distribution.leftTotal, leftCountTotal, leftValuesAreRatios)
                                 : getDisplayCount(bucketValue, distribution.rightTotal, rightCountTotal, rightValuesAreRatios);
                              return t('score.distributionPercentTooltip', {
                                 label,
                                 count: Math.round(count),
                                 percent: formatTooltipPercent(value)
                              });
                           }
                           if (label === timingLabel) {
                              const timing = distribution.timingStdDev[bucket] ?? 0;
                              return t('score.distributionTimingTooltip', { label, value: (timing * 1000).toFixed(1) });
                           }
                           return t('score.distributionTdTooltip', { label, value: value.toFixed(3) });
                        }
                     }
                  }
               }
            }}
         />
      </ChartShell>
   );
}
