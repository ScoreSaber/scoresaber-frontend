import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';

import { LiveTeamsPanel } from '@/modules/live/components/live-teams-panel';
import { LiveShell } from '@/modules/live/live-shell';
import { api } from '@/shared/api/server-api';
import { PageError } from '@/shared/components/error/page-error';
import { optionalApiData } from '@/shared/result/api';
import { buildNoindexHead } from '@/shared/seo/metadata';
import { SetPageBackground } from '@/shell/background/page-background-provider';

const getLiveTeamsData = createServerFn({ method: 'GET' })
   .inputValidator((data: { tournamentId: string }) => data)
   .handler(async ({ data }) => {
      const tournamentId = data.tournamentId;
      const [settings, teams] = await Promise.all([
         optionalApiData(api.livePlatform.liveTournamentControllerGetSettings({ tournamentId })),
         optionalApiData(api.livePlatform.liveTournamentRosterControllerListTeams({ tournamentId }))
      ]);

      return { settings, teams: teams ?? [] };
   });

export const Route = createFileRoute('/live/$tournamentId/teams')({
   loader: ({ params }) => getLiveTeamsData({ data: { tournamentId: params.tournamentId } }),
   head: ({ params }) => buildNoindexHead('Live Teams', `Manage live teams for ${params.tournamentId}`, `/live/${params.tournamentId}/teams`),
   component: LiveTournamentTeamsRoute
});

function LiveTournamentTeamsRoute() {
   const { tournamentId } = Route.useParams();
   const data = Route.useLoaderData();

   return (
      <>
         <SetPageBackground src="/images/banner.jpg" />
         {data.settings ? (
            <LiveShell tournamentId={tournamentId} title={data.settings.name ?? tournamentId} activeTab="teams">
               <LiveTeamsPanel tournamentId={tournamentId} teams={data.teams} />
            </LiveShell>
         ) : (
            <div className="relative z-10 w-full px-4 py-4 md:px-8 md:py-8">
               <PageError status={403} />
            </div>
         )}
      </>
   );
}
