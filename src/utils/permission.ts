/* eslint-disable no-unused-vars */
/* eslint-disable no-bitwise */

import { UserData } from '../entities/UserData';

// Security permissions:
export const RT = 1;
export const QAT = 2;
export const QATHead = 4;
export const NAT = 8;
export const ADMIN = 16;
export const PANDA = 32;

// User groups:
// const ADMIN_Group = RankingTeam | QATeam | QATeamHead | NATeam | Admin;
// const NAT_Group = RankingTeam | NATeam;
// const QATHead_Group = QATeam | QATeamHead;
// const QAT_Group = QATeam;
// const RT_GROUP = RankingTeam;

// function to check for permission
export function checkPermission(user: UserData | undefined, permission: number): boolean {
   if (user) {
      if (user.permissions) {
         if (user.permissions & permission) {
            return true;
         }
         return false;
      }
      return false;
   }
   return false;
}
