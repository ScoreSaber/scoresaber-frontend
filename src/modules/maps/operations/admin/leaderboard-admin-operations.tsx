'use client';

import { useState } from 'react';

import { useTranslations } from 'use-intl';
import { z } from 'zod';

import {
   loveLeaderboard,
   qualifyLeaderboard,
   rankLeaderboard,
   recalculatePP,
   setManualPP,
   unrankLeaderboard
} from '@/modules/maps/actions/leaderboard/admin';
import type { OperationAction } from '@/modules/maps/operations/operation-action';
import { ConfirmDialog } from '@/shared/components/confirm-dialog';
import { starsToPP } from '@/shared/format/star-conversion';

type LeaderboardAdminOperation = 'rank-lb' | 'set-pp' | 'unrank-lb' | 'qualify-lb' | 'love-lb' | 'recalculate';

const positiveNumberInput = z.coerce.number().gt(0);
const nonnegativeNumberInput = z.coerce.number().min(0);

interface LeaderboardAdminOperationsProps {
   activeOperation: LeaderboardAdminOperation | null;
   leaderboardId: number;
   action: OperationAction;
   onOpenChangeAction: (open: boolean) => void;
}

export function LeaderboardAdminOperations({ activeOperation, leaderboardId, action, onOpenChangeAction }: LeaderboardAdminOperationsProps) {
   const tLB = useTranslations();
   const [starValue, setStarValue] = useState('');
   const pending = action.isPending;
   const rankStarsValid = positiveNumberInput.safeParse(starValue).success;
   const setStarsValid = nonnegativeNumberInput.safeParse(starValue).success;

   function closeDialog() {
      onOpenChangeAction(false);
   }

   function handlePPAction(mode: 'rank' | 'set') {
      const starsResult = (mode === 'rank' ? positiveNumberInput : nonnegativeNumberInput).safeParse(starValue);
      if (!starsResult.success) return;

      const maxPP = starsToPP(starsResult.data);

      const clearPP = () => {
         setStarValue('');
         closeDialog();
      };

      const run = mode === 'rank' ? () => rankLeaderboard(leaderboardId, maxPP) : () => setManualPP(leaderboardId, maxPP);
      const successMessage = mode === 'rank' ? tLB('leaderboard.leaderboardRanked') : tLB('leaderboard.starsUpdated');
      const errorMessage = mode === 'rank' ? tLB('leaderboard.failedToRank') : tLB('leaderboard.failedToSetStars');

      action.run(run, successMessage, errorMessage, clearPP);
   }

   return (
      <>
         <ConfirmDialog
            open={activeOperation === 'unrank-lb'}
            onOpenChangeAction={onOpenChangeAction}
            title={tLB('leaderboard.unrankLeaderboard')}
            description={tLB('leaderboard.unrankConfirmDesc')}
            pending={pending}
            variant="destructive"
            onConfirmAction={() =>
               action.run(
                  () => unrankLeaderboard(leaderboardId),
                  tLB('leaderboard.leaderboardUnranked'),
                  tLB('leaderboard.failedToUnrank'),
                  closeDialog
               )
            }
         />

         <ConfirmDialog
            open={activeOperation === 'qualify-lb'}
            onOpenChangeAction={onOpenChangeAction}
            title={tLB('leaderboard.qualifyTitle')}
            description={tLB('leaderboard.qualifyConfirmDesc')}
            pending={pending}
            onConfirmAction={() =>
               action.run(
                  () => qualifyLeaderboard(leaderboardId),
                  tLB('leaderboard.leaderboardQualified'),
                  tLB('leaderboard.failedToQualify'),
                  closeDialog
               )
            }
         />

         <ConfirmDialog
            open={activeOperation === 'love-lb'}
            onOpenChangeAction={onOpenChangeAction}
            title={tLB('leaderboard.loveTitle')}
            description={tLB('leaderboard.loveConfirmDesc')}
            pending={pending}
            onConfirmAction={() =>
               action.run(() => loveLeaderboard(leaderboardId), tLB('leaderboard.leaderboardLoved'), tLB('leaderboard.failedToLove'), closeDialog)
            }
         />

         <ConfirmDialog
            open={activeOperation === 'recalculate'}
            onOpenChangeAction={onOpenChangeAction}
            title={tLB('leaderboard.recalculateTitle')}
            description={tLB('leaderboard.recalculateConfirmDesc')}
            pending={pending}
            onConfirmAction={() =>
               action.run(() => recalculatePP(leaderboardId), tLB('leaderboard.ppRecalculated'), tLB('leaderboard.failedToRecalculate'), closeDialog)
            }
         />

         <ConfirmDialog
            open={activeOperation === 'rank-lb'}
            onOpenChangeAction={onOpenChangeAction}
            title={tLB('leaderboard.rank')}
            description={tLB('leaderboard.rankStarsDialogDesc')}
            confirmLabel={tLB('leaderboard.rank')}
            pending={pending}
            disabled={!rankStarsValid}
            textInput={{
               label: tLB('leaderboard.stars'),
               value: starValue,
               onValueChangeAction: setStarValue,
               placeholder: tLB('leaderboard.stars'),
               required: true,
               type: 'number',
               min: 0,
               step: 'any'
            }}
            onConfirmAction={() => handlePPAction('rank')}
         />

         <ConfirmDialog
            open={activeOperation === 'set-pp'}
            onOpenChangeAction={onOpenChangeAction}
            title={tLB('leaderboard.setStars')}
            description={tLB('leaderboard.setStarsDialogDesc')}
            confirmLabel={tLB('leaderboard.setStars')}
            pending={pending}
            disabled={!setStarsValid}
            textInput={{
               label: tLB('leaderboard.stars'),
               value: starValue,
               onValueChangeAction: setStarValue,
               placeholder: tLB('leaderboard.stars'),
               required: true,
               type: 'number',
               min: 0,
               step: 'any'
            }}
            onConfirmAction={() => handlePPAction('set')}
         />
      </>
   );
}

export type { LeaderboardAdminOperation };
