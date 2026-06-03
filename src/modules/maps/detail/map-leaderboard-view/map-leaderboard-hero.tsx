'use client';

import { useLocation } from '@tanstack/react-router';
import { Result, TaggedError } from 'better-result';
import { FaClock, FaDrum, FaKey, FaLink, FaMusic } from 'react-icons/fa';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { LinkedNames } from '@/modules/search/search-link';
import type { LeaderboardControllerGetLeaderboardByIdResponse, MapControllerGetMapByIdResponse } from '@/shared/api/generated/ApiParams';
import { FadeInImage } from '@/shared/components/fade-in-image';
import { Stat } from '@/shared/components/stat';
import { Time } from '@/shared/components/time';
import { cn, formatNumber } from '@/shared/format/helpers';
import { getStatusAccentClass } from '@/shared/format/styling';
import { isLeaderboardPersonalizationParam } from '@/shared/url-state/persisted-filter-preferences';

class ShareLinkCopyError extends TaggedError('ShareLinkCopyError')<{
   message: string;
   cause: unknown;
}>() {}

export function MapLeaderboardHero({ mapInfo, leaderboardInfo }: MapLeaderboardHeroProps) {
   const tc = useTranslations();
   const status = leaderboardInfo.realm.leaderboardStatus;

   return (
      <div className="flex flex-col gap-1.5">
         <div className="flex min-w-0 flex-1 items-center gap-4 md:gap-5">
            <FadeInImage
               src={mapInfo.coverUrl}
               alt={mapInfo.songName}
               width={96}
               height={96}
               className="h-20 w-20 shrink-0 rounded-md object-cover shadow-md outline outline-1 outline-black/10 sm:h-24 sm:w-24 md:h-32 md:w-32 dark:outline-white/10"
            />

            <div className="flex min-w-0 flex-1 flex-col gap-1">
               <div className="flex items-center gap-1.5">
                  <span
                     className={cn(
                        'inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[11px] font-semibold',
                        getStatusAccentClass(status),
                        'text-foreground'
                     )}
                  >
                     {status === 'RANKED'
                        ? tc('map.statusRanked')
                        : status === 'QUALIFIED'
                          ? tc('map.statusQualified')
                          : status === 'LOVED'
                            ? tc('map.statusLoved')
                            : tc('map.statusUnranked')}
                  </span>
                  <ShareMapButton />
               </div>

               <h1 className="min-w-0 text-base leading-tight text-pretty sm:text-lg md:text-xl">
                  <span className="font-bold">
                     {mapInfo.songName}
                     {mapInfo.songSubName ? ` ${mapInfo.songSubName}` : ''}
                  </span>{' '}
                  <span className="text-muted-foreground text-sm font-normal md:text-base">
                     {tc('common.by')} <LinkedNames name={mapInfo.songAuthorName} />
                  </span>
               </h1>

               <p className="text-muted-foreground text-xs">
                  {tc('common.mappedBy')} <LinkedNames name={mapInfo.levelAuthorName} splitCommas />
               </p>

               {/* stats inline on desktop */}
               <div className="mt-1 hidden md:block">
                  <MapStats mapInfo={mapInfo} />
               </div>
            </div>
         </div>

         {/* stats below cover on mobile */}
         <div className="md:hidden">
            <MapStats mapInfo={mapInfo} />
         </div>
      </div>
   );
}

function MapStats({ mapInfo }: { mapInfo: MapControllerGetMapByIdResponse }) {
   const t = useTranslations();
   const tc = useTranslations();
   return (
      <div className="flex flex-wrap items-center gap-2">
         <Stat icon={FaDrum} label="BPM">
            {mapInfo.bpm}
         </Stat>
         <Stat icon={FaMusic} label={tc('common.totalPlays')}>
            {formatNumber(mapInfo.totalScores)}
         </Stat>
         <Stat icon={FaClock} label={t('map.created')}>
            <Time date={mapInfo.createdAt} short />
         </Stat>
         {mapInfo.bsid && (
            <Stat icon={FaKey} label="">
               <a
                  href={`https://beatsaver.com/maps/${mapInfo.bsid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary font-mono transition-colors"
               >
                  {mapInfo.bsid}
               </a>
            </Stat>
         )}
      </div>
   );
}

function ShareMapButton() {
   const location = useLocation();
   const pathname = location.pathname;
   const searchParams = new URLSearchParams(location.searchStr);
   const t = useTranslations();

   async function handleCopyShareLink() {
      const result = await Result.tryPromise({
         try: () => {
            const url = new URL(pathname, window.location.origin);

            for (const [key, value] of searchParams.entries()) {
               if (isLeaderboardPersonalizationParam(key)) continue;
               url.searchParams.set(key, value);
            }

            return navigator.clipboard.writeText(url.toString());
         },
         catch: (cause) =>
            new ShareLinkCopyError({
               message: 'failed to copy share link',
               cause
            })
      });

      Result.match(result, {
         ok: () => toast.success(t('map.shareLinkCopied')),
         err: () => toast.error(t('map.shareLinkCopyFailed'))
      });
   }

   return (
      <Tooltip>
         <TooltipTrigger asChild>
            <Button
               type="button"
               variant="secondary"
               size="icon-xs"
               className="border-border/70 h-6 w-6 cursor-pointer rounded-full border"
               aria-label={t('map.copyShareLink')}
               onClick={handleCopyShareLink}
            >
               <FaLink className="size-2.5" />
            </Button>
         </TooltipTrigger>
         <TooltipContent>{t('map.copyShareLink')}</TooltipContent>
      </Tooltip>
   );
}

interface MapLeaderboardHeroProps {
   mapInfo: MapControllerGetMapByIdResponse;
   leaderboardInfo: LeaderboardControllerGetLeaderboardByIdResponse;
}
