import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';

import { PerksAccessGate } from '@/modules/settings/perks-access-gate';
import { PerksSubNav } from '@/modules/settings/perks-sub-nav';
import { VanitySection } from '@/modules/settings/sections/vanity-section';
import { SettingsShell } from '@/modules/settings/settings-shell';
import { api } from '@/shared/api/server-api';
import { optionalApi } from '@/shared/result/api';
import { buildNoindexHead } from '@/shared/seo/metadata';
import { SetPageBackground } from '@/shell/background/page-background-provider';

const getPerksOverviewData = createServerFn({ method: 'GET' }).handler(async () => {
   const [connections, vanity] = await Promise.all([
      optionalApi(api.user.userControllerGetConnections().then((r) => r.data)),
      optionalApi(api.user.userControllerGetVanity({ cache: 'no-store' }).then((r) => r.data))
   ]);

   return {
      vanity,
      patreonConnected: connections?.some((connection) => connection.provider === 'PATREON' && connection.state === 'CONNECTED') ?? false
   };
});

export const Route = createFileRoute('/settings/perks/')({
   loader: () => getPerksOverviewData(),
   head: () => buildNoindexHead('Perks Settings', 'Manage your ScoreSaber supporter perks', '/settings/perks'),
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
                  <VanitySection vanity={data.vanity} />
               </PerksSubNav>
            </PerksAccessGate>
         </SettingsShell>
      </>
   );
}
