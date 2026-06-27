import { createServerFn } from '@tanstack/react-start';

import { getEmailLoginHeaders, setAuthCookie } from '@/modules/auth/actions/session.server';
import type { PasswordAuthControllerGetPasswordCredentialResponse } from '@/shared/api/generated/ApiParams';
import { api } from '@/shared/api/server-api';
import { actionApiData, actionSuccess, type ActionResult } from '@/shared/result/action';

export type CredentialAuthActionValue = { status: 'authenticated'; playerId: string } | { status: 'support-required' };
export type PasswordCredentialSummary = PasswordAuthControllerGetPasswordCredentialResponse;

function requestOptions() {
   return { cache: 'no-store' as const, headers: getEmailLoginHeaders() };
}

function finishAuth(
   result: Awaited<ReturnType<typeof actionApiData<{ status: string; token?: string; playerId?: string }>>>
): ActionResult<CredentialAuthActionValue> {
   if (result.ok && result.value.status === 'authenticated' && result.value.token && result.value.playerId) {
      setAuthCookie(result.value.token);
      return actionSuccess({ status: 'authenticated', playerId: result.value.playerId });
   }

   return result as ActionResult<CredentialAuthActionValue>;
}

const startSignupFn = createServerFn({ method: 'POST' })
   .inputValidator((email: string) => email)
   .handler(({ data: email }) => actionApiData(api.auth.passwordAuthControllerStartSignup({ email }, requestOptions())));

export async function startSignup(email: string) {
   return startSignupFn({ data: email });
}

const completeSignupFn = createServerFn({ method: 'POST' })
   .inputValidator((data: { email: string; challengeId: string; code: string; password: string; displayName: string }) => data)
   .handler(async ({ data }) => finishAuth(await actionApiData(api.auth.passwordAuthControllerCompleteSignup(data, requestOptions()))));

export async function completeSignup(data: { email: string; challengeId: string; code: string; password: string; displayName: string }) {
   return completeSignupFn({ data });
}

const loginWithPasswordFn = createServerFn({ method: 'POST' })
   .inputValidator((data: { email: string; password: string }) => data)
   .handler(async ({ data }) => finishAuth(await actionApiData(api.auth.passwordAuthControllerLoginWithPassword(data, requestOptions()))));

export async function loginWithPassword(data: { email: string; password: string }) {
   return loginWithPasswordFn({ data });
}

const startPasswordResetFn = createServerFn({ method: 'POST' })
   .inputValidator((email: string) => email)
   .handler(({ data: email }) => actionApiData(api.auth.passwordAuthControllerStartPasswordReset({ email }, requestOptions())));

export async function startPasswordReset(email: string) {
   return startPasswordResetFn({ data: email });
}

const completePasswordResetFn = createServerFn({ method: 'POST' })
   .inputValidator((data: { email: string; challengeId: string; code: string; password: string }) => data)
   .handler(async ({ data }) => finishAuth(await actionApiData(api.auth.passwordAuthControllerCompletePasswordReset(data, requestOptions()))));

export async function completePasswordReset(data: { email: string; challengeId: string; code: string; password: string }) {
   return completePasswordResetFn({ data });
}

const getPasswordCredentialFn = createServerFn({ method: 'GET' }).handler(() =>
   actionApiData(api.auth.passwordAuthControllerGetPasswordCredential(requestOptions()))
);

export async function getPasswordCredential() {
   return getPasswordCredentialFn();
}

const startPasswordSetupFn = createServerFn({ method: 'POST' })
   .inputValidator((email: string) => email)
   .handler(({ data: email }) => actionApiData(api.auth.passwordAuthControllerStartPasswordSetup({ email }, requestOptions())));

export async function startPasswordSetup(email: string) {
   return startPasswordSetupFn({ data: email });
}

const completePasswordSetupFn = createServerFn({ method: 'POST' })
   .inputValidator((data: { email: string; challengeId: string; code: string; password: string }) => data)
   .handler(async ({ data }) => {
      const result = await actionApiData(api.auth.passwordAuthControllerCompletePasswordSetup(data, requestOptions()));

      if (result.ok) {
         setAuthCookie(result.value.token);
         return actionSuccess(undefined);
      }

      return result;
   });

export async function completePasswordSetup(data: { email: string; challengeId: string; code: string; password: string }) {
   return completePasswordSetupFn({ data });
}

const changePasswordFn = createServerFn({ method: 'POST' })
   .inputValidator((data: { currentPassword: string; newPassword: string }) => data)
   .handler(async ({ data }) => {
      const result = await actionApiData(api.auth.passwordAuthControllerChangePassword(data, requestOptions()));

      if (result.ok) {
         // password change rotates every session; keep this one alive with the fresh token
         setAuthCookie(result.value.token);
         return actionSuccess(undefined);
      }

      return result;
   });

export async function changePassword(data: { currentPassword: string; newPassword: string }) {
   return changePasswordFn({ data });
}
