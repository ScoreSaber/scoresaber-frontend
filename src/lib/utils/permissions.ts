import type { Player } from '$lib/models/PlayerData';
// Security permissions:
export const RT = 1;
export const QAT = 2;
export const QATHead = 4;
export const NAT = 8;
export const ADMIN = 16;
export const PANDA = 32;

// User groups:
export const PANDA_Group = RT | QAT | QATHead | NAT | ADMIN | PANDA;
export const ADMIN_Group = RT | QAT | QATHead | NAT | ADMIN;
export const NAT_Group = RT | NAT;
export const QATHead_Group = QAT | QATHead;
export const QAT_Group = QAT;
export const RT_GROUP = RT;

// function to check for permission
export function checkPermission(player: Player, permission: number): boolean {
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

export function checkPermissionNumber(userPermissions: number, permission: number): boolean {
   if (userPermissions === undefined) {
      return false;
   }
   if (userPermissions & permission) {
      return true;
   }
   return false;
}
