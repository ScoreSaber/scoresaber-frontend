import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';

import { AccountSection } from '@/modules/settings/sections/account-section';
import { SettingsShell } from '@/modules/settings/settings-shell';
import { api } from '@/shared/api/server-api';
import { optionalApi } from '@/shared/result/api';
import { SetPageBackground } from '@/shell/background/page-background-provider';

const getAccountSettingsData = createServerFn({ method: 'GET' }).handler(async () => {
   const [countryReset, connections] = await Promise.all([
      optionalApi(api.user.userControllerCanResetCountry().then((r) => r.data)),
      optionalApi(api.user.userControllerGetConnections().then((r) => r.data))
   ]);

   return {
      countryReset,
      patreonConnected: connections?.some((connection) => connection.provider === 'PATREON' && connection.state === 'CONNECTED') ?? false
   };
});

export const Route = createFileRoute('/settings/account')({
   loader: () => getAccountSettingsData(),
   head: () => ({
      meta: [{ title: 'Account | ScoreSaber!' }, { name: 'description', content: 'Manage your ScoreSaber settings' }]
   }),
   component: SettingsAccountRoute
});

function SettingsAccountRoute() {
   const data = Route.useLoaderData();

   return (
      <>
         <SetPageBackground src="/images/banner.jpg" />
         <SettingsShell activeTab="account">
            <AccountSection countryReset={data.countryReset} patreonConnected={data.patreonConnected} />
         </SettingsShell>
      </>
   );
}
