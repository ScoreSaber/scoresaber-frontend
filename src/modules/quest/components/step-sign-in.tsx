'use client';

import { getRouteApi, linkOptions, useRouter } from '@tanstack/react-router';
import { LogIn } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';

import { useAuth } from '@/modules/auth';
import { getRouteHref } from '@/shared/url-state/route-location';

const loginRoute = getRouteApi('/login');

export function StepSignIn() {
   const t = useTranslations();
   const { user } = useAuth();
   const router = useRouter();

   if (user) {
      return (
         <div className="flex flex-col gap-3 text-sm">
            <p>
               {t.rich('quest.step.2.signedInAs', {
                  name: user.name,
                  b: (chunks) => <span className="text-foreground font-semibold">{chunks}</span>
               })}
            </p>
            <p className="text-muted-foreground">{t('quest.step.2.continueHint')}</p>
         </div>
      );
   }

   const redirectTo = getRouteHref(router, linkOptions({ to: '/quest', search: { step: 2 } }));

   return (
      <div className="flex flex-col gap-4 text-sm">
         <p>{t('quest.step.2.signInPrompt')}</p>
         <Button asChild className="w-fit cursor-pointer">
            <loginRoute.Link search={{ redirectTo }}>
               <LogIn data-icon="inline-start" />
               {t('quest.step.2.signInButton')}
            </loginRoute.Link>
         </Button>
      </div>
   );
}
