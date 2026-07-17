'use client';

import { useState } from 'react';

import { useTranslations } from 'use-intl';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import type { OperationAction } from '@/modules/maps/operations/operation-action';
import { createRankRequest } from '@/modules/rank-requests/actions/rt';
import type { MapControllerGetMapByIdResponse } from '@/shared/api/generated/ApiParams';
import { ConfirmDialog } from '@/shared/components/confirm-dialog';
import { getDifficultyLabel } from '@/shared/format/strings';

interface RankRequestCreateOperationProps {
   open: boolean;
   mapInfo: MapControllerGetMapByIdResponse;
   action: OperationAction;
   onOpenChangeAction: (open: boolean) => void;
}

export function RankRequestCreateOperation({ open, mapInfo, action, onOpenChangeAction }: RankRequestCreateOperationProps) {
   const tRR = useTranslations();
   const [description, setDescription] = useState('');
   const [selectedLeaderboards, setSelectedLeaderboards] = useState<number[]>([]);
   const pending = action.isPending;

   function closeDialog() {
      onOpenChangeAction(false);
   }

   function resetDialog() {
      setDescription('');
      setSelectedLeaderboards([]);
   }

   function toggleLeaderboard(id: number) {
      setSelectedLeaderboards((prev) => (prev.includes(id) ? prev.filter((leaderboardId) => leaderboardId !== id) : [...prev, id]));
   }

   function handleCreateRequest() {
      if (!description || selectedLeaderboards.length === 0) return;
      action.run(
         () => createRankRequest(mapInfo.id, description, selectedLeaderboards),
         tRR('rankRequest.requestSubmitted'),
         tRR('rankRequest.failedToCreateRequest'),
         () => {
            resetDialog();
            closeDialog();
         }
      );
   }

   return (
      <ConfirmDialog
         open={open}
         onOpenChangeAction={(isOpen) => {
            if (!isOpen) {
               resetDialog();
               closeDialog();
            }
         }}
         title={tRR('rankRequest.createRankRequest')}
         description={tRR('rankRequest.createRankDesc')}
         confirmLabel={tRR('common.submit')}
         pending={pending}
         disabled={!description || selectedLeaderboards.length === 0}
         onConfirmAction={handleCreateRequest}
      >
         <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
               <Label>{tRR('rankRequest.difficulties')}</Label>
               <div className="flex flex-col gap-2">
                  {mapInfo.leaderboards
                     .filter((lb) => lb.rawDifficulty.endsWith('_SoloStandard'))
                     .map((lb) => (
                        <Label key={lb.id} className="font-normal">
                           <Checkbox checked={selectedLeaderboards.includes(lb.id)} onCheckedChange={() => toggleLeaderboard(lb.id)} />
                           {getDifficultyLabel(lb.difficulty)}
                        </Label>
                     ))}
               </div>
            </div>
            <div className="flex flex-col gap-2">
               <Label>{tRR('rankRequest.description')}</Label>
               <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={tRR('rankRequest.whyRank')}
                  required
                  minLength={1}
                  maxLength={4096}
                  rows={4}
                  size="sm"
                  resize="none"
               />
            </div>
         </div>
      </ConfirmDialog>
   );
}
