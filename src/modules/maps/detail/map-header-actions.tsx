'use client';

import { Fragment, useState } from 'react';

import { Loader2 } from 'lucide-react';
import type { IconType } from 'react-icons';
import { FaCalculator, FaCheckCircle, FaCog, FaExchangeAlt, FaGavel, FaHeart, FaStar, FaStream, FaTimesCircle } from 'react-icons/fa';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuSub,
   DropdownMenuSubContent,
   DropdownMenuSubTrigger,
   DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useActionMutation } from '@/hooks/use-action-mutation';
import { type LeaderboardAdminOperation, LeaderboardAdminOperations } from '@/modules/maps/operations/admin/leaderboard-admin-operations';
import { RankRequestApproveOperation } from '@/modules/maps/operations/admin/rank-request-approve-operation';
import {
   type RankRequestModerationOperation,
   RankRequestModerationOperations
} from '@/modules/maps/operations/nat/rank-request-moderation-operations';
import { RankRequestCreateOperation } from '@/modules/maps/operations/rt/rank-request-create-operation';
import { isActiveRankRequest } from '@/modules/rank-requests/lib/model';
import type { MapControllerGetMapByIdResponse } from '@/shared/api/generated/ApiParams';

type ActiveDialog =
   | 'rank'
   | 'qualify-full'
   | 'approve-full'
   | 'deny-full'
   | 'deny-selected'
   | 'replace'
   | 'rank-lb'
   | 'set-pp'
   | 'unrank-lb'
   | 'qualify-lb'
   | 'love-lb'
   | 'recalculate'
   | null;

type DialogId = Exclude<ActiveDialog, null>;

interface DropdownOperationDescriptor<T extends DialogId> {
   id: T;
   visible: boolean;
   label: string;
   icon?: IconType;
   className?: string;
   disabled?: boolean;
}

interface SelectOperationDescriptor<T extends DialogId> {
   id: T;
   visible: boolean;
   label: string;
   icon: IconType;
   className?: string;
   separatorBefore?: boolean;
}

interface MapHeaderActionsProps {
   mapInfo: MapControllerGetMapByIdResponse;
   leaderboardId: number;
   isRanked: boolean;
   hasRankRequest: boolean;
   requestId?: number;
   canCreateRequest: boolean;
   canQualify: boolean;
   canDeny: boolean;
   canReplace: boolean;
   canApprove: boolean;
   canAdmin: boolean;
   activeTab: 'leaderboard' | 'insights' | 'rank-request';
}

const rankRequestModerationOperations: { id: RankRequestModerationOperation }[] = [
   { id: 'qualify-full' },
   { id: 'deny-full' },
   { id: 'deny-selected' },
   { id: 'replace' }
];

export function MapHeaderActions({
   mapInfo,
   leaderboardId,
   isRanked,
   hasRankRequest,
   requestId,
   canCreateRequest,
   canQualify,
   canDeny,
   canReplace,
   canApprove,
   canAdmin,
   activeTab
}: MapHeaderActionsProps) {
   const tRR = useTranslations();
   const [activeDialog, setActiveDialog] = useState<ActiveDialog>(null);
   const [adminSelectKey, setAdminSelectKey] = useState(0);
   const action = useActionMutation();
   const pending = action.isPending;

   function closeDialog() {
      setActiveDialog(null);
   }

   function openDialog(id: DialogId) {
      setActiveDialog(id);
   }

   const showCreateButtons = canCreateRequest && !hasRankRequest && !isRanked;
   const hasActiveRankRequest = isActiveRankRequest(mapInfo.rankRequest);
   const showRequestActions =
      activeTab === 'rank-request' && hasActiveRankRequest && requestId != null && (canQualify || canDeny || canReplace || canApprove);
   const hasSelectedRankRequestDifficulty =
      mapInfo.rankRequest?.difficulties.some((difficulty) => difficulty.leaderboard.id === leaderboardId) ?? false;
   const hasRankActions = showCreateButtons || showRequestActions;
   const showAdmin = canAdmin && activeTab === 'leaderboard';

   if (!hasRankActions && !showAdmin) return null;

   const rankRequestOperations: DropdownOperationDescriptor<'rank' | 'approve-full' | 'qualify-full' | 'replace'>[] = [
      {
         id: 'rank',
         visible: showCreateButtons,
         icon: FaStream,
         label: tRR('rankRequest.createRankRequest')
      },
      {
         id: 'approve-full',
         visible: showRequestActions && canApprove,
         icon: FaCheckCircle,
         label: tRR('rankRequest.approveMapset'),
         className: 'text-green-500 focus:text-green-500 [&_svg]:!text-green-500'
      },
      {
         id: 'qualify-full',
         visible: showRequestActions && canQualify,
         icon: FaStar,
         label: tRR('rankRequest.qualifyMapset')
      },
      {
         id: 'replace',
         visible: showRequestActions && canReplace,
         icon: FaExchangeAlt,
         label: tRR('rankRequest.replace')
      }
   ];
   const denyOperations: DropdownOperationDescriptor<'deny-full' | 'deny-selected'>[] = [
      {
         id: 'deny-full',
         visible: showRequestActions && canDeny,
         label: tRR('rankRequest.fullMapset')
      },
      {
         id: 'deny-selected',
         visible: showRequestActions && canDeny,
         label: tRR('rankRequest.selectedDifficulty'),
         disabled: !hasSelectedRankRequestDifficulty
      }
   ];
   const adminOperations: SelectOperationDescriptor<LeaderboardAdminOperation>[] = [
      {
         id: 'qualify-lb',
         visible: true,
         icon: FaStar,
         label: tRR('leaderboard.qualify')
      },
      {
         id: 'love-lb',
         visible: true,
         icon: FaHeart,
         label: tRR('leaderboard.love')
      },
      {
         id: 'rank-lb',
         visible: true,
         icon: FaStream,
         label: tRR('leaderboard.rank'),
         separatorBefore: true
      },
      {
         id: 'set-pp',
         visible: true,
         icon: FaCalculator,
         label: tRR('leaderboard.setStars')
      },
      {
         id: 'recalculate',
         visible: true,
         icon: FaCalculator,
         label: tRR('leaderboard.recalculatePP'),
         separatorBefore: true
      },
      {
         id: 'unrank-lb',
         visible: true,
         icon: FaTimesCircle,
         label: tRR('leaderboard.unrank'),
         className: 'text-destructive focus:text-destructive'
      }
   ];
   const visibleRankRequestOperations = rankRequestOperations.filter((operation) => operation.visible);
   const visibleDenyOperations = denyOperations.filter((operation) => operation.visible);
   const visibleAdminOperations = adminOperations.filter((operation) => operation.visible);
   const activeModerationOperation = getActiveOperation(activeDialog, rankRequestModerationOperations);
   const activeLeaderboardAdminOperation = getActiveOperation(activeDialog, adminOperations);

   function handleAdminAction(value: string) {
      setAdminSelectKey((prev) => prev + 1);
      const operation = visibleAdminOperations.find((item) => item.id === value);
      if (operation) openDialog(operation.id);
   }

   return (
      <>
         <div className="flex items-center gap-1.5">
            {hasRankActions && (
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button
                        variant="outline"
                        size="icon-sm"
                        className="rounded-full"
                        aria-label={tRR('common.rankRequestActions')}
                        disabled={pending}
                     >
                        {pending ? <Loader2 className="size-3 animate-spin" /> : <FaGavel />}
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                     <DropdownMenuGroup>
                        <DropdownMenuLabel>{tRR('common.actions')}</DropdownMenuLabel>
                        {visibleRankRequestOperations
                           .filter((operation) => operation.id !== 'replace')
                           .map((operation) => (
                              <DropdownOperationItem key={operation.id} operation={operation} onSelectAction={openDialog} />
                           ))}
                        {visibleDenyOperations.length > 0 && (
                           <DropdownMenuSub>
                              <DropdownMenuSubTrigger className="text-destructive focus:bg-destructive/10 focus:text-destructive data-[state=open]:bg-destructive/10 data-[state=open]:text-destructive dark:focus:bg-destructive/20 dark:data-[state=open]:bg-destructive/20 [&_svg]:!text-destructive">
                                 <FaTimesCircle />
                                 {tRR('rankRequest.deny')}
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent>
                                 <DropdownMenuGroup>
                                    {visibleDenyOperations.map((operation) => (
                                       <DropdownOperationItem key={operation.id} operation={operation} onSelectAction={openDialog} />
                                    ))}
                                 </DropdownMenuGroup>
                              </DropdownMenuSubContent>
                           </DropdownMenuSub>
                        )}
                        {visibleRankRequestOperations
                           .filter((operation) => operation.id === 'replace')
                           .map((operation) => (
                              <Fragment key={operation.id}>
                                 <DropdownMenuSeparator />
                                 <DropdownOperationItem operation={operation} onSelectAction={openDialog} />
                              </Fragment>
                           ))}
                     </DropdownMenuGroup>
                  </DropdownMenuContent>
               </DropdownMenu>
            )}

            {showAdmin && (
               <Select key={`admin-${adminSelectKey}`} onValueChange={handleAdminAction}>
                  <SelectTrigger variant="icon" size="icon" aria-label={tRR('common.adminActions')} disabled={pending}>
                     <SelectValue placeholder={tRR('common.adminActions')} />
                     {pending ? <Loader2 className="size-3 animate-spin" /> : <FaCog className="size-3" />}
                  </SelectTrigger>
                  <SelectContent align="end" position="popper">
                     <SelectGroup>
                        <SelectLabel>{tRR('leaderboard.admin')}</SelectLabel>
                        {visibleAdminOperations.map((operation) => (
                           <Fragment key={operation.id}>
                              {operation.separatorBefore && <SelectSeparator />}
                              <SelectOperationItem operation={operation} />
                           </Fragment>
                        ))}
                     </SelectGroup>
                  </SelectContent>
               </Select>
            )}
         </div>

         <RankRequestCreateOperation
            open={activeDialog === 'rank'}
            mapInfo={mapInfo}
            action={action}
            onOpenChangeAction={(open) => !open && closeDialog()}
         />

         <RankRequestModerationOperations
            activeOperation={activeModerationOperation}
            mapInfo={mapInfo}
            leaderboardId={leaderboardId}
            requestId={requestId}
            action={action}
            onOpenChangeAction={(open) => !open && closeDialog()}
         />

         <RankRequestApproveOperation
            open={activeDialog === 'approve-full'}
            requestId={requestId}
            action={action}
            onOpenChangeAction={(open) => !open && closeDialog()}
         />

         <LeaderboardAdminOperations
            activeOperation={activeLeaderboardAdminOperation}
            leaderboardId={leaderboardId}
            action={action}
            onOpenChangeAction={(open) => !open && closeDialog()}
         />
      </>
   );
}

function DropdownOperationItem<T extends DialogId>({
   operation,
   onSelectAction
}: {
   operation: DropdownOperationDescriptor<T>;
   onSelectAction: (id: T) => void;
}) {
   const Icon = operation.icon;

   return (
      <DropdownMenuItem className={operation.className} disabled={operation.disabled} onClick={() => onSelectAction(operation.id)}>
         {Icon && <Icon />}
         {operation.label}
      </DropdownMenuItem>
   );
}

function SelectOperationItem<T extends DialogId>({ operation }: { operation: SelectOperationDescriptor<T> }) {
   const Icon = operation.icon;

   return (
      <SelectItem value={operation.id} className={operation.className}>
         <Icon className="size-3" />
         {operation.label}
      </SelectItem>
   );
}

function getActiveOperation<T extends string>(value: string | null, operations: { id: T }[]): T | null {
   for (const operation of operations) {
      if (operation.id === value) return operation.id;
   }
   return null;
}
