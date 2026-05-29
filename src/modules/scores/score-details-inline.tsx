'use client';

import { useEffect } from 'react';

import { Loader2 } from 'lucide-react';

import type {
   LeaderboardControllerGetLeaderboardScoresByIdDataItem,
   PlayerControllerGetPlayerScoresDataItem
} from '@/shared/api/generated/ApiParams';
import { dynamic } from '@/shared/components/dynamic';

const ScoreStatsDetail = dynamic(() => import('./score-stats-detail').then((mod) => mod.ScoreStatsDetail), {
   ssr: false,
   loading: () => (
      <div className="flex min-h-32 items-center justify-center">
         <Loader2 className="text-muted-foreground/40 size-6 animate-spin" />
      </div>
   )
});

interface ScoreDetailsInlineProps {
   score: PlayerControllerGetPlayerScoresDataItem['score'] | LeaderboardControllerGetLeaderboardScoresByIdDataItem;
   onReadyAction?: () => void;
}

export function ScoreDetailsInline({ score, onReadyAction }: ScoreDetailsInlineProps) {
   // if no replay, content is synchronous. signal ready immediately
   useEffect(() => {
      if (!score.hasReplay) onReadyAction?.();
   }, []);

   return (
      <div className="bg-secondary/30 animate-in fade-in rounded border p-3 text-sm duration-300">
         {score.hasReplay && <ScoreStatsDetail scoreId={score.id} fullCombo={score.fullCombo} onLoadedAction={onReadyAction} />}
      </div>
   );
}
