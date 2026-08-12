'use client';

import { useState } from 'react';

import { Camera, ChartSpline, ChevronDown, History, Play, Trash2 } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { useActionMutation } from '@/hooks/use-action-mutation';
import { useAuth } from '@/modules/auth';
import { useDenyahMode } from '@/modules/player/denyah/denyah-mode-context';
import { Runaway } from '@/modules/player/denyah/runaway';
import { deleteScore } from '@/modules/scores/actions/admin';
import { ReplayDialog } from '@/modules/scores/replay-dialog';
import type {
   LeaderboardControllerGetLeaderboardScoresByIdDataItem,
   PlayerControllerGetPlayerScoresDataItem
} from '@/shared/api/generated/ApiParams';
import { ConfirmDialog } from '@/shared/components/confirm-dialog';
import { cn } from '@/shared/format/helpers';
import Permissions from '@/shared/permissions';

interface ScoreCardActionsProps {
   score: PlayerControllerGetPlayerScoresDataItem['score'] | LeaderboardControllerGetLeaderboardScoresByIdDataItem;
   className?: string;
   historyExpanded?: boolean;
   onToggleHistoryAction?: () => void;
   detailsExpanded?: boolean;
   onToggleDetailsAction?: () => void;
   onShareAction?: () => void;
   mobileBottomRow?: boolean;
   bottomRowDesktopBreakpoint?: 'md' | 'lg';
   tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
   replayTooltipSide?: 'top' | 'right' | 'bottom' | 'left';
   deleteContext?: { playerName?: string; mapName?: string };
   allowDelete?: boolean;
}

export function ScoreCardActions({
   score,
   className,
   historyExpanded,
   onToggleHistoryAction,
   detailsExpanded,
   onToggleDetailsAction,
   onShareAction,
   mobileBottomRow = false,
   bottomRowDesktopBreakpoint = 'lg',
   tooltipSide = 'top',
   replayTooltipSide,
   deleteContext,
   allowDelete = true
}: ScoreCardActionsProps) {
   const t = useTranslations();
   const { user } = useAuth();
   const denyahMode = useDenyahMode();
   const deleteAction = useActionMutation();
   const [deleteOpen, setDeleteOpen] = useState(false);
   const canDelete = allowDelete && !!user && Permissions.checkPermissionNumber(user.permissions, Permissions.security.ADMIN);
   const bottomRowTouchTargetClassName =
      bottomRowDesktopBreakpoint === 'md'
         ? 'max-md:pointer-coarse:min-h-8 max-md:pointer-coarse:min-w-8'
         : 'max-lg:pointer-coarse:min-h-8 max-lg:pointer-coarse:min-w-8';
   const bottomRowOffsetClassName =
      bottomRowDesktopBreakpoint === 'md' ? 'bottom-2 max-md:pointer-coarse:bottom-0' : 'bottom-2 max-lg:pointer-coarse:bottom-0';
   const iconButtonClassName = cn(
      'h-auto w-auto cursor-default p-0 text-muted-foreground hover:bg-transparent hover:text-foreground',
      mobileBottomRow && bottomRowTouchTargetClassName
   );
   const disabledClassName = cn(iconButtonClassName, 'text-muted-foreground/30 hover:text-muted-foreground/30');
   const shouldCenterSingleAction = !score.hasReplay && !onToggleHistoryAction && !onToggleDetailsAction && !canDelete;
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

   const shareButton = onShareAction ? (
      <Button
         type="button"
         variant="ghost-icon"
         size="icon-xs"
         onClick={onShareAction}
         className={cn(iconButtonClassName, bottomRowDesktopBreakpoint === 'md' ? 'md:hidden' : 'lg:hidden')}
         aria-label={t('score.share.shareRow')}
      >
         <Camera data-icon />
      </Button>
   ) : null;

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
   const runawayReplayButton = (
      <Runaway enabled={denyahMode} maxDodges={1}>
         {replayButton}
      </Runaway>
   );
   const runawayDetailsButton = (
      <Runaway enabled={denyahMode} maxDodges={1}>
         {detailsButton}
      </Runaway>
   );
   const runawayHistoryButton = historyButton && (
      <Runaway enabled={denyahMode} maxDodges={1}>
         {historyButton}
      </Runaway>
   );
   const deleteButton = canDelete ? (
      <Tooltip>
         <TooltipTrigger asChild>
            <Button
               type="button"
               variant="ghost-icon"
               size="icon-xs"
               onClick={() => setDeleteOpen(true)}
               className={cn(iconButtonClassName, 'hover:text-destructive')}
               aria-label={t('score.delete.action')}
            >
               <Trash2 data-icon />
            </Button>
         </TooltipTrigger>
         <TooltipContent side={tooltipSide}>
            <p>{t('score.delete.action')}</p>
         </TooltipContent>
      </Tooltip>
   ) : null;

   function confirmDelete() {
      deleteAction.run(
         () => deleteScore(score.id),
         t('score.delete.success'),
         t('score.delete.failed'),
         () => setDeleteOpen(false)
      );
   }

   return (
      <>
         <div
            className={cn(
               'absolute z-20 flex items-center',
               mobileBottomRow ? bottomRowDesktopClassName : 'flex-col gap-1.5',
               mobileBottomRow
                  ? bottomRowOffsetClassName
                  : shouldCenterSingleAction
                    ? 'top-1/2 right-2 -translate-y-1/2'
                    : 'top-1/2 right-3 -translate-y-1/2',
               className
            )}
         >
            {mobileBottomRow ? (
               <div className={cn('flex items-center', bottomRowDesktopClassName)}>
                  {runawayReplayButton}
                  <div className={cn('flex', bottomRowDetailsClassName)}>
                     {runawayDetailsButton}
                     {runawayHistoryButton}
                  </div>
                  {shareButton}
                  {deleteButton}
               </div>
            ) : (
               <>
                  {runawayReplayButton}
                  {runawayDetailsButton}
                  {runawayHistoryButton}
                  {deleteButton}
               </>
            )}
         </div>
         <ConfirmDialog
            open={deleteOpen}
            onOpenChangeAction={setDeleteOpen}
            title={t('score.delete.title')}
            description={t('score.delete.description', {
               player: deleteContext?.playerName ?? t('score.delete.unknownPlayer'),
               map: deleteContext?.mapName ?? t('score.delete.unknownMap')
            })}
            confirmLabel={t('score.delete.action')}
            variant="destructive"
            pending={deleteAction.isPending}
            onConfirmAction={confirmDelete}
         />
      </>
   );
}
