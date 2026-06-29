'use client';

import type { ReactNode } from 'react';

import { useTranslations } from 'use-intl';

import { Icons } from '@/shared/components/icons';
import { SupporterGateActions } from '@/shared/components/supporter-gate-actions';

interface SupporterRequiredOverlayProps {
   patreonConnected: boolean;
   title?: ReactNode;
   description?: ReactNode;
}

export function SupporterRequiredOverlay({ patreonConnected, title, description }: SupporterRequiredOverlayProps) {
   const t = useTranslations();

   return (
      <div className="mx-auto flex max-w-sm flex-col items-center gap-3 text-center">
         <span className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-full">
            <Icons.patreon className="size-4 fill-current" aria-hidden />
         </span>
         <div className="flex flex-col gap-1">
            <h3 className="font-semibold">{title ?? t('supporterGate.title')}</h3>
            <p className="text-muted-foreground text-sm text-pretty">
               {description ?? (patreonConnected ? t('supporterGate.subscribeDescription') : t('supporterGate.connectDescription'))}
            </p>
         </div>
         <SupporterGateActions />
      </div>
   );
}
