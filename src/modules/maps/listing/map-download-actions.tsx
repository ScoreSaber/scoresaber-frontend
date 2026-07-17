'use client';

import { useRef, useState } from 'react';

import { Result } from 'better-result';
import { Download, Loader2 } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { useAuth } from '@/modules/auth';
import { downloadMapPlaylist, getMapPlaylistTitle, type PlaylistInput } from '@/modules/maps/actions/playlist';

interface MapDownloadActionsProps {
   search: PlaylistInput;
}

const DEFAULT_PLAYLIST_LIMIT = 100;
const MAX_PLAYLIST_LIMIT = 200;

export function MapDownloadActions({ search }: MapDownloadActionsProps) {
   const t = useTranslations();
   const { user } = useAuth();
   const titleInputRef = useRef<HTMLInputElement>(null);
   const [open, setOpen] = useState(false);
   const [pending, setPending] = useState(false);
   const [limit, setLimit] = useState(search.limit ?? DEFAULT_PLAYLIST_LIMIT);
   const [playlistTitle, setPlaylistTitle] = useState(getMapPlaylistTitle(search));
   const [playlistDescription, setPlaylistDescription] = useState(search.playlistDescription ?? '');
   const canDownload = playlistTitle.trim().length > 0;

   function handleOpenChange(nextOpen: boolean) {
      setOpen(nextOpen);
      if (!nextOpen) return;

      const nextLimit = search.limit ?? DEFAULT_PLAYLIST_LIMIT;
      const nextTitle = getMapPlaylistTitle(search);
      setLimit(nextLimit);
      setPlaylistTitle(nextTitle);
      setPlaylistDescription(search.playlistDescription ?? '');
   }

   async function handleDownloadPlaylist() {
      setPending(true);

      await Result.tryPromise(async () => {
         const result = await downloadMapPlaylist({
            ...search,
            limit,
            playlistTitle: playlistTitle.trim(),
            playlistAuthor: user?.name.trim() || undefined,
            playlistDescription: playlistDescription.trim()
         });
         if (!result.ok) return;

         const url = URL.createObjectURL(new Blob([result.value.content], { type: 'application/json;charset=utf-8' }));
         const link = document.createElement('a');
         link.href = url;
         link.download = result.value.fileName;
         link.click();
         URL.revokeObjectURL(url);
         setOpen(false);
      });
      setPending(false);
   }

   return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
         <Tooltip>
            <TooltipTrigger asChild>
               <Button
                  type="button"
                  variant="ghost-icon"
                  size="icon-sm"
                  aria-label={t('map.downloadPlaylist')}
                  onClick={() => handleOpenChange(true)}
                  disabled={pending}
               >
                  <Download data-icon />
               </Button>
            </TooltipTrigger>
            <TooltipContent>{t('map.downloadPlaylist')}</TooltipContent>
         </Tooltip>

         <DialogContent
            className="sm:max-w-md"
            onOpenAutoFocus={(event) => {
               event.preventDefault();
               requestAnimationFrame(() => {
                  const input = titleInputRef.current;
                  if (!input) return;

                  input.focus({ preventScroll: true });
                  input.setSelectionRange(input.value.length, input.value.length);
               });
            }}
         >
            <DialogHeader>
               <DialogTitle>{t('map.downloadPlaylist')}</DialogTitle>
               <DialogDescription>{t('map.playlistDownloadDescription')}</DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-3 py-2">
               <div className="flex flex-col gap-2">
                  <Label htmlFor="playlist-title">{t('map.playlistTitle')}</Label>
                  <Input
                     ref={titleInputRef}
                     id="playlist-title"
                     value={playlistTitle}
                     maxLength={120}
                     onChange={(event) => setPlaylistTitle(event.target.value)}
                     disabled={pending}
                  />
               </div>

               <div className="flex flex-col gap-2">
                  <Label htmlFor="playlist-description">{t('map.playlistDescription')}</Label>
                  <Textarea
                     id="playlist-description"
                     value={playlistDescription}
                     maxLength={300}
                     onChange={(event) => setPlaylistDescription(event.target.value)}
                     disabled={pending}
                     className="min-h-20 resize-none"
                  />
               </div>

               <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="playlist-limit">{t('map.playlistMapLimit')}</Label>
                  <span className="text-muted-foreground text-sm tabular-nums">{t('map.playlistMapLimitValue', { count: limit })}</span>
               </div>
               <Slider
                  id="playlist-limit"
                  value={[limit]}
                  min={1}
                  max={MAX_PLAYLIST_LIMIT}
                  step={1}
                  aria-label={t('map.playlistMapLimit')}
                  onValueChange={(value) => setLimit(value[0])}
                  disabled={pending}
               />
            </div>

            <DialogFooter>
               <DialogClose asChild>
                  <Button type="button" variant="outline" disabled={pending}>
                     {t('common.cancel')}
                  </Button>
               </DialogClose>
               <Button type="button" className="cursor-pointer" onClick={handleDownloadPlaylist} disabled={pending || !canDownload}>
                  {pending ? <Loader2 data-icon="inline-start" className="animate-spin" /> : <Download data-icon="inline-start" />}
                  {t('map.downloadPlaylistAction')}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
