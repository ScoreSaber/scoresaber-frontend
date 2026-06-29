'use client';

import { getRouteApi } from '@tanstack/react-router';
import { useTranslations } from 'use-intl';

import { DifficultyPill } from './difficulty-pill';

import { LinkedNames } from '@/modules/search/search-link';
import { FadeInImage } from '@/shared/components/fade-in-image';
import { Time } from '@/shared/components/time';
import { cn } from '@/shared/format/helpers';
import { usePersistedLeaderboardSearch } from '@/shared/url-state/persisted/use-persisted-leaderboard-search';

const mapDifficultyRoute = getRouteApi('/map/$id/difficulty/$leaderboardId');

interface SongInfoCardProps {
   mapId: number;
   leaderboardId: number;
   songName: string;
   songAuthorName: string;
   levelAuthorName: string;
   coverImage: string;
   createdDate: string | Date;

   // difficulty
   difficultyValue: number;
   difficultyName: string;
   starValue?: number;

   // display
   variant?: 'default' | 'compact';
   showCover?: boolean;
   showDifficulty?: boolean;
   showSongAuthor?: boolean;
   showMapper?: boolean;
   showCreatedDate?: boolean;
   className?: string;
}

export function SongInfoCard({
   mapId,
   leaderboardId,
   songName,
   songAuthorName,
   levelAuthorName,
   coverImage,
   createdDate,
   difficultyValue,
   difficultyName,
   starValue,
   variant = 'default',
   showCover = true,
   showDifficulty = true,
   showSongAuthor = true,
   showMapper = true,
   showCreatedDate = true,
   className
}: SongInfoCardProps) {
   const tc = useTranslations();
   const linkSearch = usePersistedLeaderboardSearch();
   const compact = variant === 'compact';

   return (
      <div
         className={cn(
            'flex cursor-default',
            compact ? 'min-w-0 flex-col gap-0.5' : 'flex-col gap-2 lg:flex-row lg:items-center lg:gap-4',
            className
         )}
      >
         {showCover && (
            <div className={cn('relative flex justify-center', !compact && 'translate-y-0.5')}>
               <figure className="relative">
                  <FadeInImage
                     className={cn(
                        'max-w-full rounded-md object-cover outline outline-1 outline-black/10 dark:outline-white/10',
                        compact ? 'size-10' : 'h-12 w-12 min-w-11'
                     )}
                     src={coverImage}
                     alt={songName}
                     width={compact ? 40 : 48}
                     height={compact ? 40 : 48}
                  />
                  {showDifficulty && (
                     <DifficultyPill
                        size={compact ? 'compact' : 'default'}
                        className={compact ? 'absolute -right-1.5 -bottom-0.5' : 'absolute top-5 -right-3 bottom-1/4 left-4'}
                        difficultyValue={difficultyValue}
                        difficultyName={difficultyName}
                        starValue={starValue}
                     />
                  )}
               </figure>
            </div>
         )}
         <div className={cn('flex min-w-0 flex-col', !compact && 'lg:justify-center')}>
            {compact ? (
               <div className="text-muted-foreground flex min-w-0 items-baseline text-sm leading-tight">
                  <mapDifficultyRoute.Link
                     className="text-foreground mr-1 min-w-0 truncate font-semibold transition-colors"
                     params={{ id: mapId, leaderboardId }}
                     search={linkSearch}
                  >
                     {songName}
                  </mapDifficultyRoute.Link>
                  {showSongAuthor && (
                     <>
                        <span className="shrink-0">{tc('common.by')}</span>
                        <LinkedNames className="ml-1 min-w-0 truncate" linkClassName="truncate text-foreground font-normal" name={songAuthorName} />
                     </>
                  )}
               </div>
            ) : (
               <div className="text-muted-foreground inline-block w-full overflow-hidden text-center text-ellipsis whitespace-nowrap lg:text-left">
                  <mapDifficultyRoute.Link
                     className="text-foreground mr-1 text-lg font-semibold transition-colors"
                     params={{ id: mapId, leaderboardId }}
                     search={linkSearch}
                  >
                     {songName}
                  </mapDifficultyRoute.Link>
                  {showSongAuthor && (
                     <>
                        <span>{tc('common.by')}</span>
                        <LinkedNames className="ml-1" linkClassName="text-foreground font-normal" name={songAuthorName} />
                     </>
                  )}
               </div>
            )}
            {showMapper && (
               <div
                  className={cn(
                     'text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap',
                     compact ? 'text-[11px] leading-tight' : '-mt-1.5 text-center lg:mt-0 lg:text-left'
                  )}
               >
                  <span className="capitalize">{tc('common.mappedBy')}</span>
                  <LinkedNames
                     className="mr-1 ml-1"
                     linkClassName={cn('text-foreground font-normal', compact && 'text-[11px]')}
                     name={levelAuthorName}
                     splitCommas
                  />
                  {showCreatedDate && (
                     <span className="text-muted-foreground">
                        <Time date={createdDate} short className="text-sm" />
                     </span>
                  )}
               </div>
            )}
         </div>
      </div>
   );
}
