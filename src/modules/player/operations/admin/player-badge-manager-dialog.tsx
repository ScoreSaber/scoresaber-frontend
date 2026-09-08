'use client';

import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { Loader2, Search } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import { useActionMutation } from '@/hooks/use-action-mutation';
import { getAdminBadges } from '@/modules/admin/actions/admin';
import { getPlayerBadgeAssignments, replacePlayerBadgeAssignments } from '@/modules/player/actions/user/admin';
import type { AdminBadgeControllerGetAllBadgesResponse, AdminBadgeControllerGetPlayerBadgesResponse } from '@/shared/api/generated/ApiParams';
import { unwrapAction } from '@/shared/result/action';

export function PlayerBadgeManagerDialog({
   open,
   playerId,
   onOpenChangeAction
}: {
   open: boolean;
   playerId: string;
   onOpenChangeAction: (open: boolean) => void;
}) {
   const t = useTranslations();
   const catalogue = useQuery({
      queryKey: ['admin', 'badges'],
      queryFn: async () => unwrapAction(await getAdminBadges()),
      enabled: open,
      staleTime: 30_000
   });
   const assignments = useQuery({
      queryKey: ['admin', 'player-badges', playerId],
      queryFn: async () => unwrapAction(await getPlayerBadgeAssignments(playerId)),
      enabled: open,
      staleTime: 0
   });
   const loading = catalogue.isLoading || assignments.isLoading;
   const failed = catalogue.isError || assignments.isError;

   return (
      <Dialog open={open} onOpenChange={onOpenChangeAction}>
         <DialogContent className="h-dvh max-h-dvh max-w-none overflow-hidden rounded-none border-0 p-0 sm:h-auto sm:max-h-[calc(100dvh-2rem)] sm:max-w-2xl sm:rounded-lg sm:border">
            {loading ? (
               <div className="flex min-h-64 items-center justify-center">
                  <Loader2 className="text-muted-foreground size-5 animate-spin" />
               </div>
            ) : failed || !catalogue.data || !assignments.data ? (
               <div className="flex min-h-64 flex-col items-center justify-center gap-3 p-6 text-center">
                  <p className="text-muted-foreground text-sm">{t('player.badges.loadFailed')}</p>
                  <Button type="button" size="sm" variant="secondary" onClick={() => void Promise.all([catalogue.refetch(), assignments.refetch()])}>
                     {t('common.retry')}
                  </Button>
               </div>
            ) : (
               <BadgeEditor
                  key={`${playerId}:${assignments.data.map((assignment) => `${assignment.badgeId}:${assignment.descriptionOverride ?? ''}`).join('|')}`}
                  playerId={playerId}
                  catalogue={catalogue.data}
                  assignments={assignments.data}
                  onOpenChangeAction={onOpenChangeAction}
               />
            )}
         </DialogContent>
      </Dialog>
   );
}

function BadgeEditor({
   playerId,
   catalogue,
   assignments,
   onOpenChangeAction
}: {
   playerId: string;
   catalogue: AdminBadgeControllerGetAllBadgesResponse;
   assignments: AdminBadgeControllerGetPlayerBadgesResponse;
   onOpenChangeAction: (open: boolean) => void;
}) {
   const t = useTranslations();
   const action = useActionMutation();
   const [search, setSearch] = useState('');
   const [draft, setDraft] = useState(() => new Map(assignments.map((assignment) => [assignment.badgeId, assignment.descriptionOverride])));
   const query = search.trim().toLocaleLowerCase();
   const visibleBadges = catalogue.filter(
      (badge) => !query || badge.description.toLocaleLowerCase().includes(query) || String(badge.id).includes(query)
   );

   function toggleBadge(badgeId: number, selected: boolean) {
      setDraft((current) => {
         const next = new Map(current);
         if (selected) next.set(badgeId, null);
         else next.delete(badgeId);
         return next;
      });
   }

   function updateOverride(badgeId: number, value: string) {
      setDraft((current) => new Map(current).set(badgeId, value));
   }

   function save() {
      const badges = [...draft].map(([badgeId, descriptionOverride]) => ({
         badgeId,
         descriptionOverride: descriptionOverride?.trim() || null
      }));
      action.run(
         () => replacePlayerBadgeAssignments(playerId, badges),
         t('player.badges.updated'),
         t('player.badges.updateFailed'),
         () => onOpenChangeAction(false)
      );
   }

   return (
      <div className="flex max-h-dvh min-h-0 flex-col sm:max-h-[calc(100dvh-2rem)]">
         <DialogHeader className="p-6 pb-3">
            <DialogTitle>{t('player.badges.manage')}</DialogTitle>
            <DialogDescription>{t('player.badges.manageDescription')}</DialogDescription>
         </DialogHeader>
         <div className="relative px-6 pb-4">
            <Search className="text-muted-foreground absolute top-2.5 left-8 size-4" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t('player.badges.search')} className="pl-8" />
         </div>
         <div className="min-h-0 flex-1 overflow-y-auto border-y">
            {visibleBadges.length === 0 ? (
               <p className="text-muted-foreground p-8 text-center text-sm">{t('player.badges.empty')}</p>
            ) : (
               visibleBadges.map((badge) => {
                  const selected = draft.has(badge.id);
                  return (
                     <div key={badge.id} className="flex items-start gap-3 border-b p-4 last:border-b-0 sm:px-6">
                        <Checkbox
                           id={`player-badge-${badge.id}`}
                           checked={selected}
                           onCheckedChange={(value) => toggleBadge(badge.id, value === true)}
                           className="mt-2"
                        />
                        <img src={badge.imageUrl} alt="" className="h-9 w-18 shrink-0 object-contain" />
                        <div className="min-w-0 flex-1">
                           <label htmlFor={`player-badge-${badge.id}`} className="block cursor-pointer text-sm font-medium">
                              {badge.description}
                           </label>
                           <p className="text-muted-foreground text-xs">{t('player.badges.badgeId', { id: badge.id })}</p>
                           {selected && (
                              <Input
                                 value={draft.get(badge.id) ?? ''}
                                 onChange={(event) => updateOverride(badge.id, event.target.value)}
                                 placeholder={t('player.badges.overridePlaceholder')}
                                 maxLength={256}
                                 className="mt-2"
                              />
                           )}
                        </div>
                     </div>
                  );
               })
            )}
         </div>
         <DialogFooter className="bg-background p-4 sm:p-6">
            <Button type="button" variant="secondary" onClick={() => onOpenChangeAction(false)}>
               {t('common.cancel')}
            </Button>
            <Button type="button" onClick={save} disabled={action.isPending}>
               {action.isPending && <Loader2 data-icon="inline-start" className="animate-spin" />}
               {t('common.save')}
            </Button>
         </DialogFooter>
      </div>
   );
}
