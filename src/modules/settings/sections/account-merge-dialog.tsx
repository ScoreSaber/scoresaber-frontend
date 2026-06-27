'use client';

import type { SubmitEvent } from 'react';
import { useEffect, useState } from 'react';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getRouteApi, linkOptions, useRouter } from '@tanstack/react-router';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { ArrowRight, CircleCheck, Loader2, Mail, ShieldCheck, TriangleAlert } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'use-intl';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';

import { useActionMutation } from '@/hooks/use-action-mutation';
import { useCountdownSeconds } from '@/hooks/use-countdown-seconds';
import { useEmailChallenge } from '@/hooks/use-email-challenge';
import {
   confirmAccountMerge,
   getAccountMergeChallenge,
   startOculusAccountMerge,
   verifyOculusAccountMerge
} from '@/modules/settings/actions/connections';
import type { UserControllerGetAccountMergeChallengeResponse, UserControllerGetConnectionsItem } from '@/shared/api/generated/ApiParams';
import { Icons } from '@/shared/components/icons';
import { unwrapAction } from '@/shared/result/action';
import { getRouteHref } from '@/shared/url-state/route-location';

const settingsConnectionsRoute = getRouteApi('/settings/connections');

interface AccountMergeDialogProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   proofProvider: MergeProvider | null;
   initialChallengeId: string | null;
   steamFailed: boolean;
   onMerged: (challenge: MergeChallenge) => void;
}

type MergeProvider = Extract<UserControllerGetConnectionsItem['provider'], 'STEAM' | 'OCULUS'>;
type MergeChallenge = UserControllerGetAccountMergeChallengeResponse;
type OculusEmailChallenge = { challengeId: string; expiresAt: string; resendAvailableAt: string };
type ConfirmMergeResult = Extract<Awaited<ReturnType<typeof confirmAccountMerge>>, { ok: true }>['value'];
type FeedbackMessage = {
   variant: 'default' | 'destructive';
   title: string;
   description: string;
};
type Feedback = FeedbackMessage | null;

export function AccountMergeDialog({ open, onOpenChange, proofProvider, initialChallengeId, steamFailed, onMerged }: AccountMergeDialogProps) {
   const t = useTranslations();
   const router = useRouter();
   const [mergeChallenge, setMergeChallenge] = useState<MergeChallenge | null>(null);
   const [feedback, setFeedback] = useState<Feedback>(null);

   useEffect(() => {
      if (!open) {
         setMergeChallenge(null);
         setFeedback(null);
         return;
      }

      if (!steamFailed) return;

      setFeedback({
         variant: 'destructive',
         title: t('settings.connections.merge.steamFailedTitle'),
         description: t('settings.connections.merge.steamFailedDescription')
      });
   }, [open, steamFailed, t]);

   const challengeQuery = useQuery({
      queryKey: ['accountMergeChallenge', initialChallengeId],
      queryFn: async () => unwrapAction(await getAccountMergeChallenge(initialChallengeId ?? '')),
      enabled: open && Boolean(initialChallengeId),
      retry: false
   });

   useEffect(() => {
      if (!open || !challengeQuery.isFetching) return;
      setFeedback(null);
   }, [challengeQuery.isFetching, open]);

   useEffect(() => {
      if (!open || !challengeQuery.data) return;
      setMergeChallenge(challengeQuery.data);
   }, [challengeQuery.data, open]);

   useEffect(() => {
      if (!open || !challengeQuery.error) return;
      setFeedback(
         toFeedback(
            challengeQuery.error,
            t('settings.connections.merge.challengeLoadFailedTitle'),
            t('settings.connections.merge.challengeLoadFailedDescription')
         )
      );
   }, [challengeQuery.error, open, t]);

   function resetMergeFlow() {
      setMergeChallenge(null);
      setFeedback(null);
   }

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="max-h-[calc(100dvh-2rem)] w-[min(calc(100%-2rem),34rem)] max-w-none overflow-y-auto sm:max-w-none">
            <DialogHeader>
               <DialogTitle>{t('settings.connections.merge.title')}</DialogTitle>
               <DialogDescription>{t('settings.connections.merge.description')}</DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4">
               {feedback && (
                  <Alert variant={feedback.variant}>
                     {feedback.variant === 'destructive' ? <TriangleAlert aria-hidden /> : <CircleCheck aria-hidden />}
                     <AlertTitle>{feedback.title}</AlertTitle>
                     <AlertDescription>{feedback.description}</AlertDescription>
                  </Alert>
               )}

               {challengeQuery.isFetching && (
                  <div className="text-muted-foreground flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                     <Loader2 className="size-4 animate-spin" aria-hidden />
                     {t('settings.connections.merge.loadingChallenge')}
                  </div>
               )}

               {mergeChallenge ? (
                  <MergePreview
                     challenge={mergeChallenge}
                     onCancel={proofProvider ? resetMergeFlow : () => onOpenChange(false)}
                     onConfirmed={() => {
                        onMerged(mergeChallenge);
                        setMergeChallenge(null);
                        onOpenChange(false);
                     }}
                     onFeedback={setFeedback}
                  />
               ) : proofProvider === 'OCULUS' ? (
                  <OculusProofForm onChallenge={setMergeChallenge} onFeedback={setFeedback} />
               ) : proofProvider === 'STEAM' ? (
                  <Button asChild className="w-fit cursor-pointer">
                     <a
                        href={getRouteHref(
                           router,
                           linkOptions({ to: '/auth/steam', search: { intent: 'merge', redirectTo: settingsConnectionsRoute.id } })
                        )}
                     >
                        <ShieldCheck data-icon="inline-start" />
                        {t('settings.connections.merge.proveSteam')}
                     </a>
                  </Button>
               ) : null}

               {feedback?.variant === 'destructive' && (
                  <div className="flex flex-wrap gap-2">
                     <Button type="button" variant="outline" onClick={resetMergeFlow} className="cursor-pointer">
                        {t('settings.connections.merge.retry')}
                     </Button>
                  </div>
               )}
            </div>
         </DialogContent>
      </Dialog>
   );
}

function OculusProofForm({
   onChallenge,
   onFeedback
}: {
   onChallenge: (challenge: MergeChallenge) => void;
   onFeedback: (feedback: Feedback) => void;
}) {
   const t = useTranslations();
   const { email, setEmail, code, setCode, challenge, clearChallenge, resendSeconds, expirySeconds, startMutation, verifyMutation } =
      useEmailChallenge<OculusEmailChallenge, MergeChallenge>({
         start: async (email) => unwrapAction(await startOculusAccountMerge(email)),
         verify: async (challengeId, code) => unwrapAction(await verifyOculusAccountMerge(challengeId, code)),
         missingChallengeMessage: t('settings.connections.merge.missingOculusChallenge'),
         onStartMutate: () => onFeedback(null),
         onStarted: () => {
            onFeedback({
               variant: 'default',
               title: t('settings.connections.merge.oculusCodeSentTitle'),
               description: t('settings.connections.merge.oculusCodeSentDescription')
            });
         },
         onStartError: (error) =>
            onFeedback(
               toFeedback(error, t('settings.connections.merge.oculusSendFailedTitle'), t('settings.connections.merge.oculusSendFailedDescription'))
            ),
         onVerifyMutate: () => onFeedback(null),
         onVerified: (mergeChallenge) => {
            clearChallenge();
            onChallenge(mergeChallenge);
         },
         onVerifyError: (error) =>
            onFeedback(
               toFeedback(
                  error,
                  t('settings.connections.merge.oculusVerifyFailedTitle'),
                  t('settings.connections.merge.oculusVerifyFailedDescription')
               )
            )
      });

   function submitEmail(event: SubmitEvent<HTMLFormElement>) {
      event.preventDefault();
      startMutation.mutate();
   }

   function submitCode(event: SubmitEvent<HTMLFormElement>) {
      event.preventDefault();
      verifyMutation.mutate();
   }

   return (
      <div className="flex flex-col gap-4">
         <div className="flex items-start gap-3">
            <span className="border-border/60 bg-secondary/35 text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded border">
               <Icons.meta className="size-5 fill-current" aria-hidden />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-3">
               <div>
                  <h3 className="text-sm font-semibold">{t('settings.connections.merge.oculusTitle')}</h3>
                  <p className="text-muted-foreground text-xs leading-5 text-pretty">{t('settings.connections.merge.oculusDescription')}</p>
               </div>

               <form className="flex flex-col gap-2" onSubmit={submitEmail}>
                  <Label htmlFor="account-merge-email">{t('settings.connections.merge.emailLabel')}</Label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                     <Input
                        id="account-merge-email"
                        type="email"
                        value={email}
                        autoComplete="email"
                        placeholder={t('settings.connections.merge.emailPlaceholder')}
                        disabled={startMutation.isPending || verifyMutation.isPending}
                        onChange={(event) => setEmail(event.target.value)}
                     />
                     <Button
                        type="submit"
                        disabled={!email || startMutation.isPending || verifyMutation.isPending || resendSeconds > 0}
                        className="cursor-pointer"
                     >
                        {startMutation.isPending ? <Loader2 data-icon="inline-start" className="animate-spin" /> : <Mail data-icon="inline-start" />}
                        {challenge
                           ? resendSeconds > 0
                              ? t('settings.connections.merge.resendIn', { seconds: resendSeconds })
                              : t('settings.connections.merge.resendCode')
                           : t('settings.connections.merge.sendCode')}
                     </Button>
                  </div>
               </form>
            </div>
         </div>

         {challenge && (
            <form className="border-border/70 flex flex-col items-center gap-3 border-t pt-4" onSubmit={submitCode}>
               <div className="flex w-full items-center justify-between gap-3">
                  <Label htmlFor="account-merge-code">{t('settings.connections.merge.codeLabel')}</Label>
                  <span className="text-muted-foreground text-xs tabular-nums">
                     {t('settings.connections.merge.expiresIn', { seconds: expirySeconds })}
                  </span>
               </div>
               <InputOTP
                  id="account-merge-code"
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS}
                  value={code}
                  onChange={setCode}
                  disabled={verifyMutation.isPending}
                  containerClassName="justify-center"
               >
                  <InputOTPGroup>
                     {Array.from({ length: 6 }).map((_, index) => (
                        <InputOTPSlot key={index} index={index} />
                     ))}
                  </InputOTPGroup>
               </InputOTP>
               <Button type="submit" disabled={code.length !== 6 || verifyMutation.isPending} className="w-full cursor-pointer">
                  {verifyMutation.isPending ? (
                     <Loader2 data-icon="inline-start" className="animate-spin" />
                  ) : (
                     <ShieldCheck data-icon="inline-start" />
                  )}
                  {t('settings.connections.merge.verifyCode')}
               </Button>
            </form>
         )}
      </div>
   );
}

function MergePreview({
   challenge,
   onCancel,
   onConfirmed,
   onFeedback
}: {
   challenge: MergeChallenge;
   onCancel: () => void;
   onConfirmed: () => void;
   onFeedback: (feedback: Feedback) => void;
}) {
   const t = useTranslations();
   const router = useRouter();
   const queryClient = useQueryClient();
   const expirySeconds = useCountdownSeconds(String(challenge.expiresAt));
   const confirmMutation = useActionMutation<ConfirmMergeResult>();

   return (
      <div className="flex flex-col gap-4">
         <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-start">
            <MergePlayerCard title={t('settings.connections.merge.sourceTitle')} player={challenge.sourcePlayer} />
            <div className="text-muted-foreground flex min-h-9 items-center justify-center sm:pt-7">
               <ArrowRight className="size-4 rotate-90 sm:rotate-0" aria-hidden />
            </div>
            <MergePlayerCard title={t('settings.connections.merge.targetTitle')} player={challenge.targetPlayer} />
         </div>

         <Alert variant="warning">
            <TriangleAlert aria-hidden />
            <AlertTitle>{t('settings.connections.merge.permanentWarningTitle')}</AlertTitle>
            <AlertDescription>
               {t('settings.connections.merge.permanentWarningDescription', {
                  seconds: expirySeconds,
                  publicPlayerId: challenge.targetPlayer.publicPlayerId
               })}
            </AlertDescription>
         </Alert>

         <div className="flex flex-wrap gap-2">
            <Button
               type="button"
               variant="destructive"
               disabled={confirmMutation.isPending}
               onClick={() => {
                  onFeedback(null);
                  confirmMutation.mutate(() => confirmAccountMerge(challenge.challengeId), {
                     onSuccess: (result) => {
                        queryClient.clear();
                        toast.success(t('settings.connections.merge.mergeConfirmed', { publicPlayerId: result.publicPlayerId }));
                        onConfirmed();
                        void router.navigate({ to: '/settings/connections', replace: true });
                        void router.invalidate();
                     },
                     onError: (error) =>
                        onFeedback(
                           toFeedback(error, t('settings.connections.merge.mergeFailedTitle'), t('settings.connections.merge.mergeFailedDescription'))
                        )
                  });
               }}
               className="cursor-pointer"
            >
               {confirmMutation.isPending ? <Loader2 data-icon="inline-start" className="animate-spin" /> : <ShieldCheck data-icon="inline-start" />}
               {t('settings.connections.merge.confirmMerge')}
            </Button>
            <Button type="button" variant="outline" disabled={confirmMutation.isPending} onClick={onCancel}>
               {t('common.cancel')}
            </Button>
         </div>
      </div>
   );
}

function MergePlayerCard({ title, player }: { title: string; player: MergeChallenge['targetPlayer'] }) {
   const t = useTranslations();
   const ProviderIcon = player.provider === 'STEAM' ? Icons.steam : Icons.meta;

   return (
      <div className="flex min-w-0 flex-col gap-3">
         <div className="flex min-w-0 items-start gap-3">
            <span className="border-border/60 bg-secondary/35 text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded border">
               <ProviderIcon className="size-5 fill-current" aria-hidden />
            </span>
            <div className="min-w-0">
               <p className="text-muted-foreground text-xs font-medium">{title}</p>
               <h3 className="truncate text-sm font-semibold">{player.name}</h3>
               <p className="text-muted-foreground truncate text-xs">
                  {player.provider === 'STEAM' ? t('settings.connections.providers.STEAM.label') : t('settings.connections.providers.OCULUS.label')}
               </p>
            </div>
         </div>
         <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 text-xs">
            <dt className="text-muted-foreground">{t('settings.connections.merge.publicId')}</dt>
            <dd className="truncate font-medium">{player.publicPlayerId}</dd>
            <dt className="text-muted-foreground">{t('common.country')}</dt>
            <dd className="truncate font-medium">{player.country || t('settings.connections.merge.unknownCountry')}</dd>
         </dl>
      </div>
   );
}

function toFeedback(error: Error, title: string, fallback: string): FeedbackMessage {
   return {
      variant: 'destructive',
      title,
      description: error.message || fallback
   };
}
