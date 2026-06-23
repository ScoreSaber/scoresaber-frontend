import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/live/$tournamentId/')({
   loader: ({ params }) => {
      throw redirect({ to: '/live/$tournamentId/settings', params });
   },
   component: LiveTournamentIndexRoute
});

function LiveTournamentIndexRoute() {
   return null;
}
