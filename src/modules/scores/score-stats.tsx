'use client';

import { Check, Clock, Hash, Info, Star, Target, X } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import type {
   LeaderboardControllerGetLeaderboardScoresByIdDataItem,
   PlayerControllerGetPlayerScoresDataItem
} from '@/shared/api/generated/ApiParams';
import { Stat } from '@/shared/components/stat';
import { Time } from '@/shared/components/time';
import { cn, formatAccuracy, formatNumber, formatPP } from '@/shared/format/helpers';

type ScoreStatsScore = PlayerControllerGetPlayerScoresDataItem['score'] | LeaderboardControllerGetLeaderboardScoresByIdDataItem;

interface ScoreStatsProps {
   score: ScoreStatsScore;
   weightedPP?: string;
   weightedPercent?: string;
   showAccuracy?: boolean;
   showPP?: boolean;
   legacyAccuracy?: boolean;
   className?: string;
   timeSet?: string | Date;
}

export function ScoreStats({
   score,
   weightedPP,
   weightedPercent,
   showAccuracy = true,
   showPP = true,
   legacyAccuracy = false,
   className,
   timeSet
}: ScoreStatsProps) {
   const t = useTranslations();
   const tc = useTranslations();
   const accuracy = formatAccuracy(score.accuracy * 100);
   const missedTotal = score.missedNotes + score.badCuts;

   return (
      <div className={cn('text-foreground flex cursor-default flex-col flex-wrap items-center justify-center gap-1 text-sm lg:items-end', className)}>
         {showAccuracy && (
            <div className="flex gap-2 lg:mb-1">
               <Tooltip>
                  <TooltipTrigger asChild>
                     <Stat
                        icon={Target}
                        className={cn(
                           'cursor-default',
                           legacyAccuracy ? 'border-muted-foreground/30 bg-muted/40' : 'border-status-warning/40 bg-status-warning/10'
                        )}
                        valueClassName={legacyAccuracy ? 'text-muted-foreground' : 'text-score-accuracy-good'}
                     >
                        <span className="inline-flex items-center gap-1">
                           {accuracy}
                           {legacyAccuracy && <Info className="size-3 opacity-70" />}
                        </span>
                     </Stat>
                  </TooltipTrigger>
                  <TooltipContent>
                     <p>{legacyAccuracy ? t('score.legacyAccuracy') : t('score.accuracy')}</p>
                  </TooltipContent>
               </Tooltip>
               {showPP && score.pp > 0 && (
                  <Stat icon={Star} className="border-score-pp bg-score-pp/10" iconClassName="text-score-pp">
                     <Tooltip>
                        <TooltipTrigger asChild>
                           <span className="cursor-default">{formatPP(score.pp)}pp</span>
                        </TooltipTrigger>
                        <TooltipContent>
                           <p>{tc('common.performancePoints')}</p>
                        </TooltipContent>
                     </Tooltip>
                     {weightedPP && weightedPercent && (
                        <Tooltip>
                           <TooltipTrigger asChild>
                              <span className="ml-1.5 cursor-default text-[10px] opacity-70">[{weightedPP}pp]</span>
                           </TooltipTrigger>
                           <TooltipContent>
                              <p>{t('score.weighted', { weightedPercent })}</p>
                           </TooltipContent>
                        </Tooltip>
                     )}
                  </Stat>
               )}
            </div>
         )}

         <div className="flex items-center gap-2">
            <Tooltip>
               <TooltipTrigger asChild>
                  <Stat icon={Hash} className="cursor-default">
                     <span className="inline-flex items-baseline gap-1.5">
                        {formatNumber(score.modifiedScore)}
                        {score.mods.length > 0 && <span className="text-muted-foreground text-[10px] font-semibold">{score.mods.join(', ')}</span>}
                     </span>
                  </Stat>
               </TooltipTrigger>
               <TooltipContent>
                  <p>{t('score.score')}</p>
               </TooltipContent>
            </Tooltip>
            <Stat
               icon={score.fullCombo ? Check : X}
               className={cn(
                  score.fullCombo
                     ? 'border-score-combo-full bg-score-combo-full/10 text-score-combo-full'
                     : 'border-score-combo-broken bg-score-combo-broken/10 text-score-combo-broken'
               )}
               valueClassName={score.fullCombo ? 'text-score-combo-full' : 'text-score-combo-broken'}
               iconClassName={score.fullCombo ? 'text-score-combo-full' : 'text-score-combo-broken'}
            >
               {score.fullCombo ? 'FC' : missedTotal === 0 ? 'FC' : missedTotal}
            </Stat>
         </div>

         {timeSet && (
            <Stat icon={Clock} className="cursor-default">
               <Time short date={timeSet} />
            </Stat>
         )}
      </div>
   );
}
