'use client';

import { useCallback, useEffect, useRef, useTransition } from 'react';

import { getRouteApi, useRouter } from '@tanstack/react-router';
import type { IconType } from 'react-icons';
import { FaBullseye, FaGlobe, FaPlay, FaSortAmountDown, FaSortAmountUp, FaStar, FaTrophy } from 'react-icons/fa';
import { useTranslations } from 'use-intl';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { PlayerLink } from '@/modules/player/shared/player-link';
import type {
   PlayerControllerGetPlayersDataItem,
   PlayerControllerGetPlayersPivot,
   PlayerControllerGetPlayersSort,
   PlayerControllerGetPlayersSortDirection
} from '@/shared/api/generated/ApiParams';
import { CountryImage } from '@/shared/components/country-image';
import { FilterPill } from '@/shared/components/filter-pill';
import type { CountryRegionFilterValue } from '@/shared/country-region';
import { cn, formatAccuracy, formatNumber, formatPP } from '@/shared/format/helpers';
import type { SearchParamsRecord } from '@/shared/url-state/search-params';
import { updateSearchParams } from '@/shared/url-state/update-search-params';

const PAGE_SIZE = 50;
const playerRoute = getRouteApi('/u/$playerId');

const DEFAULT_DIRECTIONS: Record<PlayerControllerGetPlayersSort, PlayerControllerGetPlayersSortDirection> = {
   rank: 'asc',
   countryRank: 'asc',
   totalPP: 'desc',
   totalScore: 'desc',
   totalRankedScore: 'desc',
   totalPlayedLeaderboards: 'desc',
   totalPlayedRankedLeaderboards: 'desc',
   totalSubmittedPlays: 'desc',
   totalReplayViews: 'desc',
   averageAccuracy: 'desc',
   weightedAverageAccuracy: 'desc',
   completionAccuracy: 'desc'
};

interface SortableColumn {
   sortField: PlayerControllerGetPlayersSort;
   icon: IconType;
}

const SORTABLE_COLUMNS: SortableColumn[] = [
   { sortField: 'totalPP', icon: FaStar },
   { sortField: 'totalSubmittedPlays', icon: FaPlay },
   { sortField: 'totalPlayedRankedLeaderboards', icon: FaTrophy },
   { sortField: 'averageAccuracy', icon: FaBullseye }
];

interface RankingsTableProps {
   players: PlayerControllerGetPlayersDataItem[];
   countryFiltered: boolean;
   currentSort?: PlayerControllerGetPlayersSort;
   currentSortDirection?: PlayerControllerGetPlayersSortDirection;
   currentPage: number;
   currentPivot?: PlayerControllerGetPlayersPivot;
   highlight?: string;
   search: RankingsTableSearch;
   buildHref: (search?: RankingsTableSearch) => string;
}

type RankingsTableSearch = SearchParamsRecord & {
   page?: number;
   search?: string;
   countries?: CountryRegionFilterValue;
   sort?: PlayerControllerGetPlayersSort;
   sortDirection?: PlayerControllerGetPlayersSortDirection;
   pivot?: PlayerControllerGetPlayersPivot;
   includeInactive?: 'true' | 'false';
   highlight?: string;
};

export function RankingsTable({
   players,
   countryFiltered,
   currentSort,
   currentSortDirection,
   currentPage,
   currentPivot,
   highlight,
   search,
   buildHref
}: RankingsTableProps) {
   const router = useRouter();
   const t = useTranslations();
   const [isPending, startTransition] = useTransition();

   const handleSort = useCallback(
      (field: PlayerControllerGetPlayersSort) => {
         const updates: Partial<RankingsTableSearch> = {};

         const isCurrentField = currentSort === field || (!currentSort && field === 'totalPP');
         if (isCurrentField) {
            const currentDir = currentSortDirection ?? DEFAULT_DIRECTIONS[field];
            updates.sort = field;
            updates.sortDirection = currentDir === 'desc' ? 'asc' : 'desc';
         } else {
            updates.sort = field;
            updates.sortDirection = DEFAULT_DIRECTIONS[field];
         }

         if (updates.sort === 'totalPP' && updates.sortDirection === 'desc') {
            updates.sort = undefined;
            updates.sortDirection = undefined;
         }

         startTransition(() =>
            router.navigate({
               href: buildHref(updateSearchParams(search, updates, ['page']))
            })
         );
      },
      [buildHref, search, router, currentSort, currentSortDirection]
   );

   const isPlayerPivot = currentPivot === 'player';
   const activeField = currentSort ?? 'totalPP';
   const activeDirection = currentSortDirection ?? DEFAULT_DIRECTIONS[activeField];
   const isDefaultSort = !currentSort || currentSort === 'totalPP';
   const SortArrow = activeDirection === 'desc' ? FaSortAmountDown : FaSortAmountUp;
   const sharedProps = { countryFiltered, isDefaultSort, highlight };

   return (
      <div id="rankings" className="scroll-mt-20">
         {/* mobile: sort pills + card list */}
         <div className="lg:hidden">
            {!isPlayerPivot && (
               <div className={cn('flex flex-wrap gap-1.5 pb-3', isPending && 'pointer-events-none opacity-50')}>
                  {SORTABLE_COLUMNS.map((col) => {
                     const isActive = activeField === col.sortField;
                     return (
                        <FilterPill
                           className="cursor-pointer"
                           key={col.sortField}
                           active={isActive}
                           icon={col.icon}
                           onClick={() => handleSort(col.sortField)}
                        >
                           {col.sortField === 'totalPP'
                              ? t('rankings.pp')
                              : col.sortField === 'totalSubmittedPlays'
                                ? t('rankings.plays')
                                : col.sortField === 'totalPlayedRankedLeaderboards'
                                  ? t('rankings.ranked')
                                  : t('rankings.acc')}
                           {isActive && <SortArrow className="size-2.5" />}
                        </FilterPill>
                     );
                  })}
               </div>
            )}

            <div className="flex flex-col gap-1.5">
               {players.map((player, index) => (
                  <RankingCard key={player.id} player={player} {...sharedProps} listPosition={(currentPage - 1) * PAGE_SIZE + index + 1} />
               ))}
            </div>
         </div>

         {/* desktop: full table */}
         <div className="hidden lg:block">
            <Table className="border-separate border-spacing-y-1.5 text-center whitespace-nowrap">
               <TableHeader>
                  <TableRow className="after:from-border/60 relative border-b-0 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-linear-to-l after:to-transparent hover:bg-transparent">
                     <TableHead className="h-auto px-3 py-2.5 text-center" />
                     <TableHead className="h-auto px-3 py-2.5 text-center" />
                     {SORTABLE_COLUMNS.map((col) => {
                        const isActive = activeField === col.sortField;
                        return (
                           <TableHead
                              key={col.sortField}
                              className={cn(
                                 'h-auto px-4 py-2.5 text-center text-xs font-medium tracking-wide transition-colors select-none',
                                 isPlayerPivot
                                    ? 'text-muted-foreground'
                                    : cn('hover:text-foreground cursor-pointer', isActive ? 'text-foreground' : 'text-muted-foreground'),
                                 isPending && !isPlayerPivot && 'pointer-events-none opacity-50'
                              )}
                              onClick={isPlayerPivot ? undefined : () => handleSort(col.sortField)}
                           >
                              <span className="inline-flex items-center gap-1.5">
                                 <col.icon className="size-3" />
                                 {col.sortField === 'totalPP'
                                    ? t('rankings.pp')
                                    : col.sortField === 'totalSubmittedPlays'
                                      ? t('rankings.totalPlayCount')
                                      : col.sortField === 'totalPlayedRankedLeaderboards'
                                        ? t('rankings.rankedPlayCount')
                                        : t('rankings.averageRankedAccuracy')}
                                 {isActive && !isPlayerPivot && <SortArrow className="size-3" />}
                              </span>
                           </TableHead>
                        );
                     })}
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {players.map((player, index) => (
                     <RankingRow key={player.id} player={player} {...sharedProps} listPosition={(currentPage - 1) * PAGE_SIZE + index + 1} />
                  ))}
               </TableBody>
            </Table>
         </div>
      </div>
   );
}

interface RankingItemProps {
   player: PlayerControllerGetPlayersDataItem;
   countryFiltered: boolean;
   isDefaultSort: boolean;
   listPosition: number;
   highlight?: string;
}

function buildPlayerForLink(player: PlayerControllerGetPlayersDataItem) {
   return {
      id: player.id,
      name: player.name,
      avatar: player.avatar,
      country: player.country,
      permissions: player.permissions,
      role: player.role
   };
}

function RankingCard({ player, countryFiltered, isDefaultSort, listPosition, highlight }: RankingItemProps) {
   const router = useRouter();
   const stats = player.stats;
   const isHighlighted = highlight === player.id;
   const ref = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (isHighlighted && ref.current) {
         ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
   }, [isHighlighted]);

   return (
      <div
         ref={ref}
         className={cn(
            'group bg-secondary/40 hover:bg-primary/10 flex cursor-pointer flex-col gap-1.5 rounded-lg border px-3 py-2.5 transition-colors',
            player.inactive && 'opacity-60',
            isHighlighted && 'border-primary ring-primary/40 ring-1'
         )}
         onClick={() => router.navigate({ to: playerRoute.id, params: { playerId: player.id }, search: { page: 1, sort: 'top' } })}
         onMouseEnter={() => router.preloadRoute({ to: playerRoute.id, params: { playerId: player.id }, search: { page: 1, sort: 'top' } })}
      >
         <div className="flex items-center gap-2">
            <span className="text-muted-foreground shrink-0 text-sm tabular-nums">
               <RankCell
                  isDefaultSort={isDefaultSort}
                  countryFiltered={countryFiltered}
                  listPosition={listPosition}
                  globalRank={stats.rank}
                  countryRank={stats.countryRank}
                  country={player.country}
               />
            </span>
            <div className="min-w-0 flex-1">
               <PlayerLink withPFP player={buildPlayerForLink(player)} isInactive={player.inactive} />
            </div>
         </div>

         <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-0.5 pl-1 text-xs">
            {[
               { Icon: FaStar, value: `${formatPP(stats.totalPP)}pp`, extra: 'font-semibold text-score-pp' },
               { Icon: FaBullseye, value: formatAccuracy(stats.averageAccuracy) },
               { Icon: FaPlay, value: formatNumber(stats.totalSubmittedPlays) },
               { Icon: FaTrophy, value: formatNumber(stats.totalPlayedRankedLeaderboards) }
            ].map(({ Icon, value, extra }, i) => (
               <span key={i} className={cn('inline-flex items-center gap-1', extra)}>
                  <Icon className="size-2.5" />
                  {value}
               </span>
            ))}
         </div>
      </div>
   );
}

function RankingRow({ player, countryFiltered, isDefaultSort, listPosition, highlight }: RankingItemProps) {
   const stats = player.stats;
   const isHighlighted = highlight === player.id;
   const ref = useRef<HTMLTableRowElement>(null);

   useEffect(() => {
      if (isHighlighted && ref.current) {
         ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
   }, [isHighlighted]);

   return (
      <TableRow
         ref={ref}
         className={cn(
            '[&>td]:bg-secondary/40 border-b-0 transition-colors duration-500 ease-out hover:bg-transparent',
            player.inactive && 'opacity-60',
            isHighlighted && '[&>td]:border-primary'
         )}
      >
         <TableCell className="rounded-l-lg border-y border-l px-3 py-2.5 text-left">
            <RankCell
               isDefaultSort={isDefaultSort}
               countryFiltered={countryFiltered}
               listPosition={listPosition}
               globalRank={stats.rank}
               countryRank={stats.countryRank}
               country={player.country}
            />
         </TableCell>
         <TableCell className="max-w-50 border-y py-2.5 text-left font-semibold">
            <div className="truncate">
               <PlayerLink withPFP player={buildPlayerForLink(player)} isInactive={player.inactive} />
            </div>
         </TableCell>
         {[
            { value: `${formatPP(stats.totalPP)}pp`, extra: 'text-score-pp' },
            { value: formatNumber(stats.totalSubmittedPlays) },
            { value: formatNumber(stats.totalPlayedRankedLeaderboards) },
            { value: formatAccuracy(stats.averageAccuracy), extra: 'rounded-r-lg border-r' }
         ].map(({ value, extra }, i) => (
            <TableCell key={i} className={cn('border-y px-4 py-2.5', extra)}>
               {value}
            </TableCell>
         ))}
      </TableRow>
   );
}

interface RankCellProps {
   isDefaultSort: boolean;
   countryFiltered: boolean;
   listPosition: number;
   globalRank: number;
   countryRank: number;
   country: string;
}

function RankCell({ isDefaultSort, countryFiltered, listPosition, globalRank, countryRank, country }: RankCellProps) {
   if (isDefaultSort) {
      if (countryFiltered) {
         return (
            <>
               <span>#{formatNumber(listPosition)}</span>
               <span className="text-muted-foreground ml-1 text-xs">(#{formatNumber(globalRank)})</span>
            </>
         );
      }
      return <>#{formatNumber(globalRank)}</>;
   }

   return (
      <div className="flex items-center gap-2">
         <span className="tabular-nums">#{formatNumber(listPosition)}</span>
         <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
            {countryFiltered && (
               <span className="inline-flex items-center gap-0.5">
                  <CountryImage country={country} size={12} className="cursor-pointer" />
                  <span className="tabular-nums">#{formatNumber(countryRank)}</span>
               </span>
            )}
            <span className="inline-flex items-center gap-0.5">
               <FaGlobe className="size-2.5" />
               <span className="tabular-nums">#{formatNumber(globalRank)}</span>
            </span>
         </div>
      </div>
   );
}
