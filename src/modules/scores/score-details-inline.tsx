'use client';

import { useEffect } from 'react';

import { Loader2 } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import type { ScorePPContext } from '@/modules/scores/score-pp-context';
import type {
   LeaderboardControllerGetLeaderboardByIdResponse,
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

const InlineLeaderboard = dynamic(() => import('@/modules/scores/leaderboard/inline-leaderboard').then((mod) => mod.InlineLeaderboard), {
   ssr: false
});

interface ScoreDetailsInlineProps {
   score: PlayerControllerGetPlayerScoresDataItem['score'] | LeaderboardControllerGetLeaderboardScoresByIdDataItem;
   fcPPContext?: ScorePPContext;
   leaderboard?: LeaderboardControllerGetLeaderboardByIdResponse;
   onReadyAction?: () => void;
}

export function ScoreDetailsInline({ score, fcPPContext, leaderboard, onReadyAction }: ScoreDetailsInlineProps) {
   const t = useTranslations();

   useEffect(() => {
      if (!score.hasReplay && !leaderboard) onReadyAction?.();
   }, []);

   const detailsContent = score.hasReplay ? (
      <ScoreStatsDetail scoreId={score.id} fullCombo={score.fullCombo} fcPPContext={fcPPContext} onLoadedAction={onReadyAction} />
   ) : null;

   const leaderboardContent = leaderboard ? (
      <InlineLeaderboard
         leaderboardId={leaderboard.id}
         leaderboard={leaderboard}
         mapId={leaderboard.map.id}
         playerRank={score.rank}
         playerScoreId={score.id}
         onReadyAction={onReadyAction}
         unstyled
      />
   ) : null;

   return (
      <div className="bg-secondary/30 animate-in fade-in rounded border p-3 text-sm duration-300">
         {detailsContent && leaderboardContent ? (
            <Tabs defaultValue="details">
               <TabsList variant="accent-pill" className="mx-auto w-fit">
                  <TabsTrigger value="details" className="px-4">
                     {t('score.detailsTab')}
                  </TabsTrigger>
                  <TabsTrigger value="leaderboard" className="px-4">
                     {t('score.leaderboardTab')}
                  </TabsTrigger>
               </TabsList>
               <TabsContent value="details" className="mt-3">
                  {detailsContent}
               </TabsContent>
               <TabsContent value="leaderboard" className="mt-3">
                  {leaderboardContent}
               </TabsContent>
            </Tabs>
         ) : (
            (detailsContent ?? leaderboardContent)
         )}
      </div>
   );
}
