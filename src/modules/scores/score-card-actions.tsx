'use client';

import { ChartSpline, ChevronDown, Play, Trophy } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { ReplayDialog } from '@/modules/scores/replay-dialog';
import type {
   LeaderboardControllerGetLeaderboardScoresByIdDataItem,
   PlayerControllerGetPlayerScoresDataItem
} from '@/shared/api/generated/ApiParams';
import { cn } from '@/shared/format/helpers';

interface ScoreCardActionsProps {
   score: PlayerControllerGetPlayerScoresDataItem['score'] | LeaderboardControllerGetLeaderboardScoresByIdDataItem;
   className?: string;
   expanded?: boolean;
   onToggleExpandedAction?: () => void;
   detailsExpanded?: boolean;
   onToggleDetailsAction?: () => void;
   mobileBottomRow?: boolean;
   tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
   replayTooltipSide?: 'top' | 'right' | 'bottom' | 'left';
}

export function ScoreCardActions({
   score,
   className,
   expanded,
   onToggleExpandedAction,
   detailsExpanded,
   onToggleDetailsAction,
   mobileBottomRow = false,
   tooltipSide = 'top',
   replayTooltipSide
}: ScoreCardActionsProps) {
   const t = useTranslations();
   const iconButtonClassName = 'h-auto w-auto cursor-default p-0 text-muted-foreground hover:bg-transparent hover:text-foreground';
   const disabledClassName = cn(iconButtonClassName, 'text-muted-foreground/30 hover:text-muted-foreground/30');
   const shouldCenterSingleAction = !score.hasReplay && !onToggleExpandedAction && !onToggleDetailsAction;
   const replayButton = score.hasReplay ? (
      <ReplayDialog
         scoreId={score.id}
         tooltip={t('score.watchReplay')}
         tooltipSide={replayTooltipSide ?? tooltipSide}
         trigger={({ replayUrl, openReplayAction }) => (
            <Button variant="ghost-icon" size="icon-xs" asChild className={iconButtonClassName}>
               <a href={replayUrl} target="_blank" rel="noopener noreferrer" onClick={openReplayAction} aria-label={t('score.watchReplay')}>
                  <Play data-icon />
               </a>
            </Button>
         )}
      />
   ) : (
      <Button type="button" variant="ghost-icon" size="icon-xs" className={disabledClassName} disabled aria-label={t('score.noReplayAvailable')}>
         <Play data-icon />
      </Button>
   );

   const detailsButton = onToggleDetailsAction ? (
      <Tooltip>
         <TooltipTrigger asChild>
            <Button
               type="button"
               variant="ghost-icon"
               size="icon-xs"
               onClick={onToggleDetailsAction}
               className={cn(iconButtonClassName, 'gap-0.5', detailsExpanded && 'text-foreground')}
               aria-label={detailsExpanded ? t('score.hideDetails') : t('score.showDetails')}
               aria-expanded={detailsExpanded}
            >
               <ChartSpline data-icon />
               <ChevronDown data-icon className={cn('transition-transform duration-200', detailsExpanded && 'rotate-180')} />
            </Button>
         </TooltipTrigger>
         <TooltipContent side={tooltipSide}>
            <p>{detailsExpanded ? t('score.hideDetails') : t('score.scoreDetails')}</p>
         </TooltipContent>
      </Tooltip>
   ) : (
      <Button
         type="button"
         variant="ghost-icon"
         size="icon-xs"
         className={cn(disabledClassName, 'gap-0.5')}
         disabled
         aria-label={t('score.noDetailsAvailable')}
      >
         <ChartSpline data-icon />
         <ChevronDown data-icon />
      </Button>
   );

   const expandButton = onToggleExpandedAction ? (
      <Tooltip>
         <TooltipTrigger asChild>
            <Button
               type="button"
               variant="ghost-icon"
               size="icon-xs"
               onClick={onToggleExpandedAction}
               className={cn(iconButtonClassName, 'gap-0.5', expanded && 'text-foreground')}
               aria-label={expanded ? t('score.collapseLeaderboard') : t('score.expandLeaderboard')}
               aria-expanded={expanded}
            >
               <Trophy data-icon />
               <ChevronDown data-icon className={cn('transition-transform duration-200', expanded && 'rotate-180')} />
            </Button>
         </TooltipTrigger>
         <TooltipContent side={tooltipSide}>
            <p>{expanded ? t('score.collapseLeaderboard') : t('score.expandLeaderboard')}</p>
         </TooltipContent>
      </Tooltip>
   ) : null;

   return (
      <div
         className={cn(
            'absolute z-20 flex items-center',
            mobileBottomRow ? 'flex-row gap-3 lg:flex-col lg:gap-1.5' : 'flex-col gap-1.5',
            mobileBottomRow ? 'bottom-2' : shouldCenterSingleAction ? 'top-1/2 right-2 -translate-y-1/2' : 'top-1/2 right-3 -translate-y-1/2',
            className
         )}
      >
         {mobileBottomRow ? (
            <div className="flex items-center gap-3 lg:flex-col lg:gap-1.5">
               {replayButton}
               <div className="flex gap-2 lg:flex-col lg:gap-1.5">
                  {detailsButton}
                  {expandButton}
               </div>
            </div>
         ) : (
            <>
               {replayButton}
               {detailsButton}
               {expandButton}
            </>
         )}
      </div>
   );
}
