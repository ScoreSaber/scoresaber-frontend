import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { CircleCheck, TriangleAlert } from 'lucide-react';
import { useTranslations } from 'use-intl';
import { z } from 'zod';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { ConnectionsSection } from '@/modules/settings/sections/connections-section';
import { SettingsShell } from '@/modules/settings/settings-shell';
import { api } from '@/shared/api/server-api';
import { optionalApi } from '@/shared/result/api';
import { validateRequest } from '@/shared/url-state/params';
import { SetPageBackground } from '@/shell/background/page-background-provider';

const connectionOAuthProviders = ['patreon', 'discord'] as const;
type ConnectionOAuthProvider = (typeof connectionOAuthProviders)[number];
type SettingsConnectionsSearch = ReturnType<typeof settingsConnectionsSearchSchema.parse>;

const searchParamString = z.preprocess((val) => (Array.isArray(val) ? val[0] : val), z.string().optional());

function optionalSearchParamEnum<TValues extends readonly [string, ...string[]]>(values: TValues) {
   return z.preprocess((val) => (Array.isArray(val) ? val[0] : val), z.enum(values).optional().catch(undefined));
}

const settingsConnectionsSearchSchema = z.object({
   accountMergeChallengeId: searchParamString,
   steam: optionalSearchParamEnum(['failed']),
   patreon: optionalSearchParamEnum(['connected', 'failed']),
   discord: optionalSearchParamEnum(['connected', 'failed'])
});

const getConnectionsSettingsData = createServerFn({ method: 'GET' }).handler(async () => {
   return {
      connections: (await optionalApi(api.user.userControllerGetConnections().then((r) => r.data))) ?? []
   };
});

export const Route = createFileRoute('/settings/connections')({
   validateSearch: (search) => validateRequest(settingsConnectionsSearchSchema, search),
   loaderDeps: ({ search }) => search,
   loader: () => getConnectionsSettingsData(),
   head: () => ({
      meta: [{ title: 'Connections | ScoreSaber!' }, { name: 'description', content: 'Manage your ScoreSaber settings' }]
   }),
   component: SettingsConnectionsRoute
});

function SettingsConnectionsRoute() {
   const data = Route.useLoaderData();
   const params = Route.useSearch();
   const t = useTranslations();
   const initialMergeChallengeId = params.accountMergeChallengeId ?? null;
   const steamFailed = params.steam === 'failed';
   const oauthStatus = getOAuthStatus(params);

   return (
      <>
         <SetPageBackground src="/images/banner.jpg" />
         <SettingsShell activeTab="connections">
            {oauthStatus && (
               <Alert variant={oauthStatus.status === 'failed' ? 'destructive' : 'default'} className="mb-4">
                  {oauthStatus.status === 'failed' ? <TriangleAlert aria-hidden /> : <CircleCheck aria-hidden />}
                  <AlertTitle>
                     {oauthStatus.status === 'failed'
                        ? t('settings.connections.oauth.failedTitle', {
                             provider:
                                oauthStatus.provider === 'patreon'
                                   ? t('settings.connections.providers.PATREON.label')
                                   : t('settings.connections.providers.DISCORD.label')
                          })
                        : t('settings.connections.oauth.connectedTitle', {
                             provider:
                                oauthStatus.provider === 'patreon'
                                   ? t('settings.connections.providers.PATREON.label')
                                   : t('settings.connections.providers.DISCORD.label')
                          })}
                  </AlertTitle>
                  <AlertDescription>
                     {oauthStatus.status === 'failed'
                        ? t('settings.connections.oauth.failedDescription')
                        : t('settings.connections.oauth.connectedDescription')}
                  </AlertDescription>
               </Alert>
            )}
            <ConnectionsSection connections={data.connections} initialMergeChallengeId={initialMergeChallengeId} steamFailed={steamFailed} />
         </SettingsShell>
      </>
   );
}

function getOAuthStatus(params: SettingsConnectionsSearch): { provider: ConnectionOAuthProvider; status: 'connected' | 'failed' } | null {
   for (const provider of connectionOAuthProviders) {
      const status = params[provider];
      if (status === 'connected' || status === 'failed') {
         return { provider, status };
      }
   }

   return null;
}
