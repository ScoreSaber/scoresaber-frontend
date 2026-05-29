'use client';

import { type ReactNode, useRef, useState } from 'react';

import { Loader2, OctagonAlert } from 'lucide-react';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupText, InputGroupTextarea } from '@/components/ui/input-group';

import { useActionMutation } from '@/hooks/use-action-mutation';
import { ConfirmDialog } from '@/shared/components/confirm-dialog';
import { Time } from '@/shared/components/time';
import { decodeHtmlEntities } from '@/shared/format/helpers';
import type { ActionResult } from '@/shared/result/action';

interface CommentProps {
   avatar: ReactNode;
   author: ReactNode;
   content: string;
   createdAt: string;
   edited?: boolean;
   canModify?: boolean;
   onEditAction?: (next: string) => Promise<ActionResult>;
   onDeleteAction?: () => Promise<ActionResult>;
   maxLength?: number;
   deleteTitle?: string;
   deleteDescription?: string;
}

export function Comment({
   avatar,
   author,
   content,
   createdAt,
   edited = false,
   canModify = false,
   onEditAction,
   onDeleteAction,
   maxLength = 4096,
   deleteTitle,
   deleteDescription
}: CommentProps) {
   const t = useTranslations();
   const tc = useTranslations();
   const [isEditing, setIsEditing] = useState(false);
   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
   const [deleted, setDeleted] = useState(false);
   const [editedText, setEditedText] = useState(decodeHtmlEntities(content));
   const [localEdited, setLocalEdited] = useState(edited);
   const [localContent, setLocalContent] = useState(content);
   const textareaRef = useRef<HTMLTextAreaElement>(null);

   const editMutation = useActionMutation();
   const deleteMutation = useActionMutation();

   const pending = editMutation.isPending || deleteMutation.isPending;
   const canEdit = canModify && !!onEditAction;
   const canDelete = canModify && !!onDeleteAction;

   if (deleted) return null;

   function handleEdit() {
      setEditedText(decodeHtmlEntities(localContent));
      editMutation.reset();
      setIsEditing(true);
      setTimeout(() => textareaRef.current?.focus(), 0);
   }

   function handleCancelEdit() {
      setIsEditing(false);
      editMutation.reset();
      setEditedText(decodeHtmlEntities(localContent));
   }

   function handleSaveEdit() {
      const trimmed = editedText.trim();
      if (!trimmed || trimmed.length > maxLength) return;
      editMutation.mutate(() => onEditAction?.(trimmed) ?? Promise.resolve({ ok: false, error: 'edit not supported' }), {
         onSuccess: () => {
            toast.success(t('comments.commentUpdated'));
            setLocalContent(trimmed);
            setLocalEdited(true);
            setIsEditing(false);
         }
      });
   }

   return (
      <>
         <div className="group flex gap-3">
            {avatar}
            <div className="min-w-0 flex-1">
               <div className="flex items-center gap-2">
                  {author}
                  <Time date={createdAt} short className="text-muted-foreground text-xs" />
                  {localEdited && <span className="text-muted-foreground text-xs italic">{t('comments.edited')}</span>}

                  {(canEdit || canDelete) && !isEditing && (
                     <div className="ml-auto flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        {canEdit && (
                           <Button
                              variant="ghost"
                              size="icon-xs"
                              className="text-muted-foreground hover:text-foreground"
                              onClick={handleEdit}
                              disabled={pending}
                           >
                              <FaPencilAlt data-icon />
                           </Button>
                        )}
                        {canDelete && (
                           <Button
                              variant="ghost"
                              size="icon-xs"
                              className="text-muted-foreground hover:text-destructive"
                              onClick={() => setShowDeleteDialog(true)}
                              disabled={pending}
                           >
                              <FaTrash data-icon />
                           </Button>
                        )}
                     </div>
                  )}
               </div>

               {isEditing ? (
                  <div className="mt-1 flex flex-col gap-1.5">
                     <InputGroup>
                        <InputGroupTextarea
                           ref={textareaRef}
                           value={editedText}
                           onChange={(e) => setEditedText(e.target.value)}
                           rows={3}
                           maxLength={maxLength}
                           size="sm"
                        />
                        <InputGroupAddon align="block-end">
                           <InputGroupText className="text-xs">
                              {t('comments.charCount', { count: editedText.length, max: maxLength })}
                           </InputGroupText>
                           <div className="ml-auto flex gap-1.5">
                              <InputGroupButton variant="ghost" size="sm" onClick={handleCancelEdit} disabled={pending}>
                                 {tc('common.cancel')}
                              </InputGroupButton>
                              <InputGroupButton
                                 variant="default"
                                 size="sm"
                                 onClick={handleSaveEdit}
                                 disabled={pending || editedText.trim().length === 0}
                                 className="relative cursor-pointer"
                              >
                                 <span className={editMutation.isPending ? 'invisible' : undefined}>{tc('common.save')}</span>
                                 {editMutation.isPending && <Loader2 className="absolute size-3.5 animate-spin" />}
                              </InputGroupButton>
                           </div>
                        </InputGroupAddon>
                     </InputGroup>
                     {editMutation.error && (
                        <Alert variant="destructive">
                           <OctagonAlert className="size-4" />
                           <AlertDescription>{editMutation.error.message}</AlertDescription>
                        </Alert>
                     )}
                  </div>
               ) : (
                  <p className="text-foreground mt-1 text-sm [overflow-wrap:anywhere] whitespace-pre-wrap">{decodeHtmlEntities(localContent)}</p>
               )}
            </div>
         </div>

         <ConfirmDialog
            open={showDeleteDialog}
            onOpenChangeAction={setShowDeleteDialog}
            title={deleteTitle ?? t('comments.deleteComment')}
            description={deleteDescription ?? t('comments.deleteCommentDesc')}
            confirmLabel={tc('common.delete')}
            pending={deleteMutation.isPending}
            variant="destructive"
            onConfirmAction={() =>
               deleteMutation.mutate(() => onDeleteAction?.() ?? Promise.resolve({ ok: false, error: 'delete not supported' }), {
                  onSuccess: () => {
                     toast.success(t('comments.commentDeleted'));
                     setShowDeleteDialog(false);
                     setDeleted(true);
                  },
                  onError: () => {
                     toast.error(t('comments.failedToDeleteComment'));
                  }
               })
            }
         />
      </>
   );
}
