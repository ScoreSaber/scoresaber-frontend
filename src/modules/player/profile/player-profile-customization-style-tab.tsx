'use client';

import { useRef } from 'react';

import { ImageIcon, ImageUp, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { getReadableProfileAccentForeground, type PlayerProfileCustomizationStyle } from '@/modules/player/profile/player-profile-accent';
import { versionedImageUrl } from '@/modules/player/shared/player-avatar';
import { ConditionalOverlay } from '@/shared/components/conditional-overlay';
import { FadeInImage } from '@/shared/components/fade-in-image';
import { SupporterRequiredOverlay } from '@/shared/components/supporter-required-overlay';
import { cn } from '@/shared/format/helpers';

const defaultAccentColor = '#facc15';
const defaultAccentForegroundColor = '#422006';
const defaultAccentForegroundActiveColor = '#422006';
const backgroundMaxSize = 10 * 1024 * 1024;
const ACCENT_SWATCHES = [defaultAccentColor, '#2dd4bf', '#fb7185', '#60a5fa', '#a3e635', '#f97316'];

interface PlayerProfileCustomizationStyleTabProps {
   draftStyle: PlayerProfileCustomizationStyle;
   canUseAccentStyle: boolean;
   canToggleSupporterNameColor: boolean;
   patreonConnected: boolean;
   backgroundFile: File | null;
   savePending: boolean;
   onUpdateStyleAction: (style: PlayerProfileCustomizationStyle) => void;
   onUpdateBackgroundFileAction: (file: File) => void;
   onResetBackgroundAction: () => void;
}

export function PlayerProfileCustomizationStyleTab({
   draftStyle,
   canUseAccentStyle,
   canToggleSupporterNameColor,
   patreonConnected,
   backgroundFile,
   savePending,
   onUpdateStyleAction,
   onUpdateBackgroundFileAction,
   onResetBackgroundAction
}: PlayerProfileCustomizationStyleTabProps) {
   const t = useTranslations();
   const backgroundInputRef = useRef<HTMLInputElement | null>(null);
   const backgroundImage = draftStyle.backgroundImage ?? '';
   const previewBackgroundImage = backgroundImage ? versionedImageUrl(backgroundImage, draftStyle.backgroundImageVersion) : '';
   const accentColor = draftStyle.accentColor ?? defaultAccentColor;
   const accentForegroundColor = draftStyle.accentForegroundColor ?? getDefaultAccentForeground(accentColor);
   const accentForegroundActiveColor = draftStyle.accentForegroundActiveColor ?? getDefaultAccentActiveForeground(accentColor);

   function updateStyle(values: Partial<PlayerProfileCustomizationStyle>) {
      onUpdateStyleAction({ ...draftStyle, ...values });
   }

   function setAccentColor(color: string) {
      updateStyle({
         accentColor: color,
         accentForegroundColor: getDefaultAccentForeground(color),
         accentForegroundActiveColor: getDefaultAccentActiveForeground(color)
      });
   }

   function resetAccent() {
      updateStyle({
         accentColor: null,
         accentForegroundColor: null,
         accentForegroundActiveColor: null
      });
   }

   function selectBackgroundFile(file: File | null) {
      if (!file) return;

      if (file.size > backgroundMaxSize) {
         toast.error(t('player.customization.style.backgroundTooLarge'));
         clearBackgroundInput();
         return;
      }

      onUpdateBackgroundFileAction(file);
      clearBackgroundInput();
   }

   function clearBackgroundInput() {
      if (backgroundInputRef.current) {
         backgroundInputRef.current.value = '';
      }
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
                  contentClassName="flex flex-col gap-5"
                  overlayClassName="min-h-80"
               >
                  <section className="flex min-w-0 flex-col gap-3">
                     <div className="flex flex-col gap-1">
                        <h3 className="text-sm font-semibold">{t('player.customization.style.backgroundImage')}</h3>
                        <p className="text-muted-foreground text-xs">{t('player.customization.style.backgroundDescription')}</p>
                     </div>
                     <div className="flex min-w-0 items-center gap-3">
                        <div className="bg-secondary/30 relative size-16 shrink-0 overflow-hidden rounded-md border">
                           {previewBackgroundImage ? (
                              <FadeInImage src={previewBackgroundImage} alt="" fill className="object-cover" />
                           ) : (
                              <div className="text-muted-foreground flex size-full items-center justify-center">
                                 <ImageIcon aria-hidden />
                              </div>
                           )}
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col gap-2">
                           {backgroundFile && (
                              <p className="text-muted-foreground truncate text-xs" title={backgroundFile.name}>
                                 {t('player.customization.style.backgroundSelected', {
                                    name: backgroundFile.name
                                 })}
                              </p>
                           )}
                           <Input
                              ref={backgroundInputRef}
                              id="profile-background-image"
                              type="file"
                              accept="image/*"
                              disabled={!canUseAccentStyle || savePending}
                              onChange={(event) => selectBackgroundFile(event.target.files?.[0] ?? null)}
                              className="sr-only"
                           />
                           <div className="flex min-w-0 flex-wrap gap-2">
                              <Button
                                 type="button"
                                 variant="outline"
                                 size="sm"
                                 disabled={!canUseAccentStyle || savePending}
                                 onClick={() => backgroundInputRef.current?.click()}
                                 className="cursor-pointer"
                              >
                                 <ImageUp data-icon="inline-start" />
                                 {t('player.customization.style.backgroundUpload')}
                              </Button>
                              <Button
                                 type="button"
                                 variant="outline"
                                 size="sm"
                                 disabled={!canUseAccentStyle || savePending || !backgroundImage}
                                 onClick={onResetBackgroundAction}
                                 className="cursor-pointer"
                              >
                                 <RotateCcw data-icon="inline-start" />
                                 {t('player.customization.style.resetBackground')}
                              </Button>
                           </div>
                        </div>
                     </div>
                  </section>

                  <Separator />

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
                                    aria-label={t('player.customization.style.useAccent', {
                                       color
                                    })}
                                    onClick={() => setAccentColor(color)}
                                 />
                              </TooltipTrigger>
                              <TooltipContent>{color}</TooltipContent>
                           </Tooltip>
                        ))}
                     </div>
                     <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end">
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
                        <div className="flex min-w-0 flex-col gap-2">
                           <Label htmlFor="profile-accent-active-foreground">{t('player.customization.style.accentForegroundActive')}</Label>
                           <Input
                              id="profile-accent-active-foreground"
                              type="color"
                              value={accentForegroundActiveColor}
                              disabled={!canUseAccentStyle}
                              aria-label={t('player.customization.style.accentForegroundActive')}
                              onChange={(event) =>
                                 updateStyle({
                                    accentColor: draftStyle.accentColor ?? defaultAccentColor,
                                    accentForegroundActiveColor: event.target.value
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
            </div>
         </ScrollArea>
      </div>
   );
}

function getDefaultAccentForeground(color: string) {
   return color.toLowerCase() === defaultAccentColor ? defaultAccentForegroundColor : getReadableProfileAccentForeground(color);
}

function getDefaultAccentActiveForeground(color: string) {
   return color.toLowerCase() === defaultAccentColor ? defaultAccentForegroundActiveColor : getReadableProfileAccentForeground(color);
}
