import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { LoginScreen } from '@/modules/auth/login/login-screen';
import { buildNoindexHead } from '@/shared/seo/metadata';
import { SetPageBackground } from '@/shell/background/page-background-provider';

const searchParamString = z.preprocess((val) => (Array.isArray(val) ? val[0] : val), z.string().optional());

function optionalSearchParamEnum<TValues extends readonly [string, ...string[]]>(values: TValues) {
   return z.preprocess((val) => (Array.isArray(val) ? val[0] : val), z.enum(values).optional().catch(undefined));
}

const loginSearchSchema = z.object({
   steam: optionalSearchParamEnum(['failed']),
   patreon: optionalSearchParamEnum(['failed']),
   discord: optionalSearchParamEnum(['failed']),
   redirectTo: searchParamString
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
