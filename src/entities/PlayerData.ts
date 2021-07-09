export interface Player {
   id: string;
   name: string;
   profilePicture: string;
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
export interface ScoreStats {
   totalScore: number;
   totalRankedScore: number;
   averageRankedScore: number;
   totalPlayCount: number;
   rankedPlayCount: number;
}
export interface Badge {
   description: string;
   image: string;
}
