'use client';

import { useEffect, useState, type ChangeEvent, type ReactNode } from 'react';

import { useQuery } from '@tanstack/react-query';
import { Check, Clock, Info, Loader2, RotateCcw, Star, Target, X } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { ScoreOutcomeBadge } from '@/modules/scores/score-outcome-badge';
import type { ScorePPContext } from '@/modules/scores/score-pp-context';
import type {
   LeaderboardControllerGetLeaderboardScoresByIdDataItem,
   PlayerControllerGetPlayerScoresDataItem
} from '@/shared/api/generated/ApiParams';
import { getRealmPPCurve } from '@/shared/api/realm-pp';
import { Stat } from '@/shared/components/stat';
import { Time } from '@/shared/components/time';
import { cn, formatAccuracy, formatNumber, formatPP } from '@/shared/format/helpers';
import { calculateCurvePP } from '@/shared/format/pp-curve';
import { optionalApiData } from '@/shared/result/api';

type ScoreStatsScore = PlayerControllerGetPlayerScoresDataItem['score'] | LeaderboardControllerGetLeaderboardScoresByIdDataItem;

interface ScoreStatsProps {
   score: ScoreStatsScore;
   weightedPP?: string;
   weightedPercent?: string;
   showAccuracy?: boolean;
   showPP?: boolean;
   legacyAccuracy?: boolean;
   accuracyPPContext?: ScorePPContext;
   className?: string;
   timeSet?: string | Date;
   size?: 'default' | 'compact';
   scoreStatMode?: 'scoreAndMods' | 'modsOnly';
   useContainerQueries?: boolean;
}

export function ScoreStats({
   score,
   weightedPP,
   weightedPercent,
   showAccuracy = true,
   showPP = true,
   legacyAccuracy = false,
   accuracyPPContext,
   className,
   timeSet,
   size = 'default',
   scoreStatMode = 'scoreAndMods',
   useContainerQueries = false
}: ScoreStatsProps) {
   const t = useTranslations();
   const cq = useContainerQueries;
   const accuracy = formatAccuracy(score.accuracy * 100);
   const missedTotal = score.missedNotes + score.badCuts;
   const isCompact = size === 'compact';
   const statClassName = isCompact ? 'gap-1 rounded px-1.5 py-0.5 text-[10px]' : undefined;
   const iconClassName = isCompact ? 'size-2.5' : undefined;
   const hasMods = score.mods.length > 0;
   const showScoreStat = scoreStatMode === 'scoreAndMods' || hasMods;

   return (
      <div
         className={cn(
            'text-foreground flex cursor-default flex-wrap items-center justify-center gap-1',
            isCompact ? 'text-[10px]' : 'flex-col text-sm',
            !isCompact && (cq ? '@min-[600px]/scorecard:items-end' : 'lg:items-end'),
            className
         )}
      >
         {score.playOutcome !== 'CLEAR' && score.playOutcomeTime != null ? (
            <ScoreOutcomeBadge outcome={score.playOutcome} time={score.playOutcomeTime} statClassName={statClassName} iconClassName={iconClassName} />
         ) : showAccuracy ? (
            <div className={cn('flex', isCompact ? 'gap-1' : 'gap-2', !isCompact && (cq ? '@min-[600px]/scorecard:mb-1' : 'lg:mb-1'))}>
               <Tooltip>
                  <TooltipTrigger asChild>
                     <Stat
                        icon={Target}
                        className={cn(
                           statClassName,
                           'cursor-default',
                           legacyAccuracy ? 'border-muted-foreground/30 bg-muted/40' : 'border-status-warning/40 bg-status-warning/10'
                        )}
                        valueClassName={legacyAccuracy ? 'text-muted-foreground' : 'text-score-accuracy-good'}
                        iconClassName={iconClassName}
                     >
                        <span className="inline-flex items-center gap-1">
                           {accuracy}
                           {legacyAccuracy && <Info className={cn('opacity-70', isCompact ? 'size-2.5' : 'size-3')} />}
                        </span>
                     </Stat>
                  </TooltipTrigger>
                  <TooltipContent>
                     <p>{legacyAccuracy ? t('score.legacyAccuracy') : t('common.accuracy')}</p>
                  </TooltipContent>
               </Tooltip>
               {showPP && score.pp > 0 && (
                  <Stat
                     icon={Star}
                     className={cn(statClassName, 'border-score-pp bg-score-pp/10')}
                     iconClassName={cn(iconClassName, 'text-score-pp')}
                  >
                     {accuracyPPContext ? (
                        <AccuracyPPPopover
                           score={score}
                           ppContext={accuracyPPContext}
                           isCompact={isCompact}
                           trigger={
                              <button type="button" className="hover:text-score-pp cursor-pointer rounded-sm text-left">
                                 {formatPP(score.pp)}pp
                              </button>
                           }
                        />
                     ) : (
                        <Tooltip>
                           <TooltipTrigger asChild>
                              <span className="cursor-default">{formatPP(score.pp)}pp</span>
                           </TooltipTrigger>
                           <TooltipContent>
                              <p>{t('common.performancePoints')}</p>
                           </TooltipContent>
                        </Tooltip>
                     )}
                     {weightedPP && weightedPercent && (
                        <Tooltip>
                           <TooltipTrigger asChild>
                              <span className={cn('cursor-default opacity-70', isCompact ? 'ml-1 text-[9px]' : 'ml-1.5 text-[10px]')}>
                                 [{weightedPP}pp]
                              </span>
                           </TooltipTrigger>
                           <TooltipContent>
                              <p>{t('score.weighted', { weightedPercent })}</p>
                           </TooltipContent>
                        </Tooltip>
                     )}
                  </Stat>
               )}
            </div>
         ) : null}

         <div className={cn('flex items-center', isCompact ? 'gap-1' : 'gap-2')}>
            {showScoreStat && (
               <Tooltip>
                  <TooltipTrigger asChild>
                     <Stat className={cn(statClassName, 'cursor-default')}>
                        {scoreStatMode === 'modsOnly' ? (
                           <span className="font-semibold">{score.mods.join(', ')}</span>
                        ) : (
                           <span className="inline-flex items-baseline gap-1.5">
                              {formatNumber(score.modifiedScore)}
                              {hasMods && <span className="text-muted-foreground text-[10px] font-semibold">{score.mods.join(', ')}</span>}
                           </span>
                        )}
                     </Stat>
                  </TooltipTrigger>
                  <TooltipContent>
                     <p>{scoreStatMode === 'modsOnly' ? t('score.mods') : t('score.score')}</p>
                  </TooltipContent>
               </Tooltip>
            )}
            <Stat
               icon={score.fullCombo ? Check : X}
               className={cn(
                  statClassName,
                  score.fullCombo
                     ? 'border-score-combo-full bg-score-combo-full/10 text-score-combo-full'
                     : 'border-score-combo-broken bg-score-combo-broken/10 text-score-combo-broken'
               )}
               valueClassName={score.fullCombo ? 'text-score-combo-full' : 'text-score-combo-broken'}
               iconClassName={cn(iconClassName, score.fullCombo ? 'text-score-combo-full' : 'text-score-combo-broken')}
            >
               {score.fullCombo ? 'FC' : missedTotal === 0 ? 'FC' : missedTotal}
            </Stat>
         </div>

         {timeSet && (
            <Stat icon={Clock} className={cn(statClassName, 'cursor-default')} iconClassName={iconClassName}>
               <Time short date={timeSet} />
            </Stat>
         )}
      </div>
   );
}

function AccuracyPPPopover({
   score,
   ppContext,
   isCompact,
   trigger
}: {
   score: ScoreStatsScore;
   ppContext: ScorePPContext;
   isCompact: boolean;
   trigger: ReactNode;
}) {
   const t = useTranslations();
   const maxAccuracyPercent = ppContext.positiveModifiers ? 114 : 100;
   const actualAccuracyPercent = Math.min(maxAccuracyPercent, Math.max(0, score.accuracy * 100));
   const [open, setOpen] = useState(false);
   const [accuracyPercent, setAccuracyPercent] = useState(actualAccuracyPercent);
   const { data: ppCurveData, isLoading } = useQuery({
      queryKey: ['realmPPCurve', ppContext.realmId],
      queryFn: () => optionalApiData(getRealmPPCurve(ppContext.realmId)),
      enabled: open,
      staleTime: 5 * 60 * 1000
   });

   useEffect(() => {
      setAccuracyPercent(actualAccuracyPercent);
   }, [actualAccuracyPercent, maxAccuracyPercent]);

   const ppCurve = ppCurveData ? (ppContext.positiveModifiers ? ppCurveData.positiveModifierCurve : ppCurveData.curve) : null;
   const previewPP =
      Math.abs(accuracyPercent - actualAccuracyPercent) < 0.000001
         ? score.pp
         : ppCurve
           ? calculateCurvePP(accuracyPercent / 100, ppContext.maxPP, ppCurve)
           : null;

   function handleSliderChange(values: number[]) {
      const next = values[0];
      if (next == null) return;
      setAccuracyPercent(Math.min(maxAccuracyPercent, Math.max(0, next)));
   }

   function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
      const next = Number.parseFloat(event.currentTarget.value);
      if (!Number.isFinite(next)) return;
      setAccuracyPercent(Math.min(maxAccuracyPercent, Math.max(0, next)));
   }

   return (
      <Popover open={open} onOpenChange={setOpen}>
         <PopoverTrigger asChild>{trigger}</PopoverTrigger>
         <PopoverContent className="w-64 cursor-default p-3" align="end">
            <div className="flex flex-col gap-3">
               <div className="flex items-center justify-between gap-3">
                  <div>
                     <div className="text-foreground text-xs font-semibold">{t('score.accuracyPreview')}</div>
                  </div>
                  <Button
                     type="button"
                     variant="ghost-icon"
                     size="icon-xs"
                     onClick={() => setAccuracyPercent(actualAccuracyPercent)}
                     aria-label={t('score.resetAccuracyPreview')}
                  >
                     <RotateCcw className="size-3" />
                  </Button>
               </div>

               <div className="flex items-center gap-2">
                  <Slider
                     value={[accuracyPercent]}
                     onValueChange={handleSliderChange}
                     min={0}
                     max={maxAccuracyPercent}
                     step={0.01}
                     aria-label={t('score.accuracyPreview')}
                     className="min-w-0 flex-1"
                  />
                  <div className="relative w-24 shrink-0">
                     <Input
                        type="text"
                        inputMode="decimal"
                        value={accuracyPercent.toFixed(2)}
                        onChange={handleInputChange}
                        aria-label={t('score.accuracyPreview')}
                        className="h-7 pr-6 text-right text-xs tabular-nums"
                     />
                     <span className="text-muted-foreground pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-[10px]">%</span>
                  </div>
               </div>

               <div className="bg-secondary/35 flex items-center justify-between rounded border px-2 py-1.5">
                  <span className="text-muted-foreground text-[11px]">{t('common.pp')}</span>
                  <span
                     className={cn('text-foreground inline-flex min-h-4 items-center text-xs font-semibold tabular-nums', isCompact && 'text-[11px]')}
                  >
                     {isLoading && previewPP == null ? (
                        <Loader2 className="size-3 animate-spin opacity-60" />
                     ) : previewPP == null ? (
                        '--'
                     ) : (
                        `${formatPP(previewPP)}pp`
                     )}
                  </span>
               </div>
            </div>
         </PopoverContent>
      </Popover>
   );
}
