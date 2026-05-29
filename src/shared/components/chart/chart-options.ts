import type { ChartOptions } from 'chart.js';

import type { ChartColors } from '@/shared/components/chart/use-chart-colors';

function getLineChartBaseOptions(): ChartOptions<'line'> {
   return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
         intersect: false,
         mode: 'index'
      }
   };
}

function getBarLineChartBaseOptions(): ChartOptions<'bar' | 'line'> {
   return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
         intersect: false,
         mode: 'index'
      }
   };
}

function getChartTooltipColors(chartColors: ChartColors) {
   return {
      backgroundColor: chartColors.tooltipBg,
      titleColor: chartColors.tooltipText,
      bodyColor: chartColors.tooltipText,
      borderWidth: 1
   };
}

export { getBarLineChartBaseOptions, getLineChartBaseOptions, getChartTooltipColors };
