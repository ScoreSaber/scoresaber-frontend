'use client';

import { ChartSpline, ChevronDown, History, Play } from 'lucide-react';
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
   historyExpanded?: boolean;
   onToggleHistoryAction?: () => void;
   detailsExpanded?: boolean;
   onToggleDetailsAction?: () => void;
   mobileBottomRow?: boolean;
   bottomRowDesktopBreakpoint?: 'md' | 'lg';
   tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
   replayTooltipSide?: 'top' | 'right' | 'bottom' | 'left';
}

export function ScoreCardActions({
   score,
   className,
   historyExpanded,
   onToggleHistoryAction,
   detailsExpanded,
   onToggleDetailsAction,
   mobileBottomRow = false,
   bottomRowDesktopBreakpoint = 'lg',
   tooltipSide = 'top',
   replayTooltipSide
}: ScoreCardActionsProps) {
   const t = useTranslations();
   const iconButtonClassName = 'h-auto w-auto cursor-default p-0 text-muted-foreground hover:bg-transparent hover:text-foreground';
   const disabledClassName = cn(iconButtonClassName, 'text-muted-foreground/30 hover:text-muted-foreground/30');
   const shouldCenterSingleAction = !score.hasReplay && !onToggleHistoryAction && !onToggleDetailsAction;
   const bottomRowDesktopClassName =
      bottomRowDesktopBreakpoint === 'md' ? 'flex-row gap-3 md:flex-col md:gap-1.5' : 'flex-row gap-3 lg:flex-col lg:gap-1.5';
   const bottomRowDetailsClassName = bottomRowDesktopBreakpoint === 'md' ? 'gap-2 md:flex-col md:gap-1.5' : 'gap-2 lg:flex-col lg:gap-1.5';
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

   const historyAvailable = score.hasHistory !== false;
   const historyButton = onToggleHistoryAction ? (
      historyAvailable ? (
         <Tooltip>
            <TooltipTrigger asChild>
               <Button
                  type="button"
                  variant="ghost-icon"
                  size="icon-xs"
                  onClick={onToggleHistoryAction}
                  className={cn(iconButtonClassName, 'gap-0.5', historyExpanded && 'text-foreground')}
                  aria-label={historyExpanded ? t('score.hideHistory') : t('score.showHistory')}
                  aria-expanded={historyExpanded}
               >
                  <History data-icon />
                  <ChevronDown data-icon className={cn('transition-transform duration-200', historyExpanded && 'rotate-180')} />
               </Button>
            </TooltipTrigger>
            <TooltipContent side={tooltipSide}>
               <p>{t('score.scoreHistory')}</p>
            </TooltipContent>
         </Tooltip>
      ) : (
         <Button
            type="button"
            variant="ghost-icon"
            size="icon-xs"
            className={cn(disabledClassName, 'gap-0.5')}
            disabled
            aria-label={t('score.noScoreHistory')}
         >
            <History data-icon />
            <ChevronDown data-icon />
         </Button>
      )
   ) : null;

   return (
      <div
         className={cn(
            'absolute z-20 flex items-center',
            mobileBottomRow ? bottomRowDesktopClassName : 'flex-col gap-1.5',
            mobileBottomRow ? 'bottom-2' : shouldCenterSingleAction ? 'top-1/2 right-2 -translate-y-1/2' : 'top-1/2 right-3 -translate-y-1/2',
            className
         )}
      >
         {mobileBottomRow ? (
            <div className={cn('flex items-center', bottomRowDesktopClassName)}>
               {replayButton}
               <div className={cn('flex', bottomRowDetailsClassName)}>
                  {detailsButton}
                  {historyButton}
               </div>
            </div>
         ) : (
            <>
               {replayButton}
               {detailsButton}
               {historyButton}
            </>
         )}
      </div>
   );
}
