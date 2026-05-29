'use client';

import { CategoryScale, Chart as ChartJS, Filler, LinearScale, LineController, LineElement, PointElement, Tooltip } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTranslations } from 'use-intl';

import { buildScoreAccuracyModel } from '@/modules/scores/chart/score-chart-model';
import { getChartTooltipColors, getLineChartBaseOptions } from '@/shared/components/chart/chart-options';
import { ChartShell } from '@/shared/components/chart/chart-shell';
import { useChartColors } from '@/shared/components/chart/use-chart-colors';

ChartJS.register(LineController, LinearScale, CategoryScale, PointElement, LineElement, Tooltip, Filler);

interface ScoreAccuracyChartProps {
   scoreGraph: number[];
   endTime: number;
}

export function ScoreAccuracyChart({ scoreGraph, endTime }: ScoreAccuracyChartProps) {
   const t = useTranslations();
   const chartColors = useChartColors();
   const { labels, percentData } = buildScoreAccuracyModel(scoreGraph, endTime);
   const borderColor = chartColors.metricBorder.averageAccuracy;
   const bgColor = chartColors.metricBg.averageAccuracy;

   return (
      <ChartShell className="h-56 p-3 sm:h-64">
         <Line
            data={{
               labels,
               datasets: [
                  {
                     data: percentData,
                     borderColor,
                     backgroundColor: bgColor,
                     borderWidth: 2,
                     pointRadius: 0,
                     pointHitRadius: 8,
                     tension: 0.3,
                     fill: true
                  }
               ]
            }}
            options={{
               ...getLineChartBaseOptions(),
               scales: {
                  x: {
                     ticks: {
                        maxTicksLimit: 8,
                        color: chartColors.axisText,
                        font: { size: 10 }
                     },
                     grid: { color: chartColors.grid }
                  },
                  y: {
                     ticks: {
                        callback: (value) => `${Number(value).toFixed(1)}%`,
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
                        label: (ctx) => t('score.chartAccuracyTooltip', { accuracy: ctx.parsed.y?.toFixed(2) ?? '--' })
                     }
                  }
               }
            }}
         />
      </ChartShell>
   );
}
