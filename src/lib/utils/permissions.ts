import type { Player } from '$lib/models/PlayerData';

// Security permissions:
const security = {
   RT: 1,
   QAT: 2,
   QATHead: 4,
   NAT: 8,
   ADMIN: 16,
   PANDA: 32
};

const groups = {
   PANDA_Group: security.RT | security.QAT | security.QATHead | security.NAT | security.ADMIN | security.PANDA,
   ADMIN_Group: security.RT | security.QAT | security.QATHead | security.NAT | security.ADMIN,
   NAT_Group: security.RT | security.NAT,
   QATHead_Group: security.QAT | security.QATHead,
   QAT_Group: security.QAT,
   RT_Group: security.RT
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
   security,
   groups,
   checkPermission,
   checkPermissionNumber
};
