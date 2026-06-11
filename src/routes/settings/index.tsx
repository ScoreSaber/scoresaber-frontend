import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/settings/')({
   loader: () => {
      throw redirect({ to: '/settings/account' });
   },
   component: SettingsRoute
});

function SettingsRoute() {
   return null;
}
