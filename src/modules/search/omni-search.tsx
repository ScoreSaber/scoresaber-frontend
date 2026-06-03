'use client';

import { memo, useCallback, useEffect, useRef, useState } from 'react';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getRouteApi, useRouter } from '@tanstack/react-router';
import { Result } from 'better-result';
import { ChevronRight, ExternalLink, Loader2, Search, Users, X } from 'lucide-react';
import { FaMap } from 'react-icons/fa';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Kbd } from '@/components/ui/kbd';
import { Separator } from '@/components/ui/separator';

import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { getDisplayLeaderboards } from '@/modules/maps/map-leaderboards';
import { MapDifficultyChip } from '@/modules/maps/shared/map-difficulty-chip';
import { PlayerAvatar } from '@/modules/player/shared/player-avatar';
import { useOmniSearch } from '@/modules/search/search-provider';
import { api } from '@/shared/api/ApiInstance';
import type { MapControllerGetMapListingsDataItem, PlayerControllerGetPlayersDataItem } from '@/shared/api/generated/ApiParams';
import { CountryImage } from '@/shared/components/country-image';
import { FadeInImage } from '@/shared/components/fade-in-image';
import { Time } from '@/shared/components/time';
import { cn, formatNumber } from '@/shared/format/helpers';
import { getHighestStatus, getPlayerRoleStyleAndTitle, getStatusAccentClass } from '@/shared/format/styling';
import { apiResult } from '@/shared/result/api';

const MIN_SEARCH_LENGTH = 3;
const DEBOUNCE_MS = 300;
const RESULTS_LIMIT = 6;
const mapRoute = getRouteApi('/map/$id');
const mapsRoute = getRouteApi('/maps');
const playerRoute = getRouteApi('/u/$playerId');
const rankingsRoute = getRouteApi('/rankings');

type SearchResults = {
   players: PlayerControllerGetPlayersDataItem[];
   maps: MapControllerGetMapListingsDataItem[];
};

// stable empty reference so consumers don't get a fresh object each render
const EMPTY_RESULTS: SearchResults = { players: [], maps: [] };

// only reads open/setOpen so this stays stable while typing.
// query state + ui lives in OmniSearchBody, keeps keystroke re-renders out of Dialog/Presence
export function OmniSearch() {
   const { open, setOpen } = useOmniSearch();
   const t = useTranslations();
   const [mounted, setMounted] = useState(false);

   useEffect(() => {
      setMounted(true);
   }, []);

   // avoid radix id drift on fresh loads:
   // https://github.com/radix-ui/primitives/issues/3700
   // https://github.com/shadcn-ui/ui/issues/1018
   if (!mounted) {
      return null;
   }

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogContent
            className="top-0 left-0 flex h-dvh max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-none border-0 p-0 sm:top-[12%] sm:left-1/2 sm:h-auto sm:max-w-xl sm:-translate-x-1/2 sm:rounded-lg sm:border"
            style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
            showCloseButton={false}
         >
            <DialogHeader className="sr-only">
               <DialogTitle>{t('search.title')}</DialogTitle>
               <DialogDescription>{t('search.description')}</DialogDescription>
            </DialogHeader>
            <OmniSearchBody />
         </DialogContent>
      </Dialog>
   );
}

function OmniSearchBody() {
   const { open, setOpen, initialQuery, clearInitialQuery } = useOmniSearch();
   const router = useRouter();
   const t = useTranslations();
   const tNav = useTranslations();
   const inputRef = useRef<HTMLInputElement>(null);
   const listRef = useRef<HTMLDivElement>(null);

   const [query, setQuery] = useState('');
   const [debouncedQuery, setDebouncedQuery] = useState('');
   const [focusIndex, setFocusIndex] = useState(0);

   const [playersCollapsed, setPlayersCollapsed] = useState(false);
   const [mapsCollapsed, setMapsCollapsed] = useState(false);

   const debouncedQueryUpdate = useDebouncedCallback((value: string) => setDebouncedQuery(value), DEBOUNCE_MS);

   const trimmedQuery = debouncedQuery.trim();
   const searchEnabled = open && trimmedQuery.length >= MIN_SEARCH_LENGTH;

   const {
      data: queryData = EMPTY_RESULTS,
      isFetching: loading,
      isPlaceholderData
   } = useQuery({
      queryKey: ['omniSearch', trimmedQuery],
      queryFn: async ({ signal }) => {
         const [playersResult, mapsResult] = await Promise.all([
            apiResult(api.player.playerControllerGetPlayers({ search: trimmedQuery, limit: RESULTS_LIMIT }, { signal })),
            apiResult(
               api.map.mapControllerGetMapListings(
                  { search: trimmedQuery, limit: RESULTS_LIMIT, sortBy: 'totalScores', sortDirection: 'desc' },
                  { signal }
               )
            )
         ]);

         return {
            players: Result.match(playersResult, {
               ok: (response) => response.data.data ?? [],
               err: () => []
            }),
            maps: Result.match(mapsResult, {
               ok: (response) => response.data.data ?? [],
               err: () => []
            })
         };
      },
      enabled: searchEnabled,
      staleTime: 30 * 1000,
      // don't blank the list between keystrokes
      placeholderData: keepPreviousData
   });

   // drop stale results when the query falls below min length
   const results = searchEnabled ? queryData : EMPTY_RESULTS;

   // lock clicks on stale results during refetch -- dodges misclicks on layout shift.
   // ref keeps row handlers stable through memo
   const resultsLocked = isPlaceholderData && searchEnabled;
   const resultsLockedRef = useRef(resultsLocked);
   resultsLockedRef.current = resultsLocked;

   const hasSearched = searchEnabled && !loading;

   // true while debouncing or fetching -- query typed but results not back yet
   const isSearchPending = query.trim().length >= MIN_SEARCH_LENGTH && (loading || query.trim() !== trimmedQuery);

   // flat list of navigable items
   const flatItems = useCallback((): { type: 'player' | 'map'; index: number }[] => {
      const items: { type: 'player' | 'map'; index: number }[] = [];
      if (!playersCollapsed) {
         results.players.forEach((_, i) => items.push({ type: 'player', index: i }));
      }
      if (!mapsCollapsed) {
         results.maps.forEach((_, i) => items.push({ type: 'map', index: i }));
      }
      return items;
   }, [results, playersCollapsed, mapsCollapsed]);

   // clamp focus when items change
   useEffect(() => {
      const max = flatItems().length;
      if (max === 0) {
         setFocusIndex(0);
      } else if (focusIndex >= max) {
         setFocusIndex(max - 1);
      }
   }, [flatItems, focusIndex]);

   // reset on close, seed from initialQuery on open
   useEffect(() => {
      if (!open) {
         setQuery('');
         debouncedQueryUpdate.cancel();
         setDebouncedQuery('');
         setFocusIndex(0);
         setPlayersCollapsed(false);
         setMapsCollapsed(false);
      } else if (initialQuery) {
         setQuery(initialQuery);
         debouncedQueryUpdate.cancel();
         setDebouncedQuery(initialQuery);
         clearInitialQuery();
      }
   }, [open, initialQuery, clearInitialQuery, debouncedQueryUpdate]);

   // autofocus on open
   useEffect(() => {
      if (open) {
         // wait a frame so the dialog animation settles
         requestAnimationFrame(() => inputRef.current?.focus());
      }
   }, [open]);

   const navigateToPlayer = useCallback(
      (playerId: string) => {
         setOpen(false);
         void router.navigate({ to: playerRoute.id, params: { playerId }, search: { sort: 'top', page: 1 } });
      },
      [setOpen, router]
   );
   const navigateToMap = useCallback(
      (mapId: number) => {
         setOpen(false);
         void router.navigate({ to: mapRoute.id, params: { id: mapId }, search: { page: 1 } });
      },
      [setOpen, router]
   );
   const navigateToRankings = useCallback(
      (search: string) => {
         setOpen(false);
         void router.navigate({ to: rankingsRoute.id, search: { page: 1, search } });
      },
      [setOpen, router]
   );
   const navigateToMaps = useCallback(
      (search: string) => {
         setOpen(false);
         void router.navigate({ to: mapsRoute.id, search: { page: 1, verified: 'true', search } });
      },
      [setOpen, router]
   );

   // stable handlers so memoized row components don't re-render on every keystroke
   const handleSelectPlayer = useCallback(
      (playerId: string) => {
         if (resultsLockedRef.current) return;
         navigateToPlayer(playerId);
      },
      [navigateToPlayer]
   );
   const handleSelectMap = useCallback(
      (mapId: number) => {
         if (resultsLockedRef.current) return;
         navigateToMap(mapId);
      },
      [navigateToMap]
   );
   const handleFocusItem = useCallback((index: number) => setFocusIndex(index), []);
   const handleClose = useCallback(() => setOpen(false), [setOpen]);

   function navigateToFocused() {
      const items = flatItems();
      if (items.length === 0) return;
      const item = items[focusIndex];
      if (!item) return;

      if (item.type === 'player') {
         navigateToPlayer(results.players[item.index].id);
      } else {
         navigateToMap(results.maps[item.index].id);
      }
   }

   function scrollToFocused(index: number, max: number) {
      const container = listRef.current;
      if (!container) return;

      // wrapped to first -- snap to top
      if (index === 0) {
         container.scrollTo({ top: 0, behavior: 'smooth' });
         return;
      }
      // wrapped to last -- snap to bottom
      if (index === max - 1) {
         container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
         return;
      }

      const active = container.querySelector('[data-focused="true"]');
      if (active) {
         active.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
   }

   function handleInputChange(value: string) {
      setQuery(value);
      setFocusIndex(0);
      debouncedQueryUpdate.run(value);
   }

   function handleKeyDown(e: React.KeyboardEvent) {
      const items = flatItems();
      const max = items.length;

      switch (e.key) {
         case 'ArrowDown': {
            e.preventDefault();
            const nextDown = (focusIndex + 1) % Math.max(max, 1);
            setFocusIndex(nextDown);
            requestAnimationFrame(() => scrollToFocused(nextDown, max));
            break;
         }
         case 'ArrowUp': {
            e.preventDefault();
            const nextUp = (focusIndex - 1 + Math.max(max, 1)) % Math.max(max, 1);
            setFocusIndex(nextUp);
            requestAnimationFrame(() => scrollToFocused(nextUp, max));
            break;
         }
         case 'Enter': {
            e.preventDefault();
            navigateToFocused();
            break;
         }
         case '1': {
            if (!e.metaKey && !e.ctrlKey) break;
            e.preventDefault();
            setPlayersCollapsed((prev) => !prev);
            break;
         }
         case '2': {
            if (!e.metaKey && !e.ctrlKey) break;
            e.preventDefault();
            setMapsCollapsed((prev) => !prev);
            break;
         }
      }
   }

   const totalPlayers = results.players.length;
   const totalMaps = results.maps.length;
   const showPlayers = totalPlayers > 0;
   const showMaps = totalMaps > 0;
   const showEmpty = hasSearched && !loading && !isSearchPending && totalPlayers === 0 && totalMaps === 0;
   const showHint = !hasSearched && !loading && query.trim().length < MIN_SEARCH_LENGTH;

   // track cumulative index for focus
   let currentIndex = 0;

   return (
      <>
         {/* search input */}
         <div className="flex items-center gap-3 px-4 py-3">
            <SearchLeadingIcon loading={loading} />
            <Input
               ref={inputRef}
               type="text"
               placeholder={t('search.placeholder')}
               value={query}
               onChange={(e) => handleInputChange(e.target.value)}
               onKeyDown={handleKeyDown}
               className="h-auto flex-1 rounded-none border-0 bg-transparent px-0 py-0 text-base shadow-none focus-visible:ring-0 dark:bg-transparent"
               autoComplete="off"
               spellCheck={false}
            />
            <SearchTrailingControls onClose={handleClose} />
         </div>
         <Separator />

         {/* results list */}
         <div ref={listRef} className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto sm:max-h-[min(60vh,500px)] sm:flex-none">
            {showHint && <div className="text-muted-foreground py-12 text-center text-sm">{t('search.minChars')}</div>}

            {showEmpty && <div className="text-muted-foreground py-12 text-center text-sm">{t('search.noResults')}</div>}

            {isSearchPending && !showPlayers && !showMaps && (
               <div className="text-muted-foreground flex items-center justify-center gap-2 py-12 text-sm">
                  <Loader2 className="size-4 animate-spin" />
                  {t('search.searching')}
               </div>
            )}

            {/* players section */}
            {showPlayers && (
               <div>
                  <SectionHeader
                     collapsed={playersCollapsed}
                     onToggle={() => setPlayersCollapsed((prev) => !prev)}
                     icon={<Users className="text-muted-foreground size-3.5" />}
                     label={t('search.players')}
                     count={totalPlayers}
                     kbd="⌘1"
                     onNavigate={() => navigateToRankings(query.trim())}
                     navigateTitle={t('search.viewAllRankings')}
                  />
                  {!playersCollapsed &&
                     results.players.map((player) => {
                        const itemIndex = currentIndex++;
                        return (
                           <PlayerResult
                              key={player.id}
                              player={player}
                              focused={focusIndex === itemIndex}
                              itemIndex={itemIndex}
                              onSelect={handleSelectPlayer}
                              onFocus={handleFocusItem}
                           />
                        );
                     })}
               </div>
            )}

            {/* maps section */}
            {showMaps && (
               <div>
                  <SectionHeader
                     collapsed={mapsCollapsed}
                     onToggle={() => setMapsCollapsed((prev) => !prev)}
                     icon={<FaMap className="text-muted-foreground size-3 fill-current" />}
                     label={tNav('nav.maps')}
                     count={totalMaps}
                     kbd="⌘2"
                     onNavigate={() => navigateToMaps(query.trim())}
                     navigateTitle={t('search.viewAllMaps')}
                  />
                  {!mapsCollapsed &&
                     results.maps.map((map) => {
                        const itemIndex = currentIndex++;
                        return (
                           <MapResult
                              key={map.id}
                              map={map}
                              focused={focusIndex === itemIndex}
                              itemIndex={itemIndex}
                              onSelect={handleSelectMap}
                              onFocus={handleFocusItem}
                           />
                        );
                     })}
               </div>
            )}
         </div>

         {/* footer hints */}
         {(showPlayers || showMaps) && (
            <>
               <Separator />
               <div className="text-muted-foreground hidden items-center gap-3 px-4 py-2 text-xs sm:flex">
                  <span className="flex items-center gap-1">
                     <Kbd size="sm">↑↓</Kbd> {t('search.navigate')}
                  </span>
                  <span className="flex items-center gap-1">
                     <Kbd size="sm">↵</Kbd> {t('search.select')}
                  </span>
                  <span className="flex items-center gap-1">
                     <Kbd size="sm">esc</Kbd> {t('search.close')}
                  </span>
               </div>
            </>
         )}
      </>
   );
}

// spinner or magnifier -- only re-renders when loading flips
const SearchLeadingIcon = memo(function SearchLeadingIcon({ loading }: { loading: boolean }) {
   return loading ? (
      <Loader2 className="text-muted-foreground size-5 shrink-0 animate-spin" />
   ) : (
      <Search className="text-muted-foreground size-5 shrink-0" />
   );
});

// esc hint + mobile close button -- fully static, never re-renders
const SearchTrailingControls = memo(function SearchTrailingControls({ onClose }: { onClose: () => void }) {
   return (
      <>
         <Kbd className="hidden sm:inline-flex">Esc</Kbd>
         <Button variant="ghost" size="icon-xs" onClick={onClose} className="text-muted-foreground hover:bg-transparent sm:hidden">
            <X data-icon className="size-5" />
         </Button>
      </>
   );
});

// collapsible section header with kbd hint + external-link button
function SectionHeader({
   collapsed,
   onToggle,
   icon,
   label,
   count,
   kbd,
   onNavigate,
   navigateTitle
}: {
   collapsed: boolean;
   onToggle: () => void;
   icon: React.ReactNode;
   label: string;
   count: number;
   kbd: string;
   onNavigate: () => void;
   navigateTitle: string;
}) {
   return (
      <div
         role="button"
         tabIndex={0}
         onClick={onToggle}
         onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
               e.preventDefault();
               onToggle();
            }
         }}
         className="bg-background hover:bg-accent/50 sticky top-0 z-10 flex w-full cursor-pointer items-center gap-2 border-b px-4 py-2"
      >
         <ChevronRight className={cn('text-muted-foreground size-3.5 transition-transform', !collapsed && 'rotate-90')} />
         {icon}
         <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">{label}</span>
         <span className="text-muted-foreground/70 text-xs">({count})</span>

         <div className="ml-auto flex items-center gap-1.5">
            <Kbd className="hidden sm:inline-flex">
               <span className="text-[10px]">{kbd}</span>
            </Kbd>
            <Button
               variant="ghost"
               size="icon-xs"
               onClick={(e) => {
                  e.stopPropagation();
                  onNavigate();
               }}
               className="size-auto cursor-pointer p-0.5"
               title={navigateTitle}
            >
               <ExternalLink data-icon className="size-3" />
            </Button>
         </div>
      </div>
   );
}

// player result row
const PlayerResult = memo(function PlayerResult({
   player,
   focused,
   itemIndex,
   onSelect,
   onFocus
}: {
   player: PlayerControllerGetPlayersDataItem;
   focused: boolean;
   itemIndex: number;
   onSelect: (playerId: string) => void;
   onFocus: (index: number) => void;
}) {
   return (
      <div
         data-focused={focused}
         onClick={() => onSelect(player.id)}
         onMouseEnter={() => onFocus(itemIndex)}
         className={cn('flex cursor-pointer items-center gap-3 px-4 py-2.5 transition-colors', focused ? 'bg-accent' : 'hover:bg-accent/50')}
      >
         <PlayerAvatar src={player.avatar} playerId={player.id} alt={player.name} width={32} height={32} className="h-8 w-8 shrink-0 rounded-full" />
         <div className="flex min-w-0 flex-1 items-center gap-2">
            <CountryImage country={player.country} size={18} className="shrink-0" />
            <span className={cn('min-w-0 truncate text-sm font-medium', getPlayerRoleStyleAndTitle(player)[0])}>{player.name}</span>
         </div>
         <span className="text-muted-foreground shrink-0 text-xs font-medium tabular-nums">#{formatNumber(player.stats.rank)}</span>
         {focused && (
            <Kbd size="sm" className="hidden sm:inline-flex">
               ↵
            </Kbd>
         )}
      </div>
   );
});

// map result row
const MapResult = memo(function MapResult({
   map,
   focused,
   itemIndex,
   onSelect,
   onFocus
}: {
   map: MapControllerGetMapListingsDataItem;
   focused: boolean;
   itemIndex: number;
   onSelect: (mapId: number) => void;
   onFocus: (index: number) => void;
}) {
   const tc = useTranslations();
   const displayLeaderboards = getDisplayLeaderboards(map.leaderboards);
   const status = getHighestStatus(displayLeaderboards);

   // default to highest difficulty expanded
   const defaultChipId = displayLeaderboards.at(-1)?.id ?? null;
   const [expandedChipId, setExpandedChipId] = useState<number | null>(defaultChipId);

   return (
      <div
         data-focused={focused}
         onClick={() => onSelect(map.id)}
         onMouseEnter={() => onFocus(itemIndex)}
         className={cn(
            'relative flex cursor-pointer items-center gap-3 overflow-hidden px-4 py-2.5 transition-colors',
            focused ? 'bg-accent' : 'hover:bg-accent/50'
         )}
      >
         {/* accent bar */}
         <div className={cn('absolute top-0 bottom-0 left-0 w-0.75', getStatusAccentClass(status))} />

         {/* cover art */}
         <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md shadow-sm">
            <FadeInImage src={map.coverUrl} alt={map.songName} fill className="object-cover" sizes="48px" />
         </div>

         {/* info */}
         <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <div className="flex items-baseline gap-1.5">
               <span className="text-foreground truncate text-sm font-bold">{map.songName}</span>
               <span className="text-muted-foreground shrink-0 truncate text-xs">
                  {tc('common.by')} {map.songAuthorName}
               </span>
            </div>
            <div className="text-muted-foreground truncate text-xs">
               {tc('common.mappedBy')} {map.levelAuthorName} &middot; <Time date={map.createdAt} short />
            </div>
            {/* difficulty pills */}
            <div className="mt-0.5 flex flex-nowrap items-center gap-1">
               {displayLeaderboards.map((lb) => (
                  <MapDifficultyChip
                     key={lb.id}
                     mapId={map.id}
                     leaderboard={lb}
                     isExpanded={expandedChipId === lb.id}
                     onExpandAction={() => setExpandedChipId(lb.id)}
                  />
               ))}
            </div>
         </div>

         {focused && (
            <Kbd size="sm" className="hidden shrink-0 sm:inline-flex">
               ↵
            </Kbd>
         )}
      </div>
   );
});
