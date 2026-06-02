'use client';

import { useQueryClient } from '@tanstack/react-query';
import { getRouteApi, useRouter } from '@tanstack/react-router';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useActionMutation } from '@/hooks/use-action-mutation';
import { useAuth } from '@/modules/auth';
import { redeemScoreSaber2Badge } from '@/modules/settings/actions/perks';
import { scoreSaber2Badge } from '@/modules/settings/perks/score-saber-2-badge';
import { FadeInImage } from '@/shared/components/fade-in-image';
import { writeStorageValue } from '@/shared/result/storage';

const playerRoute = getRouteApi('/u/$playerId');

export function ScoreSaber2BadgeRedeemer({ compact = false }: { compact?: boolean }) {
   const t = useTranslations();
   const router = useRouter();
   const queryClient = useQueryClient();
   const { user } = useAuth();
   const mutation = useActionMutation();
   const isPending = mutation.isPending;

   function redeem() {
      mutation.run(
         () => redeemScoreSaber2Badge(),
         t('settings.perks.scoreSaber2Badge.redeemedToast'),
         t('settings.perks.scoreSaber2Badge.redeemFailedToast'),
         () => {
            writeStorageValue(scoreSaber2Badge.dismissedStorageKey, 'true');
            queryClient.invalidateQueries({ queryKey: ['score-saber-2-badge-player', user?.id] });
            if (user) {
               void router.navigate({ to: playerRoute.id, params: { playerId: user.id }, search: { page: 1, sort: 'top' } });
            }
         }
      );
   }

   const action = (
      <Button className={compact ? 'h-[30px] cursor-pointer px-3' : 'cursor-pointer'} onClick={redeem} disabled={!user || isPending}>
         {isPending ? t('settings.perks.scoreSaber2Badge.redeemingAction') : t('settings.perks.scoreSaber2Badge.redeemAction')}
      </Button>
   );

   if (compact) {
      return action;
   }

   return (
      <Card className="bg-background/35 rounded-lg shadow-none">
         <CardHeader className="gap-4 px-5">
            <div className="flex min-w-0 items-center gap-3">
               <FadeInImage
                  src={scoreSaber2Badge.imageUrl}
                  alt=""
                  width={scoreSaber2Badge.width}
                  height={scoreSaber2Badge.height}
                  className="rounded-sm"
                  style={{ width: scoreSaber2Badge.width, height: scoreSaber2Badge.height, objectFit: 'contain' }}
                  unoptimized
               />
               <div className="min-w-0">
                  <CardTitle className="text-xl">{t('settings.perks.scoreSaber2Badge.title')}</CardTitle>
                  <p className="text-muted-foreground mt-1 text-sm">{t('settings.perks.scoreSaber2Badge.description')}</p>
               </div>
            </div>
         </CardHeader>
         <CardContent className="px-5">{action}</CardContent>
      </Card>
   );
}
