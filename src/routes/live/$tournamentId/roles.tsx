import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';

import { LiveRolesPanel } from '@/modules/live/components/live-roles-panel';
import { LiveShell } from '@/modules/live/live-shell';
import { api } from '@/shared/api/server-api';
import { PageError } from '@/shared/components/error/page-error';
import { optionalApiData } from '@/shared/result/api';
import { buildNoindexHead } from '@/shared/seo/metadata';
import { SetPageBackground } from '@/shell/background/page-background-provider';

const getLiveRolesData = createServerFn({ method: 'GET' })
   .inputValidator((data: { tournamentId: string }) => data)
   .handler(async ({ data }) => {
      const tournamentId = data.tournamentId;
      const [settings, roles, authorizedPlayers, options] = await Promise.all([
         optionalApiData(api.livePlatform.liveTournamentControllerGetSettings({ tournamentId })),
         optionalApiData(api.livePlatform.liveTournamentRosterControllerListRoles({ tournamentId })),
         optionalApiData(api.livePlatform.liveTournamentRosterControllerListAuthorizedPlayers({ tournamentId })),
         optionalApiData(api.livePlatform.liveTournamentControllerGetWorkflowOptions())
      ]);

      return {
         settings,
         roles: roles ?? [],
         authorizedPlayers: authorizedPlayers ?? [],
         options
      };
   });

export const Route = createFileRoute('/live/$tournamentId/roles')({
   loader: ({ params }) => getLiveRolesData({ data: { tournamentId: params.tournamentId } }),
   head: ({ params }) => buildNoindexHead('Live Roles', `Manage live roles for ${params.tournamentId}`, `/live/${params.tournamentId}/roles`),
   component: LiveTournamentRolesRoute
});

function LiveTournamentRolesRoute() {
   const { tournamentId } = Route.useParams();
   const data = Route.useLoaderData();

   return (
      <>
         <SetPageBackground src="/images/banner.jpg" />
         {data.settings && data.options ? (
            <LiveShell tournamentId={tournamentId} title={data.settings.name ?? tournamentId} activeTab="roles">
               <LiveRolesPanel tournamentId={tournamentId} roles={data.roles} authorizedPlayers={data.authorizedPlayers} options={data.options} />
            </LiveShell>
         ) : (
            <div className="relative z-10 w-full px-4 py-4 md:px-8 md:py-8">
               <PageError status={403} />
            </div>
         )}
      </>
   );
}
