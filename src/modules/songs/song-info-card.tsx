'use client';

import { getRouteApi } from '@tanstack/react-router';
import { useTranslations } from 'use-intl';

import { DifficultyPill } from './difficulty-pill';

import { LinkedNames } from '@/modules/search';
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
   showDifficulty?: boolean;
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
   showDifficulty = true,
   showMapper = true,
   showCreatedDate = true,
   className
}: SongInfoCardProps) {
   const tc = useTranslations();
   const linkSearch = usePersistedLeaderboardSearch();

   return (
      <div className={cn('flex cursor-default flex-col gap-2 lg:flex-row lg:items-center lg:gap-4', className)}>
         <div className="relative flex translate-y-0.5 justify-center">
            <figure className="relative">
               <FadeInImage
                  className="h-12 w-12 max-w-full min-w-11 rounded-md object-cover outline outline-1 outline-black/10 dark:outline-white/10"
                  src={coverImage}
                  alt={songName}
                  width={48}
                  height={48}
               />
               {showDifficulty && (
                  <DifficultyPill
                     className="absolute top-5 -right-3 bottom-1/4 left-4"
                     difficultyValue={difficultyValue}
                     difficultyName={difficultyName}
                     starValue={starValue}
                  />
               )}
            </figure>
         </div>
         <div className="flex min-w-0 flex-col lg:justify-center">
            <div className="text-muted-foreground inline-block w-full overflow-hidden text-center text-ellipsis whitespace-nowrap lg:text-left">
               <mapDifficultyRoute.Link
                  className="text-foreground mr-1 text-lg font-semibold transition-colors"
                  params={{ id: mapId, leaderboardId }}
                  search={linkSearch}
               >
                  {songName}
               </mapDifficultyRoute.Link>
               <span>{tc('common.by')}</span>
               <LinkedNames className="ml-1" linkClassName="text-foreground font-normal" name={songAuthorName} />
            </div>
            {showMapper && (
               <div className="text-muted-foreground -mt-1.5 overflow-hidden text-center text-ellipsis whitespace-nowrap lg:mt-0 lg:text-left">
                  <span className="capitalize">{tc('common.mappedBy')}</span>
                  <LinkedNames className="mr-1 ml-1" linkClassName="text-foreground font-normal" name={levelAuthorName} splitCommas />
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
