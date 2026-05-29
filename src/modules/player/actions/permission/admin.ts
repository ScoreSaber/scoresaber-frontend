import { createServerFn } from '@tanstack/react-start';

import { api } from '@/shared/api/server-api';
import { actionApiData } from '@/shared/result/action';

const getPermissionsListFn = createServerFn({ method: 'GET' }).handler(() =>
   actionApiData(api.adminPermission.adminPermissionControllerListPermissions())
);

export async function getPermissionsList() {
   return getPermissionsListFn();
}
