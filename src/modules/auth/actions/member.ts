import { createServerFn } from '@tanstack/react-start';

import { clearAuthCookie, setAuthCookie } from '@/modules/auth/actions/session.server';
import { getClientRequestHeaders } from '@/shared/api/client-request.server';
import { api } from '@/shared/api/server-api';
import { actionApiData, actionSuccess, type ActionResult } from '@/shared/result/action';
import { apiResult } from '@/shared/result/api';

type EmailLoginVerificationActionValue =
   | { status: 'authenticated'; playerId: string }
   | { status: 'pending-game-auth' }
   | { status: 'support-required' };

const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
   // don't care if this fails, still clear cookie
   await apiResult(api.auth.authControllerLogout());

   clearAuthCookie();
});

export async function logout() {
   return logoutFn();
}

const startEmailLoginFn = createServerFn({ method: 'POST' })
   .validator((email: string) => email)
   .handler(async ({ data: email }) =>
      actionApiData(
         api.auth.authControllerStartEmailLogin(
            { email },
            {
               cache: 'no-store',
               headers: getClientRequestHeaders()
            }
         )
      )
   );

export async function startEmailLogin(email: string) {
   return startEmailLoginFn({ data: email });
}

const verifyEmailLoginFn = createServerFn({ method: 'POST' })
   .validator((data: { challengeId: string; code: string }) => data)
   .handler(async ({ data }): Promise<ActionResult<EmailLoginVerificationActionValue>> => {
      const result = await actionApiData(
         api.auth.authControllerVerifyEmailLogin(
            { challengeId: data.challengeId, code: data.code },
            {
               cache: 'no-store',
               headers: getClientRequestHeaders()
            }
         )
      );

      if (result.ok && result.value.status === 'authenticated') {
         setAuthCookie(result.value.token);

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
