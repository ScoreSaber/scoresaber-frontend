import type { LeaderboardPlayer } from '$lib/models/PlayerData';

export interface Leaderboard {
   leaderboardInfo: LeaderboardInfo;
   scores: Score[] | null;
}

export interface Difficulty {
   leaderboardId: number;
   difficulty: number;
}

export interface LeaderboardFilterOptions {
   verified: boolean;
   ranked: boolean;
   minStar: number;
   maxStar: number;
   category: Category;
   sortDirection: SortDirection;
}

export enum Category {
   Trending = 'trending',
   DateRanked = 'rank_date',
   ScoresSet = 'scores',
   StarDifficulty = 'max_pp',
   Author = 'levelAuthorName'
}

export enum SortDirection {
   Descending = 'desc',
   Ascending = 'asc'
}

export function getCategoryFromNumber(category: number): Category {
   switch (category) {
      case 0: {
         return Category.Trending;
      }
      case 1: {
         return Category.DateRanked;
      }
      case 2: {
         return Category.ScoresSet;
      }
      case 3: {
         return Category.StarDifficulty;
      }
      case 4: {
         return Category.Author;
      }
   }
   return Category.Trending;
}

export function getSortDirectionFromNumber(direction: number): SortDirection {
   switch (direction) {
      case 0: {
         return SortDirection.Descending;
      }
      case 1: {
         return SortDirection.Ascending;
      }
   }
   return SortDirection.Descending;
}

export interface LeaderboardInfo {
   id: number;
   songHash: string;
   songName: string;
   songSubName: string;
   songAuthorName: string;
   levelAuthorName: string;
   difficulty: number;
   difficultyRaw: string;
   maxScore: number;
   createdDate: Date;
   rankedDate: Date;
   qualifiedDate: Date;
   lovedDate: Date;
   ranked: boolean;
   qualified: boolean;
   loved: boolean;
   maxPP: number;
   stars: number;
   plays: number;
   dailyPlays: number;
   coverImage: string;
   playerScore: Score | null;
   difficulties: Difficulty[];
}

export interface Score {
   id: number;
   leaderboardPlayerInfo?: LeaderboardPlayer;
   rank: number;
   baseScore: number;
   modifiedScore: number;
   pp: number;
   weight: number;
   modifiers: string;
   multiplier: number;
   badCuts: number;
   missedNotes: number;
   maxCombo: number;
   fullCombo: boolean;
   hmd: number;
   timeSet: Date;
}
