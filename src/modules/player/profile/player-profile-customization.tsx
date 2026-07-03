'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';

import { Loader2, Pin, Save, Settings2 } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';
import { SheetFooter } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { useActionMutation } from '@/hooks/use-action-mutation';
import { useAuth } from '@/modules/auth';
import {
   resetProfileBackground,
   updatePinnedScores,
   updateProfileCustomization,
   uploadProfileBackground
} from '@/modules/player/actions/user/profile-customization';
import type { MetricKey } from '@/modules/player/chart/chart-types';
import type { PlayerExtraAction } from '@/modules/player/operations/player-actions';
import {
   getReadableProfileAccentForeground,
   normalizeProfileCustomizationStyle,
   type PlayerProfileCustomizationStyle
} from '@/modules/player/profile/player-profile-accent';
import { PlayerProfileCustomizationAccountTab } from '@/modules/player/profile/player-profile-customization-account-tab';
import {
   BADGE_COMMENT_MAX_LENGTH,
   PlayerProfileCustomizationBadgesTab,
   type BadgeCustomizationItem
} from '@/modules/player/profile/player-profile-customization-badges-tab';
import {
   DEFAULT_PROFILE_LAYOUT,
   PlayerProfileCustomizationLayoutTab,
   REQUIRED_PROFILE_SECTION_IDS,
   type ProfileLayoutCustomization,
   type ProfileSectionId
} from '@/modules/player/profile/player-profile-customization-layout-tab';
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
import { PlayerProfileCustomizationStyleTab } from '@/modules/player/profile/player-profile-customization-style-tab';
import type { PlayerProfileStatId } from '@/modules/player/profile/player-profile-header';
import type { PlayerControllerGetPlayerResponse, PlayerControllerGetPlayerScoresDataItem } from '@/shared/api/generated/ApiParams';
import { cn } from '@/shared/format/helpers';
import Permissions from '@/shared/permissions';
import type { ActionResult } from '@/shared/result/action';

type ProfileCustomizationTab = 'account' | 'style' | 'layout' | 'pinned-scores' | 'badges';
type PlayerProfileCustomizationView = PlayerProfileCustomizationStyle & {
   badgeOrder: number[] | null;
   badgeComments: Record<string, string> | null;
   statOrder: PlayerProfileStatId[] | null;
   chartMetricIds: MetricKey[] | null;
   sectionOrder: ProfileSectionId[] | null;
};

interface PinnedScorePayloadItem {
   scoreId: number;
   comment: string;
}

interface PlayerProfileCustomizationSaveResult {
   style: PlayerProfileCustomizationStyle;
   pinnedItems: PinnedScoreDraftItem[];
   badgeItems: BadgeCustomizationItem[];
   layout: ProfileLayoutCustomization;
}

interface PlayerProfileCustomizationProps {
   player: PlayerControllerGetPlayerResponse;
   patreonConnected: boolean;
   children: (props: {
      extraActions: PlayerExtraAction[];
      profileCustomization: PlayerProfileCustomizationView;
      renderScoreAction: (score: PlayerControllerGetPlayerScoresDataItem) => ReactNode;
   }) => ReactNode;
}

export function PlayerProfileCustomization({ player, patreonConnected, children }: PlayerProfileCustomizationProps) {
   const t = useTranslations();
   const { user } = useAuth();
   const userPerms = user?.permissions ?? 0;
   const isOwnProfile = user?.id === player.id;
   const isStaffProfile = Permissions.checkPermissionNumber(userPerms, Permissions.groups.ALL_STAFF);
   const canUseAccentStyle = Permissions.isPPFarmer(userPerms);
   const canToggleSupporterNameColor = Permissions.isSupporter(userPerms) && !isStaffProfile;
   const canUseStyle = canUseAccentStyle || canToggleSupporterNameColor;
   const canUsePinnedScores = Permissions.isPPFarmer(userPerms);
   const canUseBadgeCustomization = Permissions.isPPFarmer(userPerms);
   const canUseLayoutCustomization = Permissions.isPPFarmer(userPerms);
   const canShowCustomization = isOwnProfile && !player.banned;
   const rawStyle = player.profileCustomization;
   const initialStyle = useMemo(
      () => normalizeProfileCustomizationStyle(rawStyle),
      [
         rawStyle?.backgroundImage,
         rawStyle?.backgroundImageVersion,
         rawStyle?.accentColor,
         rawStyle?.accentForegroundColor,
         rawStyle?.accentForegroundActiveColor,
         rawStyle?.supporterNameColorEnabled
      ]
   );
   const initialLayout = useMemo(() => normalizeProfileLayout(rawStyle), [rawStyle?.statOrder, rawStyle?.chartMetricIds, rawStyle?.sectionOrder]);
   const [savedStyle, setSavedStyle] = useState(initialStyle);
   const [draftStyle, setDraftStyle] = useState(initialStyle);
   const [draftBackgroundFile, setDraftBackgroundFile] = useState<File | null>(null);
   const [draftBackgroundPreviewUrl, setDraftBackgroundPreviewUrl] = useState<string | null>(null);
   const initialBadgeItems = useMemo(
      () => createBadgeItems(player.badges, rawStyle?.badgeOrder, rawStyle?.badgeComments),
      [player.badges, rawStyle?.badgeOrder, rawStyle?.badgeComments]
   );
   const [savedBadgeItems, setSavedBadgeItems] = useState(initialBadgeItems);
   const [draftBadgeItems, setDraftBadgeItems] = useState(initialBadgeItems);
   const [savedLayout, setSavedLayout] = useState(initialLayout);
   const [draftLayout, setDraftLayout] = useState(initialLayout);
   const initialPinnedItems = useMemo(() => createDraftItems(player.pinnedScores ?? []), [player.pinnedScores]);
   const [savedPinnedItems, setSavedPinnedItems] = useState(initialPinnedItems);
   const [draftItems, setDraftItems] = useState(initialPinnedItems);
   const savedPayload = useMemo(() => toPinnedScorePayload(savedPinnedItems), [savedPinnedItems]);
   const savedScoreIds = useMemo(() => new Set(savedPinnedItems.map((item) => item.score.score.id)), [savedPinnedItems]);
   const [open, setOpen] = useState(false);
   const [activeTab, setActiveTab] = useState<ProfileCustomizationTab>('account');
   const draftPayload = useMemo(() => toPinnedScorePayload(draftItems), [draftItems]);
   const customizationMutation = useActionMutation<PlayerProfileCustomizationSaveResult>();
   const pinnedDirty = !arePinnedScorePayloadsEqual(savedPayload, draftPayload);
   const styleDirty = !areProfileCustomizationStylesEqual(savedStyle, draftStyle);
   const badgeDirty = !areBadgeCustomizationItemsEqual(savedBadgeItems, draftBadgeItems);
   const layoutDirty = !areProfileLayoutsEqual(savedLayout, draftLayout);
   const profileDirty = pinnedDirty || styleDirty || badgeDirty || layoutDirty;
   const profileSaveableDirty =
      (styleDirty && canUseStyle) ||
      (pinnedDirty && canUsePinnedScores) ||
      (badgeDirty && canUseBadgeCustomization) ||
      (layoutDirty && canUseLayoutCustomization);
   const profileSaveDisabled = !profileSaveableDirty || customizationMutation.isPending;
   const profileCustomization = open
      ? withProfileCustomizations(draftStyle, draftBadgeItems, draftLayout)
      : withProfileCustomizations(savedStyle, savedBadgeItems, savedLayout);

   useEffect(() => {
      setSavedPinnedItems(initialPinnedItems);
      setDraftItems(initialPinnedItems);
   }, [initialPinnedItems]);

   useEffect(() => {
      setSavedBadgeItems(initialBadgeItems);
      setDraftBadgeItems(initialBadgeItems);
   }, [initialBadgeItems]);

   useEffect(() => {
      setSavedLayout(initialLayout);
      setDraftLayout(initialLayout);
   }, [initialLayout]);

   useEffect(() => {
      return () => {
         if (draftBackgroundPreviewUrl) {
            URL.revokeObjectURL(draftBackgroundPreviewUrl);
         }
      };
   }, [draftBackgroundPreviewUrl]);

   useEffect(() => {
      setSavedStyle(initialStyle);
      setDraftStyle(initialStyle);
      clearDraftBackgroundFile();
   }, [initialStyle]);

   if (!canShowCustomization) {
      return children({
         extraActions: [],
         profileCustomization: withProfileCustomizations(initialStyle, initialBadgeItems, initialLayout),
         renderScoreAction: () => null
      });
   }

   function changeOpen(nextOpen: boolean) {
      if (!nextOpen) {
         setDraftStyle(savedStyle);
         setDraftItems(savedPinnedItems);
         setDraftBadgeItems(savedBadgeItems);
         setDraftLayout(savedLayout);
         clearDraftBackgroundFile();
      }
      setOpen(nextOpen);
   }

   function openCustomization() {
      setDraftStyle(savedStyle);
      setDraftItems(savedPinnedItems);
      setDraftBadgeItems(savedBadgeItems);
      setDraftLayout(savedLayout);
      clearDraftBackgroundFile();
      setActiveTab('account');
      setOpen(true);
   }

   function openWithScore(score: PlayerControllerGetPlayerScoresDataItem) {
      setDraftStyle(savedStyle);
      setDraftBadgeItems(savedBadgeItems);
      setDraftLayout(savedLayout);
      clearDraftBackgroundFile();
      setDraftItems(addDraftScore(savedPinnedItems, score));
      setActiveTab('pinned-scores');
      setOpen(true);
   }

   function clearDraftBackgroundFile() {
      setDraftBackgroundFile(null);
      setDraftBackgroundPreviewUrl(null);
   }

   function updateBackgroundFile(file: File) {
      if (!canUseAccentStyle) return;

      const previewUrl = URL.createObjectURL(file);
      setDraftBackgroundFile(file);
      setDraftBackgroundPreviewUrl(previewUrl);
      setDraftStyle((current) => ({ ...current, backgroundImage: previewUrl, backgroundImageVersion: null }));
   }

   function resetBackground() {
      if (!canUseAccentStyle) return;

      clearDraftBackgroundFile();
      setDraftStyle((current) => ({ ...current, backgroundImage: null, backgroundImageVersion: null }));
   }

   async function saveProfileCustomizationData(): Promise<ActionResult<PlayerProfileCustomizationSaveResult>> {
      let nextStyle = savedStyle;
      let nextBadgeItems = savedBadgeItems;
      let nextLayout = savedLayout;
      const draftStyleForSave = materializeProfileCustomizationStyle(draftStyle);
      const savedStyleForSave = materializeProfileCustomizationStyle(savedStyle);

      if ((styleDirty && canUseStyle) || (badgeDirty && canUseBadgeCustomization) || (layoutDirty && canUseLayoutCustomization)) {
         const customizationResult = await updateProfileCustomization({
            accentColor: canUseAccentStyle ? draftStyleForSave.accentColor : savedStyleForSave.accentColor,
            accentForegroundColor: canUseAccentStyle ? draftStyleForSave.accentForegroundColor : savedStyleForSave.accentForegroundColor,
            accentForegroundActiveColor: canUseAccentStyle
               ? draftStyleForSave.accentForegroundActiveColor
               : savedStyleForSave.accentForegroundActiveColor,
            supporterNameColorEnabled: canToggleSupporterNameColor ? draftStyle.supporterNameColorEnabled : true,
            badgeOrder: canUseBadgeCustomization
               ? (badgeDirty ? draftBadgeItems : savedBadgeItems).map((item) => item.badge.id)
               : (rawStyle?.badgeOrder ?? null),
            badgeComments: canUseBadgeCustomization
               ? toBadgeCommentsPayload(badgeDirty ? draftBadgeItems : savedBadgeItems)
               : (rawStyle?.badgeComments ?? null),
            statOrder: canUseLayoutCustomization ? (layoutDirty ? draftLayout.statOrder : savedLayout.statOrder) : (rawStyle?.statOrder ?? null),
            chartMetricIds: canUseLayoutCustomization
               ? layoutDirty
                  ? draftLayout.chartMetricIds
                  : savedLayout.chartMetricIds
               : (rawStyle?.chartMetricIds ?? null),
            sectionOrder: canUseLayoutCustomization
               ? layoutDirty
                  ? draftLayout.sectionOrder
                  : savedLayout.sectionOrder
               : (rawStyle?.sectionOrder ?? null)
         });
         if (!customizationResult.ok) return { ok: false, error: customizationResult.error };

         nextStyle = normalizeProfileCustomizationSaveResult(customizationResult.value, canUseAccentStyle ? draftStyleForSave : savedStyleForSave);
         nextBadgeItems = createBadgeItems(player.badges, customizationResult.value.badgeOrder, customizationResult.value.badgeComments);
         nextLayout = normalizeProfileLayout(customizationResult.value);
      }

      if (styleDirty && canUseStyle && canUseAccentStyle && draftBackgroundFile) {
         const formData = new FormData();
         formData.set('backgroundImage', draftBackgroundFile);

         const backgroundResult = await uploadProfileBackground(formData);
         if (!backgroundResult.ok) return { ok: false, error: backgroundResult.error };

         nextStyle = normalizeProfileCustomizationSaveResult(backgroundResult.value, nextStyle);
      } else if (styleDirty && canUseStyle && canUseAccentStyle && draftStyle.backgroundImage === null && savedStyle.backgroundImage !== null) {
         const backgroundResult = await resetProfileBackground();
         if (!backgroundResult.ok) return { ok: false, error: backgroundResult.error };

         nextStyle = normalizeProfileCustomizationSaveResult(backgroundResult.value, nextStyle);
      }

      if (pinnedDirty && canUsePinnedScores) {
         const pinnedResult = await updatePinnedScores({ pinnedScores: draftPayload });
         if (!pinnedResult.ok) return { ok: false, error: pinnedResult.error };
      }

      return {
         ok: true,
         value: {
            style: nextStyle,
            pinnedItems: canUsePinnedScores ? draftItems : savedPinnedItems,
            badgeItems: nextBadgeItems,
            layout: nextLayout
         }
      };
   }

   function saveProfileCustomization() {
      customizationMutation.runKeyed(
         'profile-customization',
         () => saveProfileCustomizationData(),
         t('player.customization.saved'),
         t('player.customization.saveFailed'),
         ({ style, pinnedItems, badgeItems, layout }) => {
            const nextLayout = {
               statOrder: [...layout.statOrder],
               chartMetricIds: [...layout.chartMetricIds],
               sectionOrder: [...layout.sectionOrder]
            };

            setSavedStyle(style);
            setDraftStyle(style);
            setSavedPinnedItems(pinnedItems);
            setDraftItems(pinnedItems);
            setSavedBadgeItems(badgeItems);
            setDraftBadgeItems(badgeItems);
            setSavedLayout(nextLayout);
            setDraftLayout(nextLayout);
            clearDraftBackgroundFile();
            setOpen(false);
         }
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
         value: 'style',
         label: t('player.customization.tabs.style'),
         body: (
            <PlayerProfileCustomizationStyleTab
               draftStyle={draftStyle}
               canUseAccentStyle={canUseAccentStyle}
               canToggleSupporterNameColor={canToggleSupporterNameColor}
               patreonConnected={patreonConnected}
               backgroundFile={draftBackgroundFile}
               savePending={customizationMutation.isPending}
               onUpdateStyleAction={setDraftStyle}
               onUpdateBackgroundFileAction={updateBackgroundFile}
               onResetBackgroundAction={resetBackground}
            />
         )
      },
      {
         value: 'layout',
         label: t('player.customization.tabs.layout'),
         body: (
            <PlayerProfileCustomizationLayoutTab
               draftLayout={draftLayout}
               canUseLayoutCustomization={canUseLayoutCustomization}
               patreonConnected={patreonConnected}
               onToggleStatAction={(statId, checked) =>
                  setDraftLayout((current) => ({
                     ...current,
                     statOrder: toggleOrderedLayoutItem(current.statOrder, statId, checked, DEFAULT_PROFILE_LAYOUT.statOrder)
                  }))
               }
               onMoveStatAction={(statId, direction) =>
                  setDraftLayout((current) => ({ ...current, statOrder: moveLayoutItem(current.statOrder, statId, direction) }))
               }
               onToggleChartMetricAction={(metric, checked) =>
                  setDraftLayout((current) => ({
                     ...current,
                     chartMetricIds: checked
                        ? toggleOrderedLayoutItem(current.chartMetricIds, metric, true, DEFAULT_PROFILE_LAYOUT.chartMetricIds)
                        : current.chartMetricIds.filter((item) => item !== metric)
                  }))
               }
               onToggleSectionAction={(sectionId, checked) =>
                  setDraftLayout((current) => ({
                     ...current,
                     sectionOrder:
                        REQUIRED_PROFILE_SECTION_IDS.includes(sectionId) && !checked
                           ? current.sectionOrder
                           : toggleOrderedLayoutItem(current.sectionOrder, sectionId, checked, DEFAULT_PROFILE_LAYOUT.sectionOrder)
                  }))
               }
               onMoveSectionAction={(sectionId, direction) =>
                  setDraftLayout((current) => ({ ...current, sectionOrder: moveLayoutItem(current.sectionOrder, sectionId, direction) }))
               }
            />
         )
      },
      {
         value: 'pinned-scores',
         label: t('player.customization.tabs.pinnedScores'),
         body: (
            <PlayerProfileCustomizationPinnedScoresTab
               draftItems={draftItems}
               canUsePinnedScores={canUsePinnedScores}
               patreonConnected={patreonConnected}
               onToggleScoreAction={(score, checked) => setDraftItems((current) => toggleDraftScore(current, score, checked))}
               onUpdateCommentAction={(scoreId, comment) => setDraftItems((current) => updateDraftComment(current, scoreId, comment))}
               onMoveScoreAction={(scoreId, direction) => setDraftItems((current) => moveDraftScore(current, scoreId, direction))}
            />
         )
      },
      {
         value: 'badges',
         label: t('player.customization.tabs.badges'),
         body: (
            <PlayerProfileCustomizationBadgesTab
               badges={player.badges}
               draftItems={draftBadgeItems}
               canUseBadgeCustomization={canUseBadgeCustomization}
               patreonConnected={patreonConnected}
               onToggleBadgeAction={(badge, checked) => setDraftBadgeItems((current) => toggleDraftBadge(current, badge, checked))}
               onUpdateCommentAction={(badgeId, comment) => setDraftBadgeItems((current) => updateDraftBadgeComment(current, badgeId, comment))}
               onMoveBadgeAction={(badgeId, direction) => setDraftBadgeItems((current) => moveDraftBadge(current, badgeId, direction))}
            />
         )
      }
   ];

   return (
      <>
         <PlayerProfileCustomizationSheet
            open={open}
            onOpenChange={changeOpen}
            activeTab={activeTab}
            onActiveTabChange={setActiveTab}
            title={t('player.customization.title')}
            description={t('player.customization.description')}
            tabs={tabs}
            footer={
               <SheetFooter className="border-border/60 shrink-0 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className={cn('text-muted-foreground text-xs', profileDirty && 'text-foreground')}>
                     {profileDirty ? t('player.customization.unsaved') : t('player.customization.noChanges')}
                  </p>
                  <Button type="button" disabled={profileSaveDisabled} onClick={saveProfileCustomization} className="cursor-pointer sm:min-w-24">
                     {customizationMutation.isPending ? (
                        <Loader2 data-icon="inline-start" className="animate-spin" />
                     ) : (
                        <Save data-icon="inline-start" />
                     )}
                     {t('common.save')}
                  </Button>
               </SheetFooter>
            }
         />
         {children({
            extraActions,
            profileCustomization,
            renderScoreAction: (score) => (
               <PinnedScoreButton selected={savedScoreIds.has(score.score.id)} onClickAction={() => openWithScore(score)} />
            )
         })}
      </>
   );
}

function PinnedScoreButton({ selected, onClickAction }: { selected: boolean; onClickAction: () => void }) {
   const t = useTranslations();
   const [hovered, setHovered] = useState(false);
   const highlighted = selected || hovered;
   const pinStyle = highlighted
      ? {
           color: 'var(--profile-accent, var(--primary))'
        }
      : undefined;

   return (
      <Tooltip>
         <TooltipTrigger asChild>
            <Button
               type="button"
               variant="ghost-icon"
               size="icon-lg"
               className={cn(
                  'border-border/70 bg-background/85 hover:bg-background pointer-events-auto absolute -top-3 -left-3 z-30 size-9 overflow-hidden rounded-full border shadow-xs backdrop-blur',
                  'text-muted-foreground/70'
               )}
               aria-label={selected ? t('player.customization.pinnedScores.editPinnedScore') : t('player.customization.pinnedScores.pinScore')}
               onClick={onClickAction}
               onPointerEnter={() => setHovered(true)}
               onPointerLeave={() => setHovered(false)}
               onFocus={() => setHovered(true)}
               onBlur={() => setHovered(false)}
            >
               <Pin data-icon className={cn('absolute right-2 bottom-2 size-2.5 -rotate-[42deg]', selected && 'fill-current')} style={pinStyle} />
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

function createBadgeItems(
   badges: PlayerControllerGetPlayerResponse['badges'],
   badgeOrder?: number[] | null,
   badgeComments?: Record<string, string> | null
): BadgeCustomizationItem[] {
   const badgesById = new Map(badges.map((badge) => [badge.id, badge]));
   const orderedBadges = badgeOrder ? badgeOrder.map((badgeId) => badgesById.get(badgeId)).filter((badge) => badge !== undefined) : badges;

   return orderedBadges.map((badge) => ({
      badge,
      comment: badgeComments?.[String(badge.id)] ?? ''
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

function toggleDraftBadge(items: BadgeCustomizationItem[], badge: PlayerControllerGetPlayerResponse['badges'][number], checked: boolean) {
   if (!checked) return items.filter((item) => item.badge.id !== badge.id);
   if (items.some((item) => item.badge.id === badge.id)) return items;
   return [...items, { badge, comment: '' }];
}

function updateDraftBadgeComment(items: BadgeCustomizationItem[], badgeId: number, comment: string) {
   return items.map((item) => (item.badge.id === badgeId ? { ...item, comment: comment.slice(0, BADGE_COMMENT_MAX_LENGTH) } : item));
}

function moveDraftBadge(items: BadgeCustomizationItem[], badgeId: number, direction: -1 | 1) {
   const index = items.findIndex((item) => item.badge.id === badgeId);
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

function toBadgeCommentsPayload(items: BadgeCustomizationItem[]) {
   const comments: Record<string, string> = {};
   let hasComments = false;

   for (const item of items) {
      const comment = item.comment.trim();
      if (comment.length === 0) continue;

      comments[String(item.badge.id)] = comment;
      hasComments = true;
   }

   return hasComments ? comments : null;
}

function arePinnedScorePayloadsEqual(a: PinnedScorePayloadItem[], b: PinnedScorePayloadItem[]) {
   if (a.length !== b.length) return false;

   return a.every((item, index) => item.scoreId === b[index].scoreId && item.comment === b[index].comment);
}

function withProfileCustomizations(
   style: PlayerProfileCustomizationStyle,
   badges: BadgeCustomizationItem[],
   layout: ProfileLayoutCustomization
): PlayerProfileCustomizationView {
   return {
      ...style,
      badgeOrder: badges.map((item) => item.badge.id),
      badgeComments: toBadgeCommentsPayload(badges),
      statOrder: layout.statOrder,
      chartMetricIds: layout.chartMetricIds,
      sectionOrder: layout.sectionOrder
   };
}

function areBadgeCustomizationItemsEqual(a: BadgeCustomizationItem[], b: BadgeCustomizationItem[]) {
   if (a.length !== b.length) return false;

   return a.every((item, index) => item.badge.id === b[index].badge.id && item.comment.trim() === b[index].comment.trim());
}

function areProfileCustomizationStylesEqual(a: PlayerProfileCustomizationStyle, b: PlayerProfileCustomizationStyle) {
   const left = normalizeProfileCustomizationStyle(a);
   const right = normalizeProfileCustomizationStyle(b);

   return (
      left.accentColor === right.accentColor &&
      left.backgroundImage === right.backgroundImage &&
      left.backgroundImageVersion === right.backgroundImageVersion &&
      left.accentForegroundColor === right.accentForegroundColor &&
      left.accentForegroundActiveColor === right.accentForegroundActiveColor &&
      left.supporterNameColorEnabled === right.supporterNameColorEnabled
   );
}

function materializeProfileCustomizationStyle(style: PlayerProfileCustomizationStyle) {
   const normalized = normalizeProfileCustomizationStyle(style);
   if (!normalized.accentColor) return normalized;

   const readableForeground = getReadableProfileAccentForeground(normalized.accentColor);
   return {
      ...normalized,
      accentForegroundColor: normalized.accentForegroundColor ?? readableForeground,
      accentForegroundActiveColor: normalized.accentForegroundActiveColor ?? readableForeground
   };
}

function normalizeProfileCustomizationSaveResult(
   style: PlayerProfileCustomizationStyle,
   fallback: PlayerProfileCustomizationStyle
): PlayerProfileCustomizationStyle {
   const normalized = normalizeProfileCustomizationStyle(style);
   if (!normalized.accentColor) return normalized;

   const fallbackStyle = normalizeProfileCustomizationStyle(fallback);
   const fallbackForegrounds = fallbackStyle.accentColor === normalized.accentColor ? materializeProfileCustomizationStyle(fallbackStyle) : null;
   const readableForeground = getReadableProfileAccentForeground(normalized.accentColor);

   return {
      ...normalized,
      accentForegroundColor: normalized.accentForegroundColor ?? fallbackForegrounds?.accentForegroundColor ?? readableForeground,
      accentForegroundActiveColor: normalized.accentForegroundActiveColor ?? fallbackForegrounds?.accentForegroundActiveColor ?? readableForeground
   };
}

function normalizeProfileLayout(customization?: {
   statOrder?: PlayerProfileStatId[] | null;
   chartMetricIds?: MetricKey[] | null;
   sectionOrder?: ProfileSectionId[] | null;
}): ProfileLayoutCustomization {
   return {
      statOrder: normalizeOrderedLayoutItems(customization?.statOrder, DEFAULT_PROFILE_LAYOUT.statOrder),
      chartMetricIds: normalizeOrderedLayoutItems(customization?.chartMetricIds, DEFAULT_PROFILE_LAYOUT.chartMetricIds),
      sectionOrder: normalizeRequiredOrderedLayoutItems(
         customization?.sectionOrder,
         DEFAULT_PROFILE_LAYOUT.sectionOrder,
         REQUIRED_PROFILE_SECTION_IDS
      )
   };
}

function normalizeOrderedLayoutItems<T extends string>(items: T[] | null | undefined, defaultOrder: readonly T[]) {
   if (items === undefined || items === null) return [...defaultOrder];

   const allowedItems = new Set(defaultOrder);
   const seenItems = new Set<T>();
   return items.filter((item) => {
      if (!allowedItems.has(item) || seenItems.has(item)) return false;
      seenItems.add(item);
      return true;
   });
}

function normalizeRequiredOrderedLayoutItems<T extends string>(
   items: T[] | null | undefined,
   defaultOrder: readonly T[],
   requiredItems: readonly T[]
) {
   const orderedItems = normalizeOrderedLayoutItems(items, defaultOrder);
   const selectedItems = new Set(orderedItems);
   return [...orderedItems, ...defaultOrder.filter((item) => requiredItems.includes(item) && !selectedItems.has(item))];
}

function toggleOrderedLayoutItem<T extends string>(items: T[], item: T, checked: boolean, defaultOrder: readonly T[]) {
   if (!checked) return items.filter((current) => current !== item);
   if (items.includes(item)) return items;

   const selected = new Set([...items, item]);
   return defaultOrder.filter((current) => selected.has(current));
}

function moveLayoutItem<T>(items: T[], item: T, direction: -1 | 1) {
   const index = items.indexOf(item);
   if (index === -1) return items;

   const nextIndex = index + direction;
   if (nextIndex < 0 || nextIndex >= items.length) return items;

   const next = [...items];
   const [removed] = next.splice(index, 1);
   next.splice(nextIndex, 0, removed);
   return next;
}

function areProfileLayoutsEqual(a: ProfileLayoutCustomization, b: ProfileLayoutCustomization) {
   return (
      areStringArraysEqual(a.statOrder, b.statOrder) &&
      areStringArraysEqual(a.chartMetricIds, b.chartMetricIds) &&
      areStringArraysEqual(a.sectionOrder, b.sectionOrder)
   );
}

function areStringArraysEqual(a: readonly string[], b: readonly string[]) {
   if (a.length !== b.length) return false;
   return a.every((item, index) => item === b[index]);
}
