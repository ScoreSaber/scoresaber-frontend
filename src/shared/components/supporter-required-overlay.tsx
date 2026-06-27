'use client';

import { linkOptions, useRouter } from '@tanstack/react-router';
import { ExternalLink } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';

import { Icons } from '@/shared/components/icons';
import { getRouteHref } from '@/shared/url-state/route-location';

interface SupporterRequiredOverlayProps {
   patreonConnected: boolean;
}

export function SupporterRequiredOverlay({ patreonConnected }: SupporterRequiredOverlayProps) {
   const t = useTranslations();
   const router = useRouter();

   return (
      <div className="mx-auto flex max-w-sm flex-col items-center gap-3 text-center">
         <span className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-full">
            <Icons.patreon className="size-4 fill-current" aria-hidden />
         </span>
         <div className="flex flex-col gap-1">
            <h3 className="font-semibold">{t('supporterGate.title')}</h3>
            <p className="text-muted-foreground text-sm text-pretty">
               {patreonConnected ? t('supporterGate.subscribeDescription') : t('supporterGate.connectDescription')}
            </p>
         </div>
         {patreonConnected ? (
            <Button asChild className="cursor-pointer">
               <a href="https://patreon.com/scoresaber" target="_blank" rel="noreferrer">
                  <ExternalLink data-icon="inline-start" />
                  {t('supporterGate.subscribe')}
               </a>
            </Button>
         ) : (
            <Button asChild className="cursor-pointer">
               <a href={getRouteHref(router, linkOptions({ to: '/auth/patreon', search: { intent: 'link' } }))}>
                  <Icons.patreon data-icon="inline-start" className="fill-current" aria-hidden />
                  {t('supporterGate.connect')}
               </a>
            </Button>
         )}
      </div>
   );
}
