'use client';

import { useRef, useState } from 'react';

import { useNavigate } from '@tanstack/react-router';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { useActionMutation } from '@/hooks/use-action-mutation';
import { mergePlayer } from '@/modules/player/actions/user/admin';
import { PlayerAvatar } from '@/modules/player/shared/player-avatar';
import { PlayerPickerDialog, type PlayerPickerSelection } from '@/modules/player/shared/player-picker-dialog';
import type { AdminUserControllerMergePlayerResponse, PlayerControllerGetPlayerResponse } from '@/shared/api/generated/ApiParams';
import { ConfirmDialog } from '@/shared/components/confirm-dialog';
import { CountryImage } from '@/shared/components/country-image';

export type AdminMergeTarget = Pick<PlayerControllerGetPlayerResponse, 'id' | 'name' | 'avatar' | 'avatarVersion' | 'country'>;

export function PlayerMergeDialog({
   open,
   target,
   onOpenChangeAction
}: {
   open: boolean;
   target: AdminMergeTarget;
   onOpenChangeAction: (open: boolean) => void;
}) {
   const t = useTranslations();
   const navigate = useNavigate();
   const action = useActionMutation<AdminUserControllerMergePlayerResponse>();
   const [source, setSource] = useState<PlayerPickerSelection | null>(null);
   const [reason, setReason] = useState('');
   const sourceSelected = useRef(false);

   function close(force = false) {
      if (action.isPending && !force) return;
      setSource(null);
      setReason('');
      onOpenChangeAction(false);
   }

   function selectSource(selection: PlayerPickerSelection) {
      sourceSelected.current = true;
      if (selection.publicPlayerId === target.id) {
         toast.error(t('player.merge.samePlayer'));
         return;
      }
      setSource(selection);
   }

   function submit() {
      if (!source || !reason.trim()) return;
      action.run(
         () => mergePlayer(target.id, source.publicPlayerId, reason.trim()),
         t('player.merge.success'),
         t('player.merge.failed'),
         (result) => {
            close(true);
            void navigate({ to: '/u/$playerId', params: { playerId: result.publicPlayerId } });
         }
      );
   }

   return (
      <>
         <PlayerPickerDialog
            open={open && source == null}
            onOpenChangeAction={(nextOpen) => {
               if (nextOpen) return;
               if (sourceSelected.current) {
                  sourceSelected.current = false;
                  return;
               }
               close();
            }}
            onSelectAction={selectSource}
            title={t('player.merge.selectSource')}
            description={t('player.merge.selectSourceDescription')}
         />
         <ConfirmDialog
            open={open && source != null}
            onOpenChangeAction={(nextOpen) => !nextOpen && close()}
            title={t('player.merge.title')}
            description={t('player.merge.description')}
            confirmLabel={t('player.merge.confirm')}
            confirmationText={t('player.merge.confirmationText')}
            pending={action.isPending}
            variant="destructive"
            disabled={!reason.trim()}
            onConfirmAction={submit}
         >
            {source && (
               <>
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-md border p-3">
                     <PlayerIdentity
                        label={t('player.merge.source')}
                        id={source.publicPlayerId}
                        name={source.displayName}
                        avatar={source.player.avatar}
                        avatarVersion={source.player.avatarVersion}
                        country={source.player.country}
                     />
                     <ArrowRight className="text-muted-foreground size-5" aria-hidden="true" />
                     <PlayerIdentity label={t('player.merge.target')} {...target} />
                  </div>
                  <Button type="button" size="sm" variant="secondary" onClick={() => setSource(null)} disabled={action.isPending}>
                     <RefreshCw data-icon="inline-start" />
                     {t('player.merge.changeSource')}
                  </Button>
                  <div className="flex flex-col gap-1.5">
                     <Label htmlFor="admin-merge-reason">{t('player.merge.supportReason')}</Label>
                     <Textarea
                        id="admin-merge-reason"
                        value={reason}
                        onChange={(event) => setReason(event.target.value)}
                        placeholder={t('player.merge.supportReasonPlaceholder')}
                        maxLength={512}
                        rows={3}
                        resize="none"
                        disabled={action.isPending}
                     />
                  </div>
               </>
            )}
         </ConfirmDialog>
      </>
   );
}

function PlayerIdentity({ label, id, name, avatar, avatarVersion, country }: AdminMergeTarget & { label: string }) {
   return (
      <div className="flex min-w-0 flex-col items-center gap-1.5 text-center">
         <span className="text-muted-foreground text-xs font-medium">{label}</span>
         <PlayerAvatar src={avatar} version={avatarVersion} alt={name} width={40} height={40} className="size-10 rounded-full" />
         <span className="flex min-w-0 items-center gap-1 text-sm font-medium">
            <CountryImage country={country} size={16} className="shrink-0" />
            <span className="truncate">{name}</span>
         </span>
         <span className="text-muted-foreground max-w-full truncate font-mono text-[10px]">{id}</span>
      </div>
   );
}
