import { createServerFn } from '@tanstack/react-start';

import type { UserControllerGetConnectionsItem, UserControllerRemoveConnectionProvider } from '@/shared/api/generated/ApiParams';
import { api } from '@/shared/api/server-api';
import { actionApiData, actionResultVoid } from '@/shared/result/action';

type PrimaryConnectionProvider = Extract<UserControllerGetConnectionsItem['provider'], 'STEAM' | 'OCULUS' | 'SCORESABER'>;

const removeConnectionFn = createServerFn({ method: 'POST' })
   .inputValidator((provider: UserControllerRemoveConnectionProvider) => provider)
   .handler(({ data }) => actionResultVoid(api.user.userControllerRemoveConnection({ provider: data })));

const refreshPatreonBenefitsFn = createServerFn({ method: 'POST' }).handler(() => actionApiData(api.user.userControllerRefreshPatreonBenefits()));

const switchPrimaryConnectionFn = createServerFn({ method: 'POST' })
   .inputValidator((provider: PrimaryConnectionProvider) => provider)
   .handler(({ data }) => actionApiData(api.user.userControllerSwitchPrimaryConnection({ provider: data })));

const startOculusAccountMergeFn = createServerFn({ method: 'POST' })
   .inputValidator((email: string) => email)
   .handler(({ data }) => actionApiData(api.user.userControllerStartOculusEmailMerge({ email: data })));

const verifyOculusAccountMergeFn = createServerFn({ method: 'POST' })
   .inputValidator((data: { challengeId: string; code: string }) => data)
   .handler(({ data }) => actionApiData(api.user.userControllerVerifyOculusEmailMerge(data)));

const getAccountMergeChallengeFn = createServerFn({ method: 'GET' })
   .inputValidator((challengeId: string) => challengeId)
   .handler(({ data }) => actionApiData(api.user.userControllerGetAccountMergeChallenge({ challengeId: data })));

const confirmAccountMergeFn = createServerFn({ method: 'POST' })
   .inputValidator((challengeId: string) => challengeId)
   .handler(({ data }) => actionApiData(api.user.userControllerConfirmAccountMerge({ challengeId: data })));

export async function removeConnection(provider: UserControllerRemoveConnectionProvider) {
   return removeConnectionFn({ data: provider });
}

export async function refreshPatreonBenefits() {
   return refreshPatreonBenefitsFn();
}

export async function switchPrimaryConnection(provider: PrimaryConnectionProvider) {
   return switchPrimaryConnectionFn({ data: provider });
}

export async function startOculusAccountMerge(email: string) {
   return startOculusAccountMergeFn({ data: email });
}

export async function verifyOculusAccountMerge(challengeId: string, code: string) {
   return verifyOculusAccountMergeFn({ data: { challengeId, code } });
}

export async function getAccountMergeChallenge(challengeId: string) {
   return getAccountMergeChallengeFn({ data: challengeId });
}

export async function confirmAccountMerge(challengeId: string) {
   return confirmAccountMergeFn({ data: challengeId });
}
