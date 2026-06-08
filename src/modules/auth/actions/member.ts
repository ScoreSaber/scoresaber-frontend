import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders, setCookie } from '@tanstack/react-start/server';

import { env } from '@/env';
import { getSiteAuthCookieDomain, siteAuthCookieMaxAge } from '@/modules/auth/lib/site-auth-cookie';
import { api } from '@/shared/api/server-api';
import { actionApiData, actionSuccess, type ActionResult } from '@/shared/result/action';
import { apiResult } from '@/shared/result/api';

const CLIENT_IP_HEADER = 'x-scoresaber-client-ip';
const CLIENT_COUNTRY_HEADER = 'x-scoresaber-client-country';
const CLIENT_USER_AGENT_HEADER = 'x-scoresaber-client-user-agent';

type EmailLoginVerificationActionValue =
   | { status: 'authenticated'; playerId: string }
   | { status: 'pending-game-auth' }
   | { status: 'support-required' };

type AuthCookieOptions = {
   httpOnly: boolean;
   sameSite: 'lax';
   secure: boolean;
   path: string;
   maxAge: number;
   domain?: string;
};

const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
   // don't care if this fails, still clear cookie
   await apiResult(api.auth.authControllerLogout());

   setCookie('token', '', { ...getAuthCookieOptions(), maxAge: 0 });
});

export async function logout() {
   return logoutFn();
}

const startEmailLoginFn = createServerFn({ method: 'POST' })
   .inputValidator((email: string) => email)
   .handler(async ({ data: email }) =>
      actionApiData(
         api.auth.authControllerStartEmailLogin(
            { email },
            {
               cache: 'no-store',
               headers: getEmailLoginHeaders()
            }
         )
      )
   );

export async function startEmailLogin(email: string) {
   return startEmailLoginFn({ data: email });
}

const verifyEmailLoginFn = createServerFn({ method: 'POST' })
   .inputValidator((data: { challengeId: string; code: string }) => data)
   .handler(async ({ data }): Promise<ActionResult<EmailLoginVerificationActionValue>> => {
      const result = await actionApiData(
         api.auth.authControllerVerifyEmailLogin(
            { challengeId: data.challengeId, code: data.code },
            {
               cache: 'no-store',
               headers: getEmailLoginHeaders()
            }
         )
      );

      if (result.ok && result.value.status === 'authenticated') {
         setCookie('token', result.value.token, getAuthCookieOptions());

         return actionSuccess({
            status: 'authenticated',
            playerId: result.value.playerId
         });
      }

      return result;
   });

export async function verifyEmailLogin(challengeId: string, code: string): Promise<ActionResult<EmailLoginVerificationActionValue>> {
   return verifyEmailLoginFn({ data: { challengeId, code } });
}

function getEmailLoginHeaders() {
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
   const domain = getSiteAuthCookieDomain(new URL(env.NEXT_PUBLIC_SITE_URL).hostname);

   return {
      httpOnly: true,
      sameSite: 'lax',
      secure: env.NODE_ENV === 'production',
      path: '/',
      maxAge: siteAuthCookieMaxAge,
      ...(domain ? { domain } : {})
   };
}
