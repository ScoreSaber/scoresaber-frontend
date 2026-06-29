import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

import { AccountSection } from '@/modules/settings/sections/account-section';
import { SecuritySection } from '@/modules/settings/sections/security-section';
import { SettingsShell } from '@/modules/settings/settings-shell';
import { api } from '@/shared/api/server-api';
import { optionalApi } from '@/shared/result/api';
import { buildNoindexHead } from '@/shared/seo/metadata';
import { validateRequest } from '@/shared/url-state/params';
import { SetPageBackground } from '@/shell/background/page-background-provider';

const accountSettingsSearchSchema = z.object({
   setupPassword: z.preprocess((val) => {
      const value = Array.isArray(val) ? val[0] : val;
      return value === 'true' ? true : value;
   }, z.literal(true).optional())
});

const getAccountSettingsData = createServerFn({ method: 'GET' }).handler(async () => {
   const [countryReset, connections, passkeys, credential, vanity] = await Promise.all([
      optionalApi(api.user.userControllerCanResetCountry().then((r) => r.data)),
      optionalApi(api.user.userControllerGetConnections().then((r) => r.data)),
      optionalApi(api.auth.passkeyControllerListPasskeys().then((r) => r.data.passkeys)),
      optionalApi(api.auth.passwordAuthControllerGetPasswordCredential().then((r) => r.data)),
      optionalApi(api.user.userControllerGetVanity({ cache: 'no-store' }).then((r) => r.data))
   ]);

   return {
      countryReset,
      passkeys,
      credential,
      vanity,
      patreonConnected: connections?.some((connection) => connection.provider === 'PATREON' && connection.state === 'CONNECTED') ?? false
   };
});

export const Route = createFileRoute('/settings/account')({
   validateSearch: (search) => validateRequest(accountSettingsSearchSchema, search),
   loader: () => getAccountSettingsData(),
   head: () => buildNoindexHead('Account Settings', 'Manage your ScoreSaber account settings', '/settings/account'),
   component: SettingsAccountRoute
});

function SettingsAccountRoute() {
   const data = Route.useLoaderData();
   const search = Route.useSearch();

   return (
      <>
         <SetPageBackground src="/images/banner.jpg" />
         <SettingsShell activeTab="account">
            <AccountSection
               countryReset={data.countryReset}
               vanity={data.vanity}
               patreonConnected={data.patreonConnected}
               beforeActions={<SecuritySection passkeys={data.passkeys} credential={data.credential} openPasswordSetup={search.setupPassword} />}
            />
         </SettingsShell>
      </>
   );
}
