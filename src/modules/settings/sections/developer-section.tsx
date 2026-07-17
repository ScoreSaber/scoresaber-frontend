'use client';

import type { SubmitEvent } from 'react';
import { useState } from 'react';

import { getRouteApi } from '@tanstack/react-router';
import { KeyRound, Loader2, LogIn, Pencil, Plus, Trash2 } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { useActionMutation } from '@/hooks/use-action-mutation';
import { useAuth } from '@/modules/auth';
import {
   createOAuthClient,
   revokeOAuthClient,
   rotateOAuthClientSecret,
   updateOAuthClient,
   type OAuthClientDraft,
   type OAuthScope
} from '@/modules/settings/actions/developer';
import type { OAuthClientControllerListClientsResponse } from '@/shared/api/generated/ApiParams';
import { ConfirmDialog } from '@/shared/components/confirm-dialog';
import { CopyButton } from '@/shared/components/copy-button';
import { Time } from '@/shared/components/time';
import Permissions from '@/shared/permissions';

const loginRoute = getRouteApi('/login');
const developerRoute = getRouteApi('/settings/developer');

type OAuthClientSummary = OAuthClientControllerListClientsResponse['clients'][number];

const OAUTH_SCOPES: OAuthScope[] = ['identity', 'identity.providers'];

interface DeveloperSectionProps {
   clients: OAuthClientSummary[] | null;
}

export function DeveloperSection({ clients }: DeveloperSectionProps) {
   const t = useTranslations();
   const { user } = useAuth();
   const rotateMutation = useActionMutation<{ clientSecret: string }>();
   const revokeMutation = useActionMutation<{ success: boolean }>();
   const [formTarget, setFormTarget] = useState<OAuthClientSummary | 'new' | null>(null);
   const [secret, setSecret] = useState<{ clientId: string; clientSecret: string } | null>(null);
   const [revokeTarget, setRevokeTarget] = useState<OAuthClientSummary | null>(null);

   if (!user) {
      return (
         <div className="flex flex-col items-center justify-center py-12">
            <Button asChild className="cursor-pointer">
               <loginRoute.Link search={{ redirectTo: developerRoute.id }}>
                  <LogIn data-icon="inline-start" />
                  {t('sidebar.logIn')}
               </loginRoute.Link>
            </Button>
         </div>
      );
   }

   if (!Permissions.checkPermissionNumber(user.permissions, Permissions.security.EXTERNAL_DEV)) {
      return (
         <Card variant="settings">
            <CardContent className="text-muted-foreground px-5 py-8 text-sm">{t('settings.developer.noAccess')}</CardContent>
         </Card>
      );
   }

   if (!clients) {
      return (
         <Card variant="settings">
            <CardContent className="text-muted-foreground px-5 py-8 text-sm">{t('settings.developer.loadFailed')}</CardContent>
         </Card>
      );
   }

   const submitRevoke = () => {
      if (!revokeTarget) {
         return;
      }

      revokeMutation.runKeyed(
         'revoke',
         () => revokeOAuthClient(revokeTarget.id),
         t('settings.developer.revoked'),
         t('settings.developer.revokeFailed'),
         () => setRevokeTarget(null)
      );
   };

   return (
      <>
         <Card variant="settings" className="gap-4 py-5">
            <CardHeader className="gap-4 px-5">
               <div className="min-w-0">
                  <CardTitle className="text-base">{t('settings.developer.title')}</CardTitle>
                  <p className="text-muted-foreground mt-1 text-sm text-pretty">{t('settings.developer.description')}</p>
               </div>
               <CardAction>
                  <Button type="button" onClick={() => setFormTarget('new')} className="cursor-pointer">
                     <Plus data-icon="inline-start" />
                     {t('settings.developer.create')}
                  </Button>
               </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 px-5">
               {clients.length === 0 ? (
                  <p className="text-muted-foreground py-6 text-center text-sm">{t('settings.developer.empty')}</p>
               ) : (
                  clients.map((client) => (
                     <ClientRow
                        key={client.id}
                        client={client}
                        rotatePending={rotateMutation.isPendingKey(`rotate-${client.id}`)}
                        onEdit={() => setFormTarget(client)}
                        onRotate={() =>
                           rotateMutation.runKeyed(
                              `rotate-${client.id}`,
                              () => rotateOAuthClientSecret(client.id),
                              t('settings.developer.rotated'),
                              t('settings.developer.rotateFailed'),
                              (value) => setSecret({ clientId: client.clientId, clientSecret: value.clientSecret })
                           )
                        }
                        onRevoke={() => setRevokeTarget(client)}
                     />
                  ))
               )}
            </CardContent>
         </Card>

         <ClientFormDialog
            target={formTarget}
            onClose={() => setFormTarget(null)}
            onCreated={(value) => setSecret({ clientId: value.client.clientId, clientSecret: value.clientSecret })}
         />

         <SecretDialog secret={secret} onClose={() => setSecret(null)} />

         <ConfirmDialog
            open={revokeTarget !== null}
            onOpenChangeAction={(open) => !open && setRevokeTarget(null)}
            title={t('settings.developer.revoke')}
            description={t('settings.developer.revokeDesc', { name: revokeTarget?.name ?? '' })}
            confirmLabel={t('settings.developer.revoke')}
            pending={revokeMutation.isPendingKey('revoke')}
            variant="destructive"
            confirmationText={revokeTarget?.name}
            onConfirmAction={submitRevoke}
         />
      </>
   );
}

function ClientRow({
   client,
   rotatePending,
   onEdit,
   onRotate,
   onRevoke
}: {
   client: OAuthClientSummary;
   rotatePending: boolean;
   onEdit: () => void;
   onRotate: () => void;
   onRevoke: () => void;
}) {
   const t = useTranslations();

   return (
      <div className="border-border/60 bg-background/40 flex flex-col gap-3 rounded-md border p-4">
         <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 flex-col gap-1">
               <h3 className="flex flex-wrap items-center gap-2 leading-5 font-semibold">
                  {client.name}
                  {client.allowedScopes.split(' ').map((scope) => (
                     <Badge key={scope} variant="secondary">
                        {scope}
                     </Badge>
                  ))}
               </h3>
               {client.description && <p className="text-muted-foreground text-sm text-pretty">{client.description}</p>}
               <p className="text-muted-foreground text-xs">
                  {t.rich('settings.developer.createdAt', { date: () => <Time date={client.createdAt} dateStyle="medium" /> })}
               </p>
            </div>
            <div className="flex shrink-0 gap-1.5">
               <Button type="button" variant="outline" size="sm" onClick={onEdit} className="cursor-pointer">
                  <Pencil data-icon="inline-start" />
                  {t('common.edit')}
               </Button>
               <Button type="button" variant="outline" size="sm" disabled={rotatePending} onClick={onRotate} className="cursor-pointer">
                  {rotatePending ? <Loader2 data-icon="inline-start" className="animate-spin" /> : <KeyRound data-icon="inline-start" />}
                  {t('settings.developer.rotate')}
               </Button>
               <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onRevoke}
                  className="text-destructive hover:text-destructive cursor-pointer"
               >
                  <Trash2 data-icon="inline-start" />
                  {t('settings.developer.revoke')}
               </Button>
            </div>
         </div>
         <div className="flex flex-col gap-1">
            <CopyableValue label={t('settings.developer.clientId')} value={client.clientId} />
            <div className="text-muted-foreground text-xs">
               <span className="font-medium">{t('settings.developer.redirectUris')}:</span>{' '}
               <span className="break-all">{client.redirectUris.join(', ')}</span>
            </div>
         </div>
      </div>
   );
}

function CopyableValue({ label, value }: { label: string; value: string }) {
   const t = useTranslations();

   return (
      <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
         <span className="font-medium">{label}:</span>
         <code className="bg-secondary/40 rounded px-1.5 py-0.5 font-mono break-all">{value}</code>
         <CopyButton value={value} aria-label={t('common.copy')} title={t('common.copy')} />
      </div>
   );
}

function ClientFormDialog({
   target,
   onClose,
   onCreated
}: {
   target: OAuthClientSummary | 'new' | null;
   onClose: () => void;
   onCreated: (value: { client: OAuthClientSummary; clientSecret: string }) => void;
}) {
   const t = useTranslations();
   const createMutation = useActionMutation<{ client: OAuthClientSummary; clientSecret: string }>();
   const updateMutation = useActionMutation<OAuthClientSummary>();
   const editing = target !== null && target !== 'new' ? target : null;
   const [name, setName] = useState('');
   const [description, setDescription] = useState('');
   const [redirectUris, setRedirectUris] = useState('');
   const [scopes, setScopes] = useState<OAuthScope[]>(['identity']);
   const [initializedFor, setInitializedFor] = useState<number | 'new' | null>(null);

   const pending = createMutation.isPending || updateMutation.isPending;

   // sync form state when the dialog opens for a different target
   const targetKey = target === null ? null : target === 'new' ? 'new' : target.id;
   if (target !== null && initializedFor !== targetKey) {
      setInitializedFor(targetKey);
      setName(editing?.name ?? '');
      setDescription(editing?.description ?? '');
      setRedirectUris(editing?.redirectUris.join('\n') ?? '');
      setScopes(
         editing
            ? editing.allowedScopes.split(' ').filter((scope): scope is OAuthScope => OAUTH_SCOPES.some((option) => option === scope))
            : ['identity']
      );
   }

   const parsedUris = redirectUris
      .split('\n')
      .map((uri) => uri.trim())
      .filter(Boolean);
   const submitDisabled = pending || name.trim().length < 3 || parsedUris.length === 0 || scopes.length === 0;

   const close = () => {
      setInitializedFor(null);
      onClose();
   };

   function submit(event: SubmitEvent<HTMLFormElement>) {
      event.preventDefault();
      if (submitDisabled) {
         return;
      }

      const draft: OAuthClientDraft = {
         name: name.trim(),
         description: description.trim() || undefined,
         redirectUris: parsedUris,
         allowedScopes: scopes
      };

      if (editing) {
         updateMutation.runKeyed(
            'save',
            () => updateOAuthClient(editing.id, draft),
            t('settings.developer.saved'),
            t('settings.developer.saveFailed'),
            close
         );
      } else {
         createMutation.runKeyed(
            'save',
            () => createOAuthClient(draft),
            t('settings.developer.created'),
            t('settings.developer.createFailed'),
            (value) => {
               close();
               onCreated(value);
            }
         );
      }
   }

   const toggleScope = (scope: OAuthScope, checked: boolean) => {
      setScopes((current) => (checked ? [...current, scope] : current.filter((s) => s !== scope)));
   };

   return (
      <Dialog open={target !== null} onOpenChange={(open) => !open && close()}>
         <DialogContent className="sm:max-w-lg">
            <DialogHeader>
               <DialogTitle>{editing ? t('settings.developer.editTitle') : t('settings.developer.createTitle')}</DialogTitle>
               <DialogDescription>{t('settings.developer.formDescription')}</DialogDescription>
            </DialogHeader>
            <form className="flex flex-col gap-4" onSubmit={submit}>
               <div className="flex flex-col gap-2">
                  <Label htmlFor="oauth-client-name">{t('settings.developer.nameLabel')}</Label>
                  <Input
                     id="oauth-client-name"
                     value={name}
                     minLength={3}
                     maxLength={128}
                     disabled={pending}
                     onChange={(event) => setName(event.target.value)}
                  />
               </div>
               <div className="flex flex-col gap-2">
                  <Label htmlFor="oauth-client-description">{t('settings.developer.descriptionLabel')}</Label>
                  <Input
                     id="oauth-client-description"
                     value={description}
                     maxLength={512}
                     disabled={pending}
                     onChange={(event) => setDescription(event.target.value)}
                  />
               </div>
               <div className="flex flex-col gap-2">
                  <Label htmlFor="oauth-client-redirects">{t('settings.developer.redirectUrisLabel')}</Label>
                  <Textarea
                     id="oauth-client-redirects"
                     value={redirectUris}
                     rows={3}
                     disabled={pending}
                     placeholder={'https://example.com/callback'}
                     onChange={(event) => setRedirectUris(event.target.value)}
                  />
                  <p className="text-muted-foreground text-xs">{t('settings.developer.redirectUrisHelp')}</p>
               </div>
               <div className="flex flex-col gap-2">
                  <Label>{t('settings.developer.scopesLabel')}</Label>
                  {OAUTH_SCOPES.map((scope) => (
                     <label key={scope} className="flex items-center gap-2 text-sm">
                        <Checkbox
                           checked={scopes.includes(scope)}
                           disabled={pending}
                           onCheckedChange={(checked) => toggleScope(scope, checked === true)}
                        />
                        {scope === 'identity' ? t('settings.developer.scopeIdentity') : t('settings.developer.scopeIdentityProviders')}
                     </label>
                  ))}
               </div>
               <DialogFooter>
                  <Button type="button" variant="secondary" disabled={pending} onClick={close} className="cursor-pointer">
                     {t('common.cancel')}
                  </Button>
                  <Button type="submit" disabled={submitDisabled} className="cursor-pointer">
                     {pending && <Loader2 data-icon="inline-start" className="animate-spin" />}
                     {editing ? t('common.save') : t('settings.developer.create')}
                  </Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   );
}

function SecretDialog({ secret, onClose }: { secret: { clientId: string; clientSecret: string } | null; onClose: () => void }) {
   const t = useTranslations();

   return (
      <Dialog open={secret !== null} onOpenChange={(open) => !open && onClose()}>
         <DialogContent className="sm:max-w-lg">
            <DialogHeader>
               <DialogTitle>{t('settings.developer.secretTitle')}</DialogTitle>
               <DialogDescription>{t('settings.developer.secretDescription')}</DialogDescription>
            </DialogHeader>
            {secret && (
               <div className="flex flex-col gap-2">
                  <CopyableValue label={t('settings.developer.clientId')} value={secret.clientId} />
                  <CopyableValue label={t('settings.developer.clientSecret')} value={secret.clientSecret} />
               </div>
            )}
            <DialogFooter>
               <Button type="button" onClick={onClose} className="cursor-pointer">
                  {t('common.confirm')}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}
