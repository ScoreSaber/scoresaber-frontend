import { createFileRoute } from '@tanstack/react-router';

import CookiesPolicyPage from '@/modules/legal/cookies-policy-page';

export const Route = createFileRoute('/legal/cookies-policy')({
   head: () => ({
      meta: [
         { title: 'Cookies Policy | ScoreSaber!' },
         {
            name: 'description',
            content: 'Read the ScoreSaber cookies policy'
         }
      ]
   }),
   component: CookiesPolicyPage
});
