'use client';

import { getRouteApi } from '@tanstack/react-router';
import { ExternalLink, UserRound } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { ScrollArea } from '@/components/ui/scroll-area';

const settingsAccountRoute = getRouteApi('/settings/account');

export function PlayerProfileCustomizationAccountTab() {
   const t = useTranslations();

   return (
      <ScrollArea className="min-h-0 flex-1">
         <div className="px-5 py-4">
            <Empty className="min-h-80">
               <EmptyHeader>
                  <EmptyMedia variant="icon">
                     <UserRound aria-hidden />
                  </EmptyMedia>
                  <EmptyTitle>{t('player.customization.account.title')}</EmptyTitle>
                  <EmptyDescription>{t('player.customization.account.description')}</EmptyDescription>
               </EmptyHeader>
               <EmptyContent>
                  <Button asChild className="cursor-pointer">
                     <settingsAccountRoute.Link>
                        <ExternalLink data-icon="inline-start" />
                        {t('player.customization.account.open')}
                     </settingsAccountRoute.Link>
                  </Button>
               </EmptyContent>
            </Empty>
         </div>
      </ScrollArea>
   );
}
