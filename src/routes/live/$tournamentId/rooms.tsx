import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/live/$tournamentId/rooms')({
   component: Outlet
});
