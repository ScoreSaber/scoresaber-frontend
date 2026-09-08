import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { LoginScreen } from '@/modules/auth/login/login-screen';
import { buildNoindexHead } from '@/shared/seo/metadata';
import { optionalSearchParamEnum, optionalSearchParamString } from '@/shared/url-state/params';
import { SetPageBackground } from '@/shell/background/page-background-provider';

const loginSearchSchema = z.object({
   steam: optionalSearchParamEnum(['failed']),
   patreon: optionalSearchParamEnum(['failed']),
   discord: optionalSearchParamEnum(['failed']),
   mode: optionalSearchParamEnum(['password-reset', 'signup']),
   redirectTo: optionalSearchParamString
});

export const Route = createFileRoute('/login')({
   validateSearch: (search) => loginSearchSchema.parse(search),
   head: () => buildNoindexHead('Log In', 'Log in to manage your ScoreSaber account', '/login'),
   component: LoginRoute
});

function LoginRoute() {
   return (
      <>
         <SetPageBackground src="/images/banner.jpg" />
         <LoginScreen params={Route.useSearch()} />
      </>
   );
}
