import type { ReactNode } from 'react';

import { getRouteApi } from '@tanstack/react-router';
import { useTranslations } from 'use-intl';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import type { LeaderboardSearchParams } from '@/modules/maps/detail/map-leaderboard-view/map-leaderboard-view-types';
import { LinkedNames } from '@/modules/search/search-link';
import { FadeInImage } from '@/shared/components/fade-in-image';
import { Time } from '@/shared/components/time';
import { cn } from '@/shared/format/helpers';
import { BLURRED_BG_IMAGE_CLASSES, CARD_GRADIENT_CLASSES } from '@/shared/format/styling';

const mapRoute = getRouteApi('/map/$id');

interface SongCardProps {
   coverUrl: string;
   songName: string;
   songSubName?: string;
   songAuthorName: string;
   levelAuthorName: string;
   createdAt: string;
   accentClass: string;
   accentTooltip?: string;
   mapId: number;
   linkSearch: LeaderboardSearchParams;
   pills?: ReactNode;
   mobileMetadata?: ReactNode;
   desktopMetadata?: ReactNode;
   className?: string;
   compact?: boolean;
}

export function SongCard({
   coverUrl,
   songName,
   songSubName,
   songAuthorName,
   levelAuthorName,
   createdAt,
   accentClass,
   accentTooltip,
   mapId,
   linkSearch,
   pills,
   mobileMetadata,
   desktopMetadata,
   className,
   compact = false
}: SongCardProps) {
   const tc = useTranslations('common');
   const accent = <div className={cn('absolute top-0 bottom-0 left-0 z-30 w-0.75', accentTooltip && 'cursor-help', accentClass)} />;

   return (
      <div className={cn(CARD_GRADIENT_CLASSES, 'flex items-center', className)}>
         {accentTooltip ? (
            <Tooltip>
               <TooltipTrigger asChild>{accent}</TooltipTrigger>
               <TooltipContent side="right">{accentTooltip}</TooltipContent>
            </Tooltip>
         ) : (
            accent
         )}

         {coverUrl && (
            <div className="absolute inset-0 opacity-0 dark:opacity-25">
               <FadeInImage src={coverUrl} alt="" fill className={BLURRED_BG_IMAGE_CLASSES} sizes="(min-width: 768px) 50vw, 100vw" />
            </div>
         )}

         <div className="from-background/75 via-background/50 to-background/75 absolute inset-0 hidden bg-linear-to-r dark:block" />

         <div
            className={cn(
               'relative z-20 m-2.5 ml-3.5 aspect-square shrink-0 overflow-hidden rounded-md shadow-lg outline outline-1 outline-black/10 dark:outline-white/10',
               compact ? 'h-14 w-14' : 'h-18 w-18 md:h-21.5 md:w-21.5'
            )}
         >
            <FadeInImage src={coverUrl} alt={songName} fill className="object-cover" sizes={compact ? '56px' : '86px'} />
         </div>

         <div className={cn('relative z-20 flex min-w-0 flex-1 flex-col justify-center py-2.5 pr-3', !compact && 'md:flex-row md:justify-between')}>
            <div className="flex min-w-0 flex-1 flex-col justify-center">
               <h3 className={cn('min-w-0 leading-snug', compact ? 'text-sm' : 'text-[15px]')}>
                  <mapRoute.Link
                     params={{ id: mapId }}
                     search={{ ...linkSearch, page: linkSearch.page ?? 1 }}
                     className="text-foreground block truncate font-bold transition-colors"
                  >
                     {songName}
                     {songSubName ? ` ${songSubName}` : ''}
                  </mapRoute.Link>
               </h3>
               <p className={cn('text-muted-foreground truncate leading-snug', compact ? 'text-xs' : 'text-sm')}>
                  {tc('by')}{' '}
                  {compact ? <span className="text-foreground font-semibold">{songAuthorName}</span> : <LinkedNames name={songAuthorName} />}
               </p>
               <p className="text-muted-foreground truncate text-xs">
                  {tc('mappedBy')}{' '}
                  {compact ? (
                     <span className="text-foreground font-semibold">{levelAuthorName}</span>
                  ) : (
                     <LinkedNames name={levelAuthorName} splitCommas />
                  )}{' '}
                  &middot; <Time date={createdAt} short />
               </p>

               {pills && <div className="flex flex-nowrap items-center gap-1.5 pt-1.5">{pills}</div>}

               {mobileMetadata && (
                  <div className={cn('text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 pt-1.5 text-xs', !compact && 'md:hidden')}>
                     {mobileMetadata}
                  </div>
               )}
            </div>

            {desktopMetadata && !compact && (
               <div className="hidden shrink-0 md:flex md:flex-col md:items-end md:justify-center md:gap-1 md:pl-3">{desktopMetadata}</div>
            )}
         </div>
      </div>
   );
}
