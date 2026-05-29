import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';

import { PerksAccessGate } from '@/modules/settings/perks-access-gate';
import { PerksSubNav } from '@/modules/settings/perks-sub-nav';
import { SettingsShell } from '@/modules/settings/settings-shell';
import { api } from '@/shared/api/server-api';
import { UnderConstruction } from '@/shared/components/under-construction';
import { optionalApi } from '@/shared/result/api';
import { SetPageBackground } from '@/shell/background/page-background-provider';

const getPerksOverviewData = createServerFn({ method: 'GET' }).handler(async () => {
   const connections = await optionalApi(api.user.userControllerGetConnections().then((r) => r.data));

   return {
      patreonConnected: connections?.some((connection) => connection.provider === 'PATREON' && connection.state === 'CONNECTED') ?? false
   };
});

export const Route = createFileRoute('/settings/perks/')({
   loader: () => getPerksOverviewData(),
   head: () => ({
      meta: [{ title: 'Perks | ScoreSaber!' }, { name: 'description', content: 'Manage your ScoreSaber settings' }]
   }),
   component: SettingsPerksIndexRoute
});

function SettingsPerksIndexRoute() {
   const data = Route.useLoaderData();

   return (
      <>
         <SetPageBackground src="/images/banner.jpg" />
         <SettingsShell activeTab="perks">
            <PerksAccessGate patreonConnected={data.patreonConnected}>
               <PerksSubNav activeSubTab="overview">
                  <UnderConstruction />
               </PerksSubNav>
            </PerksAccessGate>
         </SettingsShell>
      </>
   );
}
