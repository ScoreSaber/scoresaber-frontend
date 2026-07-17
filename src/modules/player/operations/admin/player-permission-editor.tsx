'use client';

import { useEffect, useState } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

import { useActionMutation } from '@/hooks/use-action-mutation';
import { getPermissionsList } from '@/modules/player/actions/permission/admin';
import { updatePermissions } from '@/modules/player/actions/user/admin';
import { unwrapAction } from '@/shared/result/action';

interface Permission {
   name: string;
   value: number;
}

type UpdatePermissionsResult = Extract<Awaited<ReturnType<typeof updatePermissions>>, { ok: true }>['value'];

const permissionOrder = ['PANDA', 'ADMIN', 'QATHead', 'CCTHead', 'NAT', 'RT', 'RTR', 'QAT', 'CAT', 'CCT', 'PPV3', 'DEV'];

function getPermissionChanges(permissions: Permission[], serverPermissions: number, draftPermissions: number) {
   const add: string[] = [];
   const remove: string[] = [];

   for (const permission of permissions) {
      const wasEnabled = (serverPermissions & permission.value) === permission.value;
      const isEnabled = (draftPermissions & permission.value) === permission.value;
      if (isEnabled && !wasEnabled) add.push(permission.name);
      if (!isEnabled && wasEnabled) remove.push(permission.name);
   }

   return { add, remove };
}

interface PlayerPermissionEditorProps {
   open: boolean;
   onOpenChangeAction: (open: boolean) => void;
   playerId: string;
   playerPermissions: number;
   currentUserPermissions: number;
   isOwnProfile: boolean;
}

export function PlayerPermissionEditor({
   open,
   onOpenChangeAction,
   playerId,
   playerPermissions: initialPermissions,
   currentUserPermissions,
   isOwnProfile
}: PlayerPermissionEditorProps) {
   const t = useTranslations();
   const tc = useTranslations();
   const queryClient = useQueryClient();

   // committed state from the server
   const [serverPerms, setServerPerms] = useState(initialPermissions);
   // local draft while editing
   const [draftPerms, setDraftPerms] = useState(initialPermissions);

   useEffect(() => {
      setServerPerms(initialPermissions);
      setDraftPerms(initialPermissions);
   }, [initialPermissions]);

   // reset draft when dialog opens
   useEffect(() => {
      if (open) {
         setDraftPerms(serverPerms);
      }
   }, [open, serverPerms]);

   const {
      data: permissions = null,
      isLoading: loading,
      error
   } = useQuery({
      queryKey: ['permissionsList'],
      queryFn: async () => unwrapAction(await getPermissionsList()),
      enabled: open,
      staleTime: 24 * 60 * 60 * 1000 // 24 hours
   });

   const permissionChanges = permissions ? getPermissionChanges(permissions, serverPerms, draftPerms) : null;
   const hasPendingChanges = permissionChanges ? permissionChanges.add.length > 0 || permissionChanges.remove.length > 0 : false;

   const mutation = useActionMutation<UpdatePermissionsResult>();
   const pending = mutation.isPending;

   function handleSave() {
      if (!permissionChanges) return;

      mutation.mutate(
         () => {
            const { add, remove } = permissionChanges;
            return updatePermissions(playerId, add.length > 0 ? add : undefined, remove.length > 0 ? remove : undefined);
         },
         {
            onSuccess: (result) => {
               toast.success(t('player.permissionsUpdated'));
               setServerPerms(result.permissions);
               setDraftPerms(result.permissions);
               onOpenChangeAction(false);
            },
            onError: () => {
               toast.error(t('player.failedToUpdatePermissions'));
            }
         }
      );
   }

   function handleCancel() {
      setDraftPerms(serverPerms);
      onOpenChangeAction(false);
   }

   function toggleDraft(perm: Permission, checked: boolean) {
      setDraftPerms((prev) => (checked ? prev | perm.value : prev & ~perm.value));
   }

   const isAdminPermission = (name: string) => name === 'ADMIN';
   const isPandaPermission = (name: string) => name === 'PANDA';
   const sortPermissions = (perms: Permission[]) =>
      perms.toSorted((a, b) => {
         const left = permissionOrder.indexOf(a.name);
         const right = permissionOrder.indexOf(b.name);

         if (left !== -1 && right !== -1) return left - right;
         if (left !== -1) return -1;
         if (right !== -1) return 1;
         return a.name.localeCompare(b.name);
      });
   const hasActualPanda = permissions?.some((perm) => isPandaPermission(perm.name) && (currentUserPermissions & perm.value) === perm.value) ?? false;
   const canSeePermission = (perm: Permission) => {
      if (!isAdminPermission(perm.name) && !isPandaPermission(perm.name)) return true;
      if ((draftPerms & perm.value) === perm.value) return true;
      if ((currentUserPermissions & perm.value) === perm.value) return true;
      return isAdminPermission(perm.name) && hasActualPanda;
   };
   const canModifyPermission = (perm: Permission) => {
      if (isPandaPermission(perm.name)) return false;
      if (isAdminPermission(perm.name)) return hasActualPanda && !isOwnProfile;
      return true;
   };
   const visiblePermissions = permissions ? sortPermissions(permissions.filter(canSeePermission)) : null;

   return (
      <Dialog
         open={open}
         onOpenChange={(isOpen) => {
            if (!isOpen) handleCancel();
            else onOpenChangeAction(isOpen);
         }}
      >
         <DialogContent>
            <DialogHeader>
               <DialogTitle>{t('player.managePermissions')}</DialogTitle>
               <DialogDescription>{t('player.togglePermissions')}</DialogDescription>
            </DialogHeader>

            {loading ? (
               <div className="flex items-center justify-center py-8">
                  <Loader2 className="text-muted-foreground size-5 animate-spin" />
               </div>
            ) : error ? (
               <div className="flex flex-col gap-3 py-4 text-center">
                  <p className="text-destructive text-sm">{t('player.failedToLoadPermissions')}</p>
                  <Button
                     variant="secondary"
                     size="sm"
                     onClick={() => queryClient.invalidateQueries({ queryKey: ['permissionsList'] })}
                     className="cursor-pointer"
                  >
                     {tc('common.retry')}
                  </Button>
               </div>
            ) : permissions ? (
               <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                     <span className="text-muted-foreground text-xs">
                        {t('player.permissionCount', { count: visiblePermissions?.length ?? permissions.length })}
                     </span>
                     <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => queryClient.invalidateQueries({ queryKey: ['permissionsList'] })}
                        disabled={pending}
                        aria-label={t('player.refreshPermissionsList')}
                        className="cursor-pointer"
                     >
                        <RefreshCw data-icon />
                     </Button>
                  </div>
                  <ScrollArea className="max-h-64">
                     <div className="grid gap-2 pr-3">
                        {(visiblePermissions ?? permissions).map((perm) => {
                           const isChecked = (draftPerms & perm.value) === perm.value;
                           const isDisabled = pending || !canModifyPermission(perm);

                           return (
                              <Label
                                 key={perm.name}
                                 className="hover:bg-muted/50 gap-2.5 rounded-md border px-3 py-2 transition-colors has-disabled:cursor-not-allowed has-disabled:opacity-50"
                              >
                                 <Checkbox
                                    checked={isChecked}
                                    onCheckedChange={(checked) => toggleDraft(perm, checked === true)}
                                    disabled={isDisabled}
                                 />
                                 <span>{perm.name}</span>
                              </Label>
                           );
                        })}
                     </div>
                  </ScrollArea>
               </div>
            ) : null}

            <DialogFooter>
               <Button variant="outline" onClick={handleCancel} disabled={pending}>
                  {tc('common.cancel')}
               </Button>
               <Button onClick={handleSave} disabled={pending || !hasPendingChanges} className="relative cursor-pointer">
                  <span className={pending ? 'invisible' : undefined}>{tc('common.save')}</span>
                  {pending && <Loader2 className="absolute animate-spin" />}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
