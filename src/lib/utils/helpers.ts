import type { LeaderboardInfo } from '$lib/models/LeaderboardData';
import { CDN_URL } from './env';
export function rankToPage(rank: number, perPage: number) {
   return Math.floor((rank + perPage - 1) / perPage);
}
export function getCDNUrl(input: string) {
   return CDN_URL + input;
}

export function getDifficultyStyle(input: number): string {
   switch (input) {
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

export function getDifficultyLabel(input: number): string {
   switch (input) {
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

export function getDifficultyLabelSmall(input: number): string {
   switch (input) {
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

export function getDifficultyOrStarValue(input: LeaderboardInfo): string {
   if (input.stars > 0) {
      return `${input.stars}★`;
   }
   return getDifficultyLabelSmall(input.difficulty);
}
