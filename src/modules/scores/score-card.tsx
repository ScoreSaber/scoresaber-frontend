'use client';

import { useCallback, useRef, useState, type ReactNode } from 'react';

import { Camera, Loader2 } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { ScoreRank } from './score-rank';
import { ScoreStats } from './score-stats';

import { Button } from '@/components/ui/button';
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

const ScoreHistory = dynamic(() => import('@/modules/scores/score-history').then((mod) => mod.ScoreHistory), {
   ssr: false
});

type Panel = 'details' | 'history' | null;

interface ScoreCardProps {
   playerScore: PlayerControllerGetPlayerScoresDataItem;
   className?: string;
   overlayAction?: ReactNode;
   presentation?: boolean;
   onShare?: () => void;
}

export function ScoreCard({ playerScore, className, overlayAction, presentation = false, onShare }: ScoreCardProps) {
   const t = useTranslations();
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

   const showOverlay = !presentation && overlayAction != null;
   const showShare = !presentation && onShare != null;

   const toggle = useCallback(
      (panel: 'details' | 'history') => {
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
   const showHistory = activePanel === 'history';

   return (
      <div>
         <div className={cn('group relative', presentation && '@container/scorecard')}>
            {showOverlay && <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden rounded">{overlayAction}</div>}
            {showShare && (
               <Button
                  type="button"
                  variant="ghost-icon"
                  size="icon-xs"
                  onClick={onShare}
                  aria-label={t('score.share.shareRow')}
                  className={cn(
                     'text-muted-foreground hover:text-foreground absolute bottom-2 left-1/2 z-40 hidden h-auto w-auto -translate-x-1/2 cursor-default p-0 hover:bg-transparent lg:inline-flex',
                     'pointer-events-none opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 focus-visible:pointer-events-auto focus-visible:opacity-100'
                  )}
               >
                  <Camera data-icon />
               </Button>
            )}
            <ScoreCardSurface
               coverUrl={leaderboard.map.coverUrl}
               className={cn(
                  className,
                  presentation ? 'lg:pb-3' : 'pb-9 max-lg:pointer-coarse:pb-10 lg:pr-16 lg:pb-3',
                  // cut a hole in the card behind the pin button so it reads as a notch, not a blob
                  showOverlay &&
                     'pl-6 lg:pl-7 [-webkit-mask-image:radial-gradient(circle_at_6px_6px,transparent_17.5px,black_18.5px)] [mask-image:radial-gradient(circle_at_6px_6px,transparent_17.5px,black_18.5px)]'
               )}
               imageSizes="(min-width: 1024px) 800px, 100vw"
            >
               <div
                  className={cn(
                     'flex flex-col flex-wrap items-center justify-between gap-0.5',
                     presentation
                        ? '@min-[600px]/scorecard:flex-row @min-[600px]/scorecard:flex-nowrap @min-[600px]/scorecard:gap-0'
                        : 'lg:flex-row lg:flex-nowrap lg:gap-0'
                  )}
               >
                  <div
                     className={cn(
                        'mr-2 flex w-full min-w-0 flex-col gap-1',
                        presentation
                           ? '@min-[600px]/scorecard:flex-1 @min-[600px]/scorecard:flex-row @min-[600px]/scorecard:items-center @min-[600px]/scorecard:gap-2'
                           : 'lg:flex-1 lg:flex-row lg:items-center lg:gap-2'
                     )}
                  >
                     <ScoreRank
                        rank={score.rank}
                        scoreId={score.id}
                        mapId={leaderboard.map.id}
                        leaderboardId={leaderboard.id}
                        timeSet={score.createdAt}
                        hmdName={getHmdName(score.device, score.legacyHmdId)}
                        controllerLeft={score.device?.controllerLeft}
                        controllerRight={score.device?.controllerRight}
                        useContainerQueries={presentation}
                     />
                     <div className="min-w-0 items-center justify-center">
                        <SongInfoCard {...buildSongInfoProps(leaderboard)} showCreatedDate={false} useContainerQueries={presentation} />
                     </div>
                  </div>

                  <ScoreStats
                     score={score}
                     weightedPP={weightedPP}
                     weightedPercent={weightedPercent}
                     showAccuracy={leaderboard.maxScore > 0}
                     showPP={isRanked}
                     legacyAccuracy={isLegacyAccuracyScore(score.createdAt)}
                     accuracyPPContext={fcPPContext}
                     useContainerQueries={presentation}
                  />
               </div>
            </ScoreCardSurface>
            {!presentation && (
               <>
                  <Separator variant="gradient" className="absolute right-4 bottom-7 left-4 lg:hidden" />
                  <ScoreCardActions
                     score={score}
                     historyExpanded={showHistory}
                     onToggleHistoryAction={() => toggle('history')}
                     detailsExpanded={showDetails}
                     onToggleDetailsAction={() => toggle('details')}
                     onShareAction={showShare ? onShare : undefined}
                     tooltipSide="right"
                     mobileBottomRow
                     className="bottom-2 left-1/2 -translate-x-1/2 lg:top-1/2 lg:right-3 lg:bottom-auto lg:left-auto lg:translate-x-0 lg:-translate-y-1/2"
                  />
               </>
            )}
         </div>
         {!presentation && activePanel !== null && (
            <div ref={panelRef} style={minHeight > 0 ? { minHeight } : undefined}>
               {transitioning && (
                  <div className="flex items-center justify-center py-8">
                     <Loader2 className="text-muted-foreground/40 size-6 animate-spin" />
                  </div>
               )}
               <div className={cn(transitioning ? 'invisible absolute' : undefined, 'mt-2 lg:mx-6')}>
                  {showDetails && (
                     <ScoreDetailsInline score={score} fcPPContext={fcPPContext} leaderboard={leaderboard} onReadyAction={onPanelReady} />
                  )}
                  {showHistory && <ScoreHistory scoreId={score.id} leaderboard={leaderboard} onReadyAction={onPanelReady} />}
               </div>
            </div>
         )}
      </div>
   );
}
