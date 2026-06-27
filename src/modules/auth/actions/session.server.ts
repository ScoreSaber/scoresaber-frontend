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
   clearHostAuthCookie();
   setCookie('token', token, getAuthCookieOptions());
}

export function clearAuthCookie() {
   clearHostAuthCookie();

   const options = getAuthCookieOptions();
   if (options.domain) {
      setCookie('token', '', { ...options, maxAge: 0 });
   }
}

export function readAuthCookie() {
   const token = getLastCookieValue(getRequestHeaders().get('cookie'), 'token');
   return token && token !== 'null' ? token : null;
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

function clearHostAuthCookie() {
   const options = getAuthCookieOptions();
   setCookie('token', '', {
      httpOnly: options.httpOnly,
      sameSite: options.sameSite,
      secure: options.secure,
      path: options.path,
      maxAge: 0
   });
}

function getLastCookieValue(header: string | null, name: string) {
   if (!header) return null;

   let value: string | null = null;
   for (const part of header.split(';')) {
      const [cookieName, ...cookieValueParts] = part.trim().split('=');
      if (cookieName !== name) continue;

      value = decodeCookieValue(cookieValueParts.join('='));
   }

   return value;
}

function decodeCookieValue(value: string) {
   try {
      return decodeURIComponent(value);
   } catch {
      return value;
   }
}
