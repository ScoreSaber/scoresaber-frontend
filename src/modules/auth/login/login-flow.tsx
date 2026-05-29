'use client';

import { useLayoutEffect, useRef, useState } from 'react';

import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { EmailLoginForm } from '@/modules/auth/login/email-login-form';
import { LoginProviderPicker } from '@/modules/auth/login/login-provider-picker';
import { Icons } from '@/shared/components/icons';
import { cn } from '@/shared/format/helpers';

interface LoginFlowProps {
   steamHref: string;
   patreonHref: string;
   discordHref: string;
   redirectTo: string;
   labels: {
      steam: string;
      meta: string;
      patreon: string;
      discord: string;
   };
   steamTooltip: string;
   metaTooltip: string;
   patreonTooltip: string;
   discordTooltip: string;
   showOtherMethodsLabel: string;
   hideOtherMethodsLabel: string;
   secondaryDescription: string;
   backLabel: string;
   metaTitle: string;
}

export function LoginFlow({
   steamHref,
   patreonHref,
   discordHref,
   redirectTo,
   labels,
   steamTooltip,
   metaTooltip,
   patreonTooltip,
   discordTooltip,
   showOtherMethodsLabel,
   hideOtherMethodsLabel,
   secondaryDescription,
   backLabel,
   metaTitle
}: LoginFlowProps) {
   const [isMetaSelected, setIsMetaSelected] = useState(false);
   const [panelHeight, setPanelHeight] = useState(128);
   const [metaFormKey, setMetaFormKey] = useState(0);
   const providersPanelRef = useRef<HTMLDivElement>(null);
   const metaPanelRef = useRef<HTMLDivElement>(null);

   useLayoutEffect(() => {
      const activePanel = isMetaSelected ? metaPanelRef.current : providersPanelRef.current;

      if (!activePanel) {
         return;
      }

      const updateHeight = () => setPanelHeight(activePanel.offsetHeight);

      updateHeight();

      const observer = new ResizeObserver(updateHeight);
      observer.observe(activePanel);

      return () => observer.disconnect();
   }, [isMetaSelected, metaFormKey]);

   const goBackToProviders = () => {
      setIsMetaSelected(false);
      setMetaFormKey((currentKey) => currentKey + 1);
   };

   return (
      <div
         className="relative w-full max-w-xl overflow-hidden transition-[height] duration-300 ease-[cubic-bezier(0.2,0,0,1)]"
         style={{ height: panelHeight }}
      >
         <div
            ref={providersPanelRef}
            className={cn(
               'absolute inset-x-0 top-0 flex justify-center transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.2,0,0,1)]',
               isMetaSelected ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'
            )}
            aria-hidden={isMetaSelected}
            inert={isMetaSelected}
         >
            <LoginProviderPicker
               steamHref={steamHref}
               patreonHref={patreonHref}
               discordHref={discordHref}
               labels={labels}
               steamTooltip={steamTooltip}
               metaTooltip={metaTooltip}
               patreonTooltip={patreonTooltip}
               discordTooltip={discordTooltip}
               showOtherMethodsLabel={showOtherMethodsLabel}
               hideOtherMethodsLabel={hideOtherMethodsLabel}
               secondaryDescription={secondaryDescription}
               onMetaSelect={() => setIsMetaSelected(true)}
            />
         </div>

         <div
            ref={metaPanelRef}
            className={cn(
               'absolute inset-x-0 top-0 flex justify-center transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.2,0,0,1)]',
               isMetaSelected ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            )}
            aria-hidden={!isMetaSelected}
            inert={!isMetaSelected}
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
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-balance">
                     <Icons.meta className="size-5 fill-current" aria-hidden />
                     {metaTitle}
                  </h2>
               </div>

               <EmailLoginForm key={metaFormKey} redirectTo={redirectTo} />
            </div>
         </div>
      </div>
   );
}
