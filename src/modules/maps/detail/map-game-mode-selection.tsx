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

   function getModeLeaderboardId(mode: string) {
      return getDefaultLeaderboardId(mapInfo.leaderboards, mode);
   }

   function preloadGameMode(mode: string) {
      void router.preloadRoute({
         to: '/map/$id/difficulty/$leaderboardId',
         params: { id: mapInfo.id, leaderboardId: getModeLeaderboardId(mode) },
         search: linkSearch
      });
   }

   function handleOpenChange(open: boolean) {
      if (!open) return;

      for (const mode of gameModes) {
         if (mode !== activeGameMode) preloadGameMode(mode);
      }
   }

   if (gameModes.length <= 1) {
      return null;
   }

   return (
      <Select
         value={activeGameMode}
         onOpenChange={handleOpenChange}
         onValueChange={(mode) =>
            router.navigate({
               to: '/map/$id/difficulty/$leaderboardId',
               params: { id: mapInfo.id, leaderboardId: getModeLeaderboardId(mode) },
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
                  <SelectItem
                     key={mode}
                     value={mode}
                     onPointerMove={() => mode !== activeGameMode && preloadGameMode(mode)}
                     onFocus={() => mode !== activeGameMode && preloadGameMode(mode)}
                     className="cursor-pointer"
                  >
                     {getGameModeLabel(mode)}
                  </SelectItem>
               ))}
            </SelectGroup>
         </SelectContent>
      </Select>
   );
}
