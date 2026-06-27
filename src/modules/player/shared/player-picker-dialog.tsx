'use client';

import { useEffect, useRef, useState } from 'react';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Result } from 'better-result';
import { Loader2, Search } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { PlayerAvatar } from '@/modules/player/shared/player-avatar';
import { api } from '@/shared/api/ApiInstance';
import type { PlayerControllerGetPlayersDataItem } from '@/shared/api/generated/ApiParams';
import { CountryImage } from '@/shared/components/country-image';
import { cn, formatNumber } from '@/shared/format/helpers';
import { getPlayerRoleStyleAndTitle } from '@/shared/format/styling';
import { apiResult } from '@/shared/result/api';

const MIN_SEARCH_LENGTH = 3;
const DEBOUNCE_MS = 300;
const RESULTS_LIMIT = 8;

export type PlayerPickerSelection = {
   publicPlayerId: string;
   displayName: string;
   player: PlayerControllerGetPlayersDataItem;
};

export function PlayerPickerDialog({
   open,
   onOpenChangeAction,
   onSelectAction,
   title,
   description
}: {
   open: boolean;
   onOpenChangeAction: (open: boolean) => void;
   onSelectAction: (player: PlayerPickerSelection) => void;
   title: string;
   description?: string;
}) {
   const t = useTranslations('live');
   const inputRef = useRef<HTMLInputElement>(null);
   const [query, setQuery] = useState('');
   const [debouncedQuery, setDebouncedQuery] = useState('');
   const debouncedQueryUpdate = useDebouncedCallback((value: string) => setDebouncedQuery(value), DEBOUNCE_MS);
   const trimmedQuery = debouncedQuery.trim();
   const searchEnabled = open && trimmedQuery.length >= MIN_SEARCH_LENGTH;

   const { data: players = [], isFetching } = useQuery({
      queryKey: ['playerPicker', trimmedQuery],
      queryFn: async ({ signal }) => {
         const result = await apiResult(api.player.playerControllerGetPlayers({ search: trimmedQuery, limit: RESULTS_LIMIT }, { signal }));
         return Result.match(result, {
            ok: (response) => response.data.data ?? [],
            err: () => []
         });
      },
      enabled: searchEnabled,
      staleTime: 30 * 1000,
      placeholderData: keepPreviousData
   });

   useEffect(() => {
      if (!open) {
         setQuery('');
         debouncedQueryUpdate.cancel();
         setDebouncedQuery('');
         return;
      }

      requestAnimationFrame(() => inputRef.current?.focus());
   }, [open, debouncedQueryUpdate]);

   function handleQueryChange(value: string) {
      setQuery(value);
      debouncedQueryUpdate.run(value);
   }

   function selectPlayer(player: PlayerControllerGetPlayersDataItem) {
      onSelectAction({ publicPlayerId: player.id, displayName: player.name, player });
      onOpenChangeAction(false);
   }

   const showHint = query.trim().length < MIN_SEARCH_LENGTH;
   const showEmpty = searchEnabled && !isFetching && players.length === 0;

   return (
      <Dialog open={open} onOpenChange={onOpenChangeAction}>
         <DialogContent className="h-dvh max-h-dvh max-w-none overflow-hidden rounded-none border-0 p-0 sm:h-auto sm:max-h-[calc(100dvh-2rem)] sm:max-w-lg sm:rounded-lg sm:border">
            <div className="flex h-full min-h-0 flex-col">
               <DialogHeader className="p-6 pb-3">
                  <DialogTitle>{title}</DialogTitle>
                  {description && <DialogDescription className="sr-only">{description}</DialogDescription>}
               </DialogHeader>
               <div className="flex items-center gap-3 px-6 pb-4">
                  {isFetching ? (
                     <Loader2 className="text-muted-foreground size-5 animate-spin" />
                  ) : (
                     <Search className="text-muted-foreground size-5" />
                  )}
                  <Input
                     ref={inputRef}
                     value={query}
                     onChange={(event) => handleQueryChange(event.target.value)}
                     placeholder={t('playerPickerPlaceholder')}
                     className="h-auto flex-1 rounded-none border-0 bg-transparent px-0 py-0 shadow-none focus-visible:ring-0 dark:bg-transparent"
                     autoComplete="off"
                     spellCheck={false}
                  />
               </div>
               <Separator />
               <div className="min-h-0 flex-1 overflow-y-auto sm:max-h-96">
                  {showHint && <div className="text-muted-foreground py-12 text-center text-sm">{t('playerPickerMinChars')}</div>}
                  {showEmpty && <div className="text-muted-foreground py-12 text-center text-sm">{t('playerPickerNoResults')}</div>}
                  {players.map((player) => (
                     <button
                        key={player.id}
                        type="button"
                        onClick={() => selectPlayer(player)}
                        className="hover:bg-accent flex w-full cursor-pointer items-center gap-3 px-6 py-3 text-left transition-colors"
                     >
                        <PlayerAvatar
                           src={player.avatar}
                           version={player.avatarVersion}
                           alt={player.name}
                           width={36}
                           height={36}
                           className="h-9 w-9 shrink-0 rounded-full"
                        />
                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                           <div className="flex min-w-0 items-center gap-2">
                              <CountryImage country={player.country} size={18} className="shrink-0" />
                              <span className={cn('truncate text-sm font-medium', getPlayerRoleStyleAndTitle(player)[0])}>{player.name}</span>
                           </div>
                           <span className="text-muted-foreground truncate text-xs">{player.id}</span>
                        </div>
                        <span className="text-muted-foreground shrink-0 text-xs font-medium tabular-nums">#{formatNumber(player.stats.rank)}</span>
                     </button>
                  ))}
               </div>
               <div className="bg-background flex justify-end border-t p-4">
                  <Button type="button" variant="secondary" onClick={() => onOpenChangeAction(false)}>
                     {t('closePicker')}
                  </Button>
               </div>
            </div>
         </DialogContent>
      </Dialog>
   );
}
