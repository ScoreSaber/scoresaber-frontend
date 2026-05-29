'use client';

import { useEffect, useState } from 'react';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Result } from 'better-result';
import { Loader2 } from 'lucide-react';
import { FaArrowRight, FaLink, FaSearch } from 'react-icons/fa';
import { useTranslations } from 'use-intl';
import { z } from 'zod';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { env } from '@/env';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { MapCard } from '@/modules/maps/listing/map-card';
import { getDisplayLeaderboards } from '@/modules/maps/map-leaderboards';
import type { OperationAction } from '@/modules/maps/operations/operation-action';
import { replaceRankRequest } from '@/modules/rank-requests/actions/nat';
import { api } from '@/shared/api/ApiInstance';
import type { MapControllerGetMapByIdResponse, MapControllerGetMapListingsDataItem } from '@/shared/api/generated/ApiParams';
import { FadeInImage } from '@/shared/components/fade-in-image';
import { Time } from '@/shared/components/time';
import { cn } from '@/shared/format/helpers';
import { getDifficultyLabel } from '@/shared/format/strings';
import { getDifficultyBgClass } from '@/shared/format/styling';
import { apiResult } from '@/shared/result/api';

type ReplacementMap = MapControllerGetMapByIdResponse | MapControllerGetMapListingsDataItem;
type ReplacementSource = { kind: 'map' | 'leaderboard'; id: number };

const positiveIntInput = z.coerce.number().int().gt(0);
const mapSearchMinLength = 3;
const mapSearchDebounceMs = 300;

interface RankRequestReplaceOperationProps {
   open: boolean;
   mapInfo: MapControllerGetMapByIdResponse;
   requestId?: number;
   action: OperationAction;
   onOpenChangeAction: (open: boolean) => void;
}

export function RankRequestReplaceOperation({ open, mapInfo, requestId, action, onOpenChangeAction }: RankRequestReplaceOperationProps) {
   const tRR = useTranslations();
   const tc = useTranslations();
   const [description, setDescription] = useState('');
   const [replacementInput, setReplacementInput] = useState('');
   const [debouncedReplacementInput, setDebouncedReplacementInput] = useState('');
   const [replacementMap, setReplacementMap] = useState<ReplacementMap | null>(null);
   const [replacementLeaderboardIds, setReplacementLeaderboardIds] = useState<number[]>([]);
   const [replacementLookupError, setReplacementLookupError] = useState<string | null>(null);
   const [replacementLookupLoading, setReplacementLookupLoading] = useState(false);
   const [replaceStep, setReplaceStep] = useState<'search' | 'configure'>('search');
   const replacementInputDebounce = useDebouncedCallback((value: string) => setDebouncedReplacementInput(value), mapSearchDebounceMs);
   const pending = action.isPending;

   const replacementInputTerm = replacementInput.trim();
   const replacementSearchTerm = debouncedReplacementInput.trim();
   const replacementSource = parseReplacementSource(replacementInputTerm);
   const replacementSearchEnabled = open && replacementSource == null && replacementSearchTerm.length >= mapSearchMinLength;
   const replacementInputIsSearch = open && replacementSource == null && replacementInputTerm.length >= mapSearchMinLength;
   const replacementValid = replacementMap != null && replacementLeaderboardIds.length > 0 && !!description;

   const { data: replacementSearchResults = [], isFetching: replacementSearchLoading } = useQuery({
      queryKey: ['rank-request-replacement-map-search', replacementSearchTerm, mapInfo.id],
      queryFn: async ({ signal }) => {
         const result = await apiResult(
            api.map.mapControllerGetMapListings(
               {
                  search: replacementSearchTerm,
                  limit: 20,
                  status: ['UNRANKED'],
                  sortBy: 'totalScores',
                  sortDirection: 'desc'
               },
               { signal }
            )
         );

         if (Result.isError(result)) return [];

         const maps = result.value.data.data ?? [];
         return maps.filter((map) => map.id !== mapInfo.id && isEligibleReplacementMap(map)).slice(0, 6);
      },
      enabled: replacementSearchEnabled,
      staleTime: 30 * 1000,
      placeholderData: keepPreviousData
   });
   const replacementSearchPending = replacementInputIsSearch && (replacementSearchLoading || replacementInputTerm !== replacementSearchTerm);

   useEffect(() => {
      if (open) return;

      replacementInputDebounce.cancel();
      setDebouncedReplacementInput('');
   }, [open, replacementInputDebounce]);

   function closeDialog() {
      onOpenChangeAction(false);
   }

   function resetDialog() {
      replacementInputDebounce.cancel();
      setDescription('');
      setReplacementInput('');
      setDebouncedReplacementInput('');
      setReplacementMap(null);
      setReplacementLeaderboardIds([]);
      setReplacementLookupError(null);
      setReplaceStep('search');
   }

   function handleReplace() {
      if (requestId == null || !description || !replacementMap || replacementLeaderboardIds.length === 0) return;
      action.run(
         () => replaceRankRequest(requestId, replacementMap.id, description, replacementLeaderboardIds),
         tRR('rankRequest.requestReplaced'),
         tRR('rankRequest.failedToReplace'),
         () => {
            resetDialog();
            closeDialog();
         }
      );
   }

   async function selectReplacementMap(map: ReplacementMap, leaderboardIds?: number[]) {
      if (!isEligibleReplacementMap(map)) {
         setReplacementLookupError(tRR('rankRequest.replacementLookupFailed'));
         return;
      }

      let detail: MapControllerGetMapByIdResponse;
      if ('rankRequest' in map) {
         detail = map;
      } else {
         setReplacementLookupLoading(true);
         const detailResult = await apiResult(api.map.mapControllerGetMapById({ id: map.id }));
         setReplacementLookupLoading(false);
         if (Result.isError(detailResult)) {
            setReplacementLookupError(tRR('rankRequest.replacementLookupFailed'));
            return;
         }
         detail = detailResult.value.data;
      }

      if (detail.rankRequest != null || !isEligibleReplacementMap(detail)) {
         setReplacementLookupError(tRR('rankRequest.replacementLookupFailed'));
         return;
      }

      const ids = leaderboardIds ?? getMatchedReplacementLeaderboardIds(mapInfo, detail);
      const eligibleIds = new Set(getEligibleReplacementLeaderboards(detail).map((leaderboard) => leaderboard.id));
      if (ids.length === 0 || ids.some((id) => !eligibleIds.has(id))) {
         setReplacementLookupError(tRR('rankRequest.replacementLookupFailed'));
         return;
      }

      setReplacementMap(detail);
      setReplacementLeaderboardIds(ids);
      setReplacementLookupError(null);
      setReplaceStep('configure');
   }

   function toggleReplacementLeaderboard(id: number) {
      setReplacementLeaderboardIds((prev) => (prev.includes(id) ? prev.filter((leaderboardId) => leaderboardId !== id) : [...prev, id]));
   }

   async function resolveReplacementInput() {
      const source = parseReplacementSource(replacementInput);
      if (!source) return;

      setReplacementLookupLoading(true);
      setReplacementLookupError(null);

      if (source.kind === 'map') {
         const mapResult = await apiResult(api.map.mapControllerGetMapById({ id: source.id }));
         setReplacementLookupLoading(false);
         if (Result.isError(mapResult)) {
            setReplacementLookupError(tRR('rankRequest.replacementLookupFailed'));
            return;
         }
         await selectReplacementMap(mapResult.value.data);
         return;
      }

      const leaderboardResult = await apiResult(api.leaderboard.leaderboardControllerGetLeaderboardById({ id: source.id }));
      if (Result.isError(leaderboardResult)) {
         setReplacementLookupLoading(false);
         setReplacementLookupError(tRR('rankRequest.replacementLookupFailed'));
         return;
      }

      const mapResult = await apiResult(api.map.mapControllerGetMapById({ id: leaderboardResult.value.data.map.id }));
      setReplacementLookupLoading(false);
      if (Result.isError(mapResult)) {
         setReplacementLookupError(tRR('rankRequest.replacementLookupFailed'));
         return;
      }
      await selectReplacementMap(mapResult.value.data, [leaderboardResult.value.data.id]);
   }

   return (
      <Dialog
         open={open}
         onOpenChange={(isOpen) => {
            if (!isOpen) {
               resetDialog();
               closeDialog();
            }
         }}
      >
         <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-[40rem]">
            <DialogHeader>
               <DialogTitle>{tRR('rankRequest.replaceRankRequest')}</DialogTitle>
            </DialogHeader>
            {replaceStep === 'search' && (
               <div className="animate-in fade-in slide-in-from-left-2 flex flex-col gap-3 duration-200">
                  <div className="flex flex-col gap-2">
                     <Label htmlFor="replacement-search">{tRR('rankRequest.replacementSearch')}</Label>
                     <InputGroup>
                        <InputGroupAddon align="inline-start">{replacementSource ? <FaLink /> : <FaSearch />}</InputGroupAddon>
                        <InputGroupInput
                           id="replacement-search"
                           value={replacementInput}
                           onChange={(event) => {
                              const value = event.target.value;
                              setReplacementInput(value);
                              replacementInputDebounce.run(value);
                              setReplacementLookupError(null);
                           }}
                           onKeyDown={(event) => {
                              if (event.key === 'Enter' && replacementSource) {
                                 event.preventDefault();
                                 void resolveReplacementInput();
                              }
                           }}
                           placeholder={tRR('rankRequest.replacementSearchPlaceholder')}
                           autoFocus
                        />
                        {replacementSource && (
                           <InputGroupAddon align="inline-end">
                              <InputGroupButton onClick={() => void resolveReplacementInput()} disabled={replacementLookupLoading}>
                                 {replacementLookupLoading ? <Loader2 className="animate-spin" /> : <FaLink />}
                                 {tRR('rankRequest.resolve')}
                              </InputGroupButton>
                           </InputGroupAddon>
                        )}
                     </InputGroup>
                     {replacementLookupError && <p className="text-destructive text-xs">{replacementLookupError}</p>}
                  </div>
                  <div className="h-[min(380px,calc(100vh-22rem))] min-h-[200px] overflow-x-hidden overflow-y-auto rounded-lg border">
                     <div className="flex flex-col gap-2 p-2">
                        {replacementSearchPending && replacementSearchResults.length === 0 && (
                           <div className="text-muted-foreground flex items-center justify-center gap-2 py-8 text-sm">
                              <Loader2 className="size-4 animate-spin" />
                              {tRR('rankRequest.searchingMaps')}
                           </div>
                        )}
                        {!replacementSearchPending &&
                           replacementSearchEnabled &&
                           replacementSearchResults.map((map) => (
                              <ReplacementMapResult key={map.id} map={map} onSelect={() => void selectReplacementMap(map)} />
                           ))}
                        {replacementSearchPending &&
                           replacementSearchResults.map((map) => (
                              <ReplacementMapResult key={map.id} map={map} onSelect={() => void selectReplacementMap(map)} />
                           ))}
                        {!replacementSearchPending && replacementSearchEnabled && replacementSearchResults.length === 0 && (
                           <p className="text-muted-foreground py-8 text-center text-sm">{tRR('rankRequest.noReplacementMaps')}</p>
                        )}
                        {!replacementInputIsSearch && !replacementSource && (
                           <p className="text-muted-foreground px-2 py-8 text-center text-sm">{tRR('rankRequest.replacementSearchHint')}</p>
                        )}
                        {replacementSource && (
                           <p className="text-muted-foreground px-2 py-8 text-center text-sm">{tRR('rankRequest.replacementResolveHint')}</p>
                        )}
                     </div>
                  </div>
               </div>
            )}
            {replaceStep === 'configure' && replacementMap && (
               <div className="animate-in fade-in slide-in-from-right-2 flex flex-col gap-4 duration-200">
                  <div className="grid grid-cols-1 items-stretch gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
                     <MapCard map={mapInfo} showChips={false} compact />
                     <div className="text-muted-foreground flex items-center justify-center">
                        <FaArrowRight className="size-3 rotate-90 sm:rotate-0" />
                     </div>
                     <MapCard map={replacementMap} showChips={false} compact />
                  </div>
                  <div className="flex flex-col gap-2">
                     <Label>{tRR('rankRequest.difficultyMapping')}</Label>
                     <div className="flex flex-col gap-1 rounded-lg border p-2">
                        {getDifficultyPairs(mapInfo, replacementMap).map((pair) => (
                           <DifficultyPairRow
                              key={pair.current.id}
                              currentLeaderboard={pair.current}
                              replacementLeaderboard={pair.replacement}
                              selected={pair.replacement != null && replacementLeaderboardIds.includes(pair.replacement.id)}
                              onToggle={() => pair.replacement && toggleReplacementLeaderboard(pair.replacement.id)}
                           />
                        ))}
                     </div>
                  </div>
                  <div className="flex flex-col gap-2">
                     <Label htmlFor="replacement-description">{tRR('rankRequest.description')}</Label>
                     <Textarea
                        id="replacement-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={tRR('rankRequest.replacementDescriptionPlaceholder')}
                        required
                        minLength={1}
                        maxLength={4096}
                        rows={3}
                        size="sm"
                        resize="none"
                     />
                  </div>
               </div>
            )}
            <DialogFooter>
               {replaceStep === 'configure' ? (
                  <Button variant="secondary" onClick={() => setReplaceStep('search')}>
                     {tc('common.back')}
                  </Button>
               ) : (
                  <Button variant="secondary" onClick={closeDialog}>
                     {tc('common.cancel')}
                  </Button>
               )}
               {replaceStep === 'configure' && (
                  <Button disabled={pending || !replacementValid} onClick={handleReplace} className="relative cursor-pointer">
                     <span className={pending ? 'invisible' : undefined}>{tRR('rankRequest.replace')}</span>
                     {pending && <Loader2 className="absolute animate-spin" />}
                  </Button>
               )}
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}

function parseReplacementSource(value: string): ReplacementSource | null {
   const trimmed = value.trim();
   if (!trimmed) return null;

   const direct = positiveIntInput.safeParse(trimmed);
   if (direct.success) return { kind: 'leaderboard', id: direct.data };

   const prefixedMap = /^map:(\d+)$/i.exec(trimmed);
   if (prefixedMap) return { kind: 'map', id: Number(prefixedMap[1]) };

   const prefixedLeaderboard = /^(?:lb|leaderboard):(\d+)$/i.exec(trimmed);
   if (prefixedLeaderboard) return { kind: 'leaderboard', id: Number(prefixedLeaderboard[1]) };

   const urlResult = Result.try({
      try: () => new URL(trimmed, env.NEXT_PUBLIC_SITE_URL),
      catch: () => null
   });
   const url = Result.unwrapOr(urlResult, null);
   if (!url) return null;

   const leaderboardMatch = /^\/leaderboard\/(\d+)/.exec(url.pathname);
   if (leaderboardMatch) return { kind: 'leaderboard', id: Number(leaderboardMatch[1]) };

   const mapDifficultyMatch = /^\/map\/\d+\/difficulty\/(\d+)/.exec(url.pathname);
   if (mapDifficultyMatch) return { kind: 'leaderboard', id: Number(mapDifficultyMatch[1]) };

   const mapMatch = /^\/map\/(\d+)/.exec(url.pathname);
   if (mapMatch) return { kind: 'map', id: Number(mapMatch[1]) };

   return null;
}

function getReplacementLeaderboards(map: ReplacementMap) {
   return getDisplayLeaderboards(map.leaderboards);
}

function getEligibleReplacementLeaderboards(map: ReplacementMap) {
   return getReplacementLeaderboards(map).filter(
      (leaderboard) => leaderboard.realm.leaderboardStatus === 'UNRANKED' && leaderboard.realm.stars === 0
   );
}

function isEligibleReplacementMap(map: ReplacementMap) {
   return getEligibleReplacementLeaderboards(map).length > 0;
}

type DifficultyPair = {
   current: ReplacementMap['leaderboards'][number];
   replacement: ReplacementMap['leaderboards'][number] | null;
};

function getDifficultyPairs(currentMap: ReplacementMap, replacementMap: ReplacementMap): DifficultyPair[] {
   const replacementLeaderboards = getEligibleReplacementLeaderboards(replacementMap);
   return getReplacementLeaderboards(currentMap).map((current) => ({
      current,
      replacement: replacementLeaderboards.find((lb) => lb.difficulty === current.difficulty) ?? null
   }));
}

function getMatchedReplacementLeaderboardIds(currentMap: ReplacementMap, replacementMap: ReplacementMap) {
   return getDifficultyPairs(currentMap, replacementMap)
      .map((pair) => pair.replacement?.id)
      .filter((id): id is number => id != null);
}

function ReplacementMapResult({ map, onSelect }: { map: MapControllerGetMapListingsDataItem; onSelect: () => void }) {
   const tc = useTranslations();
   const leaderboards = getEligibleReplacementLeaderboards(map);

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

function DifficultyPairRow({
   currentLeaderboard,
   replacementLeaderboard,
   selected,
   onToggle
}: {
   currentLeaderboard: ReplacementMap['leaderboards'][number];
   replacementLeaderboard: ReplacementMap['leaderboards'][number] | null;
   selected: boolean;
   onToggle: () => void;
}) {
   const tRR = useTranslations();
   const disabled = replacementLeaderboard == null;

   return (
      <Label
         className={cn(
            'grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 rounded-md px-2 py-1.5 font-normal transition-colors',
            selected && 'bg-accent',
            disabled && 'cursor-not-allowed opacity-60'
         )}
      >
         <span className="flex items-center justify-end gap-2">
            <Checkbox className="cursor-pointer" checked={selected} onCheckedChange={onToggle} disabled={disabled} />
            <DifficultyBadge leaderboard={currentLeaderboard} />
         </span>
         <FaArrowRight className="text-muted-foreground size-2.5 shrink-0" />
         <span className="flex items-center justify-start">
            {replacementLeaderboard ? (
               <DifficultyBadge leaderboard={replacementLeaderboard} />
            ) : (
               <span className="text-muted-foreground text-xs italic">{tRR('rankRequest.noDifficultyMatch')}</span>
            )}
         </span>
      </Label>
   );
}

function DifficultyBadge({ leaderboard }: { leaderboard: ReplacementMap['leaderboards'][number] }) {
   const label = getDifficultyLabel(leaderboard.difficulty);
   const stars = leaderboard.realm.stars > 0 ? `${leaderboard.realm.stars.toFixed(2)}★` : null;

   return (
      <Badge variant="difficulty" className={cn('max-w-none gap-1 px-1.5 tabular-nums', getDifficultyBgClass(leaderboard.difficulty))}>
         {label}
         {stars && <span className="opacity-80">{stars}</span>}
      </Badge>
   );
}
