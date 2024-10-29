import Permissions from '$lib/utils/permissions';

import type { Difficulty, LeaderboardInfo } from '$lib/models/LeaderboardData';
import { Role } from '$lib/models/PlayerData';
import type { RankingDifficulty } from '$lib/models/Ranking';

import { CDN_URL } from './env';

export function rankToPage(rank: number, perPage: number) {
   return Math.floor((rank + perPage - 1) / perPage);
}

export function getCDNUrl(input: string) {
   return CDN_URL + input;
}

export function getDifficultyStyle(input: Difficulty | RankingDifficulty): string {
   switch (input.difficulty) {
      case 1:
         return 'easy';
      case 3:
         return 'normal';
      case 5:
         return 'hard';
      case 7:
         return 'expert';
      case 9:
         return 'expert-plus';
   }
}

export function getDifficultyLabel(input: Difficulty | RankingDifficulty): string {
   switch (input.difficulty) {
      case 1:
         return 'Easy';
      case 3:
         return 'Normal';
      case 5:
         return 'Hard';
      case 7:
         return 'Expert';
      case 9:
         return 'Expert+';
   }
}

export function getDifficultyLabelSmall(input: Difficulty | RankingDifficulty): string {
   switch (input.difficulty) {
      case 1:
         return 'E';
      case 3:
         return 'N';
      case 5:
         return 'H';
      case 7:
         return 'X';
      case 9:
         return 'Ex+';
   }
}

export function getRankingApprovalStatus(input: number): string {
   switch (input) {
      case 0:
         return 'In Progress';
      case 1:
         return 'Approved';
      case 2:
         return 'Denied';
      case 3:
         return 'Qualified';
      default:
         return 'Unknown';
   }
}

export function getDifficultyOrStarValue(input: LeaderboardInfo): string {
   if (input.stars > 0) {
      return `${input.stars}★`;
   }
   return getDifficultyLabelSmall(input.difficulty);
}

export function groupBy(xs: any[], key: string) {
   return xs.reduce((rv: { [x: string]: any[] }, x: { [x: string]: string | number }) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
   }, {});
}

export function getPermissionList(currentPermissions: number): Role[] {
   const permissionList: Role[] = [];
   if (Permissions.checkPermissionNumber(currentPermissions, Permissions.security.CAT)) {
      permissionList.push(Role.CAT);
   }
   if (Permissions.checkPermissionNumber(currentPermissions, Permissions.security.RT)) {
      permissionList.push(Role.RT);
   }
   if (Permissions.checkPermissionNumber(currentPermissions, Permissions.security.QAT)) {
      permissionList.push(Role.QAT);
   }
   if (Permissions.checkPermissionNumber(currentPermissions, Permissions.security.NAT)) {
      permissionList.push(Role.NAT);
   }
   if (Permissions.checkPermissionNumber(currentPermissions, Permissions.security.QATHead)) {
      permissionList.push(Role.QATHead);
   }
   if (Permissions.checkPermissionNumber(currentPermissions, Permissions.security.DEV)) {
      permissionList.push(Role.DEV);
   }
   if (Permissions.checkPermissionNumber(currentPermissions, Permissions.security.PPV3)) {
      permissionList.push(Role.PPV3);
   }
   if (Permissions.checkPermissionNumber(currentPermissions, Permissions.security.CCT)) {
      permissionList.push(Role.CCT);
   }
   if (Permissions.checkPermissionNumber(currentPermissions, Permissions.security.CCTHead)) {
      permissionList.push(Role.CCTHead);
   }
   return permissionList;
}

export const HMDs = {
   0: 'Unknown',
   1: 'Rift CV1',
   2: 'Vive',
   4: 'Vive Pro',
   8: 'Windows Mixed Reality',
   16: 'Rift S',
   32: 'Quest',
   64: 'Valve Index',
   128: 'Vive Cosmos'
};
