'use client';

import { useTranslations } from 'use-intl';

import { usePlayerChartContext } from './player-chart-context';

import { METRICS } from '@/modules/player/chart/chart-types';
import { cn } from '@/shared/format/helpers';

export function PlayerChartStats() {
   const t = useTranslations();
   const { metricStats, metricLabels } = usePlayerChartContext();

   return (
      <div className="flex flex-wrap items-center justify-center gap-3">
         {metricStats.map(({ key, current, change, changeLabel, peak }) => {
            const m = METRICS[key];
            const isRank = key === 'rank';
            const absChange = Math.abs(change);
            const formattedChange = isRank
               ? absChange > 0 && absChange < 0.1
                  ? absChange.toPrecision(2)
                  : absChange.toLocaleString(undefined, { maximumFractionDigits: 1 })
               : key === 'averageAccuracy'
                 ? (absChange > 0 && absChange < 0.01
                      ? absChange.toPrecision(2)
                      : absChange.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 3 })) + '%'
                 : m.formatTick(absChange);
            return (
               <div
                  key={key}
                  className="flex items-center gap-3 rounded-md border-l-2 px-3 py-1.5"
                  style={{
                     borderLeftColor: `var(${m.cssVar})`,
                     backgroundColor: `color-mix(in srgb, var(${m.cssVar}) 10%, transparent)`
                  }}
               >
                  <div className="text-center">
                     <div className="text-base font-bold tabular-nums" style={{ color: `var(${m.cssVar})` }}>
                        {isRank ? `#${current.toLocaleString()}` : m.formatTick(current)}
                     </div>
                     <div className="text-muted-foreground text-[10px] tracking-wider uppercase">{metricLabels[key].shortLabel}</div>
                  </div>
                  <div className="text-center">
                     <div
                        className={cn(
                           'text-sm font-bold tabular-nums',
                           change > 0 ? 'text-status-success' : change < 0 ? 'text-status-error' : 'text-muted-foreground'
                        )}
                     >
                        {change > 0 ? `+${formattedChange}` : change < 0 ? `-${formattedChange}` : '+/-0'}
                     </div>
                     <div className="text-muted-foreground text-[10px] tracking-wider uppercase">{changeLabel}</div>
                  </div>
                  {peak !== null && (
                     <div className="text-center">
                        <div className="text-status-success text-base font-bold tabular-nums">
                           {isRank ? `#${peak.toLocaleString()}` : m.formatTick(peak)}
                        </div>
                        <div className="text-muted-foreground text-[10px] tracking-wider uppercase">{t('player.peakRecorded')}</div>
                     </div>
                  )}
               </div>
            );
         })}
      </div>
   );
}
