import type { Player } from '$lib/models/PlayerData';

// Security permissions:
const permissions = {
   RT: 1,
   QAT: 2,
   QATHead: 4,
   NAT: 8,
   ADMIN: 16,
   PANDA: 32,
   SUPPORTER: 64,
   PPFARMER: 128
};

const group_permissions = {
   ALL_STAFF: permissions.RT | permissions.QAT | permissions.QATHead | permissions.NAT | permissions.ADMIN | permissions.PANDA,
   ADMIN: permissions.RT | permissions.QAT | permissions.QATHead | permissions.NAT | permissions.ADMIN,
   NAT: permissions.RT | permissions.NAT,
   QATHead: permissions.QAT | permissions.QATHead,
   QAT: permissions.QAT,
   RT: permissions.RT
};

// function to check for permission
function checkPermission(player: Player, permission: number): boolean {
   if (player === undefined) {
      return false;
   }
   if (player.permissions === undefined) {
      return false;
   }
   if (player.permissions & permission) {
      return true;
   }
   return false;
}

function checkPermissionNumber(userPermissions: number, permission: number): boolean {
   if (userPermissions === undefined) {
      return false;
   }
   if (userPermissions & permission) {
      return true;
   }
   return false;
}

export default {
   security: permissions,
   groups: group_permissions,
   checkPermission,
   checkPermissionNumber
};
