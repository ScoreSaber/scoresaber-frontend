import { Result } from 'better-result';

import { env } from '@/env';

const authCookieMaxAge = 600;
const oauthIntentCookieName = 'scoresaber_oauth_intent';
const oauthRedirectCookieName = 'scoresaber_oauth_redirect_to';

function getSiteOrigin() {
   return new URL(env.NEXT_PUBLIC_SITE_URL).origin;
}

function getApiOrigin() {
   return new URL(env.NEXT_PUBLIC_API_URL).origin;
}

function getSiteUrl(path: string) {
   return new URL(path, env.NEXT_PUBLIC_SITE_URL).href;
}

function getSitePath(value: string) {
   const url = new URL(value, env.NEXT_PUBLIC_SITE_URL);
   return `${url.pathname}${url.search}${url.hash}`;
}

export function safeSiteRedirect(value: string | null | undefined, fallback: string) {
   if (!value) return fallback;

   return Result.unwrapOr(
      Result.try(() => {
         const url = new URL(value, env.NEXT_PUBLIC_SITE_URL);
         return url.origin === getSiteOrigin() ? url.href : fallback;
      }),
      fallback
   );
}

export function safeSitePath(value: string | null | undefined, fallback: string) {
   return getSitePath(safeSiteRedirect(value, getSiteUrl(fallback)));
}

export function getSiteOriginUrl() {
   return getSiteOrigin();
}

export function getApiOriginUrl() {
   return getApiOrigin();
}

export { authCookieMaxAge, getSiteUrl, oauthIntentCookieName, oauthRedirectCookieName };
