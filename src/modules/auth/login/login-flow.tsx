'use client';

import type { ReactNode } from 'react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { ArrowLeft, Fingerprint, KeyRound, Loader2, UserRoundPlus } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';

import { EmailLoginForm } from '@/modules/auth/login/email-login-form';
import { LoginProviderPicker } from '@/modules/auth/login/login-provider-picker';
import { PasswordLoginForm } from '@/modules/auth/login/password-login-form';
import { SignupForm } from '@/modules/auth/login/signup-form';
import { usePasskeyLogin } from '@/modules/auth/login/use-passkey-login';
import { Icons } from '@/shared/components/icons';
import { cn } from '@/shared/format/helpers';

export type LoginPanel = 'providers' | 'email' | 'password' | 'signup';

interface LoginFlowProps {
   steamHref: string;
   patreonHref: string;
   discordHref: string;
   redirectTo: string;
   labels: {
      scoresaber: string;
      steam: string;
      meta: string;
      patreon: string;
      discord: string;
   };
   metaTooltip: string;
   showOtherMethodsLabel: string;
   hideOtherMethodsLabel: string;
   secondaryDescription: string;
   backLabel: string;
   metaTitle: string;
   initialPanel?: LoginPanel;
   passwordInitialMode?: 'login' | 'reset';
   onPanelChange?: (panel: LoginPanel) => void;
}

export function LoginFlow({
   steamHref,
   patreonHref,
   discordHref,
   redirectTo,
   labels,
   metaTooltip,
   showOtherMethodsLabel,
   hideOtherMethodsLabel,
   secondaryDescription,
   backLabel,
   metaTitle,
   initialPanel = 'providers',
   passwordInitialMode = 'login',
   onPanelChange
}: LoginFlowProps) {
   const t = useTranslations();
   const [activePanel, setActivePanel] = useState<LoginPanel>(initialPanel);
   const [panelHeight, setPanelHeight] = useState(176);
   const [formKey, setFormKey] = useState(0);
   const panelRefs = useRef<Partial<Record<LoginPanel, HTMLDivElement | null>>>({});
   const passkeyLogin = usePasskeyLogin(redirectTo);

   useEffect(() => {
      onPanelChange?.(activePanel);
   }, [activePanel, onPanelChange]);

   useLayoutEffect(() => {
      const panel = panelRefs.current[activePanel];

      if (!panel) {
         return;
      }

      const updateHeight = () => setPanelHeight(panel.offsetHeight);

      updateHeight();

      const observer = new ResizeObserver(updateHeight);
      observer.observe(panel);

      return () => observer.disconnect();
   }, [activePanel, formKey]);

   const goBackToProviders = () => {
      setActivePanel('providers');
      setFormKey((currentKey) => currentKey + 1);
   };

   const formPanel = (panel: LoginPanel, title: ReactNode, content: ReactNode) => (
      <div
         ref={(node) => {
            panelRefs.current[panel] = node;
         }}
         className={cn(
            'absolute inset-x-0 top-0 flex justify-center transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.2,0,0,1)]',
            activePanel === panel ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
         )}
         aria-hidden={activePanel !== panel}
         inert={activePanel !== panel}
      >
         <div className="flex w-full max-w-sm flex-col gap-4 text-left">
            <div className="flex items-center gap-3">
               <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={backLabel}
                  onClick={goBackToProviders}
                  className="text-muted-foreground hover:text-foreground cursor-default rounded-full"
               >
                  <ArrowLeft data-icon />
               </Button>
               <h2 className="flex items-center gap-2 text-lg font-semibold text-balance">{title}</h2>
            </div>

            {content}
         </div>
      </div>
   );

   return (
      <div
         className="relative w-full max-w-xl overflow-hidden transition-[height] duration-300 ease-[cubic-bezier(0.2,0,0,1)]"
         style={{ height: panelHeight }}
      >
         <div
            ref={(node) => {
               panelRefs.current.providers = node;
            }}
            className={cn(
               'absolute inset-x-0 top-0 flex justify-center transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.2,0,0,1)]',
               activePanel === 'providers' ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
            )}
            aria-hidden={activePanel !== 'providers'}
            inert={activePanel !== 'providers'}
         >
            <div className="flex w-full flex-col items-center gap-3">
               <LoginProviderPicker
                  steamHref={steamHref}
                  patreonHref={patreonHref}
                  discordHref={discordHref}
                  labels={labels}
                  metaTooltip={metaTooltip}
                  showOtherMethodsLabel={showOtherMethodsLabel}
                  hideOtherMethodsLabel={hideOtherMethodsLabel}
                  secondaryDescription={secondaryDescription}
                  onPasswordSelect={() => setActivePanel('password')}
                  onMetaSelect={() => setActivePanel('email')}
               />

               <div className="text-muted-foreground flex items-center gap-1 text-sm">
                  <Button
                     type="button"
                     variant="ghost"
                     size="sm"
                     disabled={passkeyLogin.isPending}
                     onClick={() => passkeyLogin.mutate()}
                     className="cursor-pointer gap-1.5"
                  >
                     {passkeyLogin.isPending ? (
                        <Loader2 data-icon="inline-start" className="animate-spin" />
                     ) : (
                        <Fingerprint data-icon="inline-start" />
                     )}
                     {t('login.passkey.method')}
                  </Button>
               </div>
            </div>
         </div>

         {formPanel(
            'email',
            <>
               <Icons.meta className="size-5 fill-current" aria-hidden />
               {metaTitle}
            </>,
            <EmailLoginForm key={`email-${formKey}`} redirectTo={redirectTo} onSignupSelect={() => setActivePanel('signup')} />
         )}

         {formPanel(
            'password',
            <>
               <KeyRound className="size-5" aria-hidden />
               {t('login.password.title')}
            </>,
            <PasswordLoginForm
               key={`password-${formKey}`}
               redirectTo={redirectTo}
               initialMode={passwordInitialMode}
               onSignupSelect={() => setActivePanel('signup')}
            />
         )}

         {formPanel(
            'signup',
            <>
               <UserRoundPlus className="size-5" aria-hidden />
               {t('login.signup.title')}
            </>,
            <SignupForm key={`signup-${formKey}`} redirectTo={redirectTo} onSignInSelect={goBackToProviders} />
         )}
      </div>
   );
}
