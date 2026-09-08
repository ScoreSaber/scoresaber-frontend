import { createFileRoute } from '@tanstack/react-router';

import { VersionCompatibility } from '@/modules/admin/version-compatibility';

export const Route = createFileRoute('/admin/versions')({
   component: VersionCompatibility
});
