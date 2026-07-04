import { createServerFn } from '@tanstack/react-start';

import { api } from '@/shared/api/server-api';
import { actionApiData } from '@/shared/result/action';

const startDeviceLoginFn = createServerFn({ method: 'POST' }).handler(() =>
   actionApiData(api.auth.deviceCodeControllerStartDeviceLogin({ cache: 'no-store' }))
);

export async function startDeviceLogin() {
   return startDeviceLoginFn();
}

const getDeviceLoginStatusFn = createServerFn({ method: 'GET' }).handler(() =>
   actionApiData(api.auth.deviceCodeControllerGetDeviceLoginStatus({ cache: 'no-store' }))
);

export async function getDeviceLoginStatus() {
   return getDeviceLoginStatusFn();
}
