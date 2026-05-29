import { createFileRoute } from '@tanstack/react-router';

import PrivacyPolicyPage from '@/modules/legal/privacy-policy-page';

export const Route = createFileRoute('/legal/privacy')({
   head: () => ({
      meta: [
         { title: 'Privacy Policy | ScoreSaber!' },
         {
            name: 'description',
            content: 'Read the ScoreSaber privacy policy'
         }
      ]
   }),
   component: PrivacyPolicyPage
});
