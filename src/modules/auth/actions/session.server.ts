import '@tanstack/react-start/server-only';

import { getRequestHeaders, setCookie } from '@tanstack/react-start/server';

import { env } from '@/env';
import { getSiteAuthCookieDomain, siteAuthCookieMaxAge } from '@/modules/auth/lib/site-auth-cookie';

const CLIENT_IP_HEADER = 'x-scoresaber-client-ip';
const CLIENT_COUNTRY_HEADER = 'x-scoresaber-client-country';
const CLIENT_USER_AGENT_HEADER = 'x-scoresaber-client-user-agent';

type AuthCookieOptions = {
   httpOnly: boolean;
   sameSite: 'lax';
   secure: boolean;
   path: string;
   maxAge: number;
   domain?: string;
};

export function setAuthCookie(token: string) {
   setCookie('token', token, getAuthCookieOptions());
}

export function clearAuthCookie() {
   setCookie('token', '', { ...getAuthCookieOptions(), maxAge: 0 });
}

export function getEmailLoginHeaders() {
   const requestHeaders = getRequestHeaders();
   const headers: Record<string, string> = {};
   const clientIp = getClientIp(requestHeaders);
   const clientCountry = getClientCountry(requestHeaders);
   const userAgent = requestHeaders.get('user-agent');

   if (clientIp) {
      headers[CLIENT_IP_HEADER] = clientIp;
   }

   if (clientCountry) {
      headers[CLIENT_COUNTRY_HEADER] = clientCountry;
   }

   if (userAgent) {
      headers[CLIENT_USER_AGENT_HEADER] = userAgent;
   }

   return headers;
}

function getClientIp(requestHeaders: Headers) {
   const forwardedFor = requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim();
   return requestHeaders.get('cf-connecting-ip') ?? requestHeaders.get('x-real-ip') ?? forwardedFor ?? null;
}

function getClientCountry(requestHeaders: Headers) {
   const country = requestHeaders.get('cf-ipcountry')?.trim().toUpperCase();
   return country && /^[A-Z]{2}$/.test(country) && country !== 'XX' ? country : null;
}

function getAuthCookieOptions(): AuthCookieOptions {
   const currentHost = getRequestHeaders().get('host')?.split(':')[0] ?? new URL(env.NEXT_PUBLIC_SITE_URL).hostname;
   const domain = getSiteAuthCookieDomain(currentHost);

   return {
      httpOnly: true,
      sameSite: 'lax',
      secure: env.NODE_ENV === 'production',
      path: '/',
      maxAge: siteAuthCookieMaxAge,
      ...(domain ? { domain } : {})
   };
}
