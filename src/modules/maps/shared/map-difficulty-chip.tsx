'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { getRouteApi } from '@tanstack/react-router';

import type { MapControllerGetMapByIdResponse, MapControllerGetMapListingsDataItem } from '@/shared/api/generated/ApiParams';
import { cn } from '@/shared/format/helpers';
import { getDifficultyLabel } from '@/shared/format/strings';
import { getDifficultyBgClass } from '@/shared/format/styling';
import { usePersistedLeaderboardSearch } from '@/shared/url-state/persisted/use-persisted-leaderboard-search';

const mapDifficultyRoute = getRouteApi('/map/$id/difficulty/$leaderboardId');

export type MapCardLeaderboard =
   | MapControllerGetMapListingsDataItem['leaderboards'][number]
   | MapControllerGetMapByIdResponse['leaderboards'][number];

interface MapDifficultyChipProps {
   mapId: number;
   leaderboard: MapCardLeaderboard;
   isExpanded: boolean;
   onExpandAction: () => void;
}

export function MapDifficultyChip({ mapId, leaderboard, isExpanded, onExpandAction }: MapDifficultyChipProps) {
   const [expandedWidth, setExpandedWidth] = useState(0);
   const linkSearch = usePersistedLeaderboardSearch();
   const [measureElement, setMeasureElement] = useState<HTMLSpanElement | null>(null);
   const [transitionsEnabled, setTransitionsEnabled] = useState(false);
   const hadPointerDown = useRef(false);
   const pointerTypeRef = useRef<string | null>(null);
   const label = getDifficultyLabel(leaderboard.difficulty);
   const isRanked = leaderboard.realm.leaderboardStatus === 'RANKED' && leaderboard.realm.stars > 0;
   const chipLabel = isRanked ? `${label} (${leaderboard.realm.stars.toFixed(2)}★)` : label;
   const widthStyle = !isExpanded ? '0.9rem' : transitionsEnabled && expandedWidth > 0 ? `${expandedWidth}px` : undefined;

   useLayoutEffect(() => {
      if (!measureElement) return;
      setExpandedWidth(Math.ceil(measureElement.getBoundingClientRect().width) + 8);
   }, [chipLabel, measureElement]);

   // delay transitions by one frame to prevent mount animation
   useEffect(() => setTransitionsEnabled(true), []);

   return (
      <div className={cn('relative h-5 shrink-0', transitionsEnabled && 'transition-[width] duration-200 ease-out')} style={{ width: widthStyle }}>
         {isExpanded && <span className="pointer-events-none invisible block px-1 text-[10px] font-semibold whitespace-nowrap">{chipLabel}</span>}
         <span
            ref={setMeasureElement}
            className="pointer-events-none invisible absolute top-0 left-0 px-1 text-[10px] font-semibold whitespace-nowrap"
         >
            {chipLabel}
         </span>
         <mapDifficultyRoute.Link
            params={{ id: mapId, leaderboardId: String(leaderboard.id) }}
            search={linkSearch}
            aria-label={chipLabel}
            onPointerDown={(event) => {
               hadPointerDown.current = true;
               pointerTypeRef.current = event.pointerType;
            }}
            onPointerEnter={(e) => {
               if (e.pointerType !== 'touch') onExpandAction();
            }}
            onFocus={() => {
               // only expand on keyboard focus (no preceding pointer event)
               if (!hadPointerDown.current) onExpandAction();
               hadPointerDown.current = false;
            }}
            onClick={(event) => {
               if (!isExpanded && pointerTypeRef.current === 'touch') {
                  event.preventDefault();
                  // stop the route loader's document click listener from starting early
                  event.nativeEvent.stopImmediatePropagation();
                  onExpandAction();
               }
            }}
            className={cn(
               'text-badge-foreground absolute inset-0 flex h-full w-full items-center overflow-hidden rounded-md shadow-sm ring-1 ring-black/10',
               transitionsEnabled && 'transition-[box-shadow,padding] duration-200 ease-out',
               'hover:shadow-md focus-visible:shadow-md focus-visible:outline-hidden',
               'justify-center',
               isExpanded && 'px-1',
               getDifficultyBgClass(leaderboard.difficulty)
            )}
         >
            <span
               className={cn(
                  'h-1.5 w-1.5 shrink-0 rounded-full bg-white/85',
                  transitionsEnabled && 'transition-[opacity,transform] duration-150',
                  isExpanded ? 'scale-75 opacity-0' : 'scale-100 opacity-100'
               )}
            />
            <span
               className={cn(
                  'pointer-events-none absolute inset-0 flex items-center justify-center px-1 text-[10px] font-semibold whitespace-nowrap',
                  transitionsEnabled && 'transition-[opacity,transform] duration-200 ease-out',
                  isExpanded ? 'translate-x-0 opacity-100' : 'translate-x-1 opacity-0'
               )}
            >
               {chipLabel}
            </span>
         </mapDifficultyRoute.Link>
      </div>
   );
}
