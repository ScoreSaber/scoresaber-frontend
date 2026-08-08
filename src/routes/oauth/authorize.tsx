import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute, getRouteApi, linkOptions, useRouter } from '@tanstack/react-router';
import { Result } from 'better-result';
import { AppWindow, Check, Loader2, LogIn, TriangleAlert, X } from 'lucide-react';
import { useTranslations } from 'use-intl';
import { z } from 'zod';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { useAuth } from '@/modules/auth';
import { approveAuthorization, getAuthorizeInfo, type AuthorizeRequest } from '@/modules/auth/actions/oauth';
import { unwrapAction } from '@/shared/result/action';
import { buildNoindexHead } from '@/shared/seo/metadata';
import { optionalSearchParamString } from '@/shared/url-state/params';
import { getRouteHref } from '@/shared/url-state/route-location';
import { SetPageBackground } from '@/shell/background/page-background-provider';

const loginRoute = getRouteApi('/login');

const authorizeSearchSchema = z.object({
   client_id: optionalSearchParamString,
   redirect_uri: optionalSearchParamString,
   scope: optionalSearchParamString,
   state: optionalSearchParamString,
   code_challenge: optionalSearchParamString,
   code_challenge_method: optionalSearchParamString
});

export const Route = createFileRoute('/oauth/authorize')({
   validateSearch: (search) => authorizeSearchSchema.parse(search),
   head: () =>
      buildNoindexHead('Authorize Application', 'Authorize an application to access your ScoreSaber account', getRouteApi('/oauth/authorize').id),
   component: OAuthAuthorizeRoute
});

function parseAuthorizeRequest(search: ReturnType<typeof authorizeSearchSchema.parse>): AuthorizeRequest | null {
   if (!search.client_id || !search.redirect_uri || !search.code_challenge || search.code_challenge_method !== 'S256') {
      return null;
   }

   return {
      client_id: search.client_id,
      redirect_uri: search.redirect_uri,
      scope: search.scope,
      code_challenge: search.code_challenge,
      code_challenge_method: 'S256'
   };
}

function OAuthAuthorizeRoute() {
   return (
      <>
         <SetPageBackground src="/images/banner.jpg" />
         <div className="relative flex min-h-dvh flex-1 items-center justify-center overflow-hidden px-4 pt-10 pb-28">
            <div className="relative z-10 w-full max-w-md">
               <ConsentPanel />
            </div>
         </div>
      </>
   );
}

function ConsentPanel() {
   const t = useTranslations();
   const { user } = useAuth();
   const router = useRouter();
   const search = Route.useSearch();
   const request = parseAuthorizeRequest(search);

   if (!request) {
      return (
         <Alert variant="destructive">
            <TriangleAlert aria-hidden />
            <AlertTitle>{t('oauth.consent.invalidTitle')}</AlertTitle>
            <AlertDescription>{t('oauth.consent.invalidDescription')}</AlertDescription>
         </Alert>
      );
   }

   if (!user) {
      return (
         <Card className="bg-background/35 gap-4 rounded-lg py-5 shadow-none">
            <CardHeader className="px-5">
               <CardTitle className="text-base">{t('oauth.consent.loginTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-start gap-3 px-5">
               <p className="text-muted-foreground text-sm text-pretty">{t('oauth.consent.loginDescription')}</p>
               <Button asChild className="cursor-pointer">
                  <loginRoute.Link search={{ redirectTo: getRouteHref(router, linkOptions({ to: '/oauth/authorize', search })) }}>
                     <LogIn data-icon="inline-start" />
                     {t('sidebar.logIn')}
                  </loginRoute.Link>
               </Button>
            </CardContent>
         </Card>
      );
   }

   return <ConsentCard request={request} state={search.state} />;
}

function ConsentCard({ request, state }: { request: AuthorizeRequest; state?: string }) {
   const t = useTranslations();
   const router = useRouter();

   const infoQuery = useQuery({
      queryKey: ['oauth-authorize-info', request],
      queryFn: async () => unwrapAction(await getAuthorizeInfo(request)),
      retry: false,
      staleTime: 60 * 1000
   });

   const approveMutation = useMutation({
      mutationFn: async () => unwrapAction(await approveAuthorization({ ...request, state })),
      onSuccess: ({ redirectUrl }) => window.location.assign(redirectUrl)
   });

   const deny = () => {
      const urlResult = Result.try(() => new URL(request.redirect_uri));

      if (Result.isOk(urlResult)) {
         const url = urlResult.value;
         url.searchParams.set('error', 'access_denied');
         if (state) {
            url.searchParams.set('state', state);
         }
         window.location.assign(url.toString());
         return;
      }

      window.location.assign(getRouteHref(router, linkOptions({ to: '/' })));
   };

   if (infoQuery.isPending) {
      return (
         <div className="flex justify-center py-12">
            <Loader2 className="text-muted-foreground size-6 animate-spin" aria-hidden />
         </div>
      );
   }

   if (infoQuery.isError) {
      return (
         <Alert variant="destructive">
            <TriangleAlert aria-hidden />
            <AlertTitle>{t('oauth.consent.invalidTitle')}</AlertTitle>
            <AlertDescription>{infoQuery.error.message || t('oauth.consent.invalidDescription')}</AlertDescription>
         </Alert>
      );
   }

   const info = infoQuery.data;

   return (
      <Card className="bg-background/35 gap-4 rounded-lg py-5 shadow-none">
         <CardHeader className="px-5">
            <div className="flex items-center gap-3">
               <span className="border-border/60 bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-full border">
                  <AppWindow className="size-5" aria-hidden />
               </span>
               <CardTitle className="text-base">{t('oauth.consent.title', { app: info.name })}</CardTitle>
            </div>
         </CardHeader>
         <CardContent className="flex flex-col gap-3 px-5">
            {info.description && <p className="text-muted-foreground text-sm text-pretty">{info.description}</p>}
            <p className="text-sm font-medium">{t('oauth.consent.scopesIntro')}</p>
            <ul className="flex flex-col gap-1.5">
               {info.scopes.map((scope) => (
                  <li key={scope} className="text-muted-foreground flex items-center gap-2 text-sm">
                     <Check className="text-primary size-4 shrink-0" aria-hidden />
                     {scope === 'identity'
                        ? t('oauth.consent.scopeIdentity')
                        : scope === 'identity.providers'
                          ? t('oauth.consent.scopeIdentityProviders')
                          : scope}
                  </li>
               ))}
            </ul>
            {approveMutation.isError && (
               <Alert variant="destructive">
                  <TriangleAlert aria-hidden />
                  <AlertTitle>{t('oauth.consent.approveFailed')}</AlertTitle>
                  <AlertDescription>{approveMutation.error.message}</AlertDescription>
               </Alert>
            )}
         </CardContent>
         <CardFooter className="flex justify-end gap-2 px-5">
            <Button type="button" variant="secondary" disabled={approveMutation.isPending} onClick={deny} className="cursor-pointer">
               <X data-icon="inline-start" />
               {t('oauth.consent.deny')}
            </Button>
            <Button type="button" disabled={approveMutation.isPending} onClick={() => approveMutation.mutate()} className="cursor-pointer">
               {approveMutation.isPending ? <Loader2 data-icon="inline-start" className="animate-spin" /> : <Check data-icon="inline-start" />}
               {t('oauth.consent.approve')}
            </Button>
         </CardFooter>
      </Card>
   );
}
