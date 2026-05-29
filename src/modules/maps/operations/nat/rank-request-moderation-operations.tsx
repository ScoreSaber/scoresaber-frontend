'use client';

import { AlertTriangle } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { RankRequestReplaceOperation } from '@/modules/maps/operations/nat/rank-request-replace-operation';
import type { OperationAction } from '@/modules/maps/operations/operation-action';
import { denyRequest, qualifyRequest } from '@/modules/rank-requests/actions/nat';
import { getRankRequestQualifyGate } from '@/modules/rank-requests/lib/model';
import type { MapControllerGetMapByIdResponse } from '@/shared/api/generated/ApiParams';
import { ConfirmDialog } from '@/shared/components/confirm-dialog';
import { getDifficultyLabel } from '@/shared/format/strings';

type RankRequestModerationOperation = 'qualify-full' | 'deny-full' | 'deny-selected' | 'replace';

interface RankRequestModerationOperationsProps {
   activeOperation: RankRequestModerationOperation | null;
   mapInfo: MapControllerGetMapByIdResponse;
   leaderboardId: number;
   requestId?: number;
   action: OperationAction;
   onOpenChangeAction: (open: boolean) => void;
}

export function RankRequestModerationOperations({
   activeOperation,
   mapInfo,
   leaderboardId,
   requestId,
   action,
   onOpenChangeAction
}: RankRequestModerationOperationsProps) {
   const tRR = useTranslations();
   const rankRequest = mapInfo.rankRequest;
   const selectedOnly = activeOperation === 'deny-selected';
   const { missingRtVoteDiffs, isLessThanMonthOld, missingQatUpvoteDiffs, disabled } = getRankRequestQualifyGate(rankRequest, {
      leaderboardId,
      selectedOnly,
      now: Date.now()
   });

   function closeDialog() {
      onOpenChangeAction(false);
   }

   return (
      <>
         <ConfirmDialog
            open={activeOperation === 'qualify-full'}
            onOpenChangeAction={onOpenChangeAction}
            title={tRR('rankRequest.qualifyRankRequest')}
            description={tRR('rankRequest.qualifyConfirmDesc')}
            pending={action.isPending}
            disabled={disabled}
            onConfirmAction={() => {
               if (requestId == null) return;
               action.run(() => qualifyRequest(requestId), tRR('rankRequest.requestQualified'), tRR('rankRequest.failedToQualify'), closeDialog);
            }}
         >
            <QualifyRequestWarnings
               isLessThanMonthOld={isLessThanMonthOld}
               missingRtVoteDiffs={missingRtVoteDiffs}
               missingQatUpvoteDiffs={missingQatUpvoteDiffs}
            />
         </ConfirmDialog>

         <ConfirmDialog
            open={activeOperation === 'deny-full' || activeOperation === 'deny-selected'}
            onOpenChangeAction={onOpenChangeAction}
            title={tRR('rankRequest.denyRankRequest')}
            description={activeOperation === 'deny-selected' ? tRR('rankRequest.denySelectedConfirmDesc') : tRR('rankRequest.denyConfirmDesc')}
            pending={action.isPending}
            variant="destructive"
            onConfirmAction={() => {
               if (requestId == null) return;
               action.run(
                  () => denyRequest(requestId, activeOperation === 'deny-selected' ? leaderboardId : undefined),
                  tRR('rankRequest.requestDenied'),
                  tRR('rankRequest.failedToDeny'),
                  closeDialog
               );
            }}
         />

         <RankRequestReplaceOperation
            open={activeOperation === 'replace'}
            mapInfo={mapInfo}
            requestId={requestId}
            action={action}
            onOpenChangeAction={onOpenChangeAction}
         />
      </>
   );
}

type RankRequestDifficulty = NonNullable<MapControllerGetMapByIdResponse['rankRequest']>['difficulties'][number];

function QualifyRequestWarnings({
   isLessThanMonthOld,
   missingRtVoteDiffs,
   missingQatUpvoteDiffs
}: {
   isLessThanMonthOld: boolean;
   missingRtVoteDiffs: RankRequestDifficulty[];
   missingQatUpvoteDiffs: RankRequestDifficulty[];
}) {
   const tRR = useTranslations();
   const hasWarnings = isLessThanMonthOld || missingRtVoteDiffs.length > 0 || missingQatUpvoteDiffs.length > 0;
   if (!hasWarnings) return null;

   return (
      <div className="flex flex-col gap-2">
         {isLessThanMonthOld && (
            <Alert variant="warning">
               <AlertTriangle aria-hidden />
               <AlertTitle>{tRR('rankRequest.qualifyQueueAgeWarningTitle')}</AlertTitle>
               <AlertDescription>{tRR('rankRequest.qualifyQueueAgeWarningDesc')}</AlertDescription>
            </Alert>
         )}
         {missingRtVoteDiffs.length > 0 && (
            <Alert variant="destructive">
               <AlertTriangle aria-hidden />
               <AlertTitle>{tRR('rankRequest.qualifyRtVotesMissingTitle')}</AlertTitle>
               <AlertDescription>
                  <p>{tRR('rankRequest.qualifyRtVotesMissingDesc')}</p>
                  <DifficultyList difficulties={missingRtVoteDiffs} />
               </AlertDescription>
            </Alert>
         )}
         {missingQatUpvoteDiffs.length > 0 && (
            <Alert variant="destructive">
               <AlertTriangle aria-hidden />
               <AlertTitle>{tRR('rankRequest.qualifyQatVotesMissingTitle')}</AlertTitle>
               <AlertDescription>
                  <p>{tRR('rankRequest.qualifyQatVotesMissingDesc')}</p>
                  <DifficultyList difficulties={missingQatUpvoteDiffs} />
               </AlertDescription>
            </Alert>
         )}
      </div>
   );
}

function DifficultyList({ difficulties }: { difficulties: RankRequestDifficulty[] }) {
   return (
      <ul className="list-inside list-disc">
         {difficulties.map((difficulty) => (
            <li key={difficulty.id}>{getDifficultyLabel(difficulty.leaderboard.difficulty.difficulty)}</li>
         ))}
      </ul>
   );
}

export type { RankRequestModerationOperation };
