'use client';

import { getRouteApi } from '@tanstack/react-router';
import { FaGlobeAmericas } from 'react-icons/fa';

import { DeviceDisplay } from '@/shared/components/device-display';
import { Time } from '@/shared/components/time';
import { formatNumber, rankToPage } from '@/shared/format/helpers';

const mapDifficultyRoute = getRouteApi('/map/$id/difficulty/$leaderboardId');

interface ScoreRankProps {
   rank: number;
   scoreId: number;
   mapId: number;
   leaderboardId: number;
   timeSet: string | Date;
   hmdName?: string | null;
   controllerLeft?: string | null;
   controllerRight?: string | null;
}

export function ScoreRank({ rank, scoreId, mapId, leaderboardId, timeSet, hmdName, controllerLeft, controllerRight }: ScoreRankProps) {
   return (
      <div className="relative flex w-full shrink-0 flex-row justify-between text-sm lg:w-20 lg:flex-col">
         <span className="flex items-center lg:justify-center">
            <FaGlobeAmericas className="mr-1 size-4" />
            <mapDifficultyRoute.Link
               params={{ id: mapId, leaderboardId }}
               search={{ page: rankToPage(rank, 12), highlight: scoreId }}
               className="text-foreground font-semibold transition-colors"
            >
               #{formatNumber(rank)}
            </mapDifficultyRoute.Link>
         </span>
         <span className="absolute top-0 left-1/2 -translate-x-1/2 text-center whitespace-nowrap lg:static lg:translate-x-0">
            <Time short={true} date={timeSet} longRelativeClassName="lg:text-[10px]" />
         </span>
         <DeviceDisplay
            hmd={hmdName}
            controllerLeft={controllerLeft}
            controllerRight={controllerRight}
            className="flex-nowrap pt-0.75 lg:justify-center"
         />
      </div>
   );
}
