'use client';

import { Loader2, RotateCcw, Save } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SheetFooter } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { getReadableProfileAccentForeground, type PlayerProfileCustomizationStyle } from '@/modules/player/profile/player-profile-accent';
import { ConditionalOverlay } from '@/shared/components/conditional-overlay';
import { SupporterRequiredOverlay } from '@/shared/components/supporter-required-overlay';
import { cn } from '@/shared/format/helpers';

const defaultAccentColor = '#facc15';
const defaultAccentForegroundColor = '#422006';
const ACCENT_SWATCHES = [defaultAccentColor, '#2dd4bf', '#fb7185', '#60a5fa', '#a3e635', '#f97316'];

interface PlayerProfileCustomizationStyleTabProps {
   draftStyle: PlayerProfileCustomizationStyle;
   canUseAccentStyle: boolean;
   canToggleSupporterNameColor: boolean;
   patreonConnected: boolean;
   dirty: boolean;
   saveDisabled: boolean;
   savePending: boolean;
   onUpdateStyleAction: (style: PlayerProfileCustomizationStyle) => void;
   onSaveAction: () => void;
}

export function PlayerProfileCustomizationStyleTab({
   draftStyle,
   canUseAccentStyle,
   canToggleSupporterNameColor,
   patreonConnected,
   dirty,
   saveDisabled,
   savePending,
   onUpdateStyleAction,
   onSaveAction
}: PlayerProfileCustomizationStyleTabProps) {
   const t = useTranslations();
   const accentColor = draftStyle.accentColor ?? defaultAccentColor;
   const accentForegroundColor = draftStyle.accentForegroundColor ?? getDefaultAccentForeground(accentColor);

   function updateStyle(values: Partial<PlayerProfileCustomizationStyle>) {
      onUpdateStyleAction({ ...draftStyle, ...values });
   }

   function setAccentColor(color: string) {
      updateStyle({
         accentColor: color,
         accentForegroundColor: getDefaultAccentForeground(color)
      });
   }

   function resetAccent() {
      updateStyle({
         accentColor: null,
         accentForegroundColor: null
      });
   }

   return (
      <div className="flex min-h-0 flex-1 flex-col">
         <ScrollArea className="min-h-0 flex-1">
            <div className="flex flex-col gap-5 px-5 py-4">
               <ConditionalOverlay
                  shouldShow={() => !canUseAccentStyle}
                  component={SupporterRequiredOverlay}
                  componentProps={{
                     patreonConnected,
                     title: t('player.customization.style.accentLockTitle'),
                     description: t('player.customization.style.accentLockDescription')
                  }}
                  className={cn('rounded-md', canUseAccentStyle && 'overflow-visible', !canUseAccentStyle && 'min-h-80')}
                  overlayClassName="min-h-80"
               >
                  <section className="flex min-w-0 flex-col gap-3">
                     <div className="flex flex-col gap-1">
                        <h3 className="text-sm font-semibold">{t('player.customization.style.accentColor')}</h3>
                        <p className="text-muted-foreground text-xs">{t('player.customization.style.accentDescription')}</p>
                     </div>
                     <div className="flex flex-wrap gap-2">
                        {ACCENT_SWATCHES.map((color) => (
                           <Tooltip key={color}>
                              <TooltipTrigger asChild>
                                 <button
                                    type="button"
                                    disabled={!canUseAccentStyle}
                                    className={cn(
                                       'border-border size-8 rounded-md border shadow-xs disabled:cursor-default',
                                       accentColor === color && 'ring-ring ring-2 ring-offset-2 ring-offset-background'
                                    )}
                                    style={{ backgroundColor: color }}
                                    aria-label={t('player.customization.style.useAccent', { color })}
                                    onClick={() => setAccentColor(color)}
                                 />
                              </TooltipTrigger>
                              <TooltipContent>{color}</TooltipContent>
                           </Tooltip>
                        ))}
                     </div>
                     <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end">
                        <div className="flex min-w-0 flex-col gap-2">
                           <Label htmlFor="profile-accent-color">{t('player.customization.style.accentColor')}</Label>
                           <Input
                              id="profile-accent-color"
                              type="color"
                              value={accentColor}
                              disabled={!canUseAccentStyle}
                              aria-label={t('player.customization.style.accentColor')}
                              onChange={(event) => setAccentColor(event.target.value)}
                              className="h-9 w-full min-w-0 p-1"
                           />
                        </div>
                        <div className="flex min-w-0 flex-col gap-2">
                           <Label htmlFor="profile-accent-foreground">{t('player.customization.style.accentForeground')}</Label>
                           <Input
                              id="profile-accent-foreground"
                              type="color"
                              value={accentForegroundColor}
                              disabled={!canUseAccentStyle}
                              aria-label={t('player.customization.style.accentForeground')}
                              onChange={(event) =>
                                 updateStyle({
                                    accentColor: draftStyle.accentColor ?? defaultAccentColor,
                                    accentForegroundColor: event.target.value
                                 })
                              }
                              className="h-9 w-full min-w-0 p-1"
                           />
                        </div>
                        <Button type="button" variant="outline" disabled={!canUseAccentStyle} onClick={resetAccent} className="cursor-pointer">
                           <RotateCcw data-icon="inline-start" />
                           {t('player.customization.style.resetAccent')}
                        </Button>
                     </div>
                  </section>
               </ConditionalOverlay>

               {canToggleSupporterNameColor && (
                  <section className="flex flex-col gap-3">
                     <div className="flex flex-col gap-1">
                        <h3 className="text-sm font-semibold">{t('player.customization.style.nameColor')}</h3>
                        <p className="text-muted-foreground text-xs">{t('player.customization.style.nameColorDescription')}</p>
                     </div>
                     <div className="border-border/60 bg-card/40 flex items-center gap-3 rounded-md border p-3">
                        <Checkbox
                           id="profile-supporter-name-color"
                           checked={draftStyle.supporterNameColorEnabled}
                           onCheckedChange={(value) => updateStyle({ supporterNameColorEnabled: value === true })}
                        />
                        <Label htmlFor="profile-supporter-name-color" className="min-w-0 cursor-default text-sm font-medium">
                           {t('player.customization.style.supporterNameColor')}
                        </Label>
                     </div>
                  </section>
               )}

               <div className="border-border/60 bg-muted/25 text-muted-foreground rounded-md border border-dashed px-3 py-2 text-xs">
                  {t('player.customization.style.moreSoon')}
               </div>
            </div>
         </ScrollArea>
         <SheetFooter className="border-border/60 shrink-0 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className={cn('text-muted-foreground text-xs', dirty && 'text-foreground')}>
               {dirty ? t('player.customization.style.unsaved') : t('player.customization.style.noChanges')}
            </p>
            <Button type="button" disabled={saveDisabled} onClick={onSaveAction} className="cursor-pointer sm:min-w-24">
               {savePending ? <Loader2 data-icon="inline-start" className="animate-spin" /> : <Save data-icon="inline-start" />}
               {t('common.save')}
            </Button>
         </SheetFooter>
      </div>
   );
}

function getDefaultAccentForeground(color: string) {
   return color.toLowerCase() === defaultAccentColor ? defaultAccentForegroundColor : getReadableProfileAccentForeground(color);
}
