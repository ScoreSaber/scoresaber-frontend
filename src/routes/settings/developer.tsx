import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';

import { DeveloperSection } from '@/modules/settings/sections/developer-section';
import { SettingsShell } from '@/modules/settings/settings-shell';
import { api } from '@/shared/api/server-api';
import { optionalApi } from '@/shared/result/api';
import { buildNoindexHead } from '@/shared/seo/metadata';
import { SetPageBackground } from '@/shell/background/page-background-provider';

const getDeveloperSettingsData = createServerFn({ method: 'GET' }).handler(async () => {
   const clients = await optionalApi(api.oAuth.oAuthClientControllerListClients({ cache: 'no-store' }).then((r) => r.data.clients));

   return { clients };
});

export const Route = createFileRoute('/settings/developer')({
   loader: () => getDeveloperSettingsData(),
   head: () => buildNoindexHead('Developer Settings', 'Manage your ScoreSaber OAuth applications', '/settings/developer'),
   component: SettingsDeveloperRoute
});

function SettingsDeveloperRoute() {
   const data = Route.useLoaderData();

   return (
      <>
         <SetPageBackground src="/images/banner.jpg" />
         <SettingsShell activeTab="developer">
            <DeveloperSection clients={data.clients} />
         </SettingsShell>
      </>
   );
}
