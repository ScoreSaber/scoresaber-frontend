import { createServerFn } from '@tanstack/react-start';

import { api } from '@/shared/api/server-api';
import { actionApiData, actionApiVoid } from '@/shared/result/action';
import { toInt64PathParam } from '@/shared/url-state/params';

type BanPlayerInput = {
   playerId: string;
   reason: string;
   notes?: string;
   autoUnban?: boolean;
   autoUnbansAt?: string;
   earliestAppealDate?: string;
};

const banPlayerFn = createServerFn({ method: 'POST' })
   .inputValidator((data: BanPlayerInput) => data)
   .handler(({ data }) => {
      const apiPlayerId = toInt64PathParam(data.playerId);

      return actionApiVoid(
         api.adminUser.adminUserControllerBanPlayer(
            { id: apiPlayerId },
            {
               reason: data.reason,
               ...(data.notes && { notes: data.notes }),
               ...(data.autoUnban != null && { autoUnban: data.autoUnban }),
               ...(data.autoUnbansAt && { autoUnbansAt: new Date(data.autoUnbansAt) }),
               ...(data.earliestAppealDate && { earliestAppealDate: new Date(data.earliestAppealDate) })
            }
         )
      );
   });

const unbanPlayerFn = createServerFn({ method: 'POST' })
   .inputValidator((playerId: string) => playerId)
   .handler(({ data }) => actionApiVoid(api.adminUser.adminUserControllerUnbanPlayer({ id: toInt64PathParam(data) })));

const adminResetCountryFn = createServerFn({ method: 'POST' })
   .inputValidator((data: { playerId: string; country: string }) => data)
   .handler(({ data }) =>
      actionApiVoid(api.adminUser.adminUserControllerAdminResetCountry({ id: toInt64PathParam(data.playerId) }, { country: data.country }))
   );

const updateRoleTextFn = createServerFn({ method: 'POST' })
   .inputValidator((data: { playerId: string; roleText: string }) => data)
   .handler(({ data }) =>
      actionApiVoid(api.adminUser.adminUserControllerUpdateRoleText({ id: toInt64PathParam(data.playerId) }, { roleText: data.roleText }))
   );

const updatePermissionsFn = createServerFn({ method: 'POST' })
   .inputValidator((data: { playerId: string; add?: string[]; remove?: string[] }) => data)
   .handler(({ data }) =>
      actionApiData(
         api.adminUser.adminUserControllerUpdatePermissions({ id: toInt64PathParam(data.playerId) }, { add: data.add, remove: data.remove })
      )
   );

export async function banPlayer(
   playerId: string,
   reason: string,
   notes?: string,
   autoUnban?: boolean,
   autoUnbansAt?: string,
   earliestAppealDate?: string
) {
   return banPlayerFn({ data: { playerId, reason, notes, autoUnban, autoUnbansAt, earliestAppealDate } });
}

export async function unbanPlayer(playerId: string) {
   return unbanPlayerFn({ data: playerId });
}

export async function adminResetCountry(playerId: string, country: string) {
   return adminResetCountryFn({ data: { playerId, country } });
}

export async function updateRoleText(playerId: string, roleText: string) {
   return updateRoleTextFn({ data: { playerId, roleText } });
}

export async function updatePermissions(playerId: string, add?: string[], remove?: string[]) {
   return updatePermissionsFn({ data: { playerId, add, remove } });
}
