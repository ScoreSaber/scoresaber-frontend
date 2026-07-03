'use client';

import { createFileRoute, getRouteApi, linkOptions, useRouter } from '@tanstack/react-router';
import { Gamepad2, LogIn, UserRoundPlus } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';

import { useAuth } from '@/modules/auth';
import { DeviceCodePanel } from '@/modules/auth/device-code-panel';
import { buildNoindexHead } from '@/shared/seo/metadata';
import { getRouteHref } from '@/shared/url-state/route-location';
import { SetPageBackground } from '@/shell/background/page-background-provider';

const loginRoute = getRouteApi('/login');

export const Route = createFileRoute('/quest_/pair')({
   head: () => buildNoindexHead('Quest Standalone Pairing', 'Pair ScoreSaber with Beat Saber on Quest Standalone', '/quest/pair'),
   component: QuestPairRoute
});

function QuestPairRoute() {
   const t = useTranslations();
   const { user } = useAuth();
   const router = useRouter();
   const redirectTo = getRouteHref(router, linkOptions({ to: '/quest/pair' }));

   return (
      <div className="relative flex-1 overflow-hidden">
         <SetPageBackground src="/images/banner.jpg" />
         <div className="app-container relative z-10 flex min-h-[calc(100dvh-4rem)] items-center justify-center p-4 md:p-8">
            <section className="border-border/70 bg-card/90 flex w-full max-w-xl flex-col gap-6 rounded-lg border p-5 shadow-sm backdrop-blur sm:p-6">
               <div className="flex flex-col items-center gap-3 text-center">
                  <span className="border-border/60 bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full border">
                     <Gamepad2 aria-hidden />
                  </span>
                  <div className="flex flex-col gap-2">
                     <h1 className="text-2xl font-semibold text-balance">{t('quest.pairing.title')}</h1>
                     <p className="text-muted-foreground text-sm text-pretty">
                        {user ? t('quest.pairing.signedInDescription', { name: user.name }) : t('quest.pairing.signedOutDescription')}
                     </p>
                  </div>
               </div>

               {user ? (
                  <DeviceCodePanel autoStart className="pt-0" />
               ) : (
                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                     <Button asChild className="cursor-pointer">
                        <loginRoute.Link search={{ redirectTo }}>
                           <LogIn data-icon="inline-start" />
                           {t('quest.pairing.loginAction')}
                        </loginRoute.Link>
                     </Button>
                     <Button variant="outline" asChild className="cursor-pointer">
                        <loginRoute.Link search={{ redirectTo, mode: 'signup' }}>
                           <UserRoundPlus data-icon="inline-start" />
                           {t('quest.pairing.signupAction')}
                        </loginRoute.Link>
                     </Button>
                  </div>
               )}
            </section>
         </div>
      </div>
   );
}
