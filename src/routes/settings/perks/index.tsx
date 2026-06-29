import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/settings/perks/')({
   loader: () => {
      throw redirect({ to: '/settings/perks/replays' });
   },
   component: SettingsPerksIndexRoute
});

function SettingsPerksIndexRoute() {
   return null;
}
