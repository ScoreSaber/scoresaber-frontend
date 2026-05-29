'use client';

import { getRouteApi } from '@tanstack/react-router';
import { LogIn } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';

import { useAuth } from '@/modules/auth';
import { stringifyUrlSearch } from '@/shared/url-state/search-serializer';

const loginRoute = getRouteApi('/login');
const questRoute = getRouteApi('/quest');

export function StepSignIn() {
   const t = useTranslations();
   const { user } = useAuth();

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

   const redirectTo = `${questRoute.id}${stringifyUrlSearch({ step: 2 })}`;

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
