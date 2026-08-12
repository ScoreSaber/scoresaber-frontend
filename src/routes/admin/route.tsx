import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import { checkAdminAccess } from '@/modules/admin/actions/admin';
import { AdminShell } from '@/modules/admin/admin-shell';
import { PageError } from '@/shared/components/error/page-error';
import { buildNoindexHead } from '@/shared/seo/metadata';

export const Route = createFileRoute('/admin')({
   loader: async ({ location }) => {
      const access = await checkAdminAccess();
      if (access.status === 'unauthenticated') {
         throw redirect({ to: '/login', search: { redirectTo: location.href } });
      }
      return access;
   },
   head: () => buildNoindexHead('Administration', 'ScoreSaber administration', '/admin'),
   component: AdminRoute
});

function AdminRoute() {
   const access = Route.useLoaderData();
   if (access.status !== 'authorised') return <PageError status={403} />;

   return (
      <AdminShell>
         <Outlet />
      </AdminShell>
   );
}
