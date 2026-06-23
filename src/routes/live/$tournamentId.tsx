import { Outlet, createFileRoute } from '@tanstack/react-router';

import { buildNoindexHead } from '@/shared/seo/metadata';

export const Route = createFileRoute('/live/$tournamentId')({
   head: ({ params }) => buildNoindexHead('Live Platform', `Operate live tournament ${params.tournamentId}`, `/live/${params.tournamentId}`),
   component: Outlet
});
