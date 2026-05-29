'use client';

import { TriangleAlert } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { getSiteOriginUrl, getSiteUrl, safeSitePath } from '@/modules/auth/lib/redirect';
import { LoginFlow } from '@/modules/auth/login/login-flow';
import { stringifyUrlSearch } from '@/shared/url-state/search-serializer';

const loginOAuthProviders = ['steam', 'patreon', 'discord'] as const;

type LoginSearchParams = {
   steam?: 'failed';
   patreon?: 'failed';
   discord?: 'failed';
   redirectTo?: string;
};

export function LoginScreen({ params }: { params: LoginSearchParams }) {
   const t = useTranslations();
   const failedProvider = loginOAuthProviders.find((provider) => params[provider] === 'failed') ?? null;
   const redirectTo = safeSitePath(params.redirectTo, '/');
   const absoluteRedirectTo = getSiteUrl(redirectTo);

   return (
      <div className="relative flex min-h-dvh flex-1 items-center justify-center overflow-hidden px-4 pt-10 pb-28">
         <section className="relative z-10 flex w-full max-w-xl flex-col items-center gap-6 text-center">
            <div className="flex flex-col gap-2">
               <h1 className="text-2xl font-semibold text-balance">
                  {t('login.titlePrefix')}{' '}
                  <span className="font-pixel font-medium tracking-widest whitespace-nowrap [-webkit-text-stroke:0.8px_currentColor]">
                     {t('login.titleBrand')}
                  </span>
               </h1>
            </div>

            {failedProvider && (
               <Alert variant="destructive" className="max-w-sm text-left">
                  <TriangleAlert aria-hidden />
                  <AlertTitle>
                     {t('login.oauth.failedTitle', {
                        provider:
                           failedProvider === 'steam'
                              ? t('login.providers.STEAM.label')
                              : failedProvider === 'patreon'
                                ? t('login.providers.PATREON.label')
                                : t('login.providers.DISCORD.label')
                     })}
                  </AlertTitle>
                  <AlertDescription>{t('login.oauth.failedDescription')}</AlertDescription>
               </Alert>
            )}

            <LoginFlow
               steamHref={`/auth/steam${stringifyUrlSearch({ returnUrl: getSiteOriginUrl(), redirectTo: absoluteRedirectTo })}`}
               patreonHref={`/auth/patreon${stringifyUrlSearch({ intent: 'login', redirectTo: absoluteRedirectTo })}`}
               discordHref={`/auth/discord${stringifyUrlSearch({ intent: 'login', redirectTo: absoluteRedirectTo })}`}
               redirectTo={redirectTo}
               labels={{
                  steam: t('login.providers.STEAM.label'),
                  meta: t('login.providers.OCULUS.label'),
                  patreon: t('login.providers.PATREON.label'),
                  discord: t('login.providers.DISCORD.label')
               }}
               steamTooltip={t('login.providers.STEAM.tooltip')}
               metaTooltip={t('login.providers.OCULUS.tooltip')}
               patreonTooltip={t('login.providers.PATREON.tooltip')}
               discordTooltip={t('login.providers.DISCORD.tooltip')}
               showOtherMethodsLabel={t('login.showOtherMethods')}
               hideOtherMethodsLabel={t('login.hideOtherMethods')}
               secondaryDescription={t('login.secondaryDescription')}
               backLabel={t('common.back')}
               metaTitle={t('login.email.title')}
            />
         </section>
      </div>
   );
}
