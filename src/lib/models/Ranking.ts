import type { LeaderboardInfo } from './LeaderboardData';

export interface RankRequestInformation {
   requestId: number;
   requestDescription: string;
   leaderboardInfo: LeaderboardInfo;
   created_at: string;
   rankVotes: VoteGroup;
   qatVotes: VoteGroup;
   rankComments: Comment[];
   qatComments: Comment[];
   requestType: number;
   approved: number;
   difficulties: RankingDifficulty[];
}

export interface RankingDifficulty {
   requestId: number;
   difficulty: number;
}

export interface Comment {
   username: string;
   userId: string;
   comment: string;
   timeStamp: string;
}

export interface RankRequestListing {
   requestId: number;
   weight: number;
   leaderboardInfo: LeaderboardInfo;
   created_at: string;
   totalRankVotes: VoteGroup;
   totalQATVotes: VoteGroup;
   difficultyCount: number;
}

export interface CreateRequestResponse {
   requestId: string;
}

export class VoteGroup {
   public upvotes: number;
   public downvotes: number;
   public myVote: boolean;
   public neutral: number;
   constructor(upvotes: number, downvotes: number, myVote: boolean, neutral?: number) {
      this.upvotes = upvotes;
      this.downvotes = downvotes;
      this.myVote = myVote;
      this.neutral = neutral;
   }
   public static Add(voteGroup1: VoteGroup, voteGroup2: VoteGroup) {
      return new VoteGroup(
         voteGroup1.upvotes + voteGroup2.upvotes,
         voteGroup1.downvotes + voteGroup2.downvotes,
         voteGroup2.myVote,
         voteGroup1.neutral + voteGroup2.neutral
      );
   }
}
