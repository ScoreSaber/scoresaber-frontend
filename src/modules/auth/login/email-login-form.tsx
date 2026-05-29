'use client';

import type { SubmitEvent } from 'react';
import { useState } from 'react';

import { useRouter } from '@tanstack/react-router';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { CircleCheck, Loader2, Mail, ShieldCheck, TriangleAlert } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';

import { useEmailChallenge } from '@/hooks/use-email-challenge';
import { startEmailLogin, verifyEmailLogin } from '@/modules/auth/actions/member';
import { unwrapAction } from '@/shared/result/action';

interface ChallengeState {
   challengeId: string;
   expiresAt: string;
   resendAvailableAt: string;
}

type NoticeState = 'pending-game-auth' | 'support-required' | null;
type FeedbackState = {
   variant: 'default' | 'destructive';
   title: string;
   description: string;
} | null;
type EmailLoginVerification = Extract<Awaited<ReturnType<typeof verifyEmailLogin>>, { ok: true }>['value'];

const DELIVERY_HELP_MINUTES = 10;

export function EmailLoginForm({ redirectTo }: { redirectTo: string }) {
   const t = useTranslations();
   const router = useRouter();
   const [notice, setNotice] = useState<NoticeState>(null);
   const [feedback, setFeedback] = useState<FeedbackState>(null);
   const { email, setEmail, code, setCode, challenge, resendSeconds, expirySeconds, startMutation, verifyMutation } = useEmailChallenge<
      ChallengeState,
      EmailLoginVerification
   >({
      start: async (email) => unwrapAction(await startEmailLogin(email)),
      verify: async (challengeId, code) => unwrapAction(await verifyEmailLogin(challengeId, code)),
      missingChallengeMessage: t('login.email.missingChallenge'),
      onStartMutate: () => {
         setFeedback(null);
         setNotice(null);
      },
      onStarted: () => {
         setFeedback({
            variant: 'default',
            title: t('login.email.sentToast'),
            description: t('login.email.sentDescription')
         });
      },
      onStartError: (error) =>
         setFeedback({
            variant: 'destructive',
            title: t('login.email.sendFailedToast'),
            description: error.message || t('login.email.sendFailedToast')
         }),
      onVerifyMutate: () => setFeedback(null),
      onVerified: (value) => {
         if (value.status === 'authenticated') {
            setFeedback({
               variant: 'default',
               title: t('login.email.authenticatedToast'),
               description: t('login.email.authenticatedDescription')
            });
            void router.navigate({ href: redirectTo, replace: true });
            void router.invalidate();
            return;
         }

         setNotice(value.status);
      },
      onVerifyError: (error) =>
         setFeedback({
            variant: 'destructive',
            title: t('login.email.verifyFailedToast'),
            description: error.message || t('login.email.verifyFailedToast')
         })
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
      <div className="flex w-full max-w-sm flex-col gap-4 text-left">
         <p className="text-muted-foreground text-sm text-pretty">{t('login.email.emailDescription')}</p>

         <form className="flex flex-col gap-2" onSubmit={submitEmail}>
            <Label htmlFor="email-login">{t('login.email.emailLabel')}</Label>
            <div className="flex gap-2">
               <Input
                  id="email-login"
                  type="email"
                  value={email}
                  autoComplete="email"
                  placeholder={t('login.email.emailPlaceholder')}
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
                        ? t('login.email.resendIn', { seconds: resendSeconds })
                        : t('login.email.resendCode')
                     : t('login.email.sendCode')}
               </Button>
            </div>
         </form>

         {feedback && (
            <Alert variant={feedback.variant}>
               {feedback.variant === 'destructive' ? <TriangleAlert aria-hidden /> : <CircleCheck aria-hidden />}
               <AlertTitle>{feedback.title}</AlertTitle>
               <AlertDescription>{feedback.description}</AlertDescription>
            </Alert>
         )}

         {challenge && (
            <>
               <form className="flex flex-col items-center gap-3" onSubmit={submitCode}>
                  <div className="flex w-full items-center justify-between gap-3">
                     <Label htmlFor="email-code">{t('login.email.codeLabel')}</Label>
                     <span className="text-muted-foreground text-xs tabular-nums">{t('login.email.expiresIn', { seconds: expirySeconds })}</span>
                  </div>
                  <InputOTP
                     id="email-code"
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
                     {t('login.email.verifyCode')}
                  </Button>
               </form>

               <p className="border-border/60 bg-muted/20 text-muted-foreground rounded-md border px-3 py-2 text-xs leading-relaxed text-pretty">
                  {t('login.email.deliveryHelp', { minutes: DELIVERY_HELP_MINUTES })}
               </p>
            </>
         )}

         {notice === 'pending-game-auth' && (
            <Alert>
               <TriangleAlert aria-hidden />
               <AlertTitle>{t('login.email.pendingTitle')}</AlertTitle>
               <AlertDescription>{t('login.email.pendingDescription')}</AlertDescription>
            </Alert>
         )}

         {notice === 'support-required' && (
            <Alert variant="warning">
               <TriangleAlert aria-hidden />
               <AlertTitle>{t('login.email.supportTitle')}</AlertTitle>
               <AlertDescription>{t('login.email.supportDescription')}</AlertDescription>
            </Alert>
         )}
      </div>
   );
}
