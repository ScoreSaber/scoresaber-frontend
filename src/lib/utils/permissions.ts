import type { Player } from '$lib/models/PlayerData';

// Security permissions:
const RT = 1;
const QAT = 2;
const QATHead = 4;
const NAT = 8;
const ADMIN = 16;
const PANDA = 32;

// User groups:
const PANDA_Group = RT | QAT | QATHead | NAT | ADMIN | PANDA;
const ADMIN_Group = RT | QAT | QATHead | NAT | ADMIN;
const NAT_Group = RT | NAT;
const QATHead_Group = QAT | QATHead;
const QAT_Group = QAT;
const RT_GROUP = RT;

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
   security: {
      RT,
      QAT,
      QATHead,
      NAT,
      ADMIN,
      PANDA
   },

   groups: {
      PANDA_Group,
      ADMIN_Group,
      NAT_Group,
      QATHead_Group,
      QAT_Group,
      RT_GROUP
   },

   checkPermission,
   checkPermissionNumber
};
