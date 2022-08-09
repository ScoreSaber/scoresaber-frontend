import type { Metadata } from './GenericResponses';

import type { Score, LeaderboardInfo } from '$lib/models/LeaderboardData';

export interface Player {
   id: string;
   name: string;
   profilePicture: string;
   bio: string;
   country: string;
   pp: number;
   rank: number;
   countryRank: number;
   role: string;
   badges: Badge[] | null;
   histories: string;
   scoreStats: ScoreStats | null;
   permissions: number;
   banned: boolean;
   inactive: boolean;
}

export interface PlayerScore {
   score: Score;
   leaderboard: LeaderboardInfo;
}

export interface LeaderboardPlayer {
   id: string;
   name: string;
   profilePicture: string;
   country: string;
   permissions: number;
   role: string;
}
export interface ScoreStats {
   totalScore: number;
   totalRankedScore: number;
   averageRankedAccuracy: number;
   totalPlayCount: number;
   rankedPlayCount: number;
   replaysWatched: number;
}
export interface Badge {
   description: string;
   image: string;
}

export interface PlayerScoreCollection {
   playerScores: PlayerScore[];
   metadata: Metadata;
}
export class PlayerCollection {
   players: Player[];
   metadata: Metadata;
}

export enum Role {
   RTR = 'rtr',
   CAT = 'cat',
   RT = 'rt',
   QAT = 'qat',
   NAT = 'nat',
   QATHead = 'qathead'
}
