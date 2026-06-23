import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';

import { LiveSettingsPanel } from '@/modules/live/components/live-settings-panel';
import { LiveShell } from '@/modules/live/live-shell';
import { api } from '@/shared/api/server-api';
import { PageError } from '@/shared/components/error/page-error';
import { optionalApiData } from '@/shared/result/api';
import { buildNoindexHead } from '@/shared/seo/metadata';
import { SetPageBackground } from '@/shell/background/page-background-provider';

const getLiveSettingsData = createServerFn({ method: 'GET' })
   .inputValidator((data: { tournamentId: string }) => data)
   .handler(async ({ data }) => {
      const [settings, options] = await Promise.all([
         optionalApiData(api.livePlatform.liveTournamentControllerGetSettings({ tournamentId: data.tournamentId })),
         optionalApiData(api.livePlatform.liveTournamentControllerGetWorkflowOptions())
      ]);

      return { settings, options };
   });

export const Route = createFileRoute('/live/$tournamentId/settings')({
   loader: ({ params }) => getLiveSettingsData({ data: { tournamentId: params.tournamentId } }),
   head: ({ params }) =>
      buildNoindexHead('Live Settings', `Configure live tournament ${params.tournamentId}`, `/live/${params.tournamentId}/settings`),
   component: LiveTournamentSettingsRoute
});

function LiveTournamentSettingsRoute() {
   const { tournamentId } = Route.useParams();
   const data = Route.useLoaderData();

   return (
      <>
         <SetPageBackground src="/images/banner.jpg" />
         {data.settings && data.options ? (
            <LiveShell tournamentId={tournamentId} title={data.settings.name ?? tournamentId} activeTab="settings">
               <LiveSettingsPanel tournamentId={tournamentId} settings={data.settings} options={data.options} />
            </LiveShell>
         ) : (
            <div className="relative z-10 w-full px-4 py-4 md:px-8 md:py-8">
               <PageError status={403} />
            </div>
         )}
      </>
   );
}
