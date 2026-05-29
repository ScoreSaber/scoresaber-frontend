'use client';

import { useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useLocation } from '@tanstack/react-router';
import { Gift, X } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';

import { useAuth } from '@/modules/auth';
import { canRedeemScoreSaber2Badge, hasScoreSaber2Badge, scoreSaber2Badge } from '@/modules/settings/perks/score-saber-2-badge';
import { ScoreSaber2BadgeRedeemer } from '@/modules/settings/score-saber-2-badge-redeemer';
import { api } from '@/shared/api/ApiInstance';
import { FadeInImage } from '@/shared/components/fade-in-image';
import { queryApiData } from '@/shared/result/api';
import { toInt64PathParam } from '@/shared/url-state/params';

export function ScoreSaber2BadgePrompt() {
   const t = useTranslations();
   const pathname = useLocation({ select: (location) => location.pathname });
   const { user } = useAuth();
   const [dismissed, setDismissed] = useState<boolean | null>(null);
   const canRedeem = user ? canRedeemScoreSaber2Badge(user.permissions) : false;
   const isRedeemPage = pathname === '/settings/perks/score-saber-2-badge';

   useEffect(() => {
      setDismissed(window.localStorage.getItem(scoreSaber2Badge.dismissedStorageKey) === 'true');
   }, []);

   const playerQuery = useQuery({
      queryKey: ['score-saber-2-badge-player', user?.id],
      queryFn: () => queryApiData(api.player.playerControllerGetPlayer({ id: toInt64PathParam(user?.id ?? '') })),
      enabled: Boolean(user && canRedeem && dismissed === false),
      staleTime: 5 * 60 * 1000
   });

   function dismiss() {
      window.localStorage.setItem(scoreSaber2Badge.dismissedStorageKey, 'true');
      setDismissed(true);
   }

   const shouldShow =
      Boolean(user && canRedeem && dismissed === false && !isRedeemPage) && playerQuery.isSuccess && !hasScoreSaber2Badge(playerQuery.data);

   if (!shouldShow) return null;

   return (
      <aside className="fixed right-4 bottom-4 z-50 w-[min(calc(100vw-2rem),24rem)]">
         <div className="border-border/70 bg-card/95 text-card-foreground rounded-lg border p-4 shadow-xl backdrop-blur">
            <div className="flex items-start gap-2">
               <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 text-sm font-semibold">
                     <Gift className="text-primary size-4" aria-hidden />
                     {t('settings.perks.scoreSaber2Badge.promptTitle')}
                  </p>
                  <p className="text-muted-foreground mt-2 text-sm">{t('settings.perks.scoreSaber2Badge.description')}</p>
               </div>
               <Button
                  variant="ghost-icon"
                  size="icon-xs"
                  className="cursor-pointer"
                  onClick={dismiss}
                  aria-label={t('settings.perks.scoreSaber2Badge.dismiss')}
               >
                  <X />
               </Button>
            </div>
            <div className="mt-3 flex items-center gap-2">
               <FadeInImage
                  src={scoreSaber2Badge.imageUrl}
                  alt=""
                  width={scoreSaber2Badge.width}
                  height={scoreSaber2Badge.height}
                  className="rounded-sm"
                  style={{ width: scoreSaber2Badge.width, height: scoreSaber2Badge.height, objectFit: 'contain' }}
                  unoptimized
               />
               <ScoreSaber2BadgeRedeemer compact />
            </div>
         </div>
      </aside>
   );
}
