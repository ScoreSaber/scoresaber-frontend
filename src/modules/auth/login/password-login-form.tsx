'use client';

import type { SubmitEvent } from 'react';
import { useRef, useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { CircleCheck, KeyRound, Loader2, Mail, ShieldCheck, TriangleAlert } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';

import { useEmailChallenge } from '@/hooks/use-email-challenge';
import { completePasswordReset, loginWithPassword, startPasswordReset, type CredentialAuthActionValue } from '@/modules/auth/actions/credentials';
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

export function PasswordLoginForm({
   redirectTo,
   initialMode = 'login',
   onSignupSelect
}: {
   redirectTo: string;
   initialMode?: 'login' | 'reset';
   onSignupSelect?: () => void;
}) {
   const t = useTranslations();
   const router = useRouter();
   const [mode, setMode] = useState<'login' | 'reset'>(initialMode);
   const loginPasswordInputRef = useRef<HTMLInputElement>(null);
   const hasLoginPasswordRef = useRef(false);
   const [hasLoginPassword, setHasLoginPassword] = useState(false);
   const [resetPassword, setResetPassword] = useState('');
   const [feedback, setFeedback] = useState<FeedbackState>(null);
   const [supportRequired, setSupportRequired] = useState(false);

   const onAuthenticated = async (value: CredentialAuthActionValue) => {
      if (value.status === 'authenticated') {
         await router.invalidate();
         await router.navigate({ href: redirectTo, replace: true });
         return;
      }

      setSupportRequired(true);
   };

   const { email, setEmail, code, setCode, challenge, clearChallenge, resendSeconds, expirySeconds, startMutation, verifyMutation } =
      useEmailChallenge<ChallengeState, CredentialAuthActionValue>({
         start: async (email) => unwrapAction(await startPasswordReset(email)),
         verify: async (challengeId, code, email) => unwrapAction(await completePasswordReset({ email, challengeId, code, password: resetPassword })),
         missingChallengeMessage: t('login.email.missingChallenge'),
         onStartMutate: () => setFeedback(null),
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
         onVerifyMutate: () => setFeedback(null),
         onVerified: onAuthenticated,
         onVerifyError: (error) =>
            setFeedback({
               variant: 'destructive',
               title: t('login.password.resetFailedToast'),
               description: error.message || t('login.password.resetFailedToast')
            })
      });

   const loginMutation = useMutation({
      mutationFn: async (credentials: { email: string; password: string }) => unwrapAction(await loginWithPassword(credentials)),
      onMutate: () => setFeedback(null),
      onSuccess: onAuthenticated,
      onError: (error) =>
         setFeedback({
            variant: 'destructive',
            title: t('login.password.failedToast'),
            description: error.message || t('login.password.failedToast')
         })
   });

   const pending = loginMutation.isPending || startMutation.isPending || verifyMutation.isPending;

   const syncHasLoginPassword = (value: string) => {
      const nextHasPassword = value.length > 0;

      if (hasLoginPasswordRef.current === nextHasPassword) return;

      hasLoginPasswordRef.current = nextHasPassword;
      setHasLoginPassword(nextHasPassword);
   };

   const clearLoginPassword = () => {
      if (loginPasswordInputRef.current) loginPasswordInputRef.current.value = '';

      if (!hasLoginPasswordRef.current) return;

      hasLoginPasswordRef.current = false;
      setHasLoginPassword(false);
   };

   const switchMode = (nextMode: 'login' | 'reset') => {
      setMode(nextMode);
      clearLoginPassword();
      setResetPassword('');
      setFeedback(null);
      clearChallenge();
   };

   function submitLogin(event: SubmitEvent<HTMLFormElement>) {
      event.preventDefault();
      loginMutation.mutate({ email, password: loginPasswordInputRef.current?.value ?? '' });
   }

   function submitResetEmail(event: SubmitEvent<HTMLFormElement>) {
      event.preventDefault();
      startMutation.mutate();
   }

   function submitReset(event: SubmitEvent<HTMLFormElement>) {
      event.preventDefault();
      verifyMutation.mutate();
   }

   return (
      <div className="flex w-full max-w-sm flex-col gap-4 text-left">
         <p className="text-muted-foreground text-sm text-pretty">
            {mode === 'login' ? t('login.password.description') : t('login.password.resetDescription')}
         </p>

         {mode === 'login' ? (
            <form className="flex flex-col gap-3" onSubmit={submitLogin}>
               <div className="flex flex-col gap-2">
                  <Label htmlFor="password-login-email">{t('login.email.emailLabel')}</Label>
                  <Input
                     id="password-login-email"
                     type="email"
                     value={email}
                     autoComplete="email"
                     placeholder={t('login.email.emailPlaceholder')}
                     disabled={pending}
                     onChange={(event) => setEmail(event.target.value)}
                  />
               </div>
               <div className="flex flex-col gap-2">
                  <Label htmlFor="password-login-password">{t('login.password.passwordLabel')}</Label>
                  <Input
                     id="password-login-password"
                     type="password"
                     ref={loginPasswordInputRef}
                     autoComplete="current-password"
                     disabled={pending}
                     onChange={(event) => syncHasLoginPassword(event.target.value)}
                  />
               </div>
               <Button type="submit" disabled={!email || !hasLoginPassword || pending} className="cursor-pointer">
                  {loginMutation.isPending ? <Loader2 data-icon="inline-start" className="animate-spin" /> : <KeyRound data-icon="inline-start" />}
                  {t('login.password.submit')}
               </Button>
               <div className="flex w-full items-center justify-between gap-3">
                  {onSignupSelect ? (
                     <button
                        type="button"
                        onClick={onSignupSelect}
                        className="text-muted-foreground hover:text-foreground cursor-pointer text-xs underline-offset-4 hover:underline"
                     >
                        {t('login.signup.emailCallToAction')}
                     </button>
                  ) : (
                     <span aria-hidden />
                  )}
                  <button
                     type="button"
                     onClick={() => switchMode('reset')}
                     className="text-muted-foreground hover:text-foreground cursor-pointer text-right text-xs underline-offset-4 hover:underline"
                  >
                     {t('login.password.forgot')}
                  </button>
               </div>
            </form>
         ) : (
            <>
               <form className="flex flex-col gap-2" onSubmit={submitResetEmail}>
                  <Label htmlFor="password-reset-email">{t('login.email.emailLabel')}</Label>
                  <div className="flex gap-2">
                     <Input
                        id="password-reset-email"
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

               {challenge && (
                  <form className="flex flex-col gap-3" onSubmit={submitReset}>
                     <div className="flex w-full items-center justify-between gap-3">
                        <Label htmlFor="password-reset-code">{t('login.email.codeLabel')}</Label>
                        <span className="text-muted-foreground text-xs tabular-nums">{t('login.email.expiresIn', { seconds: expirySeconds })}</span>
                     </div>
                     <InputOTP
                        id="password-reset-code"
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
                        <Label htmlFor="password-reset-password">{t('login.password.newPasswordLabel')}</Label>
                        <Input
                           id="password-reset-password"
                           type="password"
                           value={resetPassword}
                           autoComplete="new-password"
                           minLength={10}
                           maxLength={128}
                           disabled={pending}
                           onChange={(event) => setResetPassword(event.target.value)}
                        />
                        <p className="text-muted-foreground text-xs">{t('login.password.passwordHelp')}</p>
                     </div>
                     <Button type="submit" disabled={code.length !== 6 || resetPassword.length < 10 || pending} className="cursor-pointer">
                        {verifyMutation.isPending ? (
                           <Loader2 data-icon="inline-start" className="animate-spin" />
                        ) : (
                           <ShieldCheck data-icon="inline-start" />
                        )}
                        {t('login.password.resetSubmit')}
                     </Button>
                  </form>
               )}

               <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-muted-foreground hover:text-foreground cursor-pointer self-start text-xs underline-offset-4 hover:underline"
               >
                  {t('login.password.backToLogin')}
               </button>
            </>
         )}

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
      </div>
   );
}
