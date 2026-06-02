'use client';

import { useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { getRouteApi, useLocation } from '@tanstack/react-router';
import { Result } from 'better-result';
import { Clock, Gift, X } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';

import { useCountdownSeconds } from '@/hooks/use-countdown-seconds';
import { useAuth } from '@/modules/auth';
import { canRedeemScoreSaber2Badge, hasScoreSaber2Badge, scoreSaber2Badge } from '@/modules/settings/perks/score-saber-2-badge';
import { ScoreSaber2BadgeRedeemer } from '@/modules/settings/score-saber-2-badge-redeemer';
import { api } from '@/shared/api/ApiInstance';
import { FadeInImage } from '@/shared/components/fade-in-image';
import { Icons } from '@/shared/components/icons';
import { queryApiData } from '@/shared/result/api';
import { readStorageValue, writeStorageValue } from '@/shared/result/storage';
import { toInt64PathParam } from '@/shared/url-state/params';

const loginRoute = getRouteApi('/login');
const scoreSaber2BadgeRoute = getRouteApi('/settings/perks/score-saber-2-badge');

const promptStorageKeys = {
   redeem: scoreSaber2Badge.dismissedStorageKey,
   promo: scoreSaber2Badge.promoDismissedStorageKey
} as const;

type PromptKind = keyof typeof promptStorageKeys;

export function ScoreSaber2BadgePrompt() {
   const t = useTranslations();
   const pathname = useLocation({ select: (location) => location.pathname });
   const { user } = useAuth();
   const [dismissed, setDismissed] = useState<Record<PromptKind, boolean>>({ redeem: true, promo: true });
   const secondsRemaining = useCountdownSeconds(scoreSaber2Badge.claimsCloseAt);
   const claimWindowOpen = secondsRemaining > 0;
   const canRedeem = Boolean(user && canRedeemScoreSaber2Badge(user.permissions));
   const isRedeemPage = pathname === scoreSaber2BadgeRoute.id;

   useEffect(() => {
      setDismissed({
         redeem: Result.unwrapOr(readStorageValue(promptStorageKeys.redeem), null) === 'true',
         promo: Result.unwrapOr(readStorageValue(promptStorageKeys.promo), null) === 'true'
      });
   }, []);

   const playerQuery = useQuery({
      queryKey: ['score-saber-2-badge-player', user?.id],
      queryFn: () => queryApiData(api.player.playerControllerGetPlayer({ id: toInt64PathParam(user?.id ?? '') })),
      enabled: Boolean(user && canRedeem && !dismissed.redeem && claimWindowOpen),
      staleTime: 5 * 60 * 1000
   });

   function dismiss(kind: PromptKind) {
      writeStorageValue(promptStorageKeys[kind], 'true');
      setDismissed((current) => ({ ...current, [kind]: true }));
   }

   const shouldShowRedeem =
      Boolean(user && canRedeem && !dismissed.redeem && claimWindowOpen && !isRedeemPage) &&
      playerQuery.isSuccess &&
      !hasScoreSaber2Badge(playerQuery.data);
   const shouldShowPromo = !canRedeem && !dismissed.promo && claimWindowOpen && !isRedeemPage;
   const promptKind = shouldShowRedeem ? 'redeem' : shouldShowPromo ? 'promo' : null;

   if (!promptKind) return null;

   const isPromo = promptKind === 'promo';
   const title = isPromo ? t('settings.perks.scoreSaber2Badge.promoTitle') : t('settings.perks.scoreSaber2Badge.promptTitle');
   const description = isPromo ? t('settings.perks.scoreSaber2Badge.promoDescription') : t('settings.perks.scoreSaber2Badge.description');

   return (
      <aside className="fixed right-3 bottom-20 z-50 w-[min(calc(100vw-1.5rem),24rem)] lg:right-4 lg:bottom-4 lg:w-[min(calc(100vw-2rem),24rem)]">
         <div className="border-border/70 bg-card/95 text-card-foreground rounded-lg border p-4 shadow-xl backdrop-blur">
            <div className="flex items-start gap-2">
               <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-center gap-1.5">
                     <p
                        className={
                           isPromo
                              ? 'flex min-w-0 shrink items-center gap-1 text-[13px] leading-none font-semibold whitespace-nowrap'
                              : 'flex items-center gap-1.5 text-sm font-semibold'
                        }
                     >
                        <Gift className={isPromo ? 'text-primary size-3.5 shrink-0' : 'text-primary size-4'} aria-hidden />
                        {title}
                     </p>
                     {isPromo && (
                        <span className="border-primary/20 bg-primary/5 inline-flex h-5 shrink-0 items-center gap-1 rounded-md border px-1.5">
                           <span className="text-muted-foreground flex items-center gap-0.5 text-[10px] font-medium">
                              <Clock className="size-3" aria-hidden />
                              {t('settings.perks.scoreSaber2Badge.countdownLabel')}
                           </span>
                           <time dateTime={scoreSaber2Badge.claimsCloseAt} className="font-mono text-[11px] leading-none font-semibold tabular-nums">
                              {formatBadgeCountdown(secondsRemaining)}
                           </time>
                        </span>
                     )}
                  </div>
                  <p className="text-muted-foreground mt-2 text-sm">{description}</p>
                  {isPromo && !user && (
                     <p className="text-muted-foreground mt-1 text-sm">
                        {t('settings.perks.scoreSaber2Badge.alreadySupporting')}{' '}
                        <loginRoute.Link
                           search={{ redirectTo: scoreSaber2BadgeRoute.id }}
                           className="text-primary font-medium underline-offset-4 hover:underline"
                        >
                           {t('sidebar.logIn')}
                        </loginRoute.Link>
                     </p>
                  )}
               </div>
               <Button
                  variant="ghost-icon"
                  size="icon-xs"
                  onClick={() => dismiss(promptKind)}
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
               {isPromo ? (
                  <div className="flex min-w-0 flex-1 justify-end gap-2">
                     <Button asChild size="sm" className="cursor-pointer">
                        <a href="https://patreon.com/scoresaber" target="_blank" rel="noreferrer">
                           <Icons.patreon data-icon="inline-start" className="fill-current" aria-hidden />
                           {t('settings.perks.scoreSaber2Badge.supportAction')}
                        </a>
                     </Button>
                  </div>
               ) : (
                  <ScoreSaber2BadgeRedeemer compact />
               )}
            </div>
         </div>
      </aside>
   );
}

function formatBadgeCountdown(totalSeconds: number) {
   const seconds = Math.max(0, totalSeconds);
   const hours = Math.floor(seconds / 3600);
   const minutes = Math.floor((seconds % 3600) / 60);
   const remainingSeconds = seconds % 60;

   if (hours > 0) return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
   if (minutes > 0) return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
   return String(remainingSeconds).padStart(2, '0');
}
