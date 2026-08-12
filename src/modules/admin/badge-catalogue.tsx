'use client';

import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { ImagePlus, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useActionMutation } from '@/hooks/use-action-mutation';
import { createBadge, deleteBadge, getAdminBadges, updateBadge } from '@/modules/admin/actions/admin';
import type {
   AdminBadgeControllerCreateBadgeResponse,
   AdminBadgeControllerGetAllBadgesItem,
   AdminBadgeControllerGetAllBadgesResponse,
   AdminBadgeControllerDeleteBadgeResponse
} from '@/shared/api/generated/ApiParams';
import { ConfirmDialog } from '@/shared/components/confirm-dialog';
import { unwrapAction } from '@/shared/result/action';

export function BadgeCatalogue({ initialBadges }: { initialBadges: AdminBadgeControllerGetAllBadgesResponse }) {
   const t = useTranslations('admin.badges');
   const query = useQuery({
      queryKey: ['admin', 'badges'],
      queryFn: async () => unwrapAction(await getAdminBadges()),
      initialData: initialBadges,
      staleTime: 0
   });
   const deleteAction = useActionMutation<AdminBadgeControllerDeleteBadgeResponse>();
   const [editing, setEditing] = useState<AdminBadgeControllerGetAllBadgesItem | null | 'create'>(null);
   const [deleting, setDeleting] = useState<AdminBadgeControllerGetAllBadgesItem | null>(null);

   function removeBadge() {
      if (!deleting) return;
      deleteAction.run(
         () => deleteBadge(deleting.id),
         t('deleted'),
         t('deleteFailed'),
         () => {
            setDeleting(null);
            void query.refetch();
         }
      );
   }

   return (
      <section className="flex flex-col gap-3">
         <div className="flex items-start justify-between gap-3">
            <div>
               <h2 className="font-semibold">{t('title')}</h2>
               <p className="text-muted-foreground text-sm">{t('description')}</p>
            </div>
            <Button size="sm" onClick={() => setEditing('create')}>
               <Plus data-icon="inline-start" />
               {t('create')}
            </Button>
         </div>

         {query.data.length === 0 ? (
            <div className="text-muted-foreground rounded-md border p-8 text-center text-sm">{t('empty')}</div>
         ) : (
            <div className="overflow-hidden rounded-md border">
               <div className="text-muted-foreground bg-muted/25 hidden grid-cols-[5rem_5rem_minmax(0,1fr)_8rem_5rem] gap-3 border-b px-4 py-2 text-xs font-medium sm:grid">
                  <span>{t('image')}</span>
                  <span>{t('id')}</span>
                  <span>{t('badgeDescription')}</span>
                  <span>{t('assignments')}</span>
                  <span className="sr-only">{t('actions')}</span>
               </div>
               {query.data.map((badge) => (
                  <div
                     key={badge.id}
                     className="grid grid-cols-[4rem_minmax(0,1fr)_auto] items-center gap-3 border-b px-4 py-3 last:border-b-0 sm:grid-cols-[5rem_5rem_minmax(0,1fr)_8rem_5rem]"
                  >
                     <img src={badge.imageUrl} alt="" className="h-10 w-20 object-contain" />
                     <span className="text-muted-foreground hidden font-mono text-xs sm:block">{badge.id}</span>
                     <div className="min-w-0">
                        <p className="text-sm break-words">{badge.description}</p>
                        <p className="text-muted-foreground text-xs sm:hidden">
                           {t('mobileMetadata', { id: badge.id, count: badge.assignmentCount })}
                        </p>
                     </div>
                     <span className="text-muted-foreground hidden text-sm tabular-nums sm:block">{badge.assignmentCount}</span>
                     <div className="flex justify-end gap-1">
                        <Button type="button" size="icon-sm" variant="ghost" onClick={() => setEditing(badge)} aria-label={t('edit')}>
                           <Pencil data-icon />
                        </Button>
                        <Button
                           type="button"
                           size="icon-sm"
                           variant="ghost"
                           onClick={() => setDeleting(badge)}
                           aria-label={t('delete')}
                           className="hover:text-destructive"
                        >
                           <Trash2 data-icon />
                        </Button>
                     </div>
                  </div>
               ))}
            </div>
         )}

         <BadgeEditorDialog
            key={editing === 'create' ? 'create' : (editing?.id ?? 'closed')}
            badge={editing === 'create' ? null : editing}
            open={editing != null}
            onOpenChangeAction={(open) => !open && setEditing(null)}
            onSavedAction={() => {
               setEditing(null);
               void query.refetch();
            }}
         />
         <ConfirmDialog
            open={deleting != null}
            onOpenChangeAction={(open) => !open && setDeleting(null)}
            title={t('deleteTitle')}
            description={t('deleteDescription', { count: deleting?.assignmentCount ?? 0 })}
            confirmLabel={t('delete')}
            variant="destructive"
            pending={deleteAction.isPending}
            onConfirmAction={removeBadge}
         />
      </section>
   );
}

function BadgeEditorDialog({
   badge,
   open,
   onOpenChangeAction,
   onSavedAction
}: {
   badge: AdminBadgeControllerGetAllBadgesItem | null;
   open: boolean;
   onOpenChangeAction: (open: boolean) => void;
   onSavedAction: () => void;
}) {
   const t = useTranslations('admin.badges');
   const tCommon = useTranslations('common');
   const action = useActionMutation<AdminBadgeControllerCreateBadgeResponse>();
   const [description, setDescription] = useState(badge?.description ?? '');
   const [image, setImage] = useState<File | null>(null);
   const creating = badge == null;

   function submit() {
      if (!description.trim() || (creating && !image)) return;
      const formData = new FormData();
      formData.set('description', description.trim());
      if (image) formData.set('image', image);
      action.run(
         () => (badge ? updateBadge(badge.id, formData) : createBadge(formData)),
         creating ? t('created') : t('updated'),
         creating ? t('createFailed') : t('updateFailed'),
         onSavedAction
      );
   }

   return (
      <Dialog open={open} onOpenChange={onOpenChangeAction}>
         <DialogContent>
            <form
               onSubmit={(event) => {
                  event.preventDefault();
                  submit();
               }}
               className="flex flex-col gap-4"
            >
               <DialogHeader>
                  <DialogTitle>{creating ? t('createTitle') : t('editTitle')}</DialogTitle>
                  <DialogDescription>{creating ? t('createDescription') : t('editDescription')}</DialogDescription>
               </DialogHeader>
               <div className="flex flex-col gap-1.5">
                  <Label htmlFor="badge-description">{t('badgeDescription')}</Label>
                  <Input
                     id="badge-description"
                     value={description}
                     onChange={(event) => setDescription(event.target.value)}
                     maxLength={128}
                     required
                  />
               </div>
               <div className="flex flex-col gap-1.5">
                  <Label htmlFor="badge-image">{creating ? t('image') : t('replacementImage')}</Label>
                  <Input
                     id="badge-image"
                     type="file"
                     accept="image/png,image/jpeg,image/webp,image/gif"
                     required={creating}
                     onChange={(event) => setImage(event.target.files?.[0] ?? null)}
                  />
                  <p className="text-muted-foreground text-xs">{image ? image.name : creating ? t('imageRequirements') : t('keepCurrentImage')}</p>
               </div>
               {badge && !image && (
                  <div className="flex items-center gap-3 rounded-md border p-3">
                     <img src={badge.imageUrl} alt="" className="h-10 w-20 object-contain" />
                     <span className="text-muted-foreground text-xs">{t('currentImage')}</span>
                  </div>
               )}
               <DialogFooter>
                  <Button type="button" variant="secondary" onClick={() => onOpenChangeAction(false)}>
                     {tCommon('cancel')}
                  </Button>
                  <Button type="submit" disabled={action.isPending || !description.trim() || (creating && !image)}>
                     {action.isPending ? <Loader2 data-icon="inline-start" className="animate-spin" /> : <ImagePlus data-icon="inline-start" />}
                     {creating ? t('create') : t('save')}
                  </Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   );
}
