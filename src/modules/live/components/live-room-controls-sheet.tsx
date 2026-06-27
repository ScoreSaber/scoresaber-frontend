'use client';

import { Ban, Bot, Loader2, MessageSquare, PanelRightOpen, Play, RotateCcw, Square, Trash2 } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';

import { LiveSelectedSongCard } from '@/modules/live/components/live-selected-song-card';
import type { RoomPlayerDraft } from '@/modules/live/lib/room-management';
import type { LiveMatchRoomControllerListRoomsItem } from '@/shared/api/generated/ApiParams';

export function LiveRoomControlsSheet({
   open,
   room,
   roomPlayers,
   pending,
   canPromptPlayers,
   bottifiablePlayerCount,
   countdownSeconds,
   forceStart,
   promptTarget,
   promptMessage,
   songPending,
   startPending,
   stopPending,
   promptPending,
   bottifyAllPending,
   onOpenChangeAction,
   onCountdownSecondsChangeAction,
   onForceStartChangeAction,
   onPromptTargetChangeAction,
   onPromptMessageChangeAction,
   onOpenSongDialogAction,
   onRequestStartMapAction,
   onStopMapAction,
   onSendPromptAction,
   onOpenBottifyAllAction,
   onCloseRoomAction,
   onReopenRoomAction,
   onOpenDeleteDialogAction
}: {
   open: boolean;
   room: LiveMatchRoomControllerListRoomsItem;
   roomPlayers: RoomPlayerDraft[];
   pending: boolean;
   canPromptPlayers: boolean;
   bottifiablePlayerCount: number;
   countdownSeconds: string;
   forceStart: boolean;
   promptTarget: string;
   promptMessage: string;
   songPending: boolean;
   startPending: boolean;
   stopPending: boolean;
   promptPending: boolean;
   bottifyAllPending: boolean;
   onOpenChangeAction: (open: boolean) => void;
   onCountdownSecondsChangeAction: (value: string) => void;
   onForceStartChangeAction: (checked: boolean) => void;
   onPromptTargetChangeAction: (value: string) => void;
   onPromptMessageChangeAction: (value: string) => void;
   onOpenSongDialogAction: () => void;
   onRequestStartMapAction: () => void;
   onStopMapAction: () => void;
   onSendPromptAction: () => void;
   onOpenBottifyAllAction: () => void;
   onCloseRoomAction: () => void;
   onReopenRoomAction: () => void;
   onOpenDeleteDialogAction: () => void;
}) {
   const t = useTranslations('live');

   return (
      <Sheet open={open} onOpenChange={onOpenChangeAction}>
         <SheetTrigger asChild>
            <Button type="button" variant="secondary" size="icon-sm" className="self-center" title={t('roomMenu')}>
               <PanelRightOpen data-icon />
               <span className="sr-only">{t('roomMenu')}</span>
            </Button>
         </SheetTrigger>
         <SheetContent side="right" overlayClassName="bg-transparent" className="w-[min(100vw,24rem)] overflow-hidden sm:max-w-sm">
            <SheetHeader>
               <SheetTitle>{t('roomMenu')}</SheetTitle>
            </SheetHeader>
            <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4 pb-4">
               <section className="flex min-w-0 flex-col gap-4">
                  <div className="flex items-center justify-between gap-3">
                     <h2 className="text-xl font-semibold tracking-tight">{t('selectedSong')}</h2>
                     <Button type="button" size="sm" onClick={onOpenSongDialogAction} disabled={pending}>
                        {songPending ? <Loader2 data-icon="inline-start" className="animate-spin" /> : null}
                        {t('changeSong')}
                     </Button>
                  </div>
                  <Separator variant="fade" />
                  {room.selectedSong ? (
                     <LiveSelectedSongCard song={room.selectedSong} />
                  ) : (
                     <div className="text-muted-foreground py-6 text-center text-sm">-</div>
                  )}
               </section>

               <section className="flex min-w-0 flex-col gap-3">
                  <h2 className="text-muted-foreground text-sm font-semibold">{t('playSettings')}</h2>

                  <div className="flex flex-col gap-3">
                     <div className="grid gap-2">
                        <Label htmlFor="live-room-countdown" className="text-muted-foreground text-xs">
                           {t('countdownSeconds')}
                        </Label>
                        <div className="grid grid-cols-[5rem_minmax(0,1fr)] gap-2">
                           <Input
                              id="live-room-countdown"
                              type="number"
                              min={0}
                              max={120}
                              step={1}
                              value={countdownSeconds}
                              className="h-8 px-2 text-center tabular-nums"
                              onChange={(event) => onCountdownSecondsChangeAction(event.target.value)}
                              disabled={pending || forceStart}
                           />
                           <Label className="hover:bg-muted/50 flex h-8 min-w-0 items-center gap-2 rounded-md border px-2 text-sm has-disabled:cursor-not-allowed has-disabled:opacity-50">
                              <Checkbox
                                 checked={forceStart}
                                 onCheckedChange={(value) => onForceStartChangeAction(value === true)}
                                 disabled={pending}
                              />
                              <span className="truncate">{t('forceImmediateStart')}</span>
                           </Label>
                        </div>
                     </div>

                     <div className="grid grid-cols-[minmax(0,7fr)_minmax(5.5rem,3fr)] gap-2">
                        <Button
                           type="button"
                           size="sm"
                           className="cursor-pointer justify-center"
                           onClick={onRequestStartMapAction}
                           disabled={pending}
                        >
                           {startPending ? (
                              <Loader2 data-icon="inline-start" className="animate-spin" />
                           ) : (
                              <Play data-icon="inline-start" className="fill-current" />
                           )}
                           {t('startMap')}
                        </Button>
                        <Button
                           type="button"
                           variant="secondary"
                           size="sm"
                           className="cursor-pointer justify-start"
                           onClick={onStopMapAction}
                           disabled={pending}
                        >
                           {stopPending ? (
                              <Loader2 data-icon="inline-start" className="animate-spin" />
                           ) : (
                              <Square data-icon="inline-start" className="fill-current" />
                           )}
                           {t('stopMap')}
                        </Button>
                     </div>

                     <Separator variant="fade" />

                     <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
                        <div className="min-w-0">
                           <Label htmlFor="live-room-prompt-target" className="sr-only">
                              {t('promptTarget')}
                           </Label>
                           <Select value={promptTarget} onValueChange={onPromptTargetChangeAction} disabled={pending || roomPlayers.length === 0}>
                              <SelectTrigger id="live-room-prompt-target" className="h-8">
                                 <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectGroup>
                                    <SelectItem value="all">{t('allRoomPlayers')}</SelectItem>
                                    {roomPlayers.map((player) => (
                                       <SelectItem key={player.playerId} value={player.playerId}>
                                          {player.player?.name ?? t('unknownPlayer')}
                                       </SelectItem>
                                    ))}
                                 </SelectGroup>
                              </SelectContent>
                           </Select>
                        </div>
                        <Button
                           type="button"
                           variant="secondary"
                           size="sm"
                           className="cursor-pointer"
                           onClick={onSendPromptAction}
                           disabled={pending}
                        >
                           {promptPending ? (
                              <Loader2 data-icon="inline-start" className="animate-spin" />
                           ) : (
                              <MessageSquare data-icon="inline-start" />
                           )}
                           {t('sendPrompt')}
                        </Button>
                     </div>

                     <div className="flex flex-col gap-1">
                        <Label htmlFor="live-room-prompt-message" className="sr-only">
                           {t('prompt')}
                        </Label>
                        <Textarea
                           id="live-room-prompt-message"
                           value={promptMessage}
                           className="min-h-12 text-sm"
                           rows={2}
                           onChange={(event) => onPromptMessageChangeAction(event.target.value)}
                           placeholder={t('promptPlaceholder')}
                           resize="none"
                           disabled={pending}
                        />
                     </div>

                     {canPromptPlayers ? (
                        <>
                           <Separator variant="fade" />

                           <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              className="cursor-pointer justify-start"
                              onClick={onOpenBottifyAllAction}
                              disabled={pending || bottifiablePlayerCount === 0}
                           >
                              {bottifyAllPending ? <Loader2 data-icon="inline-start" className="animate-spin" /> : <Bot data-icon="inline-start" />}
                              {t('bottifyAllPlayers')}
                           </Button>
                        </>
                     ) : null}

                     <Separator variant="fade" />

                     <div className="grid grid-cols-[minmax(0,5fr)_minmax(0,6fr)] gap-2">
                        {room.state === 'OPEN' ? (
                           <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              className="cursor-pointer justify-start"
                              onClick={onCloseRoomAction}
                              disabled={pending}
                           >
                              <Ban data-icon="inline-start" />
                              {t('closeRoom')}
                           </Button>
                        ) : (
                           <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              className="cursor-pointer justify-start"
                              onClick={onReopenRoomAction}
                              disabled={pending}
                           >
                              <RotateCcw data-icon="inline-start" />
                              {t('reopenRoom')}
                           </Button>
                        )}
                        <Button
                           type="button"
                           variant="destructive"
                           size="sm"
                           className="justify-start"
                           onClick={onOpenDeleteDialogAction}
                           disabled={pending}
                        >
                           <Trash2 data-icon="inline-start" />
                           {t('deleteRoom')}
                        </Button>
                     </div>
                  </div>
               </section>
            </div>
         </SheetContent>
      </Sheet>
   );
}
