'use client';

import { useState } from 'react';

import type { IconType } from 'react-icons';
import { FaBan, FaGlobe, FaIdBadge, FaLock, FaUndoAlt, FaUsersCog } from 'react-icons/fa';
import { useTranslations } from 'use-intl';

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useActionMutation } from '@/hooks/use-action-mutation';
import { useAuth } from '@/modules/auth';
import { type PlayerAdminOperation, PlayerAdminOperations } from '@/modules/player/operations/admin/player-admin-operations';
import Permissions from '@/shared/permissions';

type ActiveDialog = PlayerAdminOperation | null;
type PlayerOperationGroup = 'primary' | 'country';

interface PlayerOperationDescriptor {
   id: PlayerAdminOperation;
   group: PlayerOperationGroup;
   visible: boolean;
   icon: IconType;
   label: string;
}

interface PlayerActionsProps {
   playerId: string;
   playerBanned: boolean;
   playerPermissions: number;
   playerRole: string | null;
   compact?: boolean;
}

export function PlayerActions({ playerId, playerBanned, playerPermissions, playerRole, compact = false }: PlayerActionsProps) {
   const t = useTranslations();
   const { user } = useAuth();
   const isOwnProfile = user?.id === playerId;
   const userPerms = user?.permissions ?? 0;
   const isAdmin = Permissions.checkPermissionNumber(userPerms, Permissions.security.ADMIN);
   const canBan = isAdmin;
   const canUpdateRoleText = isAdmin;
   const canManagePermissions = isAdmin;
   const canAdminResetCountry = isAdmin;
   const [activeDialog, setActiveDialog] = useState<ActiveDialog>(null);
   const [actionSelectKey, setActionSelectKey] = useState(0);
   const action = useActionMutation();
   const pending = action.isPending;
   const compactIconClass = compact ? 'size-2.5' : undefined;

   function closeDialog() {
      setActiveDialog(null);
   }

   const operations: PlayerOperationDescriptor[] = [
      {
         id: 'unban',
         group: 'primary',
         visible: canBan && !isOwnProfile && playerBanned,
         icon: FaUndoAlt,
         label: t('player.unbanPlayer')
      },
      {
         id: 'ban',
         group: 'primary',
         visible: canBan && !isOwnProfile && !playerBanned,
         icon: FaBan,
         label: t('player.banPlayer')
      },
      {
         id: 'permissions',
         group: 'primary',
         visible: canManagePermissions,
         icon: FaLock,
         label: t('player.managePermissions')
      },
      {
         id: 'role-text',
         group: 'primary',
         visible: canUpdateRoleText,
         icon: FaIdBadge,
         label: t('player.setRoleText')
      },
      {
         id: 'admin-country',
         group: 'country',
         visible: canAdminResetCountry,
         icon: FaGlobe,
         label: t('player.setCountry')
      }
   ];
   const visibleOperations = operations.filter((operation) => operation.visible);
   const primaryOperations = visibleOperations.filter((operation) => operation.group === 'primary');
   const countryOperations = visibleOperations.filter((operation) => operation.group === 'country');
   const hasAnyAction = visibleOperations.length > 0;
   if (!hasAnyAction) return null;

   function handlePlayerAction(value: string) {
      setActionSelectKey((prev) => prev + 1);
      const operation = visibleOperations.find((item) => item.id === value);
      if (operation) setActiveDialog(operation.id);
   }

   return (
      <>
         <div className="flex flex-col gap-1.5">
            <Select key={actionSelectKey} onValueChange={handlePlayerAction}>
               <SelectTrigger variant="icon" size="icon" aria-label={t('player.playerActions')} disabled={pending}>
                  <SelectValue placeholder={t('player.playerActions')} />
                  <FaUsersCog data-icon className={compactIconClass} aria-hidden="true" />
               </SelectTrigger>
               <SelectContent align="end" position="popper">
                  <SelectGroup>
                     <SelectLabel>{t('player.playerActions')}</SelectLabel>
                     {primaryOperations.map((operation) => (
                        <PlayerOperationItem key={operation.id} operation={operation} />
                     ))}
                     {primaryOperations.length > 0 && countryOperations.length > 0 && <SelectSeparator />}
                     {countryOperations.map((operation) => (
                        <PlayerOperationItem key={operation.id} operation={operation} />
                     ))}
                  </SelectGroup>
               </SelectContent>
            </Select>
         </div>

         <PlayerAdminOperations
            activeOperation={activeDialog}
            playerId={playerId}
            playerBanned={playerBanned}
            playerPermissions={playerPermissions}
            playerRole={playerRole}
            currentUserPermissions={userPerms}
            isOwnProfile={isOwnProfile}
            action={action}
            onOpenChangeAction={(open) => !open && closeDialog()}
         />
      </>
   );
}

function PlayerOperationItem({ operation }: { operation: PlayerOperationDescriptor }) {
   const Icon = operation.icon;

   return (
      <SelectItem value={operation.id}>
         <Icon data-icon="inline-start" />
         {operation.label}
      </SelectItem>
   );
}
