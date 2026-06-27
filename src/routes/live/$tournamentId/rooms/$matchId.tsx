import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';

import { LiveRoomManagementPage } from '@/modules/live/components/live-room-management-page';
import { api } from '@/shared/api/server-api';
import { PageError } from '@/shared/components/error/page-error';
import { optionalApiData } from '@/shared/result/api';
import { buildNoindexHead } from '@/shared/seo/metadata';
import { SetPageBackground } from '@/shell/background/page-background-provider';

const getLiveRoomData = createServerFn({ method: 'GET' })
   .inputValidator((data: { tournamentId: string; matchId: string }) => data)
   .handler(async ({ data }) => {
      const { tournamentId, matchId } = data;
      return optionalApiData(api.livePlatform.liveMatchRoomControllerGetRoomView({ tournamentId, matchId }));
   });

export const Route = createFileRoute('/live/$tournamentId/rooms/$matchId')({
   loader: ({ params }) => getLiveRoomData({ data: { tournamentId: params.tournamentId, matchId: params.matchId } }),
   head: ({ params }) => buildNoindexHead('Live Room', `Manage live room ${params.matchId}`, `/live/${params.tournamentId}/rooms/${params.matchId}`),
   component: LiveRoomRoute
});

function LiveRoomRoute() {
   const { tournamentId } = Route.useParams();
   const data = Route.useLoaderData();

   return (
      <>
         <SetPageBackground src="/images/banner.jpg" />
         {!data ? (
            <div className="relative z-10 w-full px-4 py-4 md:px-8 md:py-8">
               <PageError status={403} />
            </div>
         ) : (
            <LiveRoomManagementPage
               tournamentId={tournamentId}
               access={data.access}
               room={data.room}
               finalScores={data.finalScores}
               authorizedPlayers={data.authorizedPlayers}
               teams={data.teams}
               options={data.options}
               liveConnectionUrl={data.settings.liveConnectionUrl}
            />
         )}
      </>
   );
}
