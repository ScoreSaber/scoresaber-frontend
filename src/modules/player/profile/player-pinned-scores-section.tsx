'use client';

import { useEffect, useState } from 'react';

import { Pin } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { useDenyahMode } from '@/modules/player/denyah/denyah-mode-context';
import { ScoreCardActions } from '@/modules/scores/score-card-actions';
import { ScoreCardSurface } from '@/modules/scores/score-card-surface';
import { ScoreDetailsInline } from '@/modules/scores/score-details-inline';
import { ScoreStats } from '@/modules/scores/score-stats';
import { DifficultyPill } from '@/modules/songs/difficulty-pill';
import { SongInfoCard } from '@/modules/songs/song-info-card';
import type { PlayerControllerGetPlayerResponse } from '@/shared/api/generated/ApiParams';
import { dynamic } from '@/shared/components/dynamic';
import { FadeInImage } from '@/shared/components/fade-in-image';
import { Time } from '@/shared/components/time';
import { cn, formatNumber, isLegacyAccuracyScore } from '@/shared/format/helpers';
import { starsToPP } from '@/shared/format/star-conversion';
import { getDifficultyLabel } from '@/shared/format/strings';

type PinnedScore = PlayerControllerGetPlayerResponse['pinnedScores'][number];
type PinnedScorePanel = 'details' | 'history';

const ScoreHistory = dynamic(() => import('@/modules/scores/score-history').then((mod) => mod.ScoreHistory));

interface PlayerPinnedScoresSectionProps {
   pinnedScores: PinnedScore[];
   showSeparator?: boolean;
}

export function PlayerPinnedScoresSection({ pinnedScores, showSeparator = true }: PlayerPinnedScoresSectionProps) {
   const t = useTranslations();
   const denyahMode = useDenyahMode();
   const [activeScorePanel, setActiveScorePanel] = useState<{ scoreId: number; panel: PinnedScorePanel } | null>(null);
   const visiblePinnedScores = activeScorePanel
      ? pinnedScores.filter((pinnedScore) => pinnedScore.score.score.id === activeScorePanel.scoreId)
      : pinnedScores;

   useEffect(() => {
      if (activeScorePanel && !pinnedScores.some((pinnedScore) => pinnedScore.score.score.id === activeScorePanel.scoreId)) {
         setActiveScorePanel(null);
      }
   }, [activeScorePanel, pinnedScores]);

   if (pinnedScores.length === 0) return null;

   function toggleScorePanel(scoreId: number, panel: PinnedScorePanel) {
      setActiveScorePanel((current) => {
         if (current?.scoreId === scoreId && current.panel === panel) return null;
         return { scoreId, panel };
      });
   }

   return (
      <div className="py-4">
         {showSeparator && <Separator variant="gradient" className="mb-4" />}
         <div className="mb-3 flex min-w-0 items-center justify-center gap-2 text-center">
            <Pin className="size-4 text-[color:var(--profile-accent,var(--primary))]" aria-hidden />
            <h2 className="truncate text-sm font-semibold">{t('player.customization.pinnedScores.profileTitle')}</h2>
         </div>
         <div className="grid grid-cols-1 gap-2 md:grid-cols-6">
            {visiblePinnedScores.map((pinnedScore, index) => {
               const scoreId = pinnedScore.score.score.id;
               const activePanel = activeScorePanel?.scoreId === scoreId ? activeScorePanel.panel : null;

               return (
                  <PinnedScoreCard
                     key={scoreId}
                     pinnedScore={pinnedScore}
                     activePanel={activePanel}
                     onTogglePanelAction={(panel) => toggleScorePanel(scoreId, panel)}
                     className={activePanel ? 'md:col-span-6' : cn('md:col-span-2', getPinnedScoreGridPlacement(index, visiblePinnedScores.length))}
                  />
               );
            })}
         </div>
         {denyahMode && (
            <div className="mt-2 grid grid-cols-1 md:grid-cols-6">
               <div className="min-w-0 md:col-span-2 md:col-start-3">
                  <FadeInImage src="/images/denyah-men.png" alt="" width={538} height={130} className="h-auto w-full rounded-md" />
               </div>
            </div>
         )}
      </div>
   );
}

function PinnedScoreCard({
   pinnedScore,
   activePanel,
   onTogglePanelAction,
   className
}: {
   pinnedScore: PinnedScore;
   activePanel: PinnedScorePanel | null;
   onTogglePanelAction: (panel: PinnedScorePanel) => void;
   className?: string;
}) {
   const { score: playerScore, comment } = pinnedScore;
   const { score, leaderboard } = playerScore;
   const isRanked = leaderboard.realm.leaderboardStatus === 'RANKED';
   const trimmedComment = comment.trim();
   const showDetails = activePanel === 'details';
   const showHistory = activePanel === 'history';
   const isExpanded = activePanel != null;
   const fcPPContext = isRanked
      ? {
           realmId: leaderboard.realm.realmId,
           maxPP: starsToPP(leaderboard.realm.stars),
           positiveModifiers: leaderboard.realm.positiveModifiers
        }
      : undefined;

   return (
      <div className={cn('min-w-0', className)}>
         <div className="relative">
            <ScoreCardSurface
               coverUrl={leaderboard.map.coverUrl}
               className={cn('h-full p-2.5', isExpanded ? 'pr-14 md:p-3 md:pr-16' : 'pr-9')}
               imageSizes="(min-width: 768px) 33vw, 100vw"
            >
               <div className="flex min-w-0 items-center gap-3">
                  <div className={cn('relative shrink-0', isExpanded ? 'size-12 md:size-14' : 'size-10')}>
                     <FadeInImage
                        src={leaderboard.map.coverUrl}
                        alt={leaderboard.map.songName}
                        width={isExpanded ? 56 : 40}
                        height={isExpanded ? 56 : 40}
                        className={cn(
                           'rounded-md object-cover outline outline-1 outline-black/10 dark:outline-white/10',
                           isExpanded ? 'size-12 md:size-14' : 'size-10'
                        )}
                     />
                     <DifficultyPill
                        size="compact"
                        className="absolute -right-1.5 -bottom-0.5"
                        difficultyValue={leaderboard.difficulty.difficulty}
                        difficultyName={getDifficultyLabel(leaderboard.difficulty.difficulty)}
                        starValue={isRanked ? leaderboard.realm.stars : undefined}
                     />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                     <div className="flex min-w-0 items-center gap-1.5">
                        <span className="shrink-0 text-xs font-semibold text-[color:var(--profile-accent,var(--primary))] tabular-nums">
                           #{formatNumber(score.rank)}
                        </span>
                        <span className="text-muted-foreground shrink-0 text-[10px]">
                           <Time short date={score.createdAt} />
                        </span>
                        {trimmedComment && <PinnedScoreComment comment={trimmedComment} />}
                     </div>
                     <SongInfoCard
                        mapId={leaderboard.map.id}
                        leaderboardId={leaderboard.id}
                        songName={leaderboard.map.songName}
                        songAuthorName={leaderboard.map.songAuthorName}
                        levelAuthorName={leaderboard.map.levelAuthorName}
                        coverImage={leaderboard.map.coverUrl}
                        createdDate={leaderboard.createdAt}
                        difficultyValue={leaderboard.difficulty.difficulty}
                        difficultyName={getDifficultyLabel(leaderboard.difficulty.difficulty)}
                        starValue={isRanked ? leaderboard.realm.stars : undefined}
                        variant="compact"
                        showCover={false}
                        showDifficulty={false}
                        showSongAuthor={false}
                        showCreatedDate={false}
                     />
                     <ScoreStats
                        score={score}
                        showAccuracy={leaderboard.maxScore > 0}
                        showPP={isRanked}
                        legacyAccuracy={isLegacyAccuracyScore(score.createdAt)}
                        accuracyPPContext={fcPPContext}
                        size="compact"
                        scoreStatMode="modsOnly"
                        className="justify-start"
                     />
                  </div>
               </div>
            </ScoreCardSurface>
            <ScoreCardActions
               score={score}
               historyExpanded={showHistory}
               onToggleHistoryAction={() => onTogglePanelAction('history')}
               detailsExpanded={showDetails}
               onToggleDetailsAction={() => onTogglePanelAction('details')}
               tooltipSide="left"
               replayTooltipSide="left"
               className={isExpanded ? 'right-3' : 'right-2'}
            />
         </div>
         {activePanel && (
            <div className="mt-2 md:mx-4">
               {showDetails && <ScoreDetailsInline score={score} fcPPContext={fcPPContext} leaderboard={leaderboard} />}
               {showHistory && <ScoreHistory scoreId={score.id} leaderboard={leaderboard} />}
            </div>
         )}
      </div>
   );
}

function getPinnedScoreGridPlacement(index: number, total: number) {
   const remainingInLastRow = total % 3;

   if (remainingInLastRow === 1 && index === total - 1) return 'md:col-start-3';
   if (remainingInLastRow === 2 && index === total - 2) return 'md:col-start-2';
}

function PinnedScoreComment({ comment }: { comment: string }) {
   return (
      <>
         <span className="text-muted-foreground/50 shrink-0 text-[10px]">/</span>
         <Tooltip>
            <TooltipTrigger asChild>
               <span className={cn('text-muted-foreground min-w-0 truncate text-[10px] font-medium', 'max-w-28 sm:max-w-36')}>{comment}</span>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={4} className="max-w-72 text-center">
               <p>{comment}</p>
            </TooltipContent>
         </Tooltip>
      </>
   );
}
