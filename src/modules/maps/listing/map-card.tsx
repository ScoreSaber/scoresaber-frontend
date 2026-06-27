'use client';

import { FaDrum, FaKey, FaMusic } from 'react-icons/fa';
import { useTranslations } from 'use-intl';

import { getDisplayLeaderboards } from '@/modules/maps/map-leaderboards';
import { MapDifficultyChips } from '@/modules/maps/shared/map-difficulty-chips';
import { SongCard } from '@/modules/maps/shared/song-card';
import type { MapControllerGetMapByIdResponse, MapControllerGetMapListingsDataItem } from '@/shared/api/generated/ApiParams';
import { formatNumber } from '@/shared/format/helpers';
import { getHighestStatus, getStatusAccentClass } from '@/shared/format/styling';
import { usePersistedLeaderboardSearch } from '@/shared/url-state/persisted/use-persisted-leaderboard-search';

interface MapCardProps {
   map: MapControllerGetMapListingsDataItem | MapControllerGetMapByIdResponse;
   className?: string;
   expandLowest?: boolean;
   starRange?: {
      min: number;
      max: number;
   };
   showChips?: boolean;
   compact?: boolean;
   variant?: 'default' | 'home';
   background?: 'default' | 'transparent';
   coverPriority?: boolean;
}

export function MapCard({
   map,
   className,
   expandLowest,
   starRange,
   showChips = true,
   compact = false,
   variant = 'default',
   background,
   coverPriority = false
}: MapCardProps) {
   const t = useTranslations();
   const linkSearch = usePersistedLeaderboardSearch();
   const displayLeaderboards = getDisplayLeaderboards(map.leaderboards);
   const status = getHighestStatus(displayLeaderboards);
   const homeVariant = variant === 'home';

   return (
      <SongCard
         coverUrl={map.coverUrl}
         songName={map.songName}
         songSubName={map.songSubName}
         songAuthorName={map.songAuthorName}
         levelAuthorName={map.levelAuthorName}
         createdAt={map.createdAt}
         accentClass={getStatusAccentClass(status)}
         accentTooltip={
            status === 'RANKED'
               ? t('map.statusRanked')
               : status === 'QUALIFIED'
                 ? t('map.statusQualified')
                 : status === 'LOVED'
                   ? t('map.statusLoved')
                   : t('map.statusUnranked')
         }
         mapId={map.id}
         linkSearch={linkSearch}
         className={className}
         compact={compact}
         showMappedAt={!homeVariant}
         background={background}
         coverPriority={coverPriority}
         coverBadge={
            homeVariant && map.bsid ? (
               <a
                  href={`https://beatsaver.com/maps/${map.bsid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-background/85 text-muted-foreground hover:text-primary flex max-w-20 items-center justify-center gap-1 rounded px-1.5 py-0.75 text-[10px] leading-tight font-medium backdrop-blur-sm transition-colors"
               >
                  <FaKey className="size-2" />
                  <span className="font-mono">{map.bsid}</span>
               </a>
            ) : undefined
         }
         pills={
            showChips ? (
               <MapDifficultyChips mapId={map.id} leaderboards={displayLeaderboards} expandLowest={expandLowest} starRange={starRange} />
            ) : undefined
         }
         mobileMetadata={
            homeVariant ? undefined : (
               <>
                  {map.bsid && (
                     <a
                        href={`https://beatsaver.com/maps/${map.bsid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary z-20 flex items-center gap-1 transition-colors"
                     >
                        <FaKey className="size-2.5" />
                        <span className="font-mono">{map.bsid}</span>
                     </a>
                  )}
                  <span className="flex items-center gap-1">
                     <FaDrum className="size-2.5" />
                     {t('map.bpm', { bpm: map.bpm })}
                  </span>
                  <span className="flex items-center gap-1">
                     <FaMusic className="size-2.5" />
                     {t('map.playsCount', { count: formatNumber(map.totalScores) })}
                  </span>
               </>
            )
         }
         desktopMetadata={
            <>
               {map.bsid && (
                  <a
                     href={`https://beatsaver.com/maps/${map.bsid}`}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="text-muted-foreground hover:text-primary z-20 flex items-center gap-1.5 text-xs transition-colors"
                  >
                     <span className="font-mono">{map.bsid}</span>
                     <FaKey className="size-2.5" />
                  </a>
               )}
               <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                  <span>{t('map.bpm', { bpm: map.bpm })}</span>
                  <FaDrum className="size-2.5" />
               </div>
               <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                  <span>{t('map.playsCount', { count: formatNumber(map.totalScores) })}</span>
                  <FaMusic className="size-2.5" />
               </div>
            </>
         }
      />
   );
}
