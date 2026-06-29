'use client';

import type { ReactNode } from 'react';

import { ArrowDown, ArrowUp, Loader2, Save } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SheetFooter } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';

import type { PlayerControllerGetPlayerScoresDataItem } from '@/shared/api/generated/ApiParams';
import { ConditionalOverlay } from '@/shared/components/conditional-overlay';
import { SupporterRequiredOverlay } from '@/shared/components/supporter-required-overlay';
import { cn, formatAccuracy, formatNumber, formatPP } from '@/shared/format/helpers';

export const MAX_PINNED_SCORES = 6;

const PINNED_SCORE_COMMENT_MAX_LENGTH = 512;

export type PinnedScoreCustomizationScore = PlayerControllerGetPlayerScoresDataItem;

export interface PinnedScoreDraftItem {
   score: PinnedScoreCustomizationScore;
   comment: string;
}

interface PlayerProfileCustomizationPinnedScoresTabProps {
   draftItems: PinnedScoreDraftItem[];
   canUsePinnedScores: boolean;
   patreonConnected: boolean;
   dirty: boolean;
   saveDisabled: boolean;
   savePending: boolean;
   onToggleScoreAction: (score: PinnedScoreCustomizationScore, checked: boolean) => void;
   onUpdateCommentAction: (scoreId: number, comment: string) => void;
   onMoveScoreAction: (scoreId: number, direction: -1 | 1) => void;
   onSaveAction: () => void;
}

export function PlayerProfileCustomizationPinnedScoresTab({
   draftItems,
   canUsePinnedScores,
   patreonConnected,
   dirty,
   saveDisabled,
   savePending,
   onToggleScoreAction,
   onUpdateCommentAction,
   onMoveScoreAction,
   onSaveAction
}: PlayerProfileCustomizationPinnedScoresTabProps) {
   const t = useTranslations();

   return (
      <ConditionalOverlay
         shouldShow={() => !canUsePinnedScores}
         component={SupporterRequiredOverlay}
         componentProps={{
            patreonConnected,
            title: t('player.customization.pinnedScores.lockTitle'),
            description: t('player.customization.pinnedScores.lockDescription')
         }}
         className="flex min-h-0 flex-1 flex-col rounded-none"
         contentClassName="flex min-h-0 flex-1 flex-col"
         overlayClassName="min-h-80"
      >
         <ScrollArea className="min-h-0 flex-1">
            <div className="flex flex-col gap-5 px-5 py-4">
               <CustomizationSection
                  title={t('player.customization.pinnedScores.selected')}
                  description={t('player.customization.pinnedScores.selectedCount', {
                     count: draftItems.length,
                     max: MAX_PINNED_SCORES
                  })}
               >
                  {draftItems.length > 0 ? (
                     <div className="flex flex-col">
                        {draftItems.map((item, index) => {
                           const scoreId = item.score.score.id;
                           return (
                              <PinnedScoreEditorRow
                                 key={scoreId}
                                 item={item}
                                 index={index}
                                 totalItems={draftItems.length}
                                 onToggleScoreAction={onToggleScoreAction}
                                 onUpdateCommentAction={onUpdateCommentAction}
                                 onMoveScoreAction={onMoveScoreAction}
                              />
                           );
                        })}
                     </div>
                  ) : (
                     <p className="text-muted-foreground rounded-md border border-dashed p-4 text-center text-sm">
                        {t('player.customization.pinnedScores.emptySelected')}
                     </p>
                  )}
               </CustomizationSection>
            </div>
         </ScrollArea>
         <SheetFooter className="border-border/60 shrink-0 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className={cn('text-muted-foreground text-xs', dirty && 'text-foreground')}>
               {dirty ? t('player.customization.pinnedScores.unsaved') : t('player.customization.pinnedScores.noChanges')}
            </p>
            <Button type="button" disabled={saveDisabled} onClick={onSaveAction} className="cursor-pointer sm:min-w-24">
               {savePending ? <Loader2 data-icon="inline-start" className="animate-spin" /> : <Save data-icon="inline-start" />}
               {t('common.save')}
            </Button>
         </SheetFooter>
      </ConditionalOverlay>
   );
}

function PinnedScoreEditorRow({
   item,
   index,
   totalItems,
   onToggleScoreAction,
   onUpdateCommentAction,
   onMoveScoreAction
}: {
   item: PinnedScoreDraftItem;
   index: number;
   totalItems: number;
   onToggleScoreAction: (score: PinnedScoreCustomizationScore, checked: boolean) => void;
   onUpdateCommentAction: (scoreId: number, comment: string) => void;
   onMoveScoreAction: (scoreId: number, direction: -1 | 1) => void;
}) {
   const t = useTranslations();
   const scoreId = item.score.score.id;
   const inputId = `pinned-score-${scoreId}`;

   return (
      <div className="border-border/60 flex flex-col gap-2 border-b py-3 first:pt-0 last:border-b-0">
         <div className="flex items-start gap-2">
            <Checkbox id={inputId} checked onCheckedChange={(value) => onToggleScoreAction(item.score, value === true)} className="mt-1" />
            <Label htmlFor={inputId} className="min-w-0 flex-1 cursor-default">
               <ScoreSummary score={item.score} />
            </Label>
            <div className="flex items-center gap-1">
               <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  disabled={index === 0}
                  onClick={() => onMoveScoreAction(scoreId, -1)}
                  aria-label={t('player.customization.pinnedScores.moveUp')}
               >
                  <ArrowUp data-icon />
               </Button>
               <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  disabled={index === totalItems - 1}
                  onClick={() => onMoveScoreAction(scoreId, 1)}
                  aria-label={t('player.customization.pinnedScores.moveDown')}
               >
                  <ArrowDown data-icon />
               </Button>
            </div>
         </div>
         <Textarea
            value={item.comment}
            resize="none"
            maxLength={PINNED_SCORE_COMMENT_MAX_LENGTH}
            placeholder={t('player.customization.pinnedScores.commentPlaceholder')}
            aria-label={t('player.customization.pinnedScores.commentLabel', { score: item.score.leaderboard.map.songName })}
            onChange={(event) => onUpdateCommentAction(scoreId, event.target.value)}
         />
         <p className="text-muted-foreground text-right text-[11px] tabular-nums">
            {t('player.customization.pinnedScores.commentCount', {
               count: item.comment.length,
               max: PINNED_SCORE_COMMENT_MAX_LENGTH
            })}
         </p>
      </div>
   );
}

function CustomizationSection({ title, description, children }: { title: string; description?: ReactNode; children: ReactNode }) {
   return (
      <section className="flex flex-col gap-3">
         <div className="flex flex-col gap-1">
            <h3 className="text-sm font-semibold">{title}</h3>
            {description && <p className="text-muted-foreground text-xs">{description}</p>}
         </div>
         {children}
      </section>
   );
}

function ScoreSummary({ score }: { score: PinnedScoreCustomizationScore }) {
   return (
      <span className="block min-w-0">
         <span className="block truncate text-sm font-medium">{score.leaderboard.map.songName}</span>
         <span className="text-muted-foreground block truncate text-xs">
            #{formatNumber(score.score.rank)} / {formatAccuracy(score.score.accuracy * 100)} / {formatPP(score.score.pp)}pp
         </span>
      </span>
   );
}
