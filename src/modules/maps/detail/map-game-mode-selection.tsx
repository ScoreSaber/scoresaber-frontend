'use client';

import { useRouter } from '@tanstack/react-router';
import { useTranslations } from 'use-intl';

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

import type { LeaderboardSearchParams } from '@/modules/maps/detail/map-leaderboard-view/map-leaderboard-view-types';
import { getAvailableGameModes, getDefaultLeaderboardId } from '@/modules/maps/map-leaderboards';
import type { MapControllerGetMapByIdResponse } from '@/shared/api/generated/ApiParams';
import { getGameModeLabel } from '@/shared/format/strings';

interface MapGameModeSelectionProps {
   mapInfo: MapControllerGetMapByIdResponse;
   activeGameMode: string;
   linkSearchParams?: LeaderboardSearchParams;
   className?: string;
}

export function MapGameModeSelection({ mapInfo, activeGameMode, linkSearchParams, className }: MapGameModeSelectionProps) {
   const t = useTranslations();
   const router = useRouter();
   const gameModes = getAvailableGameModes(mapInfo.leaderboards);
   const linkSearch = { ...linkSearchParams, page: linkSearchParams?.page ?? 1 };

   if (gameModes.length <= 1) {
      return null;
   }

   return (
      <Select
         value={activeGameMode}
         onValueChange={(mode) =>
            router.navigate({
               to: '/map/$id/difficulty/$leaderboardId',
               params: { id: mapInfo.id, leaderboardId: getDefaultLeaderboardId(mapInfo.leaderboards, mode) },
               search: linkSearch
            })
         }
      >
         <SelectTrigger variant="filter" size="compact" className={className}>
            <SelectValue aria-label={getGameModeLabel(activeGameMode)}>{getGameModeLabel(activeGameMode)}</SelectValue>
         </SelectTrigger>
         <SelectContent position="popper" align="start">
            <SelectGroup>
               <SelectLabel>{t('map.gameMode')}</SelectLabel>
               {gameModes.map((mode) => (
                  <SelectItem key={mode} value={mode} className="cursor-pointer">
                     {getGameModeLabel(mode)}
                  </SelectItem>
               ))}
            </SelectGroup>
         </SelectContent>
      </Select>
   );
}
