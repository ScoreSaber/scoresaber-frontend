import { createServerFn } from '@tanstack/react-start';

import { api } from '@/shared/api/server-api';
import { actionApiData } from '@/shared/result/action';

export type OAuthScope = 'identity' | 'identity.providers';

export interface OAuthClientDraft {
   name: string;
   description?: string;
   redirectUris: string[];
   allowedScopes?: OAuthScope[];
}

const listOAuthClientsFn = createServerFn({ method: 'GET' }).handler(() =>
   actionApiData(api.oAuth.oAuthClientControllerListClients({ cache: 'no-store' }))
);

export async function listOAuthClients() {
   return listOAuthClientsFn();
}

const createOAuthClientFn = createServerFn({ method: 'POST' })
   .validator((data: OAuthClientDraft) => data)
   .handler(({ data }) => actionApiData(api.oAuth.oAuthClientControllerCreateClient(data)));

export async function createOAuthClient(data: OAuthClientDraft) {
   return createOAuthClientFn({ data });
}

const updateOAuthClientFn = createServerFn({ method: 'POST' })
   .validator((data: { id: number; patch: Partial<OAuthClientDraft> }) => data)
   .handler(({ data }) => actionApiData(api.oAuth.oAuthClientControllerUpdateClient({ id: data.id }, data.patch)));

export async function updateOAuthClient(id: number, patch: Partial<OAuthClientDraft>) {
   return updateOAuthClientFn({ data: { id, patch } });
}

const rotateOAuthClientSecretFn = createServerFn({ method: 'POST' })
   .validator((id: number) => id)
   .handler(({ data: id }) => actionApiData(api.oAuth.oAuthClientControllerRotateSecret({ id })));

export async function rotateOAuthClientSecret(id: number) {
   return rotateOAuthClientSecretFn({ data: id });
}

const revokeOAuthClientFn = createServerFn({ method: 'POST' })
   .validator((id: number) => id)
   .handler(({ data: id }) => actionApiData(api.oAuth.oAuthClientControllerRevokeClient({ id })));

export async function revokeOAuthClient(id: number) {
   return revokeOAuthClientFn({ data: id });
}
