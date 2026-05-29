'use client';

import { useEffect, useState } from 'react';

import { type MapCardLeaderboard, MapDifficultyChip } from '@/modules/maps/shared/map-difficulty-chip';

interface MapDifficultyChipsProps {
   mapId: number;
   leaderboards: MapCardLeaderboard[];
   expandLowest?: boolean;
}

export function MapDifficultyChips({ mapId, leaderboards, expandLowest }: MapDifficultyChipsProps) {
   const defaultChipId = (expandLowest ? leaderboards.at(0) : leaderboards.at(-1))?.id ?? null;
   const [expandedChipId, setExpandedChipId] = useState<number | null>(defaultChipId);

   useEffect(() => {
      setExpandedChipId((current) => {
         if (current != null && leaderboards.some((lb) => lb.id === current)) return current;
         return defaultChipId;
      });
   }, [defaultChipId, leaderboards]);

   return (
      <div className="flex flex-nowrap items-center gap-1">
         {leaderboards.map((lb) => (
            <MapDifficultyChip
               key={lb.id}
               mapId={mapId}
               leaderboard={lb}
               isExpanded={expandedChipId === lb.id}
               onExpandAction={() => setExpandedChipId(lb.id)}
            />
         ))}
      </div>
   );
}
