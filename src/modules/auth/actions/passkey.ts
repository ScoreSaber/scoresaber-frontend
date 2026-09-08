import type { AuthenticationResponseJSON, RegistrationResponseJSON } from '@simplewebauthn/browser';
import { createServerFn } from '@tanstack/react-start';

import { setAuthCookie } from '@/modules/auth/actions/session.server';
import { getClientRequestHeaders } from '@/shared/api/client-request.server';
import { api } from '@/shared/api/server-api';
import { actionApiData, actionResultVoid, actionSuccess, type ActionResult } from '@/shared/result/action';

export type PasskeyLoginActionValue = { status: 'authenticated'; playerId: string } | { status: 'support-required' };

const getPasskeyLoginOptionsFn = createServerFn({ method: 'POST' }).handler(() =>
   actionApiData(api.auth.passkeyControllerStartAuthentication({ cache: 'no-store', headers: getClientRequestHeaders() }))
);

export async function getPasskeyLoginOptions() {
   return getPasskeyLoginOptionsFn();
}

const verifyPasskeyLoginFn = createServerFn({ method: 'POST' })
   .validator((data: { sessionId: string; response: AuthenticationResponseJSON }) => data)
   .handler(async ({ data }): Promise<ActionResult<PasskeyLoginActionValue>> => {
      const result = await actionApiData(
         api.auth.passkeyControllerVerifyAuthentication(data, { cache: 'no-store', headers: getClientRequestHeaders() })
      );

      if (!result.ok) return result;

      if (result.value.status === 'authenticated') {
         setAuthCookie(result.value.token);
         return actionSuccess({ status: 'authenticated', playerId: result.value.playerId });
      }

      return actionSuccess(result.value);
   });

export async function verifyPasskeyLogin(data: { sessionId: string; response: AuthenticationResponseJSON }) {
   return verifyPasskeyLoginFn({ data });
}

const getPasskeyRegistrationOptionsFn = createServerFn({ method: 'POST' }).handler(() =>
   actionApiData(api.auth.passkeyControllerStartRegistration({ cache: 'no-store' }))
);

export async function getPasskeyRegistrationOptions() {
   return getPasskeyRegistrationOptionsFn();
}

const verifyPasskeyRegistrationFn = createServerFn({ method: 'POST' })
   .validator((data: { response: RegistrationResponseJSON; label?: string }) => data)
   .handler(({ data }) => actionApiData(api.auth.passkeyControllerVerifyRegistration(data, { cache: 'no-store' })));

export async function verifyPasskeyRegistration(data: { response: RegistrationResponseJSON; label?: string }) {
   return verifyPasskeyRegistrationFn({ data });
}

const renamePasskeyFn = createServerFn({ method: 'POST' })
   .validator((data: { id: number; label: string }) => data)
   .handler(({ data }) => actionResultVoid(api.auth.passkeyControllerRenamePasskey({ id: data.id }, { label: data.label })));

export async function renamePasskey(id: number, label: string) {
   return renamePasskeyFn({ data: { id, label } });
}

const deletePasskeyFn = createServerFn({ method: 'POST' })
   .validator((id: number) => id)
   .handler(({ data: id }) => actionResultVoid(api.auth.passkeyControllerDeletePasskey({ id })));

export async function deletePasskey(id: number) {
   return deletePasskeyFn({ data: id });
}
