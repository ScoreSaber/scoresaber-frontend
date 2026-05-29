'use client';

import { useTranslations } from 'use-intl';

import type { OperationAction } from '@/modules/maps/operations/operation-action';
import { approveRequest } from '@/modules/rank-requests/actions/admin';
import { ConfirmDialog } from '@/shared/components/confirm-dialog';

interface RankRequestApproveOperationProps {
   open: boolean;
   requestId?: number;
   action: OperationAction;
   onOpenChangeAction: (open: boolean) => void;
}

export function RankRequestApproveOperation({ open, requestId, action, onOpenChangeAction }: RankRequestApproveOperationProps) {
   const tRR = useTranslations();

   function handleApprove() {
      if (requestId == null) return;
      action.run(
         () => approveRequest(requestId),
         tRR('rankRequest.requestApproved'),
         tRR('rankRequest.failedToApprove'),
         () => onOpenChangeAction(false)
      );
   }

   return (
      <ConfirmDialog
         open={open}
         onOpenChangeAction={onOpenChangeAction}
         title={tRR('rankRequest.approveRankRequest')}
         description={tRR('rankRequest.approveConfirmDesc')}
         pending={action.isPending}
         onConfirmAction={handleApprove}
      />
   );
}
