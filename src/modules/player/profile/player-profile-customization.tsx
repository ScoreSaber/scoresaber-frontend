'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';

import { Pin, Settings2 } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { useActionMutation } from '@/hooks/use-action-mutation';
import { useAuth } from '@/modules/auth';
import { updatePinnedScores } from '@/modules/player/actions/user/profile-customization';
import type { PlayerExtraAction } from '@/modules/player/operations/player-actions';
import { PlayerProfileCustomizationAccountTab } from '@/modules/player/profile/player-profile-customization-account-tab';
import {
   MAX_PINNED_SCORES,
   PlayerProfileCustomizationPinnedScoresTab,
   type PinnedScoreCustomizationScore,
   type PinnedScoreDraftItem
} from '@/modules/player/profile/player-profile-customization-pinned-scores-tab';
import {
   PlayerProfileCustomizationSheet,
   type PlayerProfileCustomizationSheetTab
} from '@/modules/player/profile/player-profile-customization-sheet';
import type { PlayerControllerGetPlayerResponse, PlayerControllerGetPlayerScoresDataItem } from '@/shared/api/generated/ApiParams';
import { cn } from '@/shared/format/helpers';
import Permissions from '@/shared/permissions';

type ProfileCustomizationTab = 'account' | 'pinned-scores' | 'more-soon';

interface PinnedScorePayloadItem {
   scoreId: number;
   comment: string;
}

interface PlayerProfileCustomizationProps {
   player: PlayerControllerGetPlayerResponse;
   patreonConnected: boolean;
   children: (props: {
      extraActions: PlayerExtraAction[];
      renderScoreAction: (score: PlayerControllerGetPlayerScoresDataItem) => ReactNode;
   }) => ReactNode;
}

export function PlayerProfileCustomization({ player, patreonConnected, children }: PlayerProfileCustomizationProps) {
   const t = useTranslations();
   const { user } = useAuth();
   const userPerms = user?.permissions ?? 0;
   const isOwnProfile = user?.id === player.id;
   const canUsePinnedScores = Permissions.isPPFarmer(userPerms);
   const canShowCustomization = isOwnProfile && !player.banned;
   const savedDraftItems = useMemo(() => createDraftItems(player.pinnedScores ?? []), [player.pinnedScores]);
   const savedPayload = useMemo(() => toPinnedScorePayload(savedDraftItems), [savedDraftItems]);
   const savedScoreIds = useMemo(() => new Set(savedDraftItems.map((item) => item.score.score.id)), [savedDraftItems]);
   const [open, setOpen] = useState(false);
   const [activeTab, setActiveTab] = useState<ProfileCustomizationTab>('account');
   const [draftItems, setDraftItems] = useState(savedDraftItems);
   const draftPayload = useMemo(() => toPinnedScorePayload(draftItems), [draftItems]);
   const mutation = useActionMutation();
   const dirty = !arePinnedScorePayloadsEqual(savedPayload, draftPayload);
   const saveDisabled = !canUsePinnedScores || !dirty || mutation.isPending;

   useEffect(() => {
      setDraftItems(savedDraftItems);
   }, [savedDraftItems]);

   if (!canShowCustomization) {
      return children({
         extraActions: [],
         renderScoreAction: () => null
      });
   }

   function openCustomization() {
      setActiveTab('account');
      setOpen(true);
   }

   function openWithScore(score: PlayerControllerGetPlayerScoresDataItem) {
      setDraftItems((current) => addDraftScore(current, score));
      setActiveTab('pinned-scores');
      setOpen(true);
   }

   function savePinnedScores() {
      mutation.runKeyed(
         'pinned-scores',
         () => updatePinnedScores({ pinnedScores: draftPayload }),
         t('player.customization.pinnedScores.saved'),
         t('player.customization.pinnedScores.saveFailed'),
         () => setOpen(false)
      );
   }

   const extraActions: PlayerExtraAction[] = [
      {
         id: 'profile-customization',
         label: t('player.customization.open'),
         icon: <Settings2 data-icon="inline-start" />,
         onSelect: openCustomization
      }
   ];
   const tabs: PlayerProfileCustomizationSheetTab<ProfileCustomizationTab>[] = [
      {
         value: 'account',
         label: t('player.customization.tabs.account'),
         body: <PlayerProfileCustomizationAccountTab />
      },
      {
         value: 'pinned-scores',
         label: t('player.customization.tabs.pinnedScores'),
         body: (
            <PlayerProfileCustomizationPinnedScoresTab
               draftItems={draftItems}
               canUsePinnedScores={canUsePinnedScores}
               patreonConnected={patreonConnected}
               dirty={dirty}
               saveDisabled={saveDisabled}
               savePending={mutation.isPending}
               onToggleScoreAction={(score, checked) => setDraftItems((current) => toggleDraftScore(current, score, checked))}
               onUpdateCommentAction={(scoreId, comment) => setDraftItems((current) => updateDraftComment(current, scoreId, comment))}
               onMoveScoreAction={(scoreId, direction) => setDraftItems((current) => moveDraftScore(current, scoreId, direction))}
               onSaveAction={savePinnedScores}
            />
         )
      },
      {
         value: 'more-soon',
         label: t('player.customization.tabs.moreSoon'),
         body: null,
         disabled: true
      }
   ];

   return (
      <>
         <PlayerProfileCustomizationSheet
            open={open}
            onOpenChange={setOpen}
            activeTab={activeTab}
            onActiveTabChange={setActiveTab}
            title={t('player.customization.title')}
            description={t('player.customization.description')}
            tabs={tabs}
         />
         {children({
            extraActions,
            renderScoreAction: (score) => (
               <PinnedScoreButton selected={savedScoreIds.has(score.score.id)} onClickAction={() => openWithScore(score)} />
            )
         })}
      </>
   );
}

function PinnedScoreButton({ selected, onClickAction }: { selected: boolean; onClickAction: () => void }) {
   const t = useTranslations();

   return (
      <Tooltip>
         <TooltipTrigger asChild>
            <Button
               type="button"
               variant="ghost-icon"
               size="icon-lg"
               className={cn(
                  'border-border/70 bg-background/85 hover:bg-background pointer-events-auto absolute -top-3 -left-3 z-30 size-9 overflow-hidden rounded-full border shadow-xs backdrop-blur',
                  'text-muted-foreground/70 hover:text-primary',
                  selected && 'border-primary/40 text-primary'
               )}
               aria-label={selected ? t('player.customization.pinnedScores.editPinnedScore') : t('player.customization.pinnedScores.pinScore')}
               onClick={onClickAction}
            >
               <Pin data-icon className={cn('absolute right-2 bottom-2 size-2.5 -rotate-[42deg]', selected && 'fill-current')} />
            </Button>
         </TooltipTrigger>
         <TooltipContent side="right" align="start">
            <p>{selected ? t('player.customization.pinnedScores.editPinnedScore') : t('player.customization.pinnedScores.pinScore')}</p>
         </TooltipContent>
      </Tooltip>
   );
}

function createDraftItems(pinnedScores: PlayerControllerGetPlayerResponse['pinnedScores']): PinnedScoreDraftItem[] {
   return pinnedScores.map((pinnedScore) => ({
      score: pinnedScore.score,
      comment: pinnedScore.comment
   }));
}

function addDraftScore(items: PinnedScoreDraftItem[], score: PlayerControllerGetPlayerScoresDataItem) {
   if (items.some((item) => item.score.score.id === score.score.id) || items.length >= MAX_PINNED_SCORES) return items;
   return [...items, { score, comment: '' }];
}

function toggleDraftScore(items: PinnedScoreDraftItem[], score: PinnedScoreCustomizationScore, checked: boolean) {
   const scoreId = score.score.id;
   if (!checked) return items.filter((item) => item.score.score.id !== scoreId);
   if (items.some((item) => item.score.score.id === scoreId) || items.length >= MAX_PINNED_SCORES) return items;
   return [...items, { score, comment: '' }];
}

function updateDraftComment(items: PinnedScoreDraftItem[], scoreId: number, comment: string) {
   return items.map((item) => (item.score.score.id === scoreId ? { ...item, comment } : item));
}

function moveDraftScore(items: PinnedScoreDraftItem[], scoreId: number, direction: -1 | 1) {
   const index = items.findIndex((item) => item.score.score.id === scoreId);
   if (index === -1) return items;

   const nextIndex = index + direction;
   if (nextIndex < 0 || nextIndex >= items.length) return items;

   const next = [...items];
   const [removed] = next.splice(index, 1);
   next.splice(nextIndex, 0, removed);
   return next;
}

function toPinnedScorePayload(items: PinnedScoreDraftItem[]): PinnedScorePayloadItem[] {
   return items.map((item) => ({
      scoreId: item.score.score.id,
      comment: item.comment.trim()
   }));
}

function arePinnedScorePayloadsEqual(a: PinnedScorePayloadItem[], b: PinnedScorePayloadItem[]) {
   if (a.length !== b.length) return false;

   return a.every((item, index) => item.scoreId === b[index].scoreId && item.comment === b[index].comment);
}
