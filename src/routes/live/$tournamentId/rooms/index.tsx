import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';

import { LiveRoomsPanel } from '@/modules/live/components/live-rooms-panel';
import { LiveShell } from '@/modules/live/live-shell';
import { api } from '@/shared/api/server-api';
import { PageError } from '@/shared/components/error/page-error';
import { optionalApiData } from '@/shared/result/api';
import { buildNoindexHead } from '@/shared/seo/metadata';
import { SetPageBackground } from '@/shell/background/page-background-provider';

const getLiveRoomsData = createServerFn({ method: 'GET' })
   .inputValidator((data: { tournamentId: string }) => data)
   .handler(async ({ data }) => {
      const tournamentId = data.tournamentId;
      return optionalApiData(api.livePlatform.liveMatchRoomControllerGetRoomsView({ tournamentId }));
   });

export const Route = createFileRoute('/live/$tournamentId/rooms/')({
   loader: ({ params }) => getLiveRoomsData({ data: { tournamentId: params.tournamentId } }),
   head: ({ params }) => buildNoindexHead('Live Rooms', `Manage live rooms for ${params.tournamentId}`, `/live/${params.tournamentId}/rooms`),
   component: LiveTournamentRoomsRoute
});

function LiveTournamentRoomsRoute() {
   const { tournamentId } = Route.useParams();
   const data = Route.useLoaderData();

   return (
      <>
         <SetPageBackground src="/images/banner.jpg" />
         {data ? (
            <LiveShell tournamentId={tournamentId} title={data.settings.name ?? tournamentId} activeTab="rooms">
               <LiveRoomsPanel
                  tournamentId={tournamentId}
                  access={data.access}
                  rooms={data.rooms}
                  authorizedPlayers={data.authorizedPlayers}
                  teams={data.teams}
                  options={data.options}
                  liveConnectionUrl={data.settings.liveConnectionUrl}
               />
            </LiveShell>
         ) : (
            <div className="relative z-10 w-full px-4 py-4 md:px-8 md:py-8">
               <PageError status={403} />
            </div>
         )}
      </>
   );
}
