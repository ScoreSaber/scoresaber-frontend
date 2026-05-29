import { createFileRoute, getRouteApi, redirect } from '@tanstack/react-router';

const settingsAccountRoute = getRouteApi('/settings/account');

export const Route = createFileRoute('/settings/')({
   loader: () => {
      throw redirect({ to: settingsAccountRoute.id });
   },
   component: SettingsRoute
});

function SettingsRoute() {
   return null;
}
