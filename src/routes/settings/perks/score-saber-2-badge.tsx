import { createFileRoute, getRouteApi, redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';

import { PerksSubNav } from '@/modules/settings/perks-sub-nav';
import { canRedeemScoreSaber2Badge, hasScoreSaber2Badge } from '@/modules/settings/perks/score-saber-2-badge';
import { ScoreSaber2BadgeRedeemer } from '@/modules/settings/score-saber-2-badge-redeemer';
import { SettingsShell } from '@/modules/settings/settings-shell';
import { api } from '@/shared/api/server-api';
import { optionalApi, optionalApiData } from '@/shared/result/api';
import { toInt64PathParam } from '@/shared/url-state/params';
import { SetPageBackground } from '@/shell/background/page-background-provider';

const loginRoute = getRouteApi('/login');
const scoreSaber2BadgeRoute = getRouteApi('/settings/perks/score-saber-2-badge');
const settingsPerksRoute = getRouteApi('/settings/perks');

const getScoreSaber2BadgeDecision = createServerFn({ method: 'GET' }).handler(async () => {
   const user = await optionalApi(api.user.userControllerGetMe().then((r) => r.data));

   if (!user) {
      return { redirectTo: 'login' } as const;
   }

   if (!canRedeemScoreSaber2Badge(user.permissions)) {
      return { redirectTo: 'overview' } as const;
   }

   const player = await optionalApiData(api.player.playerControllerGetPlayer({ id: toInt64PathParam(user.id) }));
   if (hasScoreSaber2Badge(player)) {
      return { redirectTo: 'overview' } as const;
   }

   return { redirectTo: null };
});

export const Route = createFileRoute('/settings/perks/score-saber-2-badge')({
   loader: async () => {
      const decision = await getScoreSaber2BadgeDecision();

      if (decision.redirectTo === 'login') {
         throw redirect({ to: loginRoute.id, search: { redirectTo: scoreSaber2BadgeRoute.id } });
      }

      if (decision.redirectTo === 'overview') {
         throw redirect({ to: settingsPerksRoute.id });
      }
   },
   head: () => ({
      meta: [{ title: 'ScoreSaber 2 Badge | ScoreSaber!' }]
   }),
   component: SettingsPerksScoreSaber2BadgeRoute
});

function SettingsPerksScoreSaber2BadgeRoute() {
   return (
      <>
         <SetPageBackground src="/images/banner.jpg" />
         <SettingsShell activeTab="perks">
            <PerksSubNav activeSubTab="score-saber-2-badge">
               <ScoreSaber2BadgeRedeemer />
            </PerksSubNav>
         </SettingsShell>
      </>
   );
}
