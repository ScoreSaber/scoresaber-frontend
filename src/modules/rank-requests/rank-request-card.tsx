'use client';

import { FaLayerGroup, FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import { FaCircleMinus } from 'react-icons/fa6';
import { useTranslations } from 'use-intl';

import { SongCard } from '@/modules/maps/shared/song-card';
import type { RankingControllerGetRequestsDataItem } from '@/shared/api/generated/ApiParams';
import { usePersistedLeaderboardSearch } from '@/shared/url-state/persisted/use-persisted-leaderboard-search';

export function RankRequestCard({ request, className, queuePosition }: RankRequestCardProps) {
   const t = useTranslations('rankRequest');
   const map = request.map;
   const linkSearch = usePersistedLeaderboardSearch({ tab: 'rank-request' });

   return (
      <SongCard
         coverUrl={map.coverUrl}
         songName={map.songName}
         songSubName={map.songSubName}
         songAuthorName={map.songAuthorName}
         levelAuthorName={map.levelAuthorName}
         createdAt={request.createdAt}
         accentClass={REQUEST_TYPE_ACCENT[request.requestType] ?? 'bg-muted'}
         mapId={map.id}
         linkSearch={linkSearch}
         className={className}
         pills={
            <>
               {queuePosition !== undefined && (
                  <span className="bg-score-pp/15 text-score-pp inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-bold tabular-nums">
                     #{queuePosition}
                  </span>
               )}
               <span className="bg-secondary/60 text-muted-foreground inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-semibold">
                  <FaLayerGroup className="size-2.5" />
                  {t('difficultyCount', { count: request.difficultyCount })}
               </span>
            </>
         }
         mobileMetadata={
            <>
               <VoteSummary label={t('rt')} up={request.totalRtVotes.upvotes} down={request.totalRtVotes.downvotes} />
               <VoteSummary
                  label={t('qat')}
                  up={request.totalQatVotes.upvotes}
                  neutral={request.totalQatVotes.neutrals}
                  down={request.totalQatVotes.downvotes}
               />
            </>
         }
         desktopMetadata={
            <>
               <div className="flex items-center gap-1.5 text-xs">
                  <VoteSummary label={t('rt')} up={request.totalRtVotes.upvotes} down={request.totalRtVotes.downvotes} />
               </div>
               <div className="flex items-center gap-1.5 text-xs">
                  <VoteSummary
                     label={t('qat')}
                     up={request.totalQatVotes.upvotes}
                     neutral={request.totalQatVotes.neutrals}
                     down={request.totalQatVotes.downvotes}
                  />
               </div>
            </>
         }
      />
   );
}

function VoteSummary({ label, up, down, neutral }: { label: string; up: number; down: number; neutral?: number }) {
   return (
      <span className="flex items-center gap-1.5">
         <span className="text-muted-foreground">{label}</span>
         <span className="flex items-center gap-0.5 text-green-400">
            <FaThumbsUp className="size-2.5" />
            {up}
         </span>
         {neutral !== undefined && (
            <span className="flex items-center gap-0.5 text-yellow-400">
               <FaCircleMinus className="size-2.5" />
               {neutral}
            </span>
         )}
         <span className="flex items-center gap-0.5 text-red-400">
            <FaThumbsDown className="size-2.5" />
            {down}
         </span>
      </span>
   );
}

const REQUEST_TYPE_ACCENT: Record<string, string> = {
   RANK: 'bg-status-success',
   UNRANK: 'bg-destructive'
};

interface RankRequestCardProps {
   request: RankingControllerGetRequestsDataItem;
   className?: string;
   queuePosition?: number;
}
