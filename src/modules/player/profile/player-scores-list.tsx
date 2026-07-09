'use client';

import { type ReactNode, useState } from 'react';

import { ScoreCard } from '@/modules/scores/score-card';
import { ScoreShareStudio } from '@/modules/scores/score-share-studio';
import type { PlayerControllerGetPlayerScoresDataItem } from '@/shared/api/generated/ApiParams';
import { Pagination } from '@/shared/components/pagination';
import type { RouteLocation } from '@/shared/url-state/route-location';

interface PlayerScoresListProps<TLocation> {
   playerScores: PlayerControllerGetPlayerScoresDataItem[];
   totalItems: number;
   pageSize: number;
   currentPage: number;
   getPageLocation: (page: number) => RouteLocation<TLocation>;
   renderScoreAction?: (score: PlayerControllerGetPlayerScoresDataItem) => ReactNode;
}

export function PlayerScoresList<TLocation>({
   playerScores,
   totalItems,
   pageSize,
   currentPage,
   getPageLocation,
   renderScoreAction
}: PlayerScoresListProps<TLocation>) {
   const [shareOpen, setShareOpen] = useState(false);
   const [shareSeedId, setShareSeedId] = useState<number | null>(null);

   return (
      <div>
         <div className="flex flex-col gap-2">
            {playerScores.map((score) => (
               <ScoreCard
                  key={score.score.id}
                  className="p-3"
                  playerScore={score}
                  overlayAction={renderScoreAction?.(score)}
                  onShare={() => {
                     setShareSeedId(score.score.id);
                     setShareOpen(true);
                  }}
               />
            ))}
         </div>
         {totalItems > pageSize && (
            <div className="mt-4 flex justify-center">
               <Pagination totalItems={totalItems} pageSize={pageSize} currentPage={currentPage} getPageLocation={getPageLocation} scroll={false} />
            </div>
         )}
         <ScoreShareStudio open={shareOpen} onOpenChange={setShareOpen} scores={playerScores} initialScoreId={shareSeedId} />
      </div>
   );
}
