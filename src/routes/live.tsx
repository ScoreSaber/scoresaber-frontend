import { Outlet, createFileRoute } from '@tanstack/react-router';

import { buildNoindexHead } from '@/shared/seo/metadata';

export const Route = createFileRoute('/live')({
   head: () => buildNoindexHead('Live Platform', 'Operate ScoreSaber live tournaments', '/live'),
   component: Outlet
});
