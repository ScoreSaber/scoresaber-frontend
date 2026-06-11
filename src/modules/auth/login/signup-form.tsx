'use client';

import type { SubmitEvent } from 'react';
import { useState } from 'react';

import { useRouter } from '@tanstack/react-router';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { CircleCheck, Loader2, Mail, TriangleAlert, UserRoundPlus } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';

import { useEmailChallenge } from '@/hooks/use-email-challenge';
import { completeSignup, startSignup, type CredentialAuthActionValue } from '@/modules/auth/actions/credentials';
import { unwrapAction } from '@/shared/result/action';

interface ChallengeState {
   challengeId: string;
   expiresAt: string;
   resendAvailableAt: string;
}

type FeedbackState = {
   variant: 'default' | 'destructive';
   title: string;
   description?: string;
} | null;

export function SignupForm({ redirectTo }: { redirectTo: string }) {
   const t = useTranslations();
   const router = useRouter();
   const [displayName, setDisplayName] = useState('');
   const [password, setPassword] = useState('');
   const [feedback, setFeedback] = useState<FeedbackState>(null);
   const [supportRequired, setSupportRequired] = useState(false);

   const { email, setEmail, code, setCode, challenge, resendSeconds, expirySeconds, startMutation, verifyMutation } = useEmailChallenge<
      ChallengeState,
      CredentialAuthActionValue
   >({
      start: async (email) => unwrapAction(await startSignup(email)),
      verify: async (challengeId, code, email) =>
         unwrapAction(await completeSignup({ email, challengeId, code, password, displayName: displayName.trim() })),
      missingChallengeMessage: t('login.email.missingChallenge'),
      onStartMutate: () => {
         setFeedback(null);
         setSupportRequired(false);
      },
      onStarted: () =>
         setFeedback({
            variant: 'default',
            title: t('login.email.sentToast'),
            description: t('login.email.sentDescription')
         }),
      onStartError: (error) =>
         setFeedback({
            variant: 'destructive',
            title: t('login.email.sendFailedToast'),
            description: error.message || t('login.email.sendFailedToast')
         }),
      onVerifyMutate: () => {
         setFeedback(null);
         setSupportRequired(false);
      },
      onVerified: async (value) => {
         if (value.status === 'authenticated') {
            await router.invalidate();
            await router.navigate({ href: redirectTo, replace: true });
            return;
         }

         setSupportRequired(true);
      },
      onVerifyError: (error) =>
         setFeedback({
            variant: 'destructive',
            title: t('login.signup.failedToast'),
            description: error.message || t('login.signup.failedToast')
         })
   });

   const pending = startMutation.isPending || verifyMutation.isPending;
   const completeDisabled = code.length !== 6 || displayName.trim().length === 0 || password.length < 10 || pending;

   function submitEmail(event: SubmitEvent<HTMLFormElement>) {
      event.preventDefault();
      startMutation.mutate();
   }

   function submitSignup(event: SubmitEvent<HTMLFormElement>) {
      event.preventDefault();
      verifyMutation.mutate();
   }

   return (
      <div className="flex w-full max-w-sm flex-col gap-4 text-left">
         <form className="flex flex-col gap-2" onSubmit={submitEmail}>
            <Label htmlFor="signup-email">{t('login.email.emailLabel')}</Label>
            <div className="flex gap-2">
               <Input
                  id="signup-email"
                  type="email"
                  value={email}
                  autoComplete="email"
                  placeholder={t('login.email.emailPlaceholder')}
                  disabled={pending}
                  onChange={(event) => setEmail(event.target.value)}
               />
               <Button type="submit" disabled={!email || pending || resendSeconds > 0} className="cursor-pointer">
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
               {feedback.description && <AlertDescription>{feedback.description}</AlertDescription>}
            </Alert>
         )}

         {supportRequired && (
            <Alert variant="warning">
               <TriangleAlert aria-hidden />
               <AlertTitle>{t('login.email.supportTitle')}</AlertTitle>
               <AlertDescription>{t('login.email.supportDescription')}</AlertDescription>
            </Alert>
         )}

         {challenge && (
            <form className="flex flex-col gap-3" onSubmit={submitSignup}>
               <div className="flex w-full items-center justify-between gap-3">
                  <Label htmlFor="signup-code">{t('login.email.codeLabel')}</Label>
                  <span className="text-muted-foreground text-xs tabular-nums">{t('login.email.expiresIn', { seconds: expirySeconds })}</span>
               </div>
               <InputOTP
                  id="signup-code"
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

               <div className="flex flex-col gap-2">
                  <Label htmlFor="signup-display-name">{t('login.signup.displayNameLabel')}</Label>
                  <Input
                     id="signup-display-name"
                     value={displayName}
                     autoComplete="nickname"
                     maxLength={128}
                     disabled={pending}
                     onChange={(event) => setDisplayName(event.target.value)}
                  />
                  <p className="text-muted-foreground text-xs">{t('login.signup.displayNameHelp')}</p>
               </div>

               <div className="flex flex-col gap-2">
                  <Label htmlFor="signup-password">{t('login.password.passwordLabel')}</Label>
                  <Input
                     id="signup-password"
                     type="password"
                     value={password}
                     autoComplete="new-password"
                     minLength={10}
                     maxLength={128}
                     disabled={pending}
                     onChange={(event) => setPassword(event.target.value)}
                  />
                  <p className="text-muted-foreground text-xs">{t('login.password.passwordHelp')}</p>
               </div>

               <Button type="submit" disabled={completeDisabled} className="cursor-pointer">
                  {verifyMutation.isPending ? (
                     <Loader2 data-icon="inline-start" className="animate-spin" />
                  ) : (
                     <UserRoundPlus data-icon="inline-start" />
                  )}
                  {t('login.signup.submit')}
               </Button>
            </form>
         )}
      </div>
   );
}
