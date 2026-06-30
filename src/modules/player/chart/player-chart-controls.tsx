'use client';

import { useEffect, useState } from 'react';

import { FaEye, FaEyeSlash, FaInfoCircle } from 'react-icons/fa';
import { useTranslations } from 'use-intl';

import { usePlayerChartContext } from './player-chart-context';

import { Button } from '@/components/ui/button';
import { Kbd } from '@/components/ui/kbd';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { METRIC_KEYS, METRICS, TIME_RANGE_SCHEMA, TIME_RANGE_VALUES } from '@/modules/player/chart/chart-types';
import { cn } from '@/shared/format/helpers';

export function PlayerChartControls() {
   const t = useTranslations();
   const {
      activeMetrics,
      isShowingEstimated,
      setIsShowingEstimated,
      isInfoOpen,
      setIsInfoOpen,
      timeRange,
      setTimeRange,
      hasEstimated,
      handlePointerDown,
      handlePointerUp,
      handlePointerCancel,
      metricLabels,
      timeRangeLabels
   } = usePlayerChartContext();

   const [isShiftHeld, setIsShiftHeld] = useState(false);

   function handleTimeRangeChange(value: string) {
      const result = TIME_RANGE_SCHEMA.safeParse(value);
      if (result.success) {
         setTimeRange(result.data);
      }
   }

   useEffect(() => {
      const onKey = (e: KeyboardEvent) => setIsShiftHeld(e.shiftKey);
      window.addEventListener('keydown', onKey);
      window.addEventListener('keyup', onKey);
      return () => {
         window.removeEventListener('keydown', onKey);
         window.removeEventListener('keyup', onKey);
      };
   }, []);
   return (
      <div className="flex flex-wrap items-center justify-center gap-1.5">
         <Tooltip open={isInfoOpen} onOpenChange={setIsInfoOpen}>
            <TooltipTrigger asChild>
               <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label={t('player.chartUsageTips')}
                  className="text-muted-foreground/40 hover:text-muted-foreground/70 cursor-help hover:bg-transparent"
                  onClick={() => setIsInfoOpen((prev) => !prev)}
               >
                  <FaInfoCircle data-icon className="size-3.5" aria-hidden="true" />
               </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
               <p className="font-medium">
                  <span className="hidden sm:inline">{t.rich('player.chartMultiSelectDesktop', { kbd: (chunks) => <Kbd>{chunks}</Kbd> })}</span>
                  <span className="sm:hidden">{t('player.chartMultiSelectMobile')}</span>
               </p>
            </TooltipContent>
         </Tooltip>

         <Separator orientation="vertical" variant="gradient" size="toolbar" className="mx-0.5" />

         <ToggleGroup type="multiple" value={[...activeMetrics]} spacing={1.5} className="flex-wrap justify-center">
            {METRIC_KEYS.map((key) => {
               const m = METRICS[key];
               const isActive = activeMetrics.has(key);
               const labels = metricLabels[key];

               return (
                  <ToggleGroupItem
                     key={key}
                     value={key}
                     size="sm"
                     onPointerDown={() => handlePointerDown(key)}
                     onPointerUp={(e) => handlePointerUp(key, e.shiftKey)}
                     onPointerLeave={handlePointerCancel}
                     onContextMenu={(e) => e.preventDefault()}
                     className={cn(
                        'border-border/40 bg-card/80 text-muted-foreground hover:bg-card hover:text-foreground data-[state=on]:text-badge-foreground border px-3 py-1.5 text-xs font-medium shadow-none backdrop-blur-xs select-none data-[state=on]:border-transparent data-[state=on]:shadow-xs data-[state=on]:hover:text-badge-foreground',
                        isShiftHeld && !isActive && 'ring-1 ring-dashed ring-muted-foreground/30'
                     )}
                     style={isActive ? { backgroundColor: `var(${m.cssVar})` } : undefined}
                  >
                     {labels.shortLabel}
                  </ToggleGroupItem>
               );
            })}
         </ToggleGroup>

         <Separator orientation="vertical" variant="gradient" size="toolbar" className="mx-1" />

         <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger variant="filter" size="compact">
               <SelectValue aria-label={timeRangeLabels[timeRange]}>{timeRangeLabels[timeRange]}</SelectValue>
            </SelectTrigger>
            <SelectContent position="popper" className="w-36">
               <SelectGroup>
                  <SelectLabel>{t('player.chartTimeRange')}</SelectLabel>
                  {TIME_RANGE_VALUES.map((value) => (
                     <SelectItem key={value} value={value} className={cn(timeRange === value && 'font-medium')}>
                        {timeRangeLabels[value]}
                     </SelectItem>
                  ))}
               </SelectGroup>
            </SelectContent>
         </Select>

         {hasEstimated && (
            <>
               <Separator orientation="vertical" variant="gradient" size="toolbar" className="mx-1" />
               <Tooltip>
                  <TooltipTrigger asChild>
                     <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label={isShowingEstimated ? t('player.hideEstimatedData') : t('player.showEstimatedData')}
                        aria-pressed={isShowingEstimated}
                        onClick={() => setIsShowingEstimated((prev) => !prev)}
                        style={
                           isShowingEstimated
                              ? {
                                   backgroundColor: 'color-mix(in srgb, var(--profile-accent, var(--primary)) 18%, transparent)',
                                   color: 'var(--profile-accent, var(--primary))'
                                }
                              : undefined
                        }
                        className={cn(
                           'size-auto border p-1.5',
                           isShowingEstimated
                              ? 'bg-primary/20 text-primary hover:bg-primary/30 border-transparent shadow-xs'
                              : 'border-border/40 bg-card/80 text-muted-foreground/60 hover:bg-card hover:text-muted-foreground backdrop-blur-xs'
                        )}
                     >
                        {isShowingEstimated ? <FaEye data-icon aria-hidden="true" /> : <FaEyeSlash data-icon aria-hidden="true" />}
                     </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                     <p className="font-medium">{isShowingEstimated ? t('player.hideEstimatedData') : t('player.showEstimatedData')}</p>
                  </TooltipContent>
               </Tooltip>
            </>
         )}
      </div>
   );
}
