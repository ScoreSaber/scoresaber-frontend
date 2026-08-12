import { createFileRoute } from '@tanstack/react-router';

import { getAdminBadges } from '@/modules/admin/actions/admin';
import { BadgeCatalogue } from '@/modules/admin/badge-catalogue';
import { PageError } from '@/shared/components/error/page-error';

export const Route = createFileRoute('/admin/badges')({
   loader: () => getAdminBadges(),
   component: AdminBadgesRoute
});

function AdminBadgesRoute() {
   const result = Route.useLoaderData();
   if (!result.ok) return <PageError status={null} />;
   return <BadgeCatalogue initialBadges={result.value} />;
}
