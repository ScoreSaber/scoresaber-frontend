'use client';

import { linkOptions, useRouter } from '@tanstack/react-router';
import { ExternalLink } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';

import { cn } from '@/shared/format/helpers';
import { getRouteHref } from '@/shared/url-state/route-location';

interface SupporterGateActionsProps {
   size?: 'default' | 'xs';
   align?: 'center' | 'start';
}

export function SupporterGateActions({ size = 'default', align = 'center' }: SupporterGateActionsProps) {
   const t = useTranslations();
   const router = useRouter();
   const connectHref = getRouteHref(router, linkOptions({ to: '/auth/patreon', search: { intent: 'link' } }));

   return (
      <div className={cn('flex flex-col gap-2', align === 'center' ? 'items-center text-center' : 'items-start text-left')}>
         <Button asChild size={size} className={cn('cursor-pointer', align === 'start' && 'w-fit')}>
            <a href="https://patreon.com/scoresaber" target="_blank" rel="noreferrer">
               <ExternalLink data-icon="inline-start" />
               {t('supporterGate.supportUs')}
            </a>
         </Button>
         <p className={cn('text-muted-foreground text-xs leading-snug text-pretty', align === 'center' ? 'text-center' : 'text-left')}>
            {t('supporterGate.connectSupporterText')}{' '}
            <a href={connectHref} className="text-primary cursor-pointer underline-offset-4 hover:underline">
               {t('supporterGate.connectSupporterLink')}
            </a>
         </p>
      </div>
   );
}
