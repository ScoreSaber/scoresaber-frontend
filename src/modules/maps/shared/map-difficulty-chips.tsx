'use client';

import { useEffect, useRef, useState } from 'react';

import { type MapCardLeaderboard, MapDifficultyChip } from '@/modules/maps/shared/map-difficulty-chip';

export type StarRangeFilter = {
   min: number;
   max: number;
};

interface MapDifficultyChipsProps {
   mapId: number;
   leaderboards: MapCardLeaderboard[];
   expandLowest?: boolean;
   starRange?: StarRangeFilter;
}

export function MapDifficultyChips({ mapId, leaderboards, expandLowest, starRange }: MapDifficultyChipsProps) {
   const matchingLeaderboards = starRange ? leaderboards.filter((leaderboard) => matchesStarRange(leaderboard, starRange)) : [];
   const defaultLeaderboards = starRange ? matchingLeaderboards : leaderboards;
   const defaultChipId = (expandLowest ? defaultLeaderboards.at(0) : defaultLeaderboards.at(-1))?.id ?? null;
   const [expandedChipId, setExpandedChipId] = useState<number | null>(defaultChipId);
   const starRangeKey = starRange ? `${starRange.min}-${starRange.max}` : '';
   const previousStarRangeKey = useRef(starRangeKey);

   useEffect(() => {
      setExpandedChipId((current) => {
         if (previousStarRangeKey.current !== starRangeKey) {
            previousStarRangeKey.current = starRangeKey;
            return defaultChipId;
         }

         if (current != null) {
            const currentLeaderboard = leaderboards.find((leaderboard) => leaderboard.id === current);
            if (currentLeaderboard && (!starRange || matchesStarRange(currentLeaderboard, starRange))) return current;
         }
         return defaultChipId;
      });
   }, [defaultChipId, leaderboards, starRange, starRangeKey]);

   return (
      <div className="flex flex-nowrap items-center gap-1">
         {leaderboards.map((lb) => (
            <MapDifficultyChip
               key={lb.id}
               mapId={mapId}
               leaderboard={lb}
               isExpanded={expandedChipId === lb.id}
               isDimmed={!!starRange && !matchesStarRange(lb, starRange)}
               onExpandAction={() => setExpandedChipId(lb.id)}
            />
         ))}
      </div>
   );
}

function matchesStarRange(leaderboard: MapCardLeaderboard, starRange: StarRangeFilter) {
   const stars = leaderboard.realm.stars;
   return leaderboard.realm.leaderboardStatus === 'RANKED' && stars >= starRange.min && stars <= starRange.max;
}
