import { createFileRoute } from '@tanstack/react-router';

import { SupportPage } from '@/modules/support/support-page';
import { buildSeoHead } from '@/shared/seo/metadata';

const SUPPORT_PRICING = {
   formatted: '$2',
   ppFarmerFormatted: '$5'
};

export const Route = createFileRoute('/support')({
   loader: () => SUPPORT_PRICING,
   head: () =>
      buildSeoHead({
         title: 'Support ScoreSaber',
         description: 'Support ScoreSaber on Patreon to fund development, infrastructure and replay storage for competitive Beat Saber',
         path: '/support'
      }),
   component: SupportPage
});
