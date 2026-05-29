'use client';

import { getRouteApi } from '@tanstack/react-router';
import { ExternalLink } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';

import { useAuth } from '@/modules/auth';
import { ConditionalOverlay } from '@/shared/components/conditional-overlay';
import { Icons } from '@/shared/components/icons';
import Permissions from '@/shared/permissions';
import { stringifyUrlSearch } from '@/shared/url-state/search-serializer';

const patreonAuthRoute = getRouteApi('/auth/patreon');

interface PerksAccessGateProps {
   children: React.ReactNode;
   patreonConnected: boolean;
}

export function PerksAccessGate({ children, patreonConnected }: PerksAccessGateProps) {
   const { user } = useAuth();
   const hasPerksAccess =
      !!user &&
      (Permissions.checkPermissionNumber(user.permissions, Permissions.security.SUPPORTER) ||
         Permissions.checkPermissionNumber(user.permissions, Permissions.security.PPFARMER) ||
         Permissions.checkPermissionNumber(user.permissions, Permissions.groups.ALL_STAFF));

   return (
      <ConditionalOverlay
         shouldShow={() => !hasPerksAccess}
         component={PerksRequiredOverlay}
         componentProps={{ patreonConnected }}
         className="min-h-112 overflow-visible rounded-lg"
         contentClassName="min-h-[28rem]"
         overlayClassName="min-h-[28rem] rounded-lg"
      >
         {children}
      </ConditionalOverlay>
   );
}

function PerksRequiredOverlay({ patreonConnected }: { patreonConnected: boolean }) {
   const t = useTranslations();

   return (
      <div className="mx-auto flex max-w-sm flex-col items-center gap-3 text-center">
         <span className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-full">
            <Icons.patreon className="size-4 fill-current" aria-hidden />
         </span>
         <div className="flex flex-col gap-1">
            <h3 className="font-semibold">{t('settings.perks.gate.title')}</h3>
            <p className="text-muted-foreground text-sm text-pretty">
               {patreonConnected ? t('settings.perks.gate.subscribeDescription') : t('settings.perks.gate.connectDescription')}
            </p>
         </div>
         {patreonConnected ? (
            <Button asChild className="cursor-pointer">
               <a href="https://patreon.com/scoresaber" target="_blank" rel="noreferrer">
                  <ExternalLink data-icon="inline-start" />
                  {t('settings.perks.gate.subscribe')}
               </a>
            </Button>
         ) : (
            <Button asChild className="cursor-pointer">
               <a href={`${patreonAuthRoute.id}${stringifyUrlSearch({ intent: 'link' })}`}>
                  <Icons.patreon data-icon="inline-start" className="fill-current" aria-hidden />
                  {t('settings.perks.gate.connect')}
               </a>
            </Button>
         )}
      </div>
   );
}
