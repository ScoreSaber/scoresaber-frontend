'use client';

import { useEffect, useState } from 'react';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Result } from 'better-result';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { FaLink, FaSearch } from 'react-icons/fa';
import { useTranslations } from 'use-intl';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';

import { env } from '@/env';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { MapCard } from '@/modules/maps/listing/map-card';
import { getDisplayLeaderboards } from '@/modules/maps/map-leaderboards';
import { isMapSearchReady } from '@/modules/maps/shared/map-search';
import { api } from '@/shared/api/ApiInstance';
import type { LiveMatchRoomControllerSetRoomSongPayload } from '@/shared/api/generated/Api';
import {
   MAP_CONTROLLER_GET_MAP_LISTINGS_STATUS,
   type MapControllerGetMapByIdResponse,
   type MapControllerGetMapListingsDataItem
} from '@/shared/api/generated/ApiParams';
import { FadeInImage } from '@/shared/components/fade-in-image';
import { Time } from '@/shared/components/time';
import { cn } from '@/shared/format/helpers';
import { getDifficultyLabel } from '@/shared/format/strings';
import { getDifficultyBgClass } from '@/shared/format/styling';
import { apiResult } from '@/shared/result/api';

type SongMap = MapControllerGetMapByIdResponse | MapControllerGetMapListingsDataItem;
type SongSource = { kind: 'map' | 'leaderboard'; id: number };
type SongLeaderboard = SongMap['leaderboards'][number];

const mapSearchDebounceMs = 300;

export function LiveSongSelectDialog({
   open,
   pending,
   onOpenChangeAction,
   onSelectAction
}: {
   open: boolean;
   pending: boolean;
   onOpenChangeAction: (open: boolean) => void;
   onSelectAction: (song: LiveMatchRoomControllerSetRoomSongPayload) => void;
}) {
   const t = useTranslations('live');
   const tc = useTranslations();
   const [input, setInput] = useState('');
   const [debouncedInput, setDebouncedInput] = useState('');
   const [selectedMap, setSelectedMap] = useState<MapControllerGetMapByIdResponse | null>(null);
   const [selectedLeaderboardId, setSelectedLeaderboardId] = useState<number | null>(null);
   const [lookupError, setLookupError] = useState<string | null>(null);
   const [lookupLoading, setLookupLoading] = useState(false);
   const inputDebounce = useDebouncedCallback((value: string) => setDebouncedInput(value), mapSearchDebounceMs);

   const inputTerm = input.trim();
   const searchTerm = debouncedInput.trim();
   const source = parseSongSource(inputTerm);
   const searchEnabled = open && source == null && isMapSearchReady(searchTerm);
   const inputIsSearch = open && source == null && isMapSearchReady(inputTerm);
   const searchPending = inputIsSearch && inputTerm !== searchTerm;

   const { data: searchResults = [], isFetching } = useQuery({
      queryKey: ['live-song-map-search', searchTerm],
      queryFn: async ({ signal }) => {
         const result = await apiResult(
            api.map.mapControllerGetMapListings(
               {
                  search: searchTerm,
                  limit: 20,
                  status: [...MAP_CONTROLLER_GET_MAP_LISTINGS_STATUS],
                  sortBy: 'trending',
                  sortDirection: 'desc'
               },
               { signal }
            )
         );

         if (Result.isError(result)) return [];

         return (result.value.data.data ?? []).filter((map) => map.leaderboards.length > 0).slice(0, 8);
      },
      enabled: searchEnabled,
      staleTime: 30 * 1000,
      placeholderData: keepPreviousData
   });

   const selectedLeaderboard = selectedMap?.leaderboards.find((leaderboard) => leaderboard.id === selectedLeaderboardId) ?? null;

   useEffect(() => {
      if (open) return;

      inputDebounce.cancel();
      setDebouncedInput('');
   }, [open, inputDebounce]);

   function resetDialog() {
      inputDebounce.cancel();
      setInput('');
      setDebouncedInput('');
      setSelectedMap(null);
      setSelectedLeaderboardId(null);
      setLookupError(null);
      setLookupLoading(false);
   }

   function closeDialog() {
      resetDialog();
      onOpenChangeAction(false);
   }

   async function selectSearchResult(map: MapControllerGetMapListingsDataItem) {
      setLookupLoading(true);
      setLookupError(null);
      const detail = await fetchMapDetail(map.id);
      setLookupLoading(false);

      if (Result.isError(detail)) {
         setLookupError(t('songLookupFailed'));
         return;
      }

      selectMap(detail.value);
   }

   function selectMap(map: MapControllerGetMapByIdResponse, preferredLeaderboardIds?: number[]) {
      const displayLeaderboards = getDisplayLeaderboards(map.leaderboards, undefined, false);
      const preferred = preferredLeaderboardIds?.find((id) => displayLeaderboards.some((leaderboard) => leaderboard.id === id));
      setSelectedMap(map);
      setSelectedLeaderboardId(preferred ?? displayLeaderboards[0]?.id ?? null);
      setLookupError(null);
   }

   async function resolveInput() {
      const currentSource = parseSongSource(input);
      if (!currentSource) return;

      setLookupLoading(true);
      setLookupError(null);
      const result = await fetchMapFromSource(currentSource);
      setLookupLoading(false);

      if (Result.isError(result)) {
         setLookupError(t('songLookupFailed'));
         return;
      }

      selectMap(result.value.detail, result.value.leaderboardIds);
   }

   function backToSearch() {
      setSelectedMap(null);
      setSelectedLeaderboardId(null);
      setLookupError(null);
   }

   function selectSong() {
      if (!selectedMap || !selectedLeaderboard) return;
      onSelectAction(toLiveSongPayload(selectedMap, selectedLeaderboard));
      closeDialog();
   }

   return (
      <Dialog
         open={open}
         onOpenChange={(nextOpen) => {
            if (!nextOpen) closeDialog();
         }}
      >
         <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-[44rem]">
            <DialogHeader>
               <DialogTitle>{selectedMap ? t('chooseDifficulty') : t('selectSong')}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
               {!selectedMap ? (
                  <>
                     <div className="flex flex-col gap-2">
                        <InputGroup>
                           <InputGroupAddon align="inline-start">{source ? <FaLink /> : <FaSearch />}</InputGroupAddon>
                           <InputGroupInput
                              id="live-song-search"
                              value={input}
                              onChange={(event) => {
                                 const value = event.target.value;
                                 setInput(value);
                                 inputDebounce.run(value);
                                 setLookupError(null);
                              }}
                              onKeyDown={(event) => {
                                 if (event.key === 'Enter' && source) {
                                    event.preventDefault();
                                    void resolveInput();
                                 }
                              }}
                              placeholder={t('songSearchPlaceholder')}
                              aria-label={t('songSearch')}
                              autoFocus
                           />
                           {source && (
                              <InputGroupAddon align="inline-end">
                                 <InputGroupButton onClick={() => void resolveInput()} disabled={lookupLoading}>
                                    {lookupLoading ? <Loader2 className="animate-spin" /> : <FaLink />}
                                    {t('resolveSong')}
                                 </InputGroupButton>
                              </InputGroupAddon>
                           )}
                        </InputGroup>
                        {lookupError && <p className="text-destructive text-xs">{lookupError}</p>}
                     </div>

                     <div className="h-[min(360px,calc(100vh-24rem))] min-h-[200px] overflow-x-hidden overflow-y-auto rounded-lg border">
                        <div className="flex flex-col gap-2 p-2">
                           {(isFetching || searchPending) && searchResults.length === 0 && (
                              <div className="text-muted-foreground flex items-center justify-center gap-2 py-8 text-sm">
                                 <Loader2 className="animate-spin" />
                                 {t('searchingSongs')}
                              </div>
                           )}
                           {searchResults.map((map) => (
                              <SongMapResult key={map.id} map={map} onSelect={() => void selectSearchResult(map)} />
                           ))}
                           {!isFetching && searchEnabled && searchResults.length === 0 && (
                              <p className="text-muted-foreground py-8 text-center text-sm">{t('noSongs')}</p>
                           )}
                           {!inputIsSearch && !source && <p className="text-muted-foreground px-2 py-8 text-center text-sm">{t('songSearchHint')}</p>}
                           {source && <p className="text-muted-foreground px-2 py-8 text-center text-sm">{t('songResolveHint')}</p>}
                        </div>
                     </div>
                  </>
               ) : (
                  <div className="animate-in fade-in slide-in-from-bottom-2 flex flex-col gap-3 duration-200">
                     <MapCard map={selectedMap} showChips={false} compact />
                     <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap gap-2">
                           {getDisplayLeaderboards(selectedMap.leaderboards).map((leaderboard) => (
                              <DifficultyOption
                                 key={leaderboard.id}
                                 leaderboard={leaderboard}
                                 selected={selectedLeaderboardId === leaderboard.id}
                                 onClick={() => setSelectedLeaderboardId(leaderboard.id)}
                              />
                           ))}
                        </div>
                     </div>
                  </div>
               )}
            </div>
            <DialogFooter>
               {selectedMap ? (
                  <Button type="button" variant="secondary" onClick={backToSearch} disabled={pending}>
                     <ArrowLeft data-icon="inline-start" />
                     {tc('common.back')}
                  </Button>
               ) : (
                  <Button type="button" variant="secondary" onClick={closeDialog} disabled={pending}>
                     {tc('common.cancel')}
                  </Button>
               )}
               {selectedMap && (
                  <Button type="button" className="cursor-pointer" onClick={selectSong} disabled={pending || !selectedLeaderboard}>
                     {pending ? <Loader2 className="animate-spin" /> : null}
                     {t('changeSong')}
                  </Button>
               )}
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}

function parseSongSource(value: string): SongSource | null {
   const trimmed = value.trim();
   if (!trimmed) return null;

   if (/^\d+$/.test(trimmed)) return { kind: 'leaderboard', id: Number(trimmed) };

   const prefixedMap = /^map:(\d+)$/i.exec(trimmed);
   if (prefixedMap) return { kind: 'map', id: Number(prefixedMap[1]) };

   const prefixedLeaderboard = /^(?:lb|leaderboard):(\d+)$/i.exec(trimmed);
   if (prefixedLeaderboard) return { kind: 'leaderboard', id: Number(prefixedLeaderboard[1]) };

   if (!URL.canParse(trimmed, env.NEXT_PUBLIC_SITE_URL)) return null;
   const url = new URL(trimmed, env.NEXT_PUBLIC_SITE_URL);

   const leaderboardMatch = /^\/leaderboard\/(\d+)/.exec(url.pathname);
   if (leaderboardMatch) return { kind: 'leaderboard', id: Number(leaderboardMatch[1]) };

   const mapDifficultyMatch = /^\/map\/\d+\/difficulty\/(\d+)/.exec(url.pathname);
   if (mapDifficultyMatch) return { kind: 'leaderboard', id: Number(mapDifficultyMatch[1]) };

   const mapMatch = /^\/map\/(\d+)/.exec(url.pathname);
   if (mapMatch) return { kind: 'map', id: Number(mapMatch[1]) };

   return null;
}

async function fetchMapDetail(id: number) {
   const result = await apiResult(api.map.mapControllerGetMapById({ id }));
   return Result.map(result, (response) => response.data);
}

async function fetchMapFromSource(source: SongSource) {
   return Result.gen(async function* () {
      if (source.kind === 'map') {
         const detail = yield* Result.await(fetchMapDetail(source.id));
         return Result.ok({ detail, leaderboardIds: undefined });
      }

      const leaderboard = yield* Result.await(apiResult(api.leaderboard.leaderboardControllerGetLeaderboardById({ id: source.id })));
      const detail = yield* Result.await(fetchMapDetail(leaderboard.data.map.id));

      return Result.ok({
         detail,
         leaderboardIds: [leaderboard.data.id]
      });
   });
}

function toLiveSongPayload(map: MapControllerGetMapByIdResponse, leaderboard: SongLeaderboard): LiveMatchRoomControllerSetRoomSongPayload {
   return {
      mapId: map.id,
      leaderboardId: leaderboard.id
   };
}

function SongMapResult({ map, onSelect }: { map: MapControllerGetMapListingsDataItem; onSelect: () => void }) {
   const tc = useTranslations();
   const leaderboards = getDisplayLeaderboards(map.leaderboards);

   return (
      <button
         type="button"
         onClick={onSelect}
         className={cn(
            'hover:bg-accent/60 grid w-full min-w-0 grid-cols-[3.5rem_minmax(0,1fr)] gap-3 rounded-md p-2 text-left transition-colors',
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-hidden'
         )}
      >
         <div className="relative size-14 shrink-0 overflow-hidden rounded-md shadow-sm ring-1 ring-black/10 dark:ring-white/10">
            <FadeInImage src={map.coverUrl} alt={map.songName} fill className="object-cover" sizes="56px" />
         </div>
         <div className="flex min-w-0 flex-col gap-1 overflow-hidden">
            <div className="min-w-0">
               <p className="truncate text-sm font-semibold">{map.songName}</p>
               <p className="text-muted-foreground truncate text-xs">
                  {tc('common.by')} {map.songAuthorName} · {tc('common.mappedBy')} {map.levelAuthorName} · <Time date={map.createdAt} short />
               </p>
            </div>
            <div className="flex min-w-0 flex-wrap gap-1 overflow-hidden">
               {leaderboards.slice(0, 5).map((leaderboard) => (
                  <DifficultyBadge key={leaderboard.id} leaderboard={leaderboard} />
               ))}
               {leaderboards.length > 5 && <Badge variant="outline">+{leaderboards.length - 5}</Badge>}
            </div>
         </div>
      </button>
   );
}

function DifficultyBadge({ leaderboard, selected = false }: { leaderboard: SongLeaderboard; selected?: boolean }) {
   const label = getDifficultyLabel(leaderboard.difficulty);
   const stars = leaderboard.realm.stars > 0 ? `${leaderboard.realm.stars.toFixed(2)}★` : null;

   return (
      <Badge
         variant="difficulty"
         className={cn(
            'max-w-none gap-1 px-1.5 tabular-nums transition-[box-shadow]',
            getDifficultyBgClass(leaderboard.difficulty),
            selected && 'ring-primary ring-2'
         )}
      >
         {label}
         {stars && <span className="opacity-80">{stars}</span>}
      </Badge>
   );
}

function DifficultyOption({ leaderboard, selected, onClick }: { leaderboard: SongLeaderboard; selected: boolean; onClick: () => void }) {
   return (
      <button
         type="button"
         className={cn(
            'cursor-pointer rounded-md transition-colors',
            'focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-hidden'
         )}
         aria-pressed={selected}
         onClick={onClick}
      >
         <DifficultyBadge leaderboard={leaderboard} selected={selected} />
      </button>
   );
}
