import { createServerFn } from '@tanstack/react-start';

import { api } from '@/shared/api/server-api';
import { actionApiData } from '@/shared/result/action';

export interface AuthorizeRequest {
   client_id: string;
   redirect_uri: string;
   scope?: string;
   code_challenge: string;
   code_challenge_method: 'S256';
}

const getAuthorizeInfoFn = createServerFn({ method: 'GET' })
   .validator((params: AuthorizeRequest) => params)
   .handler(({ data }) => actionApiData(api.oAuth.oAuthControllerGetAuthorizeInfo(data, { cache: 'no-store' })));

export async function getAuthorizeInfo(params: AuthorizeRequest) {
   return getAuthorizeInfoFn({ data: params });
}

const approveAuthorizationFn = createServerFn({ method: 'POST' })
   .validator((payload: AuthorizeRequest & { state?: string }) => payload)
   .handler(({ data }) => actionApiData(api.oAuth.oAuthControllerApproveAuthorization(data, { cache: 'no-store' })));

export async function approveAuthorization(payload: AuthorizeRequest & { state?: string }) {
   return approveAuthorizationFn({ data: payload });
}
