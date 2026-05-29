import { ScoreCard } from '@/modules/scores/score-card';
import type { PlayerControllerGetPlayerScoresDataItem } from '@/shared/api/generated/ApiParams';
import { Pagination } from '@/shared/components/pagination';

interface PlayerScoresListProps {
   playerScores: PlayerControllerGetPlayerScoresDataItem[];
   totalItems: number;
   pageSize: number;
   currentPage: number;
   getPageHref: (page: number) => string;
}

export function PlayerScoresList({ playerScores, totalItems, pageSize, currentPage, getPageHref }: PlayerScoresListProps) {
   return (
      <div>
         <div className="flex flex-col gap-2">
            {playerScores.map((score) => (
               <ScoreCard key={score.score.id} className="p-3" playerScore={score} />
            ))}
         </div>
         {totalItems > pageSize && (
            <div className="mt-4 flex justify-center">
               <Pagination totalItems={totalItems} pageSize={pageSize} currentPage={currentPage} getPageHref={getPageHref} scroll={false} />
            </div>
         )}
      </div>
   );
}
