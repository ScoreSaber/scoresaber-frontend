'use client';

import { ArrowDown, ArrowUp, ImageIcon } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

import type { PlayerControllerGetPlayerResponse } from '@/shared/api/generated/ApiParams';
import { ConditionalOverlay } from '@/shared/components/conditional-overlay';
import { FadeInImage } from '@/shared/components/fade-in-image';
import { SupporterRequiredOverlay } from '@/shared/components/supporter-required-overlay';
import { cn } from '@/shared/format/helpers';

export const BADGE_COMMENT_MAX_LENGTH = 256;

export interface BadgeCustomizationItem {
   badge: PlayerControllerGetPlayerResponse['badges'][number];
   comment: string;
}

interface PlayerProfileCustomizationBadgesTabProps {
   badges: PlayerControllerGetPlayerResponse['badges'];
   draftItems: BadgeCustomizationItem[];
   canUseBadgeCustomization: boolean;
   patreonConnected: boolean;
   onToggleBadgeAction: (badge: PlayerControllerGetPlayerResponse['badges'][number], checked: boolean) => void;
   onUpdateCommentAction: (badgeId: number, comment: string) => void;
   onMoveBadgeAction: (badgeId: number, direction: -1 | 1) => void;
}

export function PlayerProfileCustomizationBadgesTab({
   badges,
   draftItems,
   canUseBadgeCustomization,
   patreonConnected,
   onToggleBadgeAction,
   onUpdateCommentAction,
   onMoveBadgeAction
}: PlayerProfileCustomizationBadgesTabProps) {
   const t = useTranslations();
   const selectedIds = new Set(draftItems.map((item) => item.badge.id));

   return (
      <div className="flex min-h-0 flex-1 flex-col">
         <ScrollArea className="min-h-0 flex-1">
            <div className="flex flex-col gap-4 px-5 py-4">
               <ConditionalOverlay
                  shouldShow={() => !canUseBadgeCustomization}
                  component={SupporterRequiredOverlay}
                  componentProps={{
                     patreonConnected,
                     title: t('player.customization.badges.lockTitle'),
                     description: t('player.customization.badges.lockDescription')
                  }}
                  className={cn('rounded-md', canUseBadgeCustomization && 'overflow-visible', !canUseBadgeCustomization && 'min-h-80')}
                  overlayClassName="min-h-80"
               >
                  {badges.length === 0 ? (
                     <div className="border-border/60 bg-muted/25 text-muted-foreground rounded-md border border-dashed px-3 py-8 text-center text-sm">
                        {t('player.customization.badges.empty')}
                     </div>
                  ) : (
                     <div className="flex flex-col gap-3">
                        {badges.map((badge) => {
                           const selectedIndex = draftItems.findIndex((item) => item.badge.id === badge.id);
                           const selected = selectedIndex !== -1;
                           const comment = selected ? draftItems[selectedIndex].comment : '';

                           return (
                              <div key={badge.id} className="border-border/60 flex min-w-0 flex-col gap-2 border-b pb-3 last:border-b-0 last:pb-0">
                                 <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2">
                                    <Checkbox
                                       id={`profile-badge-${badge.id}`}
                                       checked={selectedIds.has(badge.id)}
                                       disabled={!canUseBadgeCustomization}
                                       className="shrink-0"
                                       onCheckedChange={(value) => onToggleBadgeAction(badge, value === true)}
                                    />
                                    <Label htmlFor={`profile-badge-${badge.id}`} className="flex min-w-0 cursor-default items-center gap-2">
                                       <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md">
                                          {badge.image ? (
                                             <FadeInImage src={badge.image} alt="" width={48} height={24} className="object-contain" unoptimized />
                                          ) : (
                                             <ImageIcon className="text-muted-foreground" aria-hidden />
                                          )}
                                       </span>
                                       <span className="min-w-0">
                                          <span className="block truncate text-sm font-medium">{badge.description}</span>
                                          {selected && (
                                             <span className="text-muted-foreground block text-xs">
                                                {t('player.customization.badges.position', { position: selectedIndex + 1 })}
                                             </span>
                                          )}
                                       </span>
                                    </Label>
                                    <BadgeMoveButtons
                                       disabled={!canUseBadgeCustomization || !selected}
                                       upDisabled={selectedIndex <= 0}
                                       downDisabled={selectedIndex === -1 || selectedIndex >= draftItems.length - 1}
                                       onUp={() => onMoveBadgeAction(badge.id, -1)}
                                       onDown={() => onMoveBadgeAction(badge.id, 1)}
                                    />
                                 </div>
                                 {selected && (
                                    <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] gap-2">
                                       <span className="size-4" aria-hidden />
                                       <div className="col-span-2 flex min-w-0 flex-col gap-1.5">
                                          <Textarea
                                             value={comment}
                                             disabled={!canUseBadgeCustomization}
                                             size="sm"
                                             resize="none"
                                             rows={3}
                                             maxLength={BADGE_COMMENT_MAX_LENGTH}
                                             placeholder={t('player.customization.badges.commentPlaceholder')}
                                             aria-label={t('player.customization.badges.commentLabel', { badge: badge.description })}
                                             className="field-sizing-fixed min-h-20 max-w-full min-w-0"
                                             onChange={(event) => onUpdateCommentAction(badge.id, event.target.value)}
                                          />
                                          <p className="text-muted-foreground text-right text-[11px] tabular-nums">
                                             {t('player.customization.badges.commentCount', {
                                                count: comment.length,
                                                max: BADGE_COMMENT_MAX_LENGTH
                                             })}
                                          </p>
                                       </div>
                                    </div>
                                 )}
                              </div>
                           );
                        })}
                     </div>
                  )}
               </ConditionalOverlay>
            </div>
         </ScrollArea>
      </div>
   );
}

function BadgeMoveButtons({
   disabled,
   upDisabled,
   downDisabled,
   onUp,
   onDown
}: {
   disabled: boolean;
   upDisabled: boolean;
   downDisabled: boolean;
   onUp: () => void;
   onDown: () => void;
}) {
   const t = useTranslations();

   return (
      <div className="flex w-16 shrink-0 justify-end gap-1">
         <Button
            type="button"
            variant="ghost-icon"
            size="icon-xs"
            disabled={disabled || upDisabled}
            onClick={onUp}
            aria-label={t('player.customization.badges.moveUp')}
         >
            <ArrowUp data-icon />
         </Button>
         <Button
            type="button"
            variant="ghost-icon"
            size="icon-xs"
            disabled={disabled || downDisabled}
            onClick={onDown}
            aria-label={t('player.customization.badges.moveDown')}
         >
            <ArrowDown data-icon />
         </Button>
      </div>
   );
}
