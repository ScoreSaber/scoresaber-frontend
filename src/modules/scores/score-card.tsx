'use client';

import { useCallback, useRef, useState, type ReactNode } from 'react';

import { Loader2 } from 'lucide-react';

import { ScoreRank } from './score-rank';
import { ScoreStats } from './score-stats';

import { Separator } from '@/components/ui/separator';

import { ScoreCardActions } from '@/modules/scores/score-card-actions';
import { ScoreCardSurface } from '@/modules/scores/score-card-surface';
import { ScoreDetailsInline } from '@/modules/scores/score-details-inline';
import { SongInfoCard } from '@/modules/songs/song-info-card';
import type { PlayerControllerGetPlayerScoresDataItem } from '@/shared/api/generated/ApiParams';
import { dynamic } from '@/shared/components/dynamic';
import { buildSongInfoProps, cn, formatAccuracy, formatPP, getHmdName, isLegacyAccuracyScore } from '@/shared/format/helpers';
import { starsToPP } from '@/shared/format/star-conversion';
import { isLeaderboardRanked } from '@/shared/format/styling';

const InlineLeaderboard = dynamic(() => import('@/modules/scores/leaderboard/inline-leaderboard').then((mod) => mod.InlineLeaderboard), {
   ssr: false
});

type Panel = 'details' | 'leaderboard' | null;

interface ScoreCardProps {
   playerScore: PlayerControllerGetPlayerScoresDataItem;
   className?: string;
   overlayAction?: ReactNode;
}

export function ScoreCard({ playerScore, className, overlayAction }: ScoreCardProps) {
   const { score, leaderboard } = playerScore;
   const isRanked = isLeaderboardRanked(leaderboard);
   const weightedPP = formatPP(score.pp * score.weight);
   const weightedPercent = formatAccuracy(score.weight * 100);
   const fcPPContext = isRanked
      ? {
           realmId: leaderboard.realm.realmId,
           maxPP: starsToPP(leaderboard.realm.stars),
           positiveModifiers: leaderboard.realm.positiveModifiers
        }
      : undefined;

   const [activePanel, setActivePanel] = useState<Panel>(null);
   const [transitioning, setTransitioning] = useState(false);
   const [minHeight, setMinHeight] = useState(0);
   const panelRef = useRef<HTMLDivElement>(null);

   const toggle = useCallback(
      (panel: 'details' | 'leaderboard') => {
         if (activePanel === panel) {
            setActivePanel(null);
            setMinHeight(0);
            return;
         }
         // switching or opening, capture outgoing height if switching
         if (activePanel !== null && panelRef.current) {
            setMinHeight(panelRef.current.offsetHeight);
            setTransitioning(true);
         }
         setActivePanel(panel);
      },
      [activePanel]
   );

   const onPanelReady = useCallback(() => {
      setTransitioning(false);
      setMinHeight(0);
   }, []);

   const showDetails = activePanel === 'details';
   const showLeaderboard = activePanel === 'leaderboard';

   return (
      <div>
         <div className="relative">
            {overlayAction && <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden rounded">{overlayAction}</div>}
            <ScoreCardSurface
               coverUrl={leaderboard.map.coverUrl}
               className={cn(
                  className,
                  'pb-9 lg:pr-16 lg:pb-3',
                  // cut a hole in the card behind the pin button so it reads as a notch, not a blob
                  overlayAction &&
                     'pl-6 lg:pl-7 [-webkit-mask-image:radial-gradient(circle_at_6px_6px,transparent_17.5px,black_18.5px)] [mask-image:radial-gradient(circle_at_6px_6px,transparent_17.5px,black_18.5px)]'
               )}
               imageSizes="(min-width: 1024px) 800px, 100vw"
            >
               <div className="flex flex-col flex-wrap items-center justify-between gap-0.5 lg:flex-row lg:flex-nowrap lg:gap-0">
                  <div className="mr-2 flex w-full min-w-0 flex-col gap-1 lg:flex-1 lg:flex-row lg:items-center lg:gap-2">
                     <ScoreRank
                        rank={score.rank}
                        scoreId={score.id}
                        mapId={leaderboard.map.id}
                        leaderboardId={leaderboard.id}
                        timeSet={score.createdAt}
                        hmdName={getHmdName(score.device, score.legacyHmdId)}
                        controllerLeft={score.device?.controllerLeft}
                        controllerRight={score.device?.controllerRight}
                     />
                     <div className="min-w-0 items-center justify-center">
                        <SongInfoCard {...buildSongInfoProps(leaderboard)} showCreatedDate={false} />
                     </div>
                  </div>

                  <ScoreStats
                     score={score}
                     weightedPP={weightedPP}
                     weightedPercent={weightedPercent}
                     showAccuracy={leaderboard.maxScore > 0}
                     showPP={isRanked}
                     legacyAccuracy={isLegacyAccuracyScore(score.createdAt)}
                  />
               </div>
            </ScoreCardSurface>
            <Separator variant="gradient" className="absolute right-4 bottom-7 left-4 lg:hidden" />
            <ScoreCardActions
               score={score}
               expanded={showLeaderboard}
               onToggleExpandedAction={() => toggle('leaderboard')}
               detailsExpanded={showDetails}
               onToggleDetailsAction={score.hasReplay ? () => toggle('details') : undefined}
               tooltipSide="right"
               mobileBottomRow
               className="bottom-2 left-1/2 -translate-x-1/2 lg:top-1/2 lg:right-3 lg:bottom-auto lg:left-auto lg:translate-x-0 lg:-translate-y-1/2"
            />
         </div>
         {activePanel !== null && (
            <div ref={panelRef} style={minHeight > 0 ? { minHeight } : undefined}>
               {transitioning && (
                  <div className="flex items-center justify-center py-8">
                     <Loader2 className="text-muted-foreground/40 size-6 animate-spin" />
                  </div>
               )}
               <div className={cn(transitioning ? 'invisible absolute' : undefined, 'mt-2 lg:mx-6')}>
                  {showDetails && <ScoreDetailsInline score={score} fcPPContext={fcPPContext} onReadyAction={onPanelReady} />}
                  {showLeaderboard && (
                     <InlineLeaderboard
                        leaderboardId={leaderboard.id}
                        leaderboard={leaderboard}
                        mapId={leaderboard.map.id}
                        playerRank={score.rank}
                        playerScoreId={score.id}
                        onReadyAction={onPanelReady}
                     />
                  )}
               </div>
            </div>
         )}
      </div>
   );
}
