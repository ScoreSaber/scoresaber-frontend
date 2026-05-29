/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface RealmControllerGetRealmByIdParams {
   /** @exclusiveMin true */
   id: number;
}

export interface PlayerControllerGetPlayersParams {
   /**
    * Page number
    * @exclusiveMin true
    * @default 1
    */
   page?: number;
   /**
    * Items per page (max: 100)
    * @min 1
    * @max 100
    * @default 50
    */
   limit?: number;
   /** Comma separated country codes */
   countries?: string;
   /**
    * Search by player name (min 3 chars)
    * @minLength 3
    * @maxLength 64
    */
   search?: string;
   /**
    * Realm ID (defaults to the active realm)
    * @min 0
    */
   realmId?: number;
   /**
    * Include inactive players
    * @default false
    */
   includeInactive?: string;
   /**
    * Sort field
    * @default "totalPP"
    */
   sort?:
      | 'rank'
      | 'countryRank'
      | 'totalPP'
      | 'totalScore'
      | 'totalRankedScore'
      | 'totalPlayedLeaderboards'
      | 'totalPlayedRankedLeaderboards'
      | 'totalSubmittedPlays'
      | 'totalReplayViews'
      | 'averageAccuracy'
      | 'weightedAverageAccuracy'
      | 'completionAccuracy';
   /** Sort direction (defaults vary by field) */
   sortDirection?: 'asc' | 'desc';
   /** Player listing pivot mode */
   pivot?: 'player' | 'friends';
}

export interface PlayerControllerGetPlayerCountParams {
   /**
    * Realm ID (defaults to the active realm)
    * @min 0
    */
   realmId?: number;
   /**
    * Include inactive players
    * @default false
    */
   includeInactive?: string;
}

export interface PlayerControllerGetPlayerParams {
   /**
    * Realm ID (defaults to the active realm)
    * @min 0
    */
   realmId?: number;
   /**
    * @pattern ^\d+$
    * @example "76561199471863419"
    */
   id: string;
}

export interface PlayerControllerGetPlayerBasicParams {
   /**
    * Realm ID (defaults to the active realm)
    * @min 0
    */
   realmId?: number;
   /**
    * @pattern ^\d+$
    * @example "76561199471863419"
    */
   id: string;
}

export interface PlayerControllerGetPlayerHistoryParams {
   /**
    * Realm ID (defaults to the active realm)
    * @min 0
    */
   realmId?: number;
   /**
    * @pattern ^\d+$
    * @example "76561199471863419"
    */
   id: string;
}

export interface PlayerControllerGetGlobalPlayerHistoryParams {
   /**
    * @pattern ^\d+$
    * @example "76561199471863419"
    */
   id: string;
}

export interface PlayerControllerGetPlayerScoresParams {
   /**
    * Page number
    * @exclusiveMin true
    * @default 1
    */
   page?: number;
   /**
    * Items per page (max: 100)
    * @min 1
    * @max 100
    * @default 8
    */
   limit?: number;
   /**
    * Sort order
    * @default "top"
    */
   sort?: 'top' | 'recent' | 'oldest' | 'accuracy';
   /**
    * Search by song name (min 3 chars)
    * @minLength 3
    * @maxLength 64
    */
   search?: string;
   /** Personal best filter */
   personalBest?: string | 'all';
   /**
    * Leaderboard id
    * @exclusiveMin true
    */
   leaderboardId?: number;
   /**
    * Map id
    * @exclusiveMin true
    */
   mapId?: number;
   /** Oldest score timestamp */
   from?: string;
   /** Newest score timestamp */
   to?: string;
   /** Replay availability filter */
   hasReplay?: string;
   /**
    * Realm ID (defaults to the active realm)
    * @min 0
    */
   realmId?: number;
   /**
    * @pattern ^\d+$
    * @example "76561199471863419"
    */
   id: string;
}

export interface PlayerAliasControllerGetAliasesParams {
   /**
    * @pattern ^\d+$
    * @example "76561199471863419"
    */
   id: string;
}

export interface PlayerAliasControllerDisableAliasParams {
   /**
    * @pattern ^\d+$
    * @example "76561199471863419"
    */
   id: string;
   /** @exclusiveMin true */
   aliasId: number;
}

export interface PlayerAliasControllerDisableAllAliasesParams {
   /**
    * @pattern ^\d+$
    * @example "76561199471863419"
    */
   id: string;
}

export interface PlayerRelationshipControllerFollowPlayerParams {
   /**
    * @pattern ^\d+$
    * @example "76561199471863419"
    */
   id: string;
}

export interface PlayerRelationshipControllerUnfollowPlayerParams {
   /**
    * @pattern ^\d+$
    * @example "76561199471863419"
    */
   id: string;
}

export interface LeaderboardControllerGetLeaderboardListingsParams {
   /**
    * Page number
    * @exclusiveMin true
    * @default 1
    */
   page?: number;
   /**
    * Items per page (max: 100)
    * @min 1
    * @max 100
    * @default 14
    */
   limit?: number;
   /**
    * Filter by status. accepts a single value or comma-separated values
    * @minItems 1
    */
   status?: ('UNRANKED' | 'RANKED' | 'QUALIFIED' | 'LOVED')[];
   /** Verified maps only */
   verified?: string;
   /**
    * Minimum star rating
    * @min 0
    */
   minStars?: number;
   /**
    * Maximum star rating
    * @min 0
    */
   maxStars?: number;
   /**
    * Search by song name (min 3 chars)
    * @minLength 3
    * @maxLength 64
    */
   search?: string;
   /** Sort field */
   sortBy?: 'createdAt' | 'rankedAt' | 'stars' | 'totalScores' | 'dailyScores' | 'trending';
   /**
    * Sort direction
    * @default "desc"
    */
   sortDirection?: 'asc' | 'desc';
   /**
    * Realm ID (defaults to the active realm)
    * @min 0
    */
   realmId?: number;
}

export interface LeaderboardControllerGetLeaderboardByIdParams {
   /**
    * Realm ID (defaults to the active realm)
    * @min 0
    */
   realmId?: number;
   /** @exclusiveMin true */
   id: number;
}

export interface LeaderboardControllerGetLeaderboardScoresByIdParams {
   /**
    * Page number
    * @exclusiveMin true
    * @default 1
    */
   page?: number;
   /**
    * Items per page (max: 100)
    * @min 1
    * @max 100
    * @default 12
    */
   limit?: number;
   /** Score pivot mode */
   pivot?: 'player' | 'friends';
   /**
    * Country code for regional scores
    * @maxLength 128
    */
   scope?: string;
   /**
    * Search by player name (min 3 chars)
    * @minLength 3
    * @maxLength 32
    */
   search?: string;
   /**
    * Sort field (default: score)
    * @default "score"
    */
   sort?: 'score' | 'timeSet';
   /**
    * Sort direction (default: desc)
    * @default "desc"
    */
   sortDirection?: 'asc' | 'desc';
   /**
    * Realm ID (defaults to the active realm)
    * @min 0
    */
   realmId?: number;
   /** @exclusiveMin true */
   id: number;
}

export interface LeaderboardControllerGetDifficultiesForHashParams {
   /**
    * Realm ID (defaults to the active realm)
    * @min 0
    */
   realmId?: number;
   /**
    * @minLength 1
    * @maxLength 40
    */
   hash: string;
}

export interface LeaderboardControllerGetLeaderboardByHashParams {
   /**
    * Realm ID (defaults to the active realm)
    * @min 0
    */
   realmId?: number;
   /**
    * @minLength 1
    * @maxLength 40
    */
   hash: string;
   /**
    * @minLength 1
    * @maxLength 64
    */
   mode: string;
   /** @exclusiveMin true */
   difficulty: number;
}

export interface LeaderboardControllerGetLeaderboardScoresByHashParams {
   /**
    * Page number
    * @exclusiveMin true
    * @default 1
    */
   page?: number;
   /**
    * Items per page (max: 100)
    * @min 1
    * @max 100
    * @default 12
    */
   limit?: number;
   /** Score pivot mode */
   pivot?: 'player' | 'friends';
   /**
    * Country code for regional scores
    * @maxLength 128
    */
   scope?: string;
   /**
    * Search by player name (min 3 chars)
    * @minLength 3
    * @maxLength 32
    */
   search?: string;
   /**
    * Sort field (default: score)
    * @default "score"
    */
   sort?: 'score' | 'timeSet';
   /**
    * Sort direction (default: desc)
    * @default "desc"
    */
   sortDirection?: 'asc' | 'desc';
   /**
    * Realm ID (defaults to the active realm)
    * @min 0
    */
   realmId?: number;
   /**
    * @minLength 1
    * @maxLength 40
    */
   hash: string;
   /**
    * @minLength 1
    * @maxLength 64
    */
   mode: string;
   /** @exclusiveMin true */
   difficulty: number;
}

export interface MapControllerGetMapListingsParams {
   /**
    * Page number
    * @exclusiveMin true
    * @default 1
    */
   page?: number;
   /**
    * Items per page (max: 100)
    * @min 1
    * @max 100
    * @default 14
    */
   limit?: number;
   /**
    * Filter by status. accepts a single value or comma-separated values
    * @minItems 1
    */
   status?: ('UNRANKED' | 'RANKED' | 'QUALIFIED' | 'LOVED')[];
   /** Verified maps only */
   verified?: string;
   /**
    * Minimum star rating (across any difficulty)
    * @min 0
    */
   minStars?: number;
   /**
    * Maximum star rating (across any difficulty)
    * @min 0
    */
   maxStars?: number;
   /**
    * Search by song name, author, or mapper (min 3 chars)
    * @minLength 3
    * @maxLength 64
    */
   search?: string;
   /** Sort field */
   sortBy?: 'createdAt' | 'latestRankedAt' | 'highestStars' | 'totalScores' | 'trending';
   /**
    * Sort direction
    * @default "desc"
    */
   sortDirection?: 'asc' | 'desc';
   /**
    * Realm ID (defaults to the active realm)
    * @min 0
    */
   realmId?: number;
}

export interface MapControllerGetMapByIdParams {
   /**
    * Realm ID (defaults to the active realm)
    * @min 0
    */
   realmId?: number;
   /** @exclusiveMin true */
   id: number;
}

export interface AuthControllerSteamLoginParams {
   intent?: 'login' | 'merge';
   /**
    * Frontend origin to use as OpenID realm and return_to base
    * @format uri
    */
   returnUrl?: string;
   /**
    * URL to redirect the user to after successful authentication
    * @format uri
    */
   redirectTo?: string;
}

export interface AuthControllerPatreonLoginParams {
   intent?: 'login' | 'link';
   /**
    * URL to redirect the user to after authentication
    * @format uri
    */
   redirectTo?: string;
}

export interface AuthControllerPatreonCallbackParams {
   /**
    * Patreon OAuth authorization code
    * @minLength 1
    */
   code?: string;
   /**
    * Patreon OAuth state
    * @minLength 1
    */
   state?: string;
}

export interface AuthControllerDiscordLoginParams {
   intent?: 'login' | 'link';
   /**
    * URL to redirect the user to after authentication
    * @format uri
    */
   redirectTo?: string;
}

export interface AuthControllerDiscordCallbackParams {
   /**
    * Discord OAuth authorization code
    * @minLength 1
    */
   code?: string;
   /**
    * Discord OAuth state
    * @minLength 1
    */
   state?: string;
}

export interface AuthControllerStartEmailLoginPayload {
   /**
    * Email address to send the one-time code to
    * @format email
    * @pattern ^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$
    */
   email: string;
}

export interface AuthControllerVerifyEmailLoginPayload {
   /** @minLength 1 */
   challengeId: string;
   /**
    * Six digit one-time code
    * @pattern ^\d{6}$
    */
   code: string;
}

export interface GameControllerSetActiveRealmsPayload {
   /**
    * Realm IDs to upload scores to
    * @minItems 1
    */
   activeRealmIds: number[];
}

export interface RankingControllerGetRequestsParams {
   /**
    * Page number
    * @exclusiveMin true
    * @default 1
    */
   page?: number;
   /**
    * Items per page (max: 50)
    * @min 1
    * @max 50
    * @default 10
    */
   limit?: number;
   /**
    * Realm ID (defaults to the active realm)
    * @min 0
    */
   realmId?: number;
}

export interface RankingControllerCreateRequestPayload {
   /**
    * Map ID to request ranking for
    * @exclusiveMin true
    */
   mapId: number;
   /**
    * Request description
    * @minLength 1
    * @maxLength 4096
    */
   description: string;
   /**
    * Leaderboard IDs to include
    * @minItems 1
    */
   leaderboardIds: number[];
   /**
    * Realm ID (defaults to the active realm)
    * @min 0
    */
   realmId?: number;
}

export interface RankingControllerGetRequestByIdParams {
   /**
    * Realm ID (defaults to the active realm)
    * @min 0
    */
   realmId?: number;
   /** @exclusiveMin true */
   id: number;
}

export interface RankingControllerReplaceRequestPayload {
   /**
    * Map ID
    * @exclusiveMin true
    */
   mapId: number;
   /**
    * Updated request description
    * @minLength 1
    * @maxLength 4096
    */
   description: string;
   /**
    * Leaderboard IDs
    * @minItems 1
    */
   leaderboardIds: number[];
   /**
    * Realm ID (defaults to the active realm)
    * @min 0
    */
   realmId?: number;
}

export interface RankingControllerReplaceRequestParams {
   /** @exclusiveMin true */
   id: number;
}

export interface RankingControllerCreateUnrankRequestPayload {
   /**
    * Map ID to request unranking for
    * @exclusiveMin true
    */
   mapId: number;
   /**
    * Request description
    * @minLength 1
    * @maxLength 4096
    */
   description: string;
   /**
    * Leaderboard IDs to include
    * @minItems 1
    */
   leaderboardIds: number[];
   /**
    * Realm ID (defaults to the active realm)
    * @min 0
    */
   realmId?: number;
}

export interface RankingControllerRtVotePayload {
   /** Vote value */
   vote: 'UPVOTE' | 'DOWNVOTE';
   /**
    * Realm ID (defaults to the active realm)
    * @min 0
    */
   realmId?: number;
}

export interface RankingControllerRtVoteParams {
   /** @exclusiveMin true */
   id: number;
}

export interface RankingControllerRtCommentPayload {
   /**
    * Comment text
    * @minLength 1
    * @maxLength 4096
    */
   comment: string;
   /**
    * Realm ID (defaults to the active realm)
    * @min 0
    */
   realmId?: number;
}

export interface RankingControllerRtCommentParams {
   /** @exclusiveMin true */
   id: number;
}

export interface RankingControllerQatVotePayload {
   /** Vote value */
   vote: 'UPVOTE' | 'DOWNVOTE' | 'NEUTRAL';
   /**
    * Realm ID (defaults to the active realm)
    * @min 0
    */
   realmId?: number;
}

export interface RankingControllerQatVoteParams {
   /** @exclusiveMin true */
   id: number;
}

export interface RankingControllerQatCommentPayload {
   /**
    * Comment text
    * @minLength 1
    * @maxLength 4096
    */
   comment: string;
   /**
    * Realm ID (defaults to the active realm)
    * @min 0
    */
   realmId?: number;
}

export interface RankingControllerQatCommentParams {
   /** @exclusiveMin true */
   id: number;
}

export interface RankingControllerRtDeleteCommentParams {
   /**
    * Realm ID (defaults to the active realm)
    * @min 0
    */
   realmId?: number;
   /** @exclusiveMin true */
   id: number;
   /** @exclusiveMin true */
   commentId: number;
}

export interface RankingControllerRtEditCommentPayload {
   /**
    * Comment text
    * @minLength 1
    * @maxLength 4096
    */
   comment: string;
   /**
    * Realm ID (defaults to the active realm)
    * @min 0
    */
   realmId?: number;
}

export interface RankingControllerRtEditCommentParams {
   /** @exclusiveMin true */
   id: number;
   /** @exclusiveMin true */
   commentId: number;
}

export interface RankingControllerQatDeleteCommentParams {
   /**
    * Realm ID (defaults to the active realm)
    * @min 0
    */
   realmId?: number;
   /** @exclusiveMin true */
   id: number;
   /** @exclusiveMin true */
   commentId: number;
}

export interface RankingControllerQatEditCommentPayload {
   /**
    * Comment text
    * @minLength 1
    * @maxLength 4096
    */
   comment: string;
   /**
    * Realm ID (defaults to the active realm)
    * @min 0
    */
   realmId?: number;
}

export interface RankingControllerQatEditCommentParams {
   /** @exclusiveMin true */
   id: number;
   /** @exclusiveMin true */
   commentId: number;
}

export interface RankingControllerQualifyPayload {
   /**
    * Realm ID (defaults to the active realm)
    * @min 0
    */
   realmId?: number;
   /**
    * Limit the action to one leaderboard
    * @exclusiveMin true
    */
   leaderboardId?: number;
}

export interface RankingControllerQualifyParams {
   /** @exclusiveMin true */
   id: number;
}

export interface RankingControllerDenyPayload {
   /**
    * Realm ID (defaults to the active realm)
    * @min 0
    */
   realmId?: number;
   /**
    * Limit the action to one leaderboard
    * @exclusiveMin true
    */
   leaderboardId?: number;
}

export interface RankingControllerDenyParams {
   /** @exclusiveMin true */
   id: number;
}

export interface RankingControllerApprovePayload {
   /**
    * Realm ID (defaults to the active realm)
    * @min 0
    */
   realmId?: number;
   /**
    * Limit the action to one leaderboard
    * @exclusiveMin true
    */
   leaderboardId?: number;
}

export interface RankingControllerApproveParams {
   /** @exclusiveMin true */
   id: number;
}

export interface ScoreControllerGetScoreParams {
   /**
    * Realm ID (defaults to the active realm)
    * @min 0
    */
   realmId?: number;
   /**
    * Include detailed replay statistics
    * @default true
    */
   includeScoreStats?: string;
   /** @exclusiveMin true */
   id: number;
}

export interface ScoreControllerGetScoreHistoryParams {
   /**
    * Realm ID (defaults to the active realm)
    * @min 0
    */
   realmId?: number;
   /**
    * Page number
    * @exclusiveMin true
    * @default 1
    */
   page?: number;
   /**
    * Items per page (max: 100)
    * @min 1
    * @max 100
    * @default 20
    */
   limit?: number;
   /** @exclusiveMin true */
   id: number;
}

export interface ScoreControllerDownloadReplayParams {
   id: number;
}

export interface ScoreControllerGetScoreStatsParams {
   /** @exclusiveMin true */
   id: number;
}

export interface AdminBadgeControllerCreateBadgePayload {
   /**
    * Badge image filename
    * @minLength 1
    */
   image: string;
   /**
    * Badge description
    * @minLength 1
    */
   description: string;
}

export interface AdminBadgeControllerUpdateBadgePayload {
   /**
    * Badge image filename
    * @minLength 1
    */
   image?: string;
   /**
    * Badge description
    * @minLength 1
    */
   description?: string;
}

export interface AdminBadgeControllerUpdateBadgeParams {
   /** @exclusiveMin true */
   id: number;
}

export interface AdminBadgeControllerDeleteBadgeParams {
   /** @exclusiveMin true */
   id: number;
}

export interface AdminBadgeControllerAssignBadgeParams {
   /** @exclusiveMin true */
   id: number;
   /**
    * @pattern ^\d+$
    * @example "76561199471863419"
    */
   playerId: string;
}

export interface AdminBadgeControllerUnassignBadgeParams {
   /** @exclusiveMin true */
   id: number;
   /**
    * @pattern ^\d+$
    * @example "76561199471863419"
    */
   playerId: string;
}

export interface AdminLeaderboardControllerRankLeaderboardPayload {
   /**
    * Maximum PP value for the leaderboard
    * @min 0
    * @exclusiveMin true
    */
   maxPP: number;
}

export interface AdminLeaderboardControllerRankLeaderboardParams {
   /**
    * Realm ID (defaults to the active realm)
    * @min 0
    */
   realmId?: number;
   /** @exclusiveMin true */
   id: number;
}

export interface AdminLeaderboardControllerUnrankLeaderboardParams {
   /**
    * Realm ID (defaults to the active realm)
    * @min 0
    */
   realmId?: number;
   /** @exclusiveMin true */
   id: number;
}

export interface AdminLeaderboardControllerRecalculatePPParams {
   /**
    * Realm ID (defaults to the active realm)
    * @min 0
    */
   realmId?: number;
   /** @exclusiveMin true */
   id: number;
}

export interface AdminLeaderboardControllerSetManualPPPayload {
   /**
    * New maximum PP value
    * @min 0
    */
   maxPP: number;
}

export interface AdminLeaderboardControllerSetManualPPParams {
   /**
    * Realm ID (defaults to the active realm)
    * @min 0
    */
   realmId?: number;
   /** @exclusiveMin true */
   id: number;
}

export interface AdminLeaderboardControllerQualifyLeaderboardParams {
   /**
    * Realm ID (defaults to the active realm)
    * @min 0
    */
   realmId?: number;
   /** @exclusiveMin true */
   id: number;
}

export interface AdminLeaderboardControllerLoveLeaderboardParams {
   /**
    * Realm ID (defaults to the active realm)
    * @min 0
    */
   realmId?: number;
   /** @exclusiveMin true */
   id: number;
}

export interface AdminScoreControllerDeleteScoreParams {
   /** @exclusiveMin true */
   id: number;
}

export interface AdminUserControllerBanPlayerPayload {
   /**
    * Ban reason
    * @maxLength 256
    */
   reason: string;
   /**
    * Internal notes
    * @maxLength 512
    */
   notes?: string;
   /** Whether to auto-unban */
   autoUnban?: boolean;
   /**
    * Auto-unban date (ISO 8601)
    * @format date-time
    * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
    */
   autoUnbansAt?: Date;
   /**
    * Earliest appeal date (ISO 8601)
    * @format date-time
    * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
    */
   earliestAppealDate?: Date;
}

export interface AdminUserControllerBanPlayerParams {
   /**
    * @pattern ^\d+$
    * @example "76561199471863419"
    */
   id: string;
}

export interface AdminUserControllerUnbanPlayerParams {
   /**
    * @pattern ^\d+$
    * @example "76561199471863419"
    */
   id: string;
}

export interface AdminUserControllerSilencePlayerPayload {
   /**
    * Silence reason
    * @maxLength 256
    */
   reason: string;
   /**
    * Evidence or internal context
    * @maxLength 4096
    */
   evidence?: string;
}

export interface AdminUserControllerSilencePlayerParams {
   /**
    * @pattern ^\d+$
    * @example "76561199471863419"
    */
   id: string;
}

export interface AdminUserControllerUnsilencePlayerParams {
   /**
    * @pattern ^\d+$
    * @example "76561199471863419"
    */
   id: string;
}

export interface AdminUserControllerUpdateRoleTextPayload {
   /**
    * Role text override
    * @maxLength 128
    */
   roleText: string;
}

export interface AdminUserControllerUpdateRoleTextParams {
   /**
    * @pattern ^\d+$
    * @example "76561199471863419"
    */
   id: string;
}

export interface AdminUserControllerAdminResetCountryPayload {
   /**
    * Country code
    * @minLength 2
    * @maxLength 2
    */
   country: string;
}

export interface AdminUserControllerAdminResetCountryParams {
   /**
    * @pattern ^\d+$
    * @example "76561199471863419"
    */
   id: string;
}

export interface AdminUserControllerUpdatePermissionsPayload {
   /** Permission names to add */
   add?: string[];
   /** Permission names to remove */
   remove?: string[];
}

export interface AdminUserControllerUpdatePermissionsParams {
   /**
    * @pattern ^\d+$
    * @example "76561199471863419"
    */
   id: string;
}

export interface AdminUserControllerMergePlayerPayload {
   /**
    * Internal source player id to merge into this player
    * @pattern ^\d+$
    * @example "76561199471863419"
    */
   sourcePlayerId: string;
   /**
    * Support reason for the merge
    * @minLength 1
    * @maxLength 512
    */
   reason: string;
}

export interface AdminUserControllerMergePlayerParams {
   /**
    * @pattern ^\d+$
    * @example "76561199471863419"
    */
   id: string;
}

export interface AdminVersionControllerCreateVersionPayload {
   /**
    * Version hash
    * @maxLength 36
    */
   hash: string;
   /**
    * Version string
    * @maxLength 16
    */
   version: string;
   /**
    * Platform (e.g. PC, Quest)
    * @maxLength 16
    */
   platform: string;
   /** Whether this version is whitelisted */
   whitelisted: boolean;
}

export interface AdminVersionControllerUpdateWhitelistPayload {
   /** Whitelist status */
   whitelisted: boolean;
}

export interface AdminVersionControllerUpdateWhitelistParams {
   /** @exclusiveMin true */
   id: number;
}

export interface AdminVersionControllerDeleteVersionParams {
   /** @exclusiveMin true */
   id: number;
}

export interface UserControllerUpdateBioPayload {
   /**
    * Player bio
    * @maxLength 4096
    */
   bio: string;
}

export interface UserControllerUpdateNamePayload {
   /**
    * New display name
    * @minLength 1
    * @maxLength 128
    */
   name: string;
}

export interface UserControllerUploadAvatarPayload {
   /** @format binary */
   avatar: File;
}

export interface UserControllerClaimReplaySlotParams {
   /** @exclusiveMin true */
   scoreId: number;
}

export interface UserControllerReleaseReplaySlotParams {
   /** @exclusiveMin true */
   scoreId: number;
}

export interface UserControllerSwitchPrimaryConnectionPayload {
   /** Primary provider to expose publicly */
   provider: 'STEAM' | 'OCULUS';
}

export interface UserControllerStartOculusEmailMergePayload {
   /**
    * Email address to send the one-time code to
    * @format email
    * @pattern ^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$
    */
   email: string;
}

export interface UserControllerVerifyOculusEmailMergePayload {
   /** @minLength 1 */
   challengeId: string;
   /**
    * Six digit one-time code
    * @pattern ^\d{6}$
    */
   code: string;
}

export interface UserControllerGetAccountMergeChallengeParams {
   /** @minLength 1 */
   challengeId: string;
}

export interface UserControllerConfirmAccountMergeParams {
   /** @minLength 1 */
   challengeId: string;
}

export interface UserControllerRemoveConnectionParams {
   provider: 'STEAM' | 'OCULUS' | 'PATREON' | 'DISCORD';
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, 'body' | 'bodyUsed'>;

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
   /** set parameter to `true` for call `securityWorker` for this request */
   secure?: boolean;
   /** request path */
   path: string;
   /** content type of request body */
   type?: ContentType;
   /** query params */
   query?: QueryParamsType;
   /** format of response (i.e. response.json() -> format: "json") */
   format?: ResponseFormat;
   /** request body */
   body?: unknown;
   /** base url */
   baseUrl?: string;
   /** request cancellation token */
   cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>;

export interface ApiConfig<SecurityDataType = unknown> {
   baseUrl?: string;
   baseApiParams?: Omit<RequestParams, 'baseUrl' | 'cancelToken' | 'signal'>;
   securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
   customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
   data: D;
   error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
   Json = 'application/json',
   JsonApi = 'application/vnd.api+json',
   FormData = 'multipart/form-data',
   UrlEncoded = 'application/x-www-form-urlencoded',
   Text = 'text/plain'
}

export class HttpClient<SecurityDataType = unknown> {
   public baseUrl: string = '';
   private securityData: SecurityDataType | null = null;
   private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
   private abortControllers = new Map<CancelToken, AbortController>();
   private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

   private baseApiParams: RequestParams = {
      credentials: 'same-origin',
      headers: {},
      redirect: 'follow',
      referrerPolicy: 'no-referrer'
   };

   constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
      Object.assign(this, apiConfig);
   }

   public setSecurityData = (data: SecurityDataType | null) => {
      this.securityData = data;
   };

   protected encodeQueryParam(key: string, value: any) {
      const encodedKey = encodeURIComponent(key);
      return `${encodedKey}=${encodeURIComponent(typeof value === 'number' ? value : `${value}`)}`;
   }

   protected addQueryParam(query: QueryParamsType, key: string) {
      return this.encodeQueryParam(key, query[key]);
   }

   protected addArrayQueryParam(query: QueryParamsType, key: string) {
      const value = query[key];
      return value.map((v: any) => this.encodeQueryParam(key, v)).join('&');
   }

   protected toQueryString(rawQuery?: QueryParamsType): string {
      const query = rawQuery || {};
      const keys = Object.keys(query).filter((key) => 'undefined' !== typeof query[key]);
      return keys.map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key))).join('&');
   }

   protected addQueryParams(rawQuery?: QueryParamsType): string {
      const queryString = this.toQueryString(rawQuery);
      return queryString ? `?${queryString}` : '';
   }

   private contentFormatters: Record<ContentType, (input: any) => any> = {
      [ContentType.Json]: (input: any) =>
         input !== null && (typeof input === 'object' || typeof input === 'string') ? JSON.stringify(input) : input,
      [ContentType.JsonApi]: (input: any) =>
         input !== null && (typeof input === 'object' || typeof input === 'string') ? JSON.stringify(input) : input,
      [ContentType.Text]: (input: any) => (input !== null && typeof input !== 'string' ? JSON.stringify(input) : input),
      [ContentType.FormData]: (input: any) => {
         if (input instanceof FormData) {
            return input;
         }

         return Object.keys(input || {}).reduce((formData, key) => {
            const property = input[key];
            formData.append(
               key,
               property instanceof Blob ? property : typeof property === 'object' && property !== null ? JSON.stringify(property) : `${property}`
            );
            return formData;
         }, new FormData());
      },
      [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input)
   };

   protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
      return {
         ...this.baseApiParams,
         ...params1,
         ...(params2 || {}),
         headers: {
            ...(this.baseApiParams.headers || {}),
            ...(params1.headers || {}),
            ...((params2 && params2.headers) || {})
         }
      };
   }

   protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
      if (this.abortControllers.has(cancelToken)) {
         const abortController = this.abortControllers.get(cancelToken);
         if (abortController) {
            return abortController.signal;
         }
         return void 0;
      }

      const abortController = new AbortController();
      this.abortControllers.set(cancelToken, abortController);
      return abortController.signal;
   };

   public abortRequest = (cancelToken: CancelToken) => {
      const abortController = this.abortControllers.get(cancelToken);

      if (abortController) {
         abortController.abort();
         this.abortControllers.delete(cancelToken);
      }
   };

   public request = async <T = any, E = any>({
      body,
      secure,
      path,
      type,
      query,
      format,
      baseUrl,
      cancelToken,
      ...params
   }: FullRequestParams): Promise<HttpResponse<T, E>> => {
      const secureParams =
         ((typeof secure === 'boolean' ? secure : this.baseApiParams.secure) &&
            this.securityWorker &&
            (await this.securityWorker(this.securityData))) ||
         {};
      const requestParams = this.mergeRequestParams(params, secureParams);
      const queryString = query && this.toQueryString(query);
      const payloadFormatter = this.contentFormatters[type || ContentType.Json];
      const responseFormat = format || requestParams.format;

      return this.customFetch(`${baseUrl || this.baseUrl || ''}${path}${queryString ? `?${queryString}` : ''}`, {
         ...requestParams,
         headers: {
            ...(requestParams.headers || {}),
            ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {})
         },
         signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
         body: typeof body === 'undefined' || body === null ? null : payloadFormatter(body)
      }).then(async (response) => {
         const r = response as HttpResponse<T, E>;
         r.data = null as unknown as T;
         r.error = null as unknown as E;

         const responseToParse = responseFormat ? response.clone() : response;
         const data = !responseFormat
            ? r
            : await responseToParse[responseFormat]()
                 .then((data) => {
                    if (r.ok) {
                       r.data = data;
                    } else {
                       r.error = data;
                    }
                    return r;
                 })
                 .catch((e) => {
                    r.error = e;
                    return r;
                 });

         if (cancelToken) {
            this.abortControllers.delete(cancelToken);
         }

         if (!response.ok) throw data;
         return data;
      });
   };
}

/**
 * @title ScoreSaber API v2
 * @version 2.0
 * @contact
 *
 * ScoreSaber API v2 Documentation
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
   app = {
      /**
       * No description
       *
       * @tags App
       * @name RootControllerGetData
       * @request GET:/api/v2
       * @response `200` `void`
       */
      rootControllerGetData: (params: RequestParams = {}) =>
         this.request<void, any>({
            path: `/api/v2`,
            method: 'GET',
            ...params
         })
   };
   health = {
      /**
       * No description
       *
       * @tags Health
       * @name HealthControllerGetHealth
       * @request GET:/api/v2/health
       * @response `200` `void`
       */
      healthControllerGetHealth: (params: RequestParams = {}) =>
         this.request<void, any>({
            path: `/api/v2/health`,
            method: 'GET',
            ...params
         })
   };
   realm = {
      /**
 * No description
 *
 * @tags Realm
 * @name RealmControllerGetRealms
 * @request GET:/api/v2/realms
 * @response `200` `({
    id: number,
    name: string,
    startDate: string,
    endDate: string | null,
    isAcceptingScores: boolean,
    hasPP: boolean,
    hasHistory: boolean,
    decayFactor: number,

})[]` All realms
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 */
      realmControllerGetRealms: (params: RequestParams = {}) =>
         this.request<
            {
               id: number;
               name: string;
               startDate: string;
               endDate: string | null;
               isAcceptingScores: boolean;
               hasPP: boolean;
               hasHistory: boolean;
               decayFactor: number;
            }[],
            {
               statusCode: 401;
               error: 'Unauthorized';
               code: 'UNAUTHORIZED';
               message: string;
            }
         >({
            path: `/api/v2/realms`,
            method: 'GET',
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags Realm
 * @name RealmControllerGetRealmById
 * @request GET:/api/v2/realms/{id}
 * @response `200` `{
    id: number,
    name: string,
    startDate: string,
    endDate: string | null,
    isAcceptingScores: boolean,
    hasPP: boolean,
    hasHistory: boolean,
    decayFactor: number,
    leaderboardCount: number,
    playerCount: number,
    scoreCount: number,

}` Realm details
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      realmControllerGetRealmById: ({ id }: RealmControllerGetRealmByIdParams, params: RequestParams = {}) =>
         this.request<
            {
               id: number;
               name: string;
               startDate: string;
               endDate: string | null;
               isAcceptingScores: boolean;
               hasPP: boolean;
               hasHistory: boolean;
               decayFactor: number;
               leaderboardCount: number;
               playerCount: number;
               scoreCount: number;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/realms/${id}`,
            method: 'GET',
            format: 'json',
            ...params
         })
   };
   player = {
      /**
 * No description
 *
 * @tags Player
 * @name PlayerControllerGetPlayers
 * @request GET:/api/v2/players
 * @response `200` `{
    data: ({
    id: string,
    name: string,
    country: string,
    role: string | null,
    avatar: string,
    permissions: number,
    banned: boolean,
    silenced: boolean,
    inactive: boolean,
    stats: {
    realmId: number,
    realmName: string,
    rank: number,
    countryRank: number,
    totalPP: number,
    totalScore: string,
    totalRankedScore: string,
    totalPlayedLeaderboards: number,
    totalPlayedRankedLeaderboards: number,
    totalSubmittedPlays: number,
    totalReplayViews: number,
    averageAccuracy: number,
    weightedAverageAccuracy: number,
    completionAccuracy: number,
    device: {
    hmd: string | null,
    controllerLeft: string | null,
    controllerRight: string | null,

} | null,

},

})[],
    metadata: {
    page: number,
    itemsPerPage: number,
    totalItems: number,
    totalPages: number,

},

}` Paginated list of players
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      playerControllerGetPlayers: (query: PlayerControllerGetPlayersParams, params: RequestParams = {}) =>
         this.request<
            {
               data: {
                  id: string;
                  name: string;
                  country: string;
                  role: string | null;
                  avatar: string;
                  permissions: number;
                  banned: boolean;
                  silenced: boolean;
                  inactive: boolean;
                  stats: {
                     realmId: number;
                     realmName: string;
                     rank: number;
                     countryRank: number;
                     totalPP: number;
                     totalScore: string;
                     totalRankedScore: string;
                     totalPlayedLeaderboards: number;
                     totalPlayedRankedLeaderboards: number;
                     totalSubmittedPlays: number;
                     totalReplayViews: number;
                     averageAccuracy: number;
                     weightedAverageAccuracy: number;
                     completionAccuracy: number;
                     device: {
                        hmd: string | null;
                        controllerLeft: string | null;
                        controllerRight: string | null;
                     } | null;
                  };
               }[];
               metadata: {
                  page: number;
                  itemsPerPage: number;
                  totalItems: number;
                  totalPages: number;
               };
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/players`,
            method: 'GET',
            query: query,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags Player
 * @name PlayerControllerGetPlayerCount
 * @request GET:/api/v2/players/count
 * @response `200` `{
    count: number,

}` Total player count
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      playerControllerGetPlayerCount: (query: PlayerControllerGetPlayerCountParams, params: RequestParams = {}) =>
         this.request<
            {
               count: number;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/players/count`,
            method: 'GET',
            query: query,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags Player
 * @name PlayerControllerGetPlayer
 * @request GET:/api/v2/players/{id}
 * @response `200` `{
    id: string,
    name: string,
    country: string,
    role: string | null,
    avatar: string,
    permissions: number,
    banned: boolean,
    silenced: boolean,
    inactive: boolean,
    stats: {
    realmId: number,
    realmName: string,
    rank: number,
    countryRank: number,
    totalPP: number,
    totalScore: string,
    totalRankedScore: string,
    totalPlayedLeaderboards: number,
    totalPlayedRankedLeaderboards: number,
    totalSubmittedPlays: number,
    totalReplayViews: number,
    averageAccuracy: number,
    weightedAverageAccuracy: number,
    completionAccuracy: number,
    device: {
    hmd: string | null,
    controllerLeft: string | null,
    controllerRight: string | null,

} | null,

},
    bio: string | null,
    createdAt: string,
    lastSeenAt: string,
    badges: ({
    id: number,
    image: string,
    description: string,

})[],
    followers: number,
    following: number,

}` Player profile
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      playerControllerGetPlayer: ({ id, ...query }: PlayerControllerGetPlayerParams, params: RequestParams = {}) =>
         this.request<
            {
               id: string;
               name: string;
               country: string;
               role: string | null;
               avatar: string;
               permissions: number;
               banned: boolean;
               silenced: boolean;
               inactive: boolean;
               stats: {
                  realmId: number;
                  realmName: string;
                  rank: number;
                  countryRank: number;
                  totalPP: number;
                  totalScore: string;
                  totalRankedScore: string;
                  totalPlayedLeaderboards: number;
                  totalPlayedRankedLeaderboards: number;
                  totalSubmittedPlays: number;
                  totalReplayViews: number;
                  averageAccuracy: number;
                  weightedAverageAccuracy: number;
                  completionAccuracy: number;
                  device: {
                     hmd: string | null;
                     controllerLeft: string | null;
                     controllerRight: string | null;
                  } | null;
               };
               bio: string | null;
               createdAt: string;
               lastSeenAt: string;
               badges: {
                  id: number;
                  image: string;
                  description: string;
               }[];
               followers: number;
               following: number;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/players/${id}`,
            method: 'GET',
            query: query,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags Player
 * @name PlayerControllerGetPlayerBasic
 * @request GET:/api/v2/players/{id}/basic
 * @response `200` `{
    id: string,
    name: string,
    country: string,
    role: string | null,
    avatar: string,
    permissions: number,
    banned: boolean,
    silenced: boolean,
    inactive: boolean,
    stats: {
    realmId: number,
    realmName: string,
    rank: number,
    countryRank: number,
    totalPP: number,
    totalScore: string,
    totalRankedScore: string,
    totalPlayedLeaderboards: number,
    totalPlayedRankedLeaderboards: number,
    totalSubmittedPlays: number,
    totalReplayViews: number,
    averageAccuracy: number,
    weightedAverageAccuracy: number,
    completionAccuracy: number,
    device: {
    hmd: string | null,
    controllerLeft: string | null,
    controllerRight: string | null,

} | null,

},

}` Basic player info
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      playerControllerGetPlayerBasic: ({ id, ...query }: PlayerControllerGetPlayerBasicParams, params: RequestParams = {}) =>
         this.request<
            {
               id: string;
               name: string;
               country: string;
               role: string | null;
               avatar: string;
               permissions: number;
               banned: boolean;
               silenced: boolean;
               inactive: boolean;
               stats: {
                  realmId: number;
                  realmName: string;
                  rank: number;
                  countryRank: number;
                  totalPP: number;
                  totalScore: string;
                  totalRankedScore: string;
                  totalPlayedLeaderboards: number;
                  totalPlayedRankedLeaderboards: number;
                  totalSubmittedPlays: number;
                  totalReplayViews: number;
                  averageAccuracy: number;
                  weightedAverageAccuracy: number;
                  completionAccuracy: number;
                  device: {
                     hmd: string | null;
                     controllerLeft: string | null;
                     controllerRight: string | null;
                  } | null;
               };
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/players/${id}/basic`,
            method: 'GET',
            query: query,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags Player
 * @name PlayerControllerGetPlayerHistory
 * @request GET:/api/v2/players/{id}/history
 * @response `200` `({
    rank: number,
    totalPP: number,
    totalScore: string,
    totalRankedScore: string,
    totalPlayedLeaderboards: number,
    totalPlayedRankedLeaderboards: number,
    totalSubmittedPlays: number,
    totalReplayViews: number,
    averageAccuracy: number,
    weightedAverageAccuracy: number,
    completionAccuracy: number,
    estimated: boolean,
    createdAt: string,

})[]` Player realm history over time
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      playerControllerGetPlayerHistory: ({ id, ...query }: PlayerControllerGetPlayerHistoryParams, params: RequestParams = {}) =>
         this.request<
            {
               rank: number;
               totalPP: number;
               totalScore: string;
               totalRankedScore: string;
               totalPlayedLeaderboards: number;
               totalPlayedRankedLeaderboards: number;
               totalSubmittedPlays: number;
               totalReplayViews: number;
               averageAccuracy: number;
               weightedAverageAccuracy: number;
               completionAccuracy: number;
               estimated: boolean;
               createdAt: string;
            }[],
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/players/${id}/history`,
            method: 'GET',
            query: query,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags Player
 * @name PlayerControllerGetGlobalPlayerHistory
 * @request GET:/api/v2/players/{id}/global-history
 * @response `200` `({
    rank: number,
    totalPP: number,
    totalScore: string,
    totalRankedScore: string,
    totalPlayedLeaderboards: number,
    totalPlayedRankedLeaderboards: number,
    totalSubmittedPlays: number,
    totalReplayViews: number,
    averageAccuracy: number,
    weightedAverageAccuracy: number,
    completionAccuracy: number,
    estimated: boolean,
    createdAt: string,

})[]` Player global history over time
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 */
      playerControllerGetGlobalPlayerHistory: ({ id }: PlayerControllerGetGlobalPlayerHistoryParams, params: RequestParams = {}) =>
         this.request<
            {
               rank: number;
               totalPP: number;
               totalScore: string;
               totalRankedScore: string;
               totalPlayedLeaderboards: number;
               totalPlayedRankedLeaderboards: number;
               totalSubmittedPlays: number;
               totalReplayViews: number;
               averageAccuracy: number;
               weightedAverageAccuracy: number;
               completionAccuracy: number;
               estimated: boolean;
               createdAt: string;
            }[],
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
         >({
            path: `/api/v2/players/${id}/global-history`,
            method: 'GET',
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags Player
 * @name PlayerControllerGetPlayerScores
 * @request GET:/api/v2/players/{id}/scores
 * @response `200` `{
    data: ({
    score: {
    id: number,
    rank: number,
    unmodifiedScore: number,
    modifiedScore: number,
    accuracy: number,
    pp: number,
    weight: number,
    mods: (string)[],
    badCuts: number,
    missedNotes: number,
    maxCombo: number,
    fullCombo: boolean,
    hasReplay: boolean,
    personalBest: boolean,
    legacyHmdId: number | null,
    version: string | null,
    createdAt: string,
    player: {
    id: string,
    name: string,
    country: string,
    role: string | null,
    avatar: string,
    permissions: number,

},
    device: {
    hmd: string | null,
    controllerLeft: string | null,
    controllerRight: string | null,

} | null,

},
    leaderboard: {
    id: number,
    map: {
    id: number,
    hash: string,
    bsid: string | null,
    songName: string,
    songSubName: string,
    songAuthorName: string,
    levelAuthorName: string,
    bpm: number,
    coverUrl: string,
    verified: boolean,

},
    difficulty: {
    id: number,
    difficulty: number,
    rawDifficulty: string,
    gameMode: string,

},
    maxScore: number,
    totalScores: number,
    dailyScores: number,
    createdAt: string,
    realm: {
    realmId: number,
    realmName: string,
    leaderboardStatus: "UNRANKED" | "RANKED" | "QUALIFIED" | "LOVED",
    positiveModifiers: boolean,
    stars: number,
    rankedAt: string | null,
    qualifiedAt: string | null,
    lovedAt: string | null,

},

},

})[],
    metadata: {
    page: number,
    itemsPerPage: number,
    totalItems: number,
    totalPages: number,

},

}` Paginated player scores
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      playerControllerGetPlayerScores: ({ id, ...query }: PlayerControllerGetPlayerScoresParams, params: RequestParams = {}) =>
         this.request<
            {
               data: {
                  score: {
                     id: number;
                     rank: number;
                     unmodifiedScore: number;
                     modifiedScore: number;
                     accuracy: number;
                     pp: number;
                     weight: number;
                     mods: string[];
                     badCuts: number;
                     missedNotes: number;
                     maxCombo: number;
                     fullCombo: boolean;
                     hasReplay: boolean;
                     personalBest: boolean;
                     legacyHmdId: number | null;
                     version: string | null;
                     createdAt: string;
                     player: {
                        id: string;
                        name: string;
                        country: string;
                        role: string | null;
                        avatar: string;
                        permissions: number;
                     };
                     device: {
                        hmd: string | null;
                        controllerLeft: string | null;
                        controllerRight: string | null;
                     } | null;
                  };
                  leaderboard: {
                     id: number;
                     map: {
                        id: number;
                        hash: string;
                        bsid: string | null;
                        songName: string;
                        songSubName: string;
                        songAuthorName: string;
                        levelAuthorName: string;
                        bpm: number;
                        coverUrl: string;
                        verified: boolean;
                     };
                     difficulty: {
                        id: number;
                        difficulty: number;
                        rawDifficulty: string;
                        gameMode: string;
                     };
                     maxScore: number;
                     totalScores: number;
                     dailyScores: number;
                     createdAt: string;
                     realm: {
                        realmId: number;
                        realmName: string;
                        leaderboardStatus: 'UNRANKED' | 'RANKED' | 'QUALIFIED' | 'LOVED';
                        positiveModifiers: boolean;
                        stars: number;
                        rankedAt: string | null;
                        qualifiedAt: string | null;
                        lovedAt: string | null;
                     };
                  };
               }[];
               metadata: {
                  page: number;
                  itemsPerPage: number;
                  totalItems: number;
                  totalPages: number;
               };
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/players/${id}/scores`,
            method: 'GET',
            query: query,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags Player
 * @name PlayerRelationshipControllerFollowPlayer
 * @request POST:/api/v2/player/{id}/follow
 * @response `200` `{
    success: boolean,

}` Follow player result
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `403` `{
    statusCode: 403,
    error: "Forbidden",
    code: "FORBIDDEN",
    message: string,
    details?: {
    reason: string,

},

}` Forbidden
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      playerRelationshipControllerFollowPlayer: ({ id }: PlayerRelationshipControllerFollowPlayerParams, params: RequestParams = {}) =>
         this.request<
            {
               success: boolean;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 403;
                 error: 'Forbidden';
                 code: 'FORBIDDEN';
                 message: string;
                 details?: {
                    reason: string;
                 };
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/player/${id}/follow`,
            method: 'POST',
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags Player
 * @name PlayerRelationshipControllerUnfollowPlayer
 * @request POST:/api/v2/player/{id}/unfollow
 * @response `200` `{
    success: boolean,

}` Unfollow player result
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `403` `{
    statusCode: 403,
    error: "Forbidden",
    code: "FORBIDDEN",
    message: string,
    details?: {
    reason: string,

},

}` Forbidden
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      playerRelationshipControllerUnfollowPlayer: ({ id }: PlayerRelationshipControllerUnfollowPlayerParams, params: RequestParams = {}) =>
         this.request<
            {
               success: boolean;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 403;
                 error: 'Forbidden';
                 code: 'FORBIDDEN';
                 message: string;
                 details?: {
                    reason: string;
                 };
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/player/${id}/unfollow`,
            method: 'POST',
            format: 'json',
            ...params
         })
   };
   playerAlias = {
      /**
 * No description
 *
 * @tags PlayerAlias
 * @name PlayerAliasControllerGetAliases
 * @request GET:/api/v2/players/{id}/aliases
 * @response `200` `({
    id: number,
    alias: string,
    disabled: boolean,
    createdAt: string,

})[]` Player name aliases
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 */
      playerAliasControllerGetAliases: ({ id }: PlayerAliasControllerGetAliasesParams, params: RequestParams = {}) =>
         this.request<
            {
               id: number;
               alias: string;
               disabled: boolean;
               createdAt: string;
            }[],
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
         >({
            path: `/api/v2/players/${id}/aliases`,
            method: 'GET',
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags PlayerAlias
 * @name PlayerAliasControllerDisableAlias
 * @request POST:/api/v2/players/{id}/aliases/{aliasId}/disable
 * @response `200` `{
    success: boolean,

}` Alias disable result
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      playerAliasControllerDisableAlias: ({ id, aliasId }: PlayerAliasControllerDisableAliasParams, params: RequestParams = {}) =>
         this.request<
            {
               success: boolean;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/players/${id}/aliases/${aliasId}/disable`,
            method: 'POST',
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags PlayerAlias
 * @name PlayerAliasControllerDisableAllAliases
 * @request POST:/api/v2/players/{id}/aliases/disable-all
 * @response `200` `{
    success: boolean,

}` Disable all aliases for a player
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 */
      playerAliasControllerDisableAllAliases: ({ id }: PlayerAliasControllerDisableAllAliasesParams, params: RequestParams = {}) =>
         this.request<
            {
               success: boolean;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
         >({
            path: `/api/v2/players/${id}/aliases/disable-all`,
            method: 'POST',
            format: 'json',
            ...params
         })
   };
   leaderboard = {
      /**
 * No description
 *
 * @tags Leaderboard
 * @name LeaderboardControllerGetLeaderboardListings
 * @request GET:/api/v2/leaderboards
 * @response `200` `{
    data: ({
    id: number,
    map: {
    id: number,
    hash: string,
    bsid: string | null,
    songName: string,
    songSubName: string,
    songAuthorName: string,
    levelAuthorName: string,
    bpm: number,
    coverUrl: string,
    verified: boolean,

},
    difficulty: {
    id: number,
    difficulty: number,
    rawDifficulty: string,
    gameMode: string,

},
    maxScore: number,
    totalScores: number,
    dailyScores: number,
    createdAt: string,
    realm: {
    realmId: number,
    realmName: string,
    leaderboardStatus: "UNRANKED" | "RANKED" | "QUALIFIED" | "LOVED",
    positiveModifiers: boolean,
    stars: number,
    rankedAt: string | null,
    qualifiedAt: string | null,
    lovedAt: string | null,

},

})[],
    metadata: {
    page: number,
    itemsPerPage: number,
    totalItems: number,
    totalPages: number,

},

}` Paginated leaderboard listings
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      leaderboardControllerGetLeaderboardListings: (query: LeaderboardControllerGetLeaderboardListingsParams, params: RequestParams = {}) =>
         this.request<
            {
               data: {
                  id: number;
                  map: {
                     id: number;
                     hash: string;
                     bsid: string | null;
                     songName: string;
                     songSubName: string;
                     songAuthorName: string;
                     levelAuthorName: string;
                     bpm: number;
                     coverUrl: string;
                     verified: boolean;
                  };
                  difficulty: {
                     id: number;
                     difficulty: number;
                     rawDifficulty: string;
                     gameMode: string;
                  };
                  maxScore: number;
                  totalScores: number;
                  dailyScores: number;
                  createdAt: string;
                  realm: {
                     realmId: number;
                     realmName: string;
                     leaderboardStatus: 'UNRANKED' | 'RANKED' | 'QUALIFIED' | 'LOVED';
                     positiveModifiers: boolean;
                     stars: number;
                     rankedAt: string | null;
                     qualifiedAt: string | null;
                     lovedAt: string | null;
                  };
               }[];
               metadata: {
                  page: number;
                  itemsPerPage: number;
                  totalItems: number;
                  totalPages: number;
               };
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/leaderboards`,
            method: 'GET',
            query: query,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags Leaderboard
 * @name LeaderboardControllerGetLeaderboardById
 * @request GET:/api/v2/leaderboards/{id}
 * @response `200` `{
    id: number,
    map: {
    id: number,
    hash: string,
    bsid: string | null,
    songName: string,
    songSubName: string,
    songAuthorName: string,
    levelAuthorName: string,
    bpm: number,
    coverUrl: string,
    verified: boolean,

},
    difficulty: {
    id: number,
    difficulty: number,
    rawDifficulty: string,
    gameMode: string,

},
    maxScore: number,
    totalScores: number,
    dailyScores: number,
    createdAt: string,
    realm: {
    realmId: number,
    realmName: string,
    leaderboardStatus: "UNRANKED" | "RANKED" | "QUALIFIED" | "LOVED",
    positiveModifiers: boolean,
    stars: number,
    rankedAt: string | null,
    qualifiedAt: string | null,
    lovedAt: string | null,

},

}` Leaderboard details
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      leaderboardControllerGetLeaderboardById: ({ id, ...query }: LeaderboardControllerGetLeaderboardByIdParams, params: RequestParams = {}) =>
         this.request<
            {
               id: number;
               map: {
                  id: number;
                  hash: string;
                  bsid: string | null;
                  songName: string;
                  songSubName: string;
                  songAuthorName: string;
                  levelAuthorName: string;
                  bpm: number;
                  coverUrl: string;
                  verified: boolean;
               };
               difficulty: {
                  id: number;
                  difficulty: number;
                  rawDifficulty: string;
                  gameMode: string;
               };
               maxScore: number;
               totalScores: number;
               dailyScores: number;
               createdAt: string;
               realm: {
                  realmId: number;
                  realmName: string;
                  leaderboardStatus: 'UNRANKED' | 'RANKED' | 'QUALIFIED' | 'LOVED';
                  positiveModifiers: boolean;
                  stars: number;
                  rankedAt: string | null;
                  qualifiedAt: string | null;
                  lovedAt: string | null;
               };
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/leaderboards/${id}`,
            method: 'GET',
            query: query,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags Leaderboard
 * @name LeaderboardControllerGetLeaderboardScoresById
 * @request GET:/api/v2/leaderboards/{id}/scores
 * @response `200` `{
    data: ({
    id: number,
    rank: number,
    unmodifiedScore: number,
    modifiedScore: number,
    accuracy: number,
    pp: number,
    weight: number,
    mods: (string)[],
    badCuts: number,
    missedNotes: number,
    maxCombo: number,
    fullCombo: boolean,
    hasReplay: boolean,
    personalBest: boolean,
    legacyHmdId: number | null,
    version: string | null,
    createdAt: string,
    player: {
    id: string,
    name: string,
    country: string,
    role: string | null,
    avatar: string,
    permissions: number,

},
    device: {
    hmd: string | null,
    controllerLeft: string | null,
    controllerRight: string | null,

} | null,

})[],
    metadata: {
    page: number,
    itemsPerPage: number,
    totalItems: number,
    totalPages: number,

},

}` Paginated leaderboard scores
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      leaderboardControllerGetLeaderboardScoresById: (
         { id, ...query }: LeaderboardControllerGetLeaderboardScoresByIdParams,
         params: RequestParams = {}
      ) =>
         this.request<
            {
               data: {
                  id: number;
                  rank: number;
                  unmodifiedScore: number;
                  modifiedScore: number;
                  accuracy: number;
                  pp: number;
                  weight: number;
                  mods: string[];
                  badCuts: number;
                  missedNotes: number;
                  maxCombo: number;
                  fullCombo: boolean;
                  hasReplay: boolean;
                  personalBest: boolean;
                  legacyHmdId: number | null;
                  version: string | null;
                  createdAt: string;
                  player: {
                     id: string;
                     name: string;
                     country: string;
                     role: string | null;
                     avatar: string;
                     permissions: number;
                  };
                  device: {
                     hmd: string | null;
                     controllerLeft: string | null;
                     controllerRight: string | null;
                  } | null;
               }[];
               metadata: {
                  page: number;
                  itemsPerPage: number;
                  totalItems: number;
                  totalPages: number;
               };
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/leaderboards/${id}/scores`,
            method: 'GET',
            query: query,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags Leaderboard
 * @name LeaderboardControllerGetDifficultiesForHash
 * @request GET:/api/v2/leaderboards/hash/{hash}
 * @response `200` `({
    id: number,
    difficulty: number,
    rawDifficulty: string,
    gameMode: string,

})[]` Difficulties for map hash
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      leaderboardControllerGetDifficultiesForHash: (
         { hash, ...query }: LeaderboardControllerGetDifficultiesForHashParams,
         params: RequestParams = {}
      ) =>
         this.request<
            {
               id: number;
               difficulty: number;
               rawDifficulty: string;
               gameMode: string;
            }[],
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/leaderboards/hash/${hash}`,
            method: 'GET',
            query: query,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags Leaderboard
 * @name LeaderboardControllerGetLeaderboardByHash
 * @request GET:/api/v2/leaderboards/hash/{hash}/{mode}/{difficulty}
 * @response `200` `{
    id: number,
    map: {
    id: number,
    hash: string,
    bsid: string | null,
    songName: string,
    songSubName: string,
    songAuthorName: string,
    levelAuthorName: string,
    bpm: number,
    coverUrl: string,
    verified: boolean,

},
    difficulty: {
    id: number,
    difficulty: number,
    rawDifficulty: string,
    gameMode: string,

},
    maxScore: number,
    totalScores: number,
    dailyScores: number,
    createdAt: string,
    realm: {
    realmId: number,
    realmName: string,
    leaderboardStatus: "UNRANKED" | "RANKED" | "QUALIFIED" | "LOVED",
    positiveModifiers: boolean,
    stars: number,
    rankedAt: string | null,
    qualifiedAt: string | null,
    lovedAt: string | null,

},

}` Leaderboard by hash and difficulty
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      leaderboardControllerGetLeaderboardByHash: (
         { hash, mode, difficulty, ...query }: LeaderboardControllerGetLeaderboardByHashParams,
         params: RequestParams = {}
      ) =>
         this.request<
            {
               id: number;
               map: {
                  id: number;
                  hash: string;
                  bsid: string | null;
                  songName: string;
                  songSubName: string;
                  songAuthorName: string;
                  levelAuthorName: string;
                  bpm: number;
                  coverUrl: string;
                  verified: boolean;
               };
               difficulty: {
                  id: number;
                  difficulty: number;
                  rawDifficulty: string;
                  gameMode: string;
               };
               maxScore: number;
               totalScores: number;
               dailyScores: number;
               createdAt: string;
               realm: {
                  realmId: number;
                  realmName: string;
                  leaderboardStatus: 'UNRANKED' | 'RANKED' | 'QUALIFIED' | 'LOVED';
                  positiveModifiers: boolean;
                  stars: number;
                  rankedAt: string | null;
                  qualifiedAt: string | null;
                  lovedAt: string | null;
               };
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/leaderboards/hash/${hash}/${mode}/${difficulty}`,
            method: 'GET',
            query: query,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags Leaderboard
 * @name LeaderboardControllerGetLeaderboardScoresByHash
 * @request GET:/api/v2/leaderboards/hash/{hash}/{mode}/{difficulty}/scores
 * @response `200` `{
    data: ({
    id: number,
    rank: number,
    unmodifiedScore: number,
    modifiedScore: number,
    accuracy: number,
    pp: number,
    weight: number,
    mods: (string)[],
    badCuts: number,
    missedNotes: number,
    maxCombo: number,
    fullCombo: boolean,
    hasReplay: boolean,
    personalBest: boolean,
    legacyHmdId: number | null,
    version: string | null,
    createdAt: string,
    player: {
    id: string,
    name: string,
    country: string,
    role: string | null,
    avatar: string,
    permissions: number,

},
    device: {
    hmd: string | null,
    controllerLeft: string | null,
    controllerRight: string | null,

} | null,

})[],
    metadata: {
    page: number,
    itemsPerPage: number,
    totalItems: number,
    totalPages: number,

},

}` Scores by hash and difficulty
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      leaderboardControllerGetLeaderboardScoresByHash: (
         { hash, mode, difficulty, ...query }: LeaderboardControllerGetLeaderboardScoresByHashParams,
         params: RequestParams = {}
      ) =>
         this.request<
            {
               data: {
                  id: number;
                  rank: number;
                  unmodifiedScore: number;
                  modifiedScore: number;
                  accuracy: number;
                  pp: number;
                  weight: number;
                  mods: string[];
                  badCuts: number;
                  missedNotes: number;
                  maxCombo: number;
                  fullCombo: boolean;
                  hasReplay: boolean;
                  personalBest: boolean;
                  legacyHmdId: number | null;
                  version: string | null;
                  createdAt: string;
                  player: {
                     id: string;
                     name: string;
                     country: string;
                     role: string | null;
                     avatar: string;
                     permissions: number;
                  };
                  device: {
                     hmd: string | null;
                     controllerLeft: string | null;
                     controllerRight: string | null;
                  } | null;
               }[];
               metadata: {
                  page: number;
                  itemsPerPage: number;
                  totalItems: number;
                  totalPages: number;
               };
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/leaderboards/hash/${hash}/${mode}/${difficulty}/scores`,
            method: 'GET',
            query: query,
            format: 'json',
            ...params
         })
   };
   map = {
      /**
 * No description
 *
 * @tags Map
 * @name MapControllerGetMapListings
 * @request GET:/api/v2/maps
 * @response `200` `{
    data: ({
    id: number,
    hash: string,
    bsid: string | null,
    songName: string,
    songSubName: string,
    songAuthorName: string,
    levelAuthorName: string,
    bpm: number,
    coverUrl: string,
    verified: boolean,
    totalScores: number,
    dailyScores: number,
    createdAt: string,
    leaderboards: ({
    id: number,
    difficulty: number,
    gameMode: string,
    rawDifficulty: string,
    maxScore: number,
    totalScores: number,
    dailyScores: number,
    createdAt: string,
    realm: {
    realmId: number,
    realmName: string,
    leaderboardStatus: "UNRANKED" | "RANKED" | "QUALIFIED" | "LOVED",
    positiveModifiers: boolean,
    stars: number,
    rankedAt: string | null,
    qualifiedAt: string | null,
    lovedAt: string | null,

},

})[],

})[],
    metadata: {
    page: number,
    itemsPerPage: number,
    totalItems: number,
    totalPages: number,

},

}` Paginated map listings
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      mapControllerGetMapListings: (query: MapControllerGetMapListingsParams, params: RequestParams = {}) =>
         this.request<
            {
               data: {
                  id: number;
                  hash: string;
                  bsid: string | null;
                  songName: string;
                  songSubName: string;
                  songAuthorName: string;
                  levelAuthorName: string;
                  bpm: number;
                  coverUrl: string;
                  verified: boolean;
                  totalScores: number;
                  dailyScores: number;
                  createdAt: string;
                  leaderboards: {
                     id: number;
                     difficulty: number;
                     gameMode: string;
                     rawDifficulty: string;
                     maxScore: number;
                     totalScores: number;
                     dailyScores: number;
                     createdAt: string;
                     realm: {
                        realmId: number;
                        realmName: string;
                        leaderboardStatus: 'UNRANKED' | 'RANKED' | 'QUALIFIED' | 'LOVED';
                        positiveModifiers: boolean;
                        stars: number;
                        rankedAt: string | null;
                        qualifiedAt: string | null;
                        lovedAt: string | null;
                     };
                  }[];
               }[];
               metadata: {
                  page: number;
                  itemsPerPage: number;
                  totalItems: number;
                  totalPages: number;
               };
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/maps`,
            method: 'GET',
            query: query,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags Map
 * @name MapControllerGetMapById
 * @request GET:/api/v2/maps/{id}
 * @response `200` `{
    id: number,
    hash: string,
    bsid: string | null,
    songName: string,
    songSubName: string,
    songAuthorName: string,
    levelAuthorName: string,
    bpm: number,
    coverUrl: string,
    verified: boolean,
    totalScores: number,
    dailyScores: number,
    createdAt: string,
    leaderboards: ({
    id: number,
    difficulty: number,
    gameMode: string,
    rawDifficulty: string,
    maxScore: number,
    totalScores: number,
    dailyScores: number,
    createdAt: string,
    realm: {
    realmId: number,
    realmName: string,
    leaderboardStatus: "UNRANKED" | "RANKED" | "QUALIFIED" | "LOVED",
    positiveModifiers: boolean,
    stars: number,
    rankedAt: string | null,
    qualifiedAt: string | null,
    lovedAt: string | null,

},

})[],
    rankRequest: {
    id: number,
    description: string,
    requestType: "RANK" | "UNRANK",
    approvalStatus: "PENDING" | "QUALIFIED" | "APPROVED" | "DENIED" | "REPLACED",
    replacedBy: {
    id: number,
    map: {
    id: number,
    hash: string,
    bsid: string | null,
    songName: string,
    songSubName: string,
    songAuthorName: string,
    levelAuthorName: string,
    bpm: number,
    coverUrl: string,
    verified: boolean,

},

} | null,
    replacedFrom: {
    id: number,
    map: {
    id: number,
    hash: string,
    bsid: string | null,
    songName: string,
    songSubName: string,
    songAuthorName: string,
    levelAuthorName: string,
    bpm: number,
    coverUrl: string,
    verified: boolean,

},

} | null,
    weight: number,
    createdAt: string,
    difficulties: ({
    id: number,
    description: string,
    approvalStatus: "PENDING" | "QUALIFIED" | "APPROVED" | "DENIED" | "REPLACED",
    leaderboard: {
    id: number,
    map: {
    id: number,
    hash: string,
    bsid: string | null,
    songName: string,
    songSubName: string,
    songAuthorName: string,
    levelAuthorName: string,
    bpm: number,
    coverUrl: string,
    verified: boolean,

},
    difficulty: {
    id: number,
    difficulty: number,
    rawDifficulty: string,
    gameMode: string,

},
    maxScore: number,
    totalScores: number,
    dailyScores: number,
    createdAt: string,
    realm: {
    realmId: number,
    realmName: string,
    leaderboardStatus: "UNRANKED" | "RANKED" | "QUALIFIED" | "LOVED",
    positiveModifiers: boolean,
    stars: number,
    rankedAt: string | null,
    qualifiedAt: string | null,
    lovedAt: string | null,

},

},
    rtVotes: {
    upvotes: number,
    downvotes: number,
    myVote: "UPVOTE" | "DOWNVOTE" | null,

},
    qatVotes: {
    upvotes: number,
    downvotes: number,
    neutrals: number,
    myVote: "UPVOTE" | "DOWNVOTE" | "NEUTRAL" | null,

},
    rtComments: ({
    id: number,
    player: {
    id: string,
    name: string,
    country: string,
    role: string | null,
    avatar: string,
    permissions: number,

},
    comment: string,
    createdAt: string,
    edited: boolean,

})[],
    qatComments: ({
    id: number,
    player: {
    id: string,
    name: string,
    country: string,
    role: string | null,
    avatar: string,
    permissions: number,

},
    comment: string,
    createdAt: string,
    edited: boolean,

})[],

})[],
    commentsObfuscated: boolean,

} | null,

}` Map details with rank request
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      mapControllerGetMapById: ({ id, ...query }: MapControllerGetMapByIdParams, params: RequestParams = {}) =>
         this.request<
            {
               id: number;
               hash: string;
               bsid: string | null;
               songName: string;
               songSubName: string;
               songAuthorName: string;
               levelAuthorName: string;
               bpm: number;
               coverUrl: string;
               verified: boolean;
               totalScores: number;
               dailyScores: number;
               createdAt: string;
               leaderboards: {
                  id: number;
                  difficulty: number;
                  gameMode: string;
                  rawDifficulty: string;
                  maxScore: number;
                  totalScores: number;
                  dailyScores: number;
                  createdAt: string;
                  realm: {
                     realmId: number;
                     realmName: string;
                     leaderboardStatus: 'UNRANKED' | 'RANKED' | 'QUALIFIED' | 'LOVED';
                     positiveModifiers: boolean;
                     stars: number;
                     rankedAt: string | null;
                     qualifiedAt: string | null;
                     lovedAt: string | null;
                  };
               }[];
               rankRequest: {
                  id: number;
                  description: string;
                  requestType: 'RANK' | 'UNRANK';
                  approvalStatus: 'PENDING' | 'QUALIFIED' | 'APPROVED' | 'DENIED' | 'REPLACED';
                  replacedBy: {
                     id: number;
                     map: {
                        id: number;
                        hash: string;
                        bsid: string | null;
                        songName: string;
                        songSubName: string;
                        songAuthorName: string;
                        levelAuthorName: string;
                        bpm: number;
                        coverUrl: string;
                        verified: boolean;
                     };
                  } | null;
                  replacedFrom: {
                     id: number;
                     map: {
                        id: number;
                        hash: string;
                        bsid: string | null;
                        songName: string;
                        songSubName: string;
                        songAuthorName: string;
                        levelAuthorName: string;
                        bpm: number;
                        coverUrl: string;
                        verified: boolean;
                     };
                  } | null;
                  weight: number;
                  createdAt: string;
                  difficulties: {
                     id: number;
                     description: string;
                     approvalStatus: 'PENDING' | 'QUALIFIED' | 'APPROVED' | 'DENIED' | 'REPLACED';
                     leaderboard: {
                        id: number;
                        map: {
                           id: number;
                           hash: string;
                           bsid: string | null;
                           songName: string;
                           songSubName: string;
                           songAuthorName: string;
                           levelAuthorName: string;
                           bpm: number;
                           coverUrl: string;
                           verified: boolean;
                        };
                        difficulty: {
                           id: number;
                           difficulty: number;
                           rawDifficulty: string;
                           gameMode: string;
                        };
                        maxScore: number;
                        totalScores: number;
                        dailyScores: number;
                        createdAt: string;
                        realm: {
                           realmId: number;
                           realmName: string;
                           leaderboardStatus: 'UNRANKED' | 'RANKED' | 'QUALIFIED' | 'LOVED';
                           positiveModifiers: boolean;
                           stars: number;
                           rankedAt: string | null;
                           qualifiedAt: string | null;
                           lovedAt: string | null;
                        };
                     };
                     rtVotes: {
                        upvotes: number;
                        downvotes: number;
                        myVote: 'UPVOTE' | 'DOWNVOTE' | null;
                     };
                     qatVotes: {
                        upvotes: number;
                        downvotes: number;
                        neutrals: number;
                        myVote: 'UPVOTE' | 'DOWNVOTE' | 'NEUTRAL' | null;
                     };
                     rtComments: {
                        id: number;
                        player: {
                           id: string;
                           name: string;
                           country: string;
                           role: string | null;
                           avatar: string;
                           permissions: number;
                        };
                        comment: string;
                        createdAt: string;
                        edited: boolean;
                     }[];
                     qatComments: {
                        id: number;
                        player: {
                           id: string;
                           name: string;
                           country: string;
                           role: string | null;
                           avatar: string;
                           permissions: number;
                        };
                        comment: string;
                        createdAt: string;
                        edited: boolean;
                     }[];
                  }[];
                  commentsObfuscated: boolean;
               } | null;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/maps/${id}`,
            method: 'GET',
            query: query,
            format: 'json',
            ...params
         })
   };
   auth = {
      /**
 * No description
 *
 * @tags Auth
 * @name AuthControllerSteamLogin
 * @request GET:/api/v2/auth/steam
 * @response `200` `{
    redirectUrl: string,

}` Steam OpenID redirect URL
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 */
      authControllerSteamLogin: (query: AuthControllerSteamLoginParams, params: RequestParams = {}) =>
         this.request<
            {
               redirectUrl: string;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
         >({
            path: `/api/v2/auth/steam`,
            method: 'GET',
            query: query,
            format: 'json',
            ...params
         }),

      /**
       * No description
       *
       * @tags Auth
       * @name AuthControllerSteamCallback
       * @request GET:/api/v2/auth/steam/callback
       * @response `200` `void`
       */
      authControllerSteamCallback: (params: RequestParams = {}) =>
         this.request<void, any>({
            path: `/api/v2/auth/steam/callback`,
            method: 'GET',
            ...params
         }),

      /**
 * No description
 *
 * @tags Auth
 * @name AuthControllerPatreonLogin
 * @request GET:/api/v2/auth/patreon
 * @response `200` `{
    redirectUrl: string,

}` Patreon OAuth redirect URL
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 */
      authControllerPatreonLogin: (query: AuthControllerPatreonLoginParams, params: RequestParams = {}) =>
         this.request<
            {
               redirectUrl: string;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
         >({
            path: `/api/v2/auth/patreon`,
            method: 'GET',
            query: query,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags Auth
 * @name AuthControllerPatreonCallback
 * @request GET:/api/v2/auth/patreon/callback
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request
 */
      authControllerPatreonCallback: (query: AuthControllerPatreonCallbackParams, params: RequestParams = {}) =>
         this.request<
            any,
            | {
                 statusCode: 400;
                 error: 'Bad Request';
                 code: 'VALIDATION_ERROR';
                 message: string;
                 details?: {
                    field?: string;
                 };
              }
            | {
                 statusCode: 400;
                 error: 'Bad Request';
                 code: 'REQUEST_VALIDATION_ERROR';
                 message: string;
                 details: {
                    errors: {
                       path: string;
                       message: string;
                    }[];
                 };
              }
            | {
                 statusCode: 400;
                 error: 'Bad Request';
                 code: 'INVALID_PATH_PARAMETER';
                 message: string;
                 details: {
                    errors: {
                       path: string;
                       message: string;
                    }[];
                 };
              }
         >({
            path: `/api/v2/auth/patreon/callback`,
            method: 'GET',
            query: query,
            ...params
         }),

      /**
 * No description
 *
 * @tags Auth
 * @name AuthControllerDiscordLogin
 * @request GET:/api/v2/auth/discord
 * @response `200` `{
    redirectUrl: string,

}` Discord OAuth redirect URL
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 */
      authControllerDiscordLogin: (query: AuthControllerDiscordLoginParams, params: RequestParams = {}) =>
         this.request<
            {
               redirectUrl: string;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
         >({
            path: `/api/v2/auth/discord`,
            method: 'GET',
            query: query,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags Auth
 * @name AuthControllerDiscordCallback
 * @request GET:/api/v2/auth/discord/callback
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request
 */
      authControllerDiscordCallback: (query: AuthControllerDiscordCallbackParams, params: RequestParams = {}) =>
         this.request<
            any,
            | {
                 statusCode: 400;
                 error: 'Bad Request';
                 code: 'VALIDATION_ERROR';
                 message: string;
                 details?: {
                    field?: string;
                 };
              }
            | {
                 statusCode: 400;
                 error: 'Bad Request';
                 code: 'REQUEST_VALIDATION_ERROR';
                 message: string;
                 details: {
                    errors: {
                       path: string;
                       message: string;
                    }[];
                 };
              }
            | {
                 statusCode: 400;
                 error: 'Bad Request';
                 code: 'INVALID_PATH_PARAMETER';
                 message: string;
                 details: {
                    errors: {
                       path: string;
                       message: string;
                    }[];
                 };
              }
         >({
            path: `/api/v2/auth/discord/callback`,
            method: 'GET',
            query: query,
            ...params
         }),

      /**
 * No description
 *
 * @tags Auth
 * @name AuthControllerGetToken
 * @request GET:/api/v2/auth/token
 * @response `200` `{
    token: string,

}` New session token
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 */
      authControllerGetToken: (params: RequestParams = {}) =>
         this.request<
            {
               token: string;
            },
            {
               statusCode: 401;
               error: 'Unauthorized';
               code: 'UNAUTHORIZED';
               message: string;
            }
         >({
            path: `/api/v2/auth/token`,
            method: 'GET',
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags Auth
 * @name AuthControllerStartEmailLogin
 * @request POST:/api/v2/auth/email/start
 * @response `200` `{
    challengeId: string,
    expiresAt: string,
    resendAvailableAt: string,

}` Start an email one-time-code login challenge
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `500` `({
    statusCode: 500,
    error: "Internal Server Error",
    code: "EXTERNAL_SERVICE_ERROR",
    message: string,
    details: {
    service: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "DATABASE_WRITE_ERROR",
    message: string,
    details: {
    operation: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "INTERNAL_SERVER_ERROR",
    message: string,

})` Internal Server Error
 */
      authControllerStartEmailLogin: (data: AuthControllerStartEmailLoginPayload, params: RequestParams = {}) =>
         this.request<
            {
               challengeId: string;
               expiresAt: string;
               resendAvailableAt: string;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | (
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'EXTERNAL_SERVICE_ERROR';
                      message: string;
                      details: {
                         service: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'DATABASE_WRITE_ERROR';
                      message: string;
                      details: {
                         operation: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'INTERNAL_SERVER_ERROR';
                      message: string;
                   }
              )
         >({
            path: `/api/v2/auth/email/start`,
            method: 'POST',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags Auth
 * @name AuthControllerVerifyEmailLogin
 * @request POST:/api/v2/auth/email/verify
 * @response `200` `({
    status: "authenticated",
    token: string,
  /** @pattern ^\d+$ *\/
    playerId: string,

} | {
    status: "pending-game-auth",

} | {
    status: "support-required",

})` Verify an email one-time-code login challenge
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `500` `({
    statusCode: 500,
    error: "Internal Server Error",
    code: "EXTERNAL_SERVICE_ERROR",
    message: string,
    details: {
    service: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "DATABASE_WRITE_ERROR",
    message: string,
    details: {
    operation: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "INTERNAL_SERVER_ERROR",
    message: string,

})` Internal Server Error
 */
      authControllerVerifyEmailLogin: (data: AuthControllerVerifyEmailLoginPayload, params: RequestParams = {}) =>
         this.request<
            | {
                 status: 'authenticated';
                 token: string;
                 /** @pattern ^\d+$ */
                 playerId: string;
              }
            | {
                 status: 'pending-game-auth';
              }
            | {
                 status: 'support-required';
              },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | (
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'EXTERNAL_SERVICE_ERROR';
                      message: string;
                      details: {
                         service: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'DATABASE_WRITE_ERROR';
                      message: string;
                      details: {
                         operation: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'INTERNAL_SERVER_ERROR';
                      message: string;
                   }
              )
         >({
            path: `/api/v2/auth/email/verify`,
            method: 'POST',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags Auth
 * @name AuthControllerLogout
 * @request POST:/api/v2/auth/logout
 * @response `200` `{
    success: boolean,

}` Logout result
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `500` `({
    statusCode: 500,
    error: "Internal Server Error",
    code: "EXTERNAL_SERVICE_ERROR",
    message: string,
    details: {
    service: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "DATABASE_WRITE_ERROR",
    message: string,
    details: {
    operation: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "INTERNAL_SERVER_ERROR",
    message: string,

})` Internal Server Error
 */
      authControllerLogout: (params: RequestParams = {}) =>
         this.request<
            {
               success: boolean;
            },
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | (
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'EXTERNAL_SERVICE_ERROR';
                      message: string;
                      details: {
                         service: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'DATABASE_WRITE_ERROR';
                      message: string;
                      details: {
                         operation: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'INTERNAL_SERVER_ERROR';
                      message: string;
                   }
              )
         >({
            path: `/api/v2/auth/logout`,
            method: 'POST',
            format: 'json',
            ...params
         })
   };
   game = {
      /**
 * No description
 *
 * @tags Game
 * @name GameControllerAuthenticate
 * @request POST:/api/v2/game/auth
 * @response `200` `{
    id: string,
    name: string,
    country: string,
    role: string | null,
    avatar: string,
    permissions: number,
    banned: boolean,
    silenced: boolean,
    inactive: boolean,
    stats: {
    realmId: number,
    realmName: string,
    rank: number,
    countryRank: number,
    totalPP: number,
    totalScore: string,
    totalRankedScore: string,
    totalPlayedLeaderboards: number,
    totalPlayedRankedLeaderboards: number,
    totalSubmittedPlays: number,
    totalReplayViews: number,
    averageAccuracy: number,
    weightedAverageAccuracy: number,
    completionAccuracy: number,
    device: {
    hmd: string | null,
    controllerLeft: string | null,
    controllerRight: string | null,

} | null,

},
    bio: string | null,
    createdAt: string,
    lastSeenAt: string,
    badges: ({
    id: number,
    image: string,
    description: string,

})[],
    followers: number,
    following: number,
    relationships: {
    followers: ({
    id: string,
    name: string,
    country: string,
    role: string | null,
    avatar: string,
    permissions: number,
    banned: boolean,
    silenced: boolean,
    inactive: boolean,
    stats: {
    realmId: number,
    realmName: string,
    rank: number,
    countryRank: number,
    totalPP: number,
    totalScore: string,
    totalRankedScore: string,
    totalPlayedLeaderboards: number,
    totalPlayedRankedLeaderboards: number,
    totalSubmittedPlays: number,
    totalReplayViews: number,
    averageAccuracy: number,
    weightedAverageAccuracy: number,
    completionAccuracy: number,
    device: {
    hmd: string | null,
    controllerLeft: string | null,
    controllerRight: string | null,

} | null,

},
    relation: "platform-friend" | "follow",

})[],
    following: ({
    id: string,
    name: string,
    country: string,
    role: string | null,
    avatar: string,
    permissions: number,
    banned: boolean,
    silenced: boolean,
    inactive: boolean,
    stats: {
    realmId: number,
    realmName: string,
    rank: number,
    countryRank: number,
    totalPP: number,
    totalScore: string,
    totalRankedScore: string,
    totalPlayedLeaderboards: number,
    totalPlayedRankedLeaderboards: number,
    totalSubmittedPlays: number,
    totalReplayViews: number,
    averageAccuracy: number,
    weightedAverageAccuracy: number,
    completionAccuracy: number,
    device: {
    hmd: string | null,
    controllerLeft: string | null,
    controllerRight: string | null,

} | null,

},
    relation: "platform-friend" | "follow",

})[],
    mutuals: ({
    id: string,
    name: string,
    country: string,
    role: string | null,
    avatar: string,
    permissions: number,
    banned: boolean,
    silenced: boolean,
    inactive: boolean,
    stats: {
    realmId: number,
    realmName: string,
    rank: number,
    countryRank: number,
    totalPP: number,
    totalScore: string,
    totalRankedScore: string,
    totalPlayedLeaderboards: number,
    totalPlayedRankedLeaderboards: number,
    totalSubmittedPlays: number,
    totalReplayViews: number,
    averageAccuracy: number,
    weightedAverageAccuracy: number,
    completionAccuracy: number,
    device: {
    hmd: string | null,
    controllerLeft: string | null,
    controllerRight: string | null,

} | null,

},
    relation: "platform-friend" | "follow",

})[],

},

}` Authenticated player profile
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `403` `{
    statusCode: 403,
    error: "Forbidden",
    code: "FORBIDDEN",
    message: string,
    details?: {
    reason: string,

},

}` Forbidden
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 * @response `500` `({
    statusCode: 500,
    error: "Internal Server Error",
    code: "EXTERNAL_SERVICE_ERROR",
    message: string,
    details: {
    service: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "DATABASE_WRITE_ERROR",
    message: string,
    details: {
    operation: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "INTERNAL_SERVER_ERROR",
    message: string,

})` Internal Server Error
 */
      gameControllerAuthenticate: (params: RequestParams = {}) =>
         this.request<
            {
               id: string;
               name: string;
               country: string;
               role: string | null;
               avatar: string;
               permissions: number;
               banned: boolean;
               silenced: boolean;
               inactive: boolean;
               stats: {
                  realmId: number;
                  realmName: string;
                  rank: number;
                  countryRank: number;
                  totalPP: number;
                  totalScore: string;
                  totalRankedScore: string;
                  totalPlayedLeaderboards: number;
                  totalPlayedRankedLeaderboards: number;
                  totalSubmittedPlays: number;
                  totalReplayViews: number;
                  averageAccuracy: number;
                  weightedAverageAccuracy: number;
                  completionAccuracy: number;
                  device: {
                     hmd: string | null;
                     controllerLeft: string | null;
                     controllerRight: string | null;
                  } | null;
               };
               bio: string | null;
               createdAt: string;
               lastSeenAt: string;
               badges: {
                  id: number;
                  image: string;
                  description: string;
               }[];
               followers: number;
               following: number;
               relationships: {
                  followers: {
                     id: string;
                     name: string;
                     country: string;
                     role: string | null;
                     avatar: string;
                     permissions: number;
                     banned: boolean;
                     silenced: boolean;
                     inactive: boolean;
                     stats: {
                        realmId: number;
                        realmName: string;
                        rank: number;
                        countryRank: number;
                        totalPP: number;
                        totalScore: string;
                        totalRankedScore: string;
                        totalPlayedLeaderboards: number;
                        totalPlayedRankedLeaderboards: number;
                        totalSubmittedPlays: number;
                        totalReplayViews: number;
                        averageAccuracy: number;
                        weightedAverageAccuracy: number;
                        completionAccuracy: number;
                        device: {
                           hmd: string | null;
                           controllerLeft: string | null;
                           controllerRight: string | null;
                        } | null;
                     };
                     relation: 'platform-friend' | 'follow';
                  }[];
                  following: {
                     id: string;
                     name: string;
                     country: string;
                     role: string | null;
                     avatar: string;
                     permissions: number;
                     banned: boolean;
                     silenced: boolean;
                     inactive: boolean;
                     stats: {
                        realmId: number;
                        realmName: string;
                        rank: number;
                        countryRank: number;
                        totalPP: number;
                        totalScore: string;
                        totalRankedScore: string;
                        totalPlayedLeaderboards: number;
                        totalPlayedRankedLeaderboards: number;
                        totalSubmittedPlays: number;
                        totalReplayViews: number;
                        averageAccuracy: number;
                        weightedAverageAccuracy: number;
                        completionAccuracy: number;
                        device: {
                           hmd: string | null;
                           controllerLeft: string | null;
                           controllerRight: string | null;
                        } | null;
                     };
                     relation: 'platform-friend' | 'follow';
                  }[];
                  mutuals: {
                     id: string;
                     name: string;
                     country: string;
                     role: string | null;
                     avatar: string;
                     permissions: number;
                     banned: boolean;
                     silenced: boolean;
                     inactive: boolean;
                     stats: {
                        realmId: number;
                        realmName: string;
                        rank: number;
                        countryRank: number;
                        totalPP: number;
                        totalScore: string;
                        totalRankedScore: string;
                        totalPlayedLeaderboards: number;
                        totalPlayedRankedLeaderboards: number;
                        totalSubmittedPlays: number;
                        totalReplayViews: number;
                        averageAccuracy: number;
                        weightedAverageAccuracy: number;
                        completionAccuracy: number;
                        device: {
                           hmd: string | null;
                           controllerLeft: string | null;
                           controllerRight: string | null;
                        } | null;
                     };
                     relation: 'platform-friend' | 'follow';
                  }[];
               };
            },
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 403;
                 error: 'Forbidden';
                 code: 'FORBIDDEN';
                 message: string;
                 details?: {
                    reason: string;
                 };
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
            | (
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'EXTERNAL_SERVICE_ERROR';
                      message: string;
                      details: {
                         service: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'DATABASE_WRITE_ERROR';
                      message: string;
                      details: {
                         operation: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'INTERNAL_SERVER_ERROR';
                      message: string;
                   }
              )
         >({
            path: `/api/v2/game/auth`,
            method: 'POST',
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags Game
 * @name GameControllerUploadScore
 * @request POST:/api/v2/game/upload
 * @response `200` `{
    success: true,

}` Score upload result
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `403` `{
    statusCode: 403,
    error: "Forbidden",
    code: "FORBIDDEN",
    message: string,
    details?: {
    reason: string,

},

}` Forbidden
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 * @response `500` `({
    statusCode: 500,
    error: "Internal Server Error",
    code: "EXTERNAL_SERVICE_ERROR",
    message: string,
    details: {
    service: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "DATABASE_WRITE_ERROR",
    message: string,
    details: {
    operation: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "INTERNAL_SERVER_ERROR",
    message: string,

})` Internal Server Error
 */
      gameControllerUploadScore: (params: RequestParams = {}) =>
         this.request<
            {
               success: true;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 403;
                 error: 'Forbidden';
                 code: 'FORBIDDEN';
                 message: string;
                 details?: {
                    reason: string;
                 };
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
            | (
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'EXTERNAL_SERVICE_ERROR';
                      message: string;
                      details: {
                         service: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'DATABASE_WRITE_ERROR';
                      message: string;
                      details: {
                         operation: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'INTERNAL_SERVER_ERROR';
                      message: string;
                   }
              )
         >({
            path: `/api/v2/game/upload`,
            method: 'POST',
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags Game
 * @name GameControllerSetActiveRealms
 * @request PUT:/api/v2/game/realms
 * @response `200` `{
    activeRealmIds: (number)[],

}` Updated active realm IDs
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `500` `({
    statusCode: 500,
    error: "Internal Server Error",
    code: "EXTERNAL_SERVICE_ERROR",
    message: string,
    details: {
    service: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "DATABASE_WRITE_ERROR",
    message: string,
    details: {
    operation: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "INTERNAL_SERVER_ERROR",
    message: string,

})` Internal Server Error
 */
      gameControllerSetActiveRealms: (data: GameControllerSetActiveRealmsPayload, params: RequestParams = {}) =>
         this.request<
            {
               activeRealmIds: number[];
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | (
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'EXTERNAL_SERVICE_ERROR';
                      message: string;
                      details: {
                         service: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'DATABASE_WRITE_ERROR';
                      message: string;
                      details: {
                         operation: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'INTERNAL_SERVER_ERROR';
                      message: string;
                   }
              )
         >({
            path: `/api/v2/game/realms`,
            method: 'PUT',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params
         })
   };
   ranking = {
      /**
 * No description
 *
 * @tags Ranking
 * @name RankingControllerGetRequests
 * @request GET:/api/v2/ranking/requests
 * @response `200` `{
    data: ({
    id: number,
    description: string,
    requestType: "RANK" | "UNRANK",
    approvalStatus: "PENDING" | "QUALIFIED" | "APPROVED" | "DENIED" | "REPLACED",
    weight: number,
    createdAt: string,
    map: {
    id: number,
    hash: string,
    bsid: string | null,
    songName: string,
    songSubName: string,
    songAuthorName: string,
    levelAuthorName: string,
    bpm: number,
    coverUrl: string,
    verified: boolean,

},
    difficultyCount: number,
    totalRtVotes: {
    upvotes: number,
    downvotes: number,
    myVote: "UPVOTE" | "DOWNVOTE" | null,

},
    totalQatVotes: {
    upvotes: number,
    downvotes: number,
    neutrals: number,
    myVote: "UPVOTE" | "DOWNVOTE" | "NEUTRAL" | null,

},

})[],
    metadata: {
    page: number,
    itemsPerPage: number,
    totalItems: number,
    totalPages: number,

},

}` Paginated rank requests
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      rankingControllerGetRequests: (query: RankingControllerGetRequestsParams, params: RequestParams = {}) =>
         this.request<
            {
               data: {
                  id: number;
                  description: string;
                  requestType: 'RANK' | 'UNRANK';
                  approvalStatus: 'PENDING' | 'QUALIFIED' | 'APPROVED' | 'DENIED' | 'REPLACED';
                  weight: number;
                  createdAt: string;
                  map: {
                     id: number;
                     hash: string;
                     bsid: string | null;
                     songName: string;
                     songSubName: string;
                     songAuthorName: string;
                     levelAuthorName: string;
                     bpm: number;
                     coverUrl: string;
                     verified: boolean;
                  };
                  difficultyCount: number;
                  totalRtVotes: {
                     upvotes: number;
                     downvotes: number;
                     myVote: 'UPVOTE' | 'DOWNVOTE' | null;
                  };
                  totalQatVotes: {
                     upvotes: number;
                     downvotes: number;
                     neutrals: number;
                     myVote: 'UPVOTE' | 'DOWNVOTE' | 'NEUTRAL' | null;
                  };
               }[];
               metadata: {
                  page: number;
                  itemsPerPage: number;
                  totalItems: number;
                  totalPages: number;
               };
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/ranking/requests`,
            method: 'GET',
            query: query,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags Ranking
 * @name RankingControllerCreateRequest
 * @request POST:/api/v2/ranking/requests
 * @response `200` `{
    id: number,
    description: string,
    requestType: "RANK" | "UNRANK",
    approvalStatus: "PENDING" | "QUALIFIED" | "APPROVED" | "DENIED" | "REPLACED",
    replacedBy: {
    id: number,
    map: {
    id: number,
    hash: string,
    bsid: string | null,
    songName: string,
    songSubName: string,
    songAuthorName: string,
    levelAuthorName: string,
    bpm: number,
    coverUrl: string,
    verified: boolean,

},

} | null,
    replacedFrom: {
    id: number,
    map: {
    id: number,
    hash: string,
    bsid: string | null,
    songName: string,
    songSubName: string,
    songAuthorName: string,
    levelAuthorName: string,
    bpm: number,
    coverUrl: string,
    verified: boolean,

},

} | null,
    weight: number,
    createdAt: string,
    map: {
    id: number,
    hash: string,
    bsid: string | null,
    songName: string,
    songSubName: string,
    songAuthorName: string,
    levelAuthorName: string,
    bpm: number,
    coverUrl: string,
    verified: boolean,

},
    difficulties: ({
    id: number,
    description: string,
    approvalStatus: "PENDING" | "QUALIFIED" | "APPROVED" | "DENIED" | "REPLACED",
    leaderboard: {
    id: number,
    map: {
    id: number,
    hash: string,
    bsid: string | null,
    songName: string,
    songSubName: string,
    songAuthorName: string,
    levelAuthorName: string,
    bpm: number,
    coverUrl: string,
    verified: boolean,

},
    difficulty: {
    id: number,
    difficulty: number,
    rawDifficulty: string,
    gameMode: string,

},
    maxScore: number,
    totalScores: number,
    dailyScores: number,
    createdAt: string,
    realm: {
    realmId: number,
    realmName: string,
    leaderboardStatus: "UNRANKED" | "RANKED" | "QUALIFIED" | "LOVED",
    positiveModifiers: boolean,
    stars: number,
    rankedAt: string | null,
    qualifiedAt: string | null,
    lovedAt: string | null,

},

},
    rtVotes: {
    upvotes: number,
    downvotes: number,
    myVote: "UPVOTE" | "DOWNVOTE" | null,

},
    qatVotes: {
    upvotes: number,
    downvotes: number,
    neutrals: number,
    myVote: "UPVOTE" | "DOWNVOTE" | "NEUTRAL" | null,

},
    rtComments: ({
    id: number,
    player: {
    id: string,
    name: string,
    country: string,
    role: string | null,
    avatar: string,
    permissions: number,

},
    comment: string,
    createdAt: string,
    edited: boolean,

})[],
    qatComments: ({
    id: number,
    player: {
    id: string,
    name: string,
    country: string,
    role: string | null,
    avatar: string,
    permissions: number,

},
    comment: string,
    createdAt: string,
    edited: boolean,

})[],

})[],
    commentsObfuscated: boolean,

}` Created rank request
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 * @response `500` `({
    statusCode: 500,
    error: "Internal Server Error",
    code: "EXTERNAL_SERVICE_ERROR",
    message: string,
    details: {
    service: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "DATABASE_WRITE_ERROR",
    message: string,
    details: {
    operation: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "INTERNAL_SERVER_ERROR",
    message: string,

})` Internal Server Error
 */
      rankingControllerCreateRequest: (data: RankingControllerCreateRequestPayload, params: RequestParams = {}) =>
         this.request<
            {
               id: number;
               description: string;
               requestType: 'RANK' | 'UNRANK';
               approvalStatus: 'PENDING' | 'QUALIFIED' | 'APPROVED' | 'DENIED' | 'REPLACED';
               replacedBy: {
                  id: number;
                  map: {
                     id: number;
                     hash: string;
                     bsid: string | null;
                     songName: string;
                     songSubName: string;
                     songAuthorName: string;
                     levelAuthorName: string;
                     bpm: number;
                     coverUrl: string;
                     verified: boolean;
                  };
               } | null;
               replacedFrom: {
                  id: number;
                  map: {
                     id: number;
                     hash: string;
                     bsid: string | null;
                     songName: string;
                     songSubName: string;
                     songAuthorName: string;
                     levelAuthorName: string;
                     bpm: number;
                     coverUrl: string;
                     verified: boolean;
                  };
               } | null;
               weight: number;
               createdAt: string;
               map: {
                  id: number;
                  hash: string;
                  bsid: string | null;
                  songName: string;
                  songSubName: string;
                  songAuthorName: string;
                  levelAuthorName: string;
                  bpm: number;
                  coverUrl: string;
                  verified: boolean;
               };
               difficulties: {
                  id: number;
                  description: string;
                  approvalStatus: 'PENDING' | 'QUALIFIED' | 'APPROVED' | 'DENIED' | 'REPLACED';
                  leaderboard: {
                     id: number;
                     map: {
                        id: number;
                        hash: string;
                        bsid: string | null;
                        songName: string;
                        songSubName: string;
                        songAuthorName: string;
                        levelAuthorName: string;
                        bpm: number;
                        coverUrl: string;
                        verified: boolean;
                     };
                     difficulty: {
                        id: number;
                        difficulty: number;
                        rawDifficulty: string;
                        gameMode: string;
                     };
                     maxScore: number;
                     totalScores: number;
                     dailyScores: number;
                     createdAt: string;
                     realm: {
                        realmId: number;
                        realmName: string;
                        leaderboardStatus: 'UNRANKED' | 'RANKED' | 'QUALIFIED' | 'LOVED';
                        positiveModifiers: boolean;
                        stars: number;
                        rankedAt: string | null;
                        qualifiedAt: string | null;
                        lovedAt: string | null;
                     };
                  };
                  rtVotes: {
                     upvotes: number;
                     downvotes: number;
                     myVote: 'UPVOTE' | 'DOWNVOTE' | null;
                  };
                  qatVotes: {
                     upvotes: number;
                     downvotes: number;
                     neutrals: number;
                     myVote: 'UPVOTE' | 'DOWNVOTE' | 'NEUTRAL' | null;
                  };
                  rtComments: {
                     id: number;
                     player: {
                        id: string;
                        name: string;
                        country: string;
                        role: string | null;
                        avatar: string;
                        permissions: number;
                     };
                     comment: string;
                     createdAt: string;
                     edited: boolean;
                  }[];
                  qatComments: {
                     id: number;
                     player: {
                        id: string;
                        name: string;
                        country: string;
                        role: string | null;
                        avatar: string;
                        permissions: number;
                     };
                     comment: string;
                     createdAt: string;
                     edited: boolean;
                  }[];
               }[];
               commentsObfuscated: boolean;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
            | (
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'EXTERNAL_SERVICE_ERROR';
                      message: string;
                      details: {
                         service: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'DATABASE_WRITE_ERROR';
                      message: string;
                      details: {
                         operation: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'INTERNAL_SERVER_ERROR';
                      message: string;
                   }
              )
         >({
            path: `/api/v2/ranking/requests`,
            method: 'POST',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags Ranking
 * @name RankingControllerGetRequestById
 * @request GET:/api/v2/ranking/requests/{id}
 * @response `200` `{
    id: number,
    description: string,
    requestType: "RANK" | "UNRANK",
    approvalStatus: "PENDING" | "QUALIFIED" | "APPROVED" | "DENIED" | "REPLACED",
    replacedBy: {
    id: number,
    map: {
    id: number,
    hash: string,
    bsid: string | null,
    songName: string,
    songSubName: string,
    songAuthorName: string,
    levelAuthorName: string,
    bpm: number,
    coverUrl: string,
    verified: boolean,

},

} | null,
    replacedFrom: {
    id: number,
    map: {
    id: number,
    hash: string,
    bsid: string | null,
    songName: string,
    songSubName: string,
    songAuthorName: string,
    levelAuthorName: string,
    bpm: number,
    coverUrl: string,
    verified: boolean,

},

} | null,
    weight: number,
    createdAt: string,
    map: {
    id: number,
    hash: string,
    bsid: string | null,
    songName: string,
    songSubName: string,
    songAuthorName: string,
    levelAuthorName: string,
    bpm: number,
    coverUrl: string,
    verified: boolean,

},
    difficulties: ({
    id: number,
    description: string,
    approvalStatus: "PENDING" | "QUALIFIED" | "APPROVED" | "DENIED" | "REPLACED",
    leaderboard: {
    id: number,
    map: {
    id: number,
    hash: string,
    bsid: string | null,
    songName: string,
    songSubName: string,
    songAuthorName: string,
    levelAuthorName: string,
    bpm: number,
    coverUrl: string,
    verified: boolean,

},
    difficulty: {
    id: number,
    difficulty: number,
    rawDifficulty: string,
    gameMode: string,

},
    maxScore: number,
    totalScores: number,
    dailyScores: number,
    createdAt: string,
    realm: {
    realmId: number,
    realmName: string,
    leaderboardStatus: "UNRANKED" | "RANKED" | "QUALIFIED" | "LOVED",
    positiveModifiers: boolean,
    stars: number,
    rankedAt: string | null,
    qualifiedAt: string | null,
    lovedAt: string | null,

},

},
    rtVotes: {
    upvotes: number,
    downvotes: number,
    myVote: "UPVOTE" | "DOWNVOTE" | null,

},
    qatVotes: {
    upvotes: number,
    downvotes: number,
    neutrals: number,
    myVote: "UPVOTE" | "DOWNVOTE" | "NEUTRAL" | null,

},
    rtComments: ({
    id: number,
    player: {
    id: string,
    name: string,
    country: string,
    role: string | null,
    avatar: string,
    permissions: number,

},
    comment: string,
    createdAt: string,
    edited: boolean,

})[],
    qatComments: ({
    id: number,
    player: {
    id: string,
    name: string,
    country: string,
    role: string | null,
    avatar: string,
    permissions: number,

},
    comment: string,
    createdAt: string,
    edited: boolean,

})[],

})[],
    commentsObfuscated: boolean,

}` Rank request details
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      rankingControllerGetRequestById: ({ id, ...query }: RankingControllerGetRequestByIdParams, params: RequestParams = {}) =>
         this.request<
            {
               id: number;
               description: string;
               requestType: 'RANK' | 'UNRANK';
               approvalStatus: 'PENDING' | 'QUALIFIED' | 'APPROVED' | 'DENIED' | 'REPLACED';
               replacedBy: {
                  id: number;
                  map: {
                     id: number;
                     hash: string;
                     bsid: string | null;
                     songName: string;
                     songSubName: string;
                     songAuthorName: string;
                     levelAuthorName: string;
                     bpm: number;
                     coverUrl: string;
                     verified: boolean;
                  };
               } | null;
               replacedFrom: {
                  id: number;
                  map: {
                     id: number;
                     hash: string;
                     bsid: string | null;
                     songName: string;
                     songSubName: string;
                     songAuthorName: string;
                     levelAuthorName: string;
                     bpm: number;
                     coverUrl: string;
                     verified: boolean;
                  };
               } | null;
               weight: number;
               createdAt: string;
               map: {
                  id: number;
                  hash: string;
                  bsid: string | null;
                  songName: string;
                  songSubName: string;
                  songAuthorName: string;
                  levelAuthorName: string;
                  bpm: number;
                  coverUrl: string;
                  verified: boolean;
               };
               difficulties: {
                  id: number;
                  description: string;
                  approvalStatus: 'PENDING' | 'QUALIFIED' | 'APPROVED' | 'DENIED' | 'REPLACED';
                  leaderboard: {
                     id: number;
                     map: {
                        id: number;
                        hash: string;
                        bsid: string | null;
                        songName: string;
                        songSubName: string;
                        songAuthorName: string;
                        levelAuthorName: string;
                        bpm: number;
                        coverUrl: string;
                        verified: boolean;
                     };
                     difficulty: {
                        id: number;
                        difficulty: number;
                        rawDifficulty: string;
                        gameMode: string;
                     };
                     maxScore: number;
                     totalScores: number;
                     dailyScores: number;
                     createdAt: string;
                     realm: {
                        realmId: number;
                        realmName: string;
                        leaderboardStatus: 'UNRANKED' | 'RANKED' | 'QUALIFIED' | 'LOVED';
                        positiveModifiers: boolean;
                        stars: number;
                        rankedAt: string | null;
                        qualifiedAt: string | null;
                        lovedAt: string | null;
                     };
                  };
                  rtVotes: {
                     upvotes: number;
                     downvotes: number;
                     myVote: 'UPVOTE' | 'DOWNVOTE' | null;
                  };
                  qatVotes: {
                     upvotes: number;
                     downvotes: number;
                     neutrals: number;
                     myVote: 'UPVOTE' | 'DOWNVOTE' | 'NEUTRAL' | null;
                  };
                  rtComments: {
                     id: number;
                     player: {
                        id: string;
                        name: string;
                        country: string;
                        role: string | null;
                        avatar: string;
                        permissions: number;
                     };
                     comment: string;
                     createdAt: string;
                     edited: boolean;
                  }[];
                  qatComments: {
                     id: number;
                     player: {
                        id: string;
                        name: string;
                        country: string;
                        role: string | null;
                        avatar: string;
                        permissions: number;
                     };
                     comment: string;
                     createdAt: string;
                     edited: boolean;
                  }[];
               }[];
               commentsObfuscated: boolean;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/ranking/requests/${id}`,
            method: 'GET',
            query: query,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags Ranking
 * @name RankingControllerReplaceRequest
 * @request PUT:/api/v2/ranking/requests/{id}
 * @response `200` `{
    id: number,
    description: string,
    requestType: "RANK" | "UNRANK",
    approvalStatus: "PENDING" | "QUALIFIED" | "APPROVED" | "DENIED" | "REPLACED",
    replacedBy: {
    id: number,
    map: {
    id: number,
    hash: string,
    bsid: string | null,
    songName: string,
    songSubName: string,
    songAuthorName: string,
    levelAuthorName: string,
    bpm: number,
    coverUrl: string,
    verified: boolean,

},

} | null,
    replacedFrom: {
    id: number,
    map: {
    id: number,
    hash: string,
    bsid: string | null,
    songName: string,
    songSubName: string,
    songAuthorName: string,
    levelAuthorName: string,
    bpm: number,
    coverUrl: string,
    verified: boolean,

},

} | null,
    weight: number,
    createdAt: string,
    map: {
    id: number,
    hash: string,
    bsid: string | null,
    songName: string,
    songSubName: string,
    songAuthorName: string,
    levelAuthorName: string,
    bpm: number,
    coverUrl: string,
    verified: boolean,

},
    difficulties: ({
    id: number,
    description: string,
    approvalStatus: "PENDING" | "QUALIFIED" | "APPROVED" | "DENIED" | "REPLACED",
    leaderboard: {
    id: number,
    map: {
    id: number,
    hash: string,
    bsid: string | null,
    songName: string,
    songSubName: string,
    songAuthorName: string,
    levelAuthorName: string,
    bpm: number,
    coverUrl: string,
    verified: boolean,

},
    difficulty: {
    id: number,
    difficulty: number,
    rawDifficulty: string,
    gameMode: string,

},
    maxScore: number,
    totalScores: number,
    dailyScores: number,
    createdAt: string,
    realm: {
    realmId: number,
    realmName: string,
    leaderboardStatus: "UNRANKED" | "RANKED" | "QUALIFIED" | "LOVED",
    positiveModifiers: boolean,
    stars: number,
    rankedAt: string | null,
    qualifiedAt: string | null,
    lovedAt: string | null,

},

},
    rtVotes: {
    upvotes: number,
    downvotes: number,
    myVote: "UPVOTE" | "DOWNVOTE" | null,

},
    qatVotes: {
    upvotes: number,
    downvotes: number,
    neutrals: number,
    myVote: "UPVOTE" | "DOWNVOTE" | "NEUTRAL" | null,

},
    rtComments: ({
    id: number,
    player: {
    id: string,
    name: string,
    country: string,
    role: string | null,
    avatar: string,
    permissions: number,

},
    comment: string,
    createdAt: string,
    edited: boolean,

})[],
    qatComments: ({
    id: number,
    player: {
    id: string,
    name: string,
    country: string,
    role: string | null,
    avatar: string,
    permissions: number,

},
    comment: string,
    createdAt: string,
    edited: boolean,

})[],

})[],
    commentsObfuscated: boolean,

}` Updated rank request
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 * @response `500` `({
    statusCode: 500,
    error: "Internal Server Error",
    code: "EXTERNAL_SERVICE_ERROR",
    message: string,
    details: {
    service: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "DATABASE_WRITE_ERROR",
    message: string,
    details: {
    operation: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "INTERNAL_SERVER_ERROR",
    message: string,

})` Internal Server Error
 */
      rankingControllerReplaceRequest: (
         { id }: RankingControllerReplaceRequestParams,
         data: RankingControllerReplaceRequestPayload,
         params: RequestParams = {}
      ) =>
         this.request<
            {
               id: number;
               description: string;
               requestType: 'RANK' | 'UNRANK';
               approvalStatus: 'PENDING' | 'QUALIFIED' | 'APPROVED' | 'DENIED' | 'REPLACED';
               replacedBy: {
                  id: number;
                  map: {
                     id: number;
                     hash: string;
                     bsid: string | null;
                     songName: string;
                     songSubName: string;
                     songAuthorName: string;
                     levelAuthorName: string;
                     bpm: number;
                     coverUrl: string;
                     verified: boolean;
                  };
               } | null;
               replacedFrom: {
                  id: number;
                  map: {
                     id: number;
                     hash: string;
                     bsid: string | null;
                     songName: string;
                     songSubName: string;
                     songAuthorName: string;
                     levelAuthorName: string;
                     bpm: number;
                     coverUrl: string;
                     verified: boolean;
                  };
               } | null;
               weight: number;
               createdAt: string;
               map: {
                  id: number;
                  hash: string;
                  bsid: string | null;
                  songName: string;
                  songSubName: string;
                  songAuthorName: string;
                  levelAuthorName: string;
                  bpm: number;
                  coverUrl: string;
                  verified: boolean;
               };
               difficulties: {
                  id: number;
                  description: string;
                  approvalStatus: 'PENDING' | 'QUALIFIED' | 'APPROVED' | 'DENIED' | 'REPLACED';
                  leaderboard: {
                     id: number;
                     map: {
                        id: number;
                        hash: string;
                        bsid: string | null;
                        songName: string;
                        songSubName: string;
                        songAuthorName: string;
                        levelAuthorName: string;
                        bpm: number;
                        coverUrl: string;
                        verified: boolean;
                     };
                     difficulty: {
                        id: number;
                        difficulty: number;
                        rawDifficulty: string;
                        gameMode: string;
                     };
                     maxScore: number;
                     totalScores: number;
                     dailyScores: number;
                     createdAt: string;
                     realm: {
                        realmId: number;
                        realmName: string;
                        leaderboardStatus: 'UNRANKED' | 'RANKED' | 'QUALIFIED' | 'LOVED';
                        positiveModifiers: boolean;
                        stars: number;
                        rankedAt: string | null;
                        qualifiedAt: string | null;
                        lovedAt: string | null;
                     };
                  };
                  rtVotes: {
                     upvotes: number;
                     downvotes: number;
                     myVote: 'UPVOTE' | 'DOWNVOTE' | null;
                  };
                  qatVotes: {
                     upvotes: number;
                     downvotes: number;
                     neutrals: number;
                     myVote: 'UPVOTE' | 'DOWNVOTE' | 'NEUTRAL' | null;
                  };
                  rtComments: {
                     id: number;
                     player: {
                        id: string;
                        name: string;
                        country: string;
                        role: string | null;
                        avatar: string;
                        permissions: number;
                     };
                     comment: string;
                     createdAt: string;
                     edited: boolean;
                  }[];
                  qatComments: {
                     id: number;
                     player: {
                        id: string;
                        name: string;
                        country: string;
                        role: string | null;
                        avatar: string;
                        permissions: number;
                     };
                     comment: string;
                     createdAt: string;
                     edited: boolean;
                  }[];
               }[];
               commentsObfuscated: boolean;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
            | (
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'EXTERNAL_SERVICE_ERROR';
                      message: string;
                      details: {
                         service: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'DATABASE_WRITE_ERROR';
                      message: string;
                      details: {
                         operation: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'INTERNAL_SERVER_ERROR';
                      message: string;
                   }
              )
         >({
            path: `/api/v2/ranking/requests/${id}`,
            method: 'PUT',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags Ranking
 * @name RankingControllerCreateUnrankRequest
 * @request POST:/api/v2/ranking/requests/unrank
 * @response `200` `{
    id: number,
    description: string,
    requestType: "RANK" | "UNRANK",
    approvalStatus: "PENDING" | "QUALIFIED" | "APPROVED" | "DENIED" | "REPLACED",
    replacedBy: {
    id: number,
    map: {
    id: number,
    hash: string,
    bsid: string | null,
    songName: string,
    songSubName: string,
    songAuthorName: string,
    levelAuthorName: string,
    bpm: number,
    coverUrl: string,
    verified: boolean,

},

} | null,
    replacedFrom: {
    id: number,
    map: {
    id: number,
    hash: string,
    bsid: string | null,
    songName: string,
    songSubName: string,
    songAuthorName: string,
    levelAuthorName: string,
    bpm: number,
    coverUrl: string,
    verified: boolean,

},

} | null,
    weight: number,
    createdAt: string,
    map: {
    id: number,
    hash: string,
    bsid: string | null,
    songName: string,
    songSubName: string,
    songAuthorName: string,
    levelAuthorName: string,
    bpm: number,
    coverUrl: string,
    verified: boolean,

},
    difficulties: ({
    id: number,
    description: string,
    approvalStatus: "PENDING" | "QUALIFIED" | "APPROVED" | "DENIED" | "REPLACED",
    leaderboard: {
    id: number,
    map: {
    id: number,
    hash: string,
    bsid: string | null,
    songName: string,
    songSubName: string,
    songAuthorName: string,
    levelAuthorName: string,
    bpm: number,
    coverUrl: string,
    verified: boolean,

},
    difficulty: {
    id: number,
    difficulty: number,
    rawDifficulty: string,
    gameMode: string,

},
    maxScore: number,
    totalScores: number,
    dailyScores: number,
    createdAt: string,
    realm: {
    realmId: number,
    realmName: string,
    leaderboardStatus: "UNRANKED" | "RANKED" | "QUALIFIED" | "LOVED",
    positiveModifiers: boolean,
    stars: number,
    rankedAt: string | null,
    qualifiedAt: string | null,
    lovedAt: string | null,

},

},
    rtVotes: {
    upvotes: number,
    downvotes: number,
    myVote: "UPVOTE" | "DOWNVOTE" | null,

},
    qatVotes: {
    upvotes: number,
    downvotes: number,
    neutrals: number,
    myVote: "UPVOTE" | "DOWNVOTE" | "NEUTRAL" | null,

},
    rtComments: ({
    id: number,
    player: {
    id: string,
    name: string,
    country: string,
    role: string | null,
    avatar: string,
    permissions: number,

},
    comment: string,
    createdAt: string,
    edited: boolean,

})[],
    qatComments: ({
    id: number,
    player: {
    id: string,
    name: string,
    country: string,
    role: string | null,
    avatar: string,
    permissions: number,

},
    comment: string,
    createdAt: string,
    edited: boolean,

})[],

})[],
    commentsObfuscated: boolean,

}` Created unrank request
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 * @response `500` `({
    statusCode: 500,
    error: "Internal Server Error",
    code: "EXTERNAL_SERVICE_ERROR",
    message: string,
    details: {
    service: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "DATABASE_WRITE_ERROR",
    message: string,
    details: {
    operation: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "INTERNAL_SERVER_ERROR",
    message: string,

})` Internal Server Error
 */
      rankingControllerCreateUnrankRequest: (data: RankingControllerCreateUnrankRequestPayload, params: RequestParams = {}) =>
         this.request<
            {
               id: number;
               description: string;
               requestType: 'RANK' | 'UNRANK';
               approvalStatus: 'PENDING' | 'QUALIFIED' | 'APPROVED' | 'DENIED' | 'REPLACED';
               replacedBy: {
                  id: number;
                  map: {
                     id: number;
                     hash: string;
                     bsid: string | null;
                     songName: string;
                     songSubName: string;
                     songAuthorName: string;
                     levelAuthorName: string;
                     bpm: number;
                     coverUrl: string;
                     verified: boolean;
                  };
               } | null;
               replacedFrom: {
                  id: number;
                  map: {
                     id: number;
                     hash: string;
                     bsid: string | null;
                     songName: string;
                     songSubName: string;
                     songAuthorName: string;
                     levelAuthorName: string;
                     bpm: number;
                     coverUrl: string;
                     verified: boolean;
                  };
               } | null;
               weight: number;
               createdAt: string;
               map: {
                  id: number;
                  hash: string;
                  bsid: string | null;
                  songName: string;
                  songSubName: string;
                  songAuthorName: string;
                  levelAuthorName: string;
                  bpm: number;
                  coverUrl: string;
                  verified: boolean;
               };
               difficulties: {
                  id: number;
                  description: string;
                  approvalStatus: 'PENDING' | 'QUALIFIED' | 'APPROVED' | 'DENIED' | 'REPLACED';
                  leaderboard: {
                     id: number;
                     map: {
                        id: number;
                        hash: string;
                        bsid: string | null;
                        songName: string;
                        songSubName: string;
                        songAuthorName: string;
                        levelAuthorName: string;
                        bpm: number;
                        coverUrl: string;
                        verified: boolean;
                     };
                     difficulty: {
                        id: number;
                        difficulty: number;
                        rawDifficulty: string;
                        gameMode: string;
                     };
                     maxScore: number;
                     totalScores: number;
                     dailyScores: number;
                     createdAt: string;
                     realm: {
                        realmId: number;
                        realmName: string;
                        leaderboardStatus: 'UNRANKED' | 'RANKED' | 'QUALIFIED' | 'LOVED';
                        positiveModifiers: boolean;
                        stars: number;
                        rankedAt: string | null;
                        qualifiedAt: string | null;
                        lovedAt: string | null;
                     };
                  };
                  rtVotes: {
                     upvotes: number;
                     downvotes: number;
                     myVote: 'UPVOTE' | 'DOWNVOTE' | null;
                  };
                  qatVotes: {
                     upvotes: number;
                     downvotes: number;
                     neutrals: number;
                     myVote: 'UPVOTE' | 'DOWNVOTE' | 'NEUTRAL' | null;
                  };
                  rtComments: {
                     id: number;
                     player: {
                        id: string;
                        name: string;
                        country: string;
                        role: string | null;
                        avatar: string;
                        permissions: number;
                     };
                     comment: string;
                     createdAt: string;
                     edited: boolean;
                  }[];
                  qatComments: {
                     id: number;
                     player: {
                        id: string;
                        name: string;
                        country: string;
                        role: string | null;
                        avatar: string;
                        permissions: number;
                     };
                     comment: string;
                     createdAt: string;
                     edited: boolean;
                  }[];
               }[];
               commentsObfuscated: boolean;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
            | (
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'EXTERNAL_SERVICE_ERROR';
                      message: string;
                      details: {
                         service: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'DATABASE_WRITE_ERROR';
                      message: string;
                      details: {
                         operation: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'INTERNAL_SERVER_ERROR';
                      message: string;
                   }
              )
         >({
            path: `/api/v2/ranking/requests/unrank`,
            method: 'POST',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags Ranking
 * @name RankingControllerRtVote
 * @request POST:/api/v2/ranking/requests/{id}/rt/vote
 * @response `200` `{
    success: boolean,

}` RT vote result
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      rankingControllerRtVote: ({ id }: RankingControllerRtVoteParams, data: RankingControllerRtVotePayload, params: RequestParams = {}) =>
         this.request<
            {
               success: boolean;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/ranking/requests/${id}/rt/vote`,
            method: 'POST',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags Ranking
 * @name RankingControllerRtComment
 * @request POST:/api/v2/ranking/requests/{id}/rt/comment
 * @response `200` `{
    success: boolean,

}` RT comment result
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      rankingControllerRtComment: ({ id }: RankingControllerRtCommentParams, data: RankingControllerRtCommentPayload, params: RequestParams = {}) =>
         this.request<
            {
               success: boolean;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/ranking/requests/${id}/rt/comment`,
            method: 'POST',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags Ranking
 * @name RankingControllerQatVote
 * @request POST:/api/v2/ranking/requests/{id}/qat/vote
 * @response `200` `{
    success: boolean,

}` QAT vote result
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      rankingControllerQatVote: ({ id }: RankingControllerQatVoteParams, data: RankingControllerQatVotePayload, params: RequestParams = {}) =>
         this.request<
            {
               success: boolean;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/ranking/requests/${id}/qat/vote`,
            method: 'POST',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags Ranking
 * @name RankingControllerQatComment
 * @request POST:/api/v2/ranking/requests/{id}/qat/comment
 * @response `200` `{
    success: boolean,

}` QAT comment result
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      rankingControllerQatComment: (
         { id }: RankingControllerQatCommentParams,
         data: RankingControllerQatCommentPayload,
         params: RequestParams = {}
      ) =>
         this.request<
            {
               success: boolean;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/ranking/requests/${id}/qat/comment`,
            method: 'POST',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags Ranking
 * @name RankingControllerRtDeleteComment
 * @request DELETE:/api/v2/ranking/requests/{id}/rt/comment/{commentId}
 * @response `200` `{
    success: boolean,

}` RT comment delete result
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `403` `{
    statusCode: 403,
    error: "Forbidden",
    code: "FORBIDDEN",
    message: string,
    details?: {
    reason: string,

},

}` Forbidden
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      rankingControllerRtDeleteComment: ({ id, commentId, ...query }: RankingControllerRtDeleteCommentParams, params: RequestParams = {}) =>
         this.request<
            {
               success: boolean;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 403;
                 error: 'Forbidden';
                 code: 'FORBIDDEN';
                 message: string;
                 details?: {
                    reason: string;
                 };
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/ranking/requests/${id}/rt/comment/${commentId}`,
            method: 'DELETE',
            query: query,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags Ranking
 * @name RankingControllerRtEditComment
 * @request PATCH:/api/v2/ranking/requests/{id}/rt/comment/{commentId}
 * @response `200` `{
    success: boolean,

}` RT comment edit result
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `403` `{
    statusCode: 403,
    error: "Forbidden",
    code: "FORBIDDEN",
    message: string,
    details?: {
    reason: string,

},

}` Forbidden
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      rankingControllerRtEditComment: (
         { id, commentId }: RankingControllerRtEditCommentParams,
         data: RankingControllerRtEditCommentPayload,
         params: RequestParams = {}
      ) =>
         this.request<
            {
               success: boolean;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 403;
                 error: 'Forbidden';
                 code: 'FORBIDDEN';
                 message: string;
                 details?: {
                    reason: string;
                 };
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/ranking/requests/${id}/rt/comment/${commentId}`,
            method: 'PATCH',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags Ranking
 * @name RankingControllerQatDeleteComment
 * @request DELETE:/api/v2/ranking/requests/{id}/qat/comment/{commentId}
 * @response `200` `{
    success: boolean,

}` QAT comment delete result
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `403` `{
    statusCode: 403,
    error: "Forbidden",
    code: "FORBIDDEN",
    message: string,
    details?: {
    reason: string,

},

}` Forbidden
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      rankingControllerQatDeleteComment: ({ id, commentId, ...query }: RankingControllerQatDeleteCommentParams, params: RequestParams = {}) =>
         this.request<
            {
               success: boolean;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 403;
                 error: 'Forbidden';
                 code: 'FORBIDDEN';
                 message: string;
                 details?: {
                    reason: string;
                 };
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/ranking/requests/${id}/qat/comment/${commentId}`,
            method: 'DELETE',
            query: query,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags Ranking
 * @name RankingControllerQatEditComment
 * @request PATCH:/api/v2/ranking/requests/{id}/qat/comment/{commentId}
 * @response `200` `{
    success: boolean,

}` QAT comment edit result
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `403` `{
    statusCode: 403,
    error: "Forbidden",
    code: "FORBIDDEN",
    message: string,
    details?: {
    reason: string,

},

}` Forbidden
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      rankingControllerQatEditComment: (
         { id, commentId }: RankingControllerQatEditCommentParams,
         data: RankingControllerQatEditCommentPayload,
         params: RequestParams = {}
      ) =>
         this.request<
            {
               success: boolean;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 403;
                 error: 'Forbidden';
                 code: 'FORBIDDEN';
                 message: string;
                 details?: {
                    reason: string;
                 };
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/ranking/requests/${id}/qat/comment/${commentId}`,
            method: 'PATCH',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags Ranking
 * @name RankingControllerQualify
 * @request POST:/api/v2/ranking/requests/{id}/qualify
 * @response `200` `{
    success: boolean,

}` Qualification result
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      rankingControllerQualify: ({ id }: RankingControllerQualifyParams, data: RankingControllerQualifyPayload, params: RequestParams = {}) =>
         this.request<
            {
               success: boolean;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/ranking/requests/${id}/qualify`,
            method: 'POST',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags Ranking
 * @name RankingControllerDeny
 * @request POST:/api/v2/ranking/requests/{id}/deny
 * @response `200` `{
    success: boolean,

}` Denial result
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      rankingControllerDeny: ({ id }: RankingControllerDenyParams, data: RankingControllerDenyPayload, params: RequestParams = {}) =>
         this.request<
            {
               success: boolean;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/ranking/requests/${id}/deny`,
            method: 'POST',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags Ranking
 * @name RankingControllerApprove
 * @request POST:/api/v2/ranking/requests/{id}/approve
 * @response `200` `{
    success: boolean,

}` Approval result
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      rankingControllerApprove: ({ id }: RankingControllerApproveParams, data: RankingControllerApprovePayload, params: RequestParams = {}) =>
         this.request<
            {
               success: boolean;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/ranking/requests/${id}/approve`,
            method: 'POST',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params
         })
   };
   score = {
      /**
 * No description
 *
 * @tags Score
 * @name ScoreControllerGetScore
 * @request GET:/api/v2/scores/{id}
 * @response `200` `{
    score: {
    id: number,
    rank: number,
    unmodifiedScore: number,
    modifiedScore: number,
    accuracy: number,
    pp: number,
    weight: number,
    mods: (string)[],
    badCuts: number,
    missedNotes: number,
    maxCombo: number,
    fullCombo: boolean,
    hasReplay: boolean,
    personalBest: boolean,
    legacyHmdId: number | null,
    version: string | null,
    createdAt: string,
    player: {
    id: string,
    name: string,
    country: string,
    role: string | null,
    avatar: string,
    permissions: number,

},
    device: {
    hmd: string | null,
    controllerLeft: string | null,
    controllerRight: string | null,

} | null,

},
    leaderboard: {
    id: number,
    map: {
    id: number,
    hash: string,
    bsid: string | null,
    songName: string,
    songSubName: string,
    songAuthorName: string,
    levelAuthorName: string,
    bpm: number,
    coverUrl: string,
    verified: boolean,

},
    difficulty: {
    id: number,
    difficulty: number,
    rawDifficulty: string,
    gameMode: string,

},
    maxScore: number,
    totalScores: number,
    dailyScores: number,
    createdAt: string,
    realm: {
    realmId: number,
    realmName: string,
    leaderboardStatus: "UNRANKED" | "RANKED" | "QUALIFIED" | "LOVED",
    positiveModifiers: boolean,
    stars: number,
    rankedAt: string | null,
    qualifiedAt: string | null,
    lovedAt: string | null,

},

},
    scoreStats: {
    totalScore: number,
    maxScore: number,
    passed: boolean,
    failTime: number,
    endTime: number,
    maxCombo: number,
    "max115Streak": number | null,
    fcAcc: number,
    accLeft: number,
    accRight: number,
    leftPreswing: number,
    rightPreswing: number,
    leftPostswing: number,
    rightPostswing: number,
    leftTimeDependence: number,
    rightTimeDependence: number,
    leftTiming: number,
    rightTiming: number,
  /**
   * @maxItems 3
   * @minItems 3
   *\/
    leftAverageCut: ((number))[],
  /**
   * @maxItems 3
   * @minItems 3
   *\/
    rightAverageCut: ((number))[],
    leftMiss: number,
    rightMiss: number,
    leftBadCuts: number,
    rightBadCuts: number,
    leftBombs: number,
    rightBombs: number,
    leftSaberHitOffset: number,
    rightSaberHitOffset: number,
    noteSpawnOffset: number,
    averageHeight: number,
    averageHeadPosition: {
    x: number,
    y: number,
    z: number,

},
    scoreGraph: (number)[],
    gridCutDetails: {
    grid: ({
    count: number,
    avgScore: number,
    left: ({
    count: number,
    avgScore: number,

})[],
    right: ({
    count: number,
    avgScore: number,

})[],

})[],
    summaryGrids: (({
    count: number,
    avgScore: number,

})[])[],

},
    handSummary: ({
    label: string,
    left: {
    count: number,
    avgScore: number,
    avgTd: number,

},
    right: {
    count: number,
    avgScore: number,
    avgTd: number,

},

})[],
    accuracyDistribution: {
    leftTotal: number,
    rightTotal: number,
    leftCount: (number)[],
    rightCount: (number)[],
    leftTd: (number | null)[],
    rightTd: (number | null)[],
    timingStdDev: (number | null)[],

},
    accuracyTimeline: {
    times: (number)[],
    left: {
    fullSwing: (number)[],
    actual: (number)[],

},
    right: {
    fullSwing: (number)[],
    actual: (number)[],

},
    total: {
    fullSwing: (number)[],
    actual: (number)[],

},

},
    underswingStats: {
    count: number,
    fcScore: number,
    fullSwingScore: number,
    fullSwingFcScore: number,
    maxCutScore: number,
    fcAcc: number,
    fullSwingAcc: number,
    fullSwingFcAcc: number,

},

} | null,

}` Score details
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      scoreControllerGetScore: ({ id, ...query }: ScoreControllerGetScoreParams, params: RequestParams = {}) =>
         this.request<
            {
               score: {
                  id: number;
                  rank: number;
                  unmodifiedScore: number;
                  modifiedScore: number;
                  accuracy: number;
                  pp: number;
                  weight: number;
                  mods: string[];
                  badCuts: number;
                  missedNotes: number;
                  maxCombo: number;
                  fullCombo: boolean;
                  hasReplay: boolean;
                  personalBest: boolean;
                  legacyHmdId: number | null;
                  version: string | null;
                  createdAt: string;
                  player: {
                     id: string;
                     name: string;
                     country: string;
                     role: string | null;
                     avatar: string;
                     permissions: number;
                  };
                  device: {
                     hmd: string | null;
                     controllerLeft: string | null;
                     controllerRight: string | null;
                  } | null;
               };
               leaderboard: {
                  id: number;
                  map: {
                     id: number;
                     hash: string;
                     bsid: string | null;
                     songName: string;
                     songSubName: string;
                     songAuthorName: string;
                     levelAuthorName: string;
                     bpm: number;
                     coverUrl: string;
                     verified: boolean;
                  };
                  difficulty: {
                     id: number;
                     difficulty: number;
                     rawDifficulty: string;
                     gameMode: string;
                  };
                  maxScore: number;
                  totalScores: number;
                  dailyScores: number;
                  createdAt: string;
                  realm: {
                     realmId: number;
                     realmName: string;
                     leaderboardStatus: 'UNRANKED' | 'RANKED' | 'QUALIFIED' | 'LOVED';
                     positiveModifiers: boolean;
                     stars: number;
                     rankedAt: string | null;
                     qualifiedAt: string | null;
                     lovedAt: string | null;
                  };
               };
               scoreStats: {
                  totalScore: number;
                  maxScore: number;
                  passed: boolean;
                  failTime: number;
                  endTime: number;
                  maxCombo: number;
                  max115Streak: number | null;
                  fcAcc: number;
                  accLeft: number;
                  accRight: number;
                  leftPreswing: number;
                  rightPreswing: number;
                  leftPostswing: number;
                  rightPostswing: number;
                  leftTimeDependence: number;
                  rightTimeDependence: number;
                  leftTiming: number;
                  rightTiming: number;
                  /**
                   * @maxItems 3
                   * @minItems 3
                   */
                  leftAverageCut: number[];
                  /**
                   * @maxItems 3
                   * @minItems 3
                   */
                  rightAverageCut: number[];
                  leftMiss: number;
                  rightMiss: number;
                  leftBadCuts: number;
                  rightBadCuts: number;
                  leftBombs: number;
                  rightBombs: number;
                  leftSaberHitOffset: number;
                  rightSaberHitOffset: number;
                  noteSpawnOffset: number;
                  averageHeight: number;
                  averageHeadPosition: {
                     x: number;
                     y: number;
                     z: number;
                  };
                  scoreGraph: number[];
                  gridCutDetails: {
                     grid: {
                        count: number;
                        avgScore: number;
                        left: {
                           count: number;
                           avgScore: number;
                        }[];
                        right: {
                           count: number;
                           avgScore: number;
                        }[];
                     }[];
                     summaryGrids: {
                        count: number;
                        avgScore: number;
                     }[][];
                  };
                  handSummary: {
                     label: string;
                     left: {
                        count: number;
                        avgScore: number;
                        avgTd: number;
                     };
                     right: {
                        count: number;
                        avgScore: number;
                        avgTd: number;
                     };
                  }[];
                  accuracyDistribution: {
                     leftTotal: number;
                     rightTotal: number;
                     leftCount: number[];
                     rightCount: number[];
                     leftTd: (number | null)[];
                     rightTd: (number | null)[];
                     timingStdDev: (number | null)[];
                  };
                  accuracyTimeline: {
                     times: number[];
                     left: {
                        fullSwing: number[];
                        actual: number[];
                     };
                     right: {
                        fullSwing: number[];
                        actual: number[];
                     };
                     total: {
                        fullSwing: number[];
                        actual: number[];
                     };
                  };
                  underswingStats: {
                     count: number;
                     fcScore: number;
                     fullSwingScore: number;
                     fullSwingFcScore: number;
                     maxCutScore: number;
                     fcAcc: number;
                     fullSwingAcc: number;
                     fullSwingFcAcc: number;
                  };
               } | null;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/scores/${id}`,
            method: 'GET',
            query: query,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags Score
 * @name ScoreControllerGetScoreHistory
 * @request GET:/api/v2/scores/{id}/history
 * @response `200` `{
    data: ({
    score: {
    id: number,
    rank: number,
    unmodifiedScore: number,
    modifiedScore: number,
    accuracy: number,
    pp: number,
    weight: number,
    mods: (string)[],
    badCuts: number,
    missedNotes: number,
    maxCombo: number,
    fullCombo: boolean,
    hasReplay: boolean,
    personalBest: boolean,
    legacyHmdId: number | null,
    version: string | null,
    createdAt: string,
    player: {
    id: string,
    name: string,
    country: string,
    role: string | null,
    avatar: string,
    permissions: number,

},
    device: {
    hmd: string | null,
    controllerLeft: string | null,
    controllerRight: string | null,

} | null,

},
    leaderboard: {
    id: number,
    map: {
    id: number,
    hash: string,
    bsid: string | null,
    songName: string,
    songSubName: string,
    songAuthorName: string,
    levelAuthorName: string,
    bpm: number,
    coverUrl: string,
    verified: boolean,

},
    difficulty: {
    id: number,
    difficulty: number,
    rawDifficulty: string,
    gameMode: string,

},
    maxScore: number,
    totalScores: number,
    dailyScores: number,
    createdAt: string,
    realm: {
    realmId: number,
    realmName: string,
    leaderboardStatus: "UNRANKED" | "RANKED" | "QUALIFIED" | "LOVED",
    positiveModifiers: boolean,
    stars: number,
    rankedAt: string | null,
    qualifiedAt: string | null,
    lovedAt: string | null,

},

},

})[],
    metadata: {
    page: number,
    itemsPerPage: number,
    totalItems: number,
    totalPages: number,

},

}` Player's visible attempts on the same leaderboard up to this score
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      scoreControllerGetScoreHistory: ({ id, ...query }: ScoreControllerGetScoreHistoryParams, params: RequestParams = {}) =>
         this.request<
            {
               data: {
                  score: {
                     id: number;
                     rank: number;
                     unmodifiedScore: number;
                     modifiedScore: number;
                     accuracy: number;
                     pp: number;
                     weight: number;
                     mods: string[];
                     badCuts: number;
                     missedNotes: number;
                     maxCombo: number;
                     fullCombo: boolean;
                     hasReplay: boolean;
                     personalBest: boolean;
                     legacyHmdId: number | null;
                     version: string | null;
                     createdAt: string;
                     player: {
                        id: string;
                        name: string;
                        country: string;
                        role: string | null;
                        avatar: string;
                        permissions: number;
                     };
                     device: {
                        hmd: string | null;
                        controllerLeft: string | null;
                        controllerRight: string | null;
                     } | null;
                  };
                  leaderboard: {
                     id: number;
                     map: {
                        id: number;
                        hash: string;
                        bsid: string | null;
                        songName: string;
                        songSubName: string;
                        songAuthorName: string;
                        levelAuthorName: string;
                        bpm: number;
                        coverUrl: string;
                        verified: boolean;
                     };
                     difficulty: {
                        id: number;
                        difficulty: number;
                        rawDifficulty: string;
                        gameMode: string;
                     };
                     maxScore: number;
                     totalScores: number;
                     dailyScores: number;
                     createdAt: string;
                     realm: {
                        realmId: number;
                        realmName: string;
                        leaderboardStatus: 'UNRANKED' | 'RANKED' | 'QUALIFIED' | 'LOVED';
                        positiveModifiers: boolean;
                        stars: number;
                        rankedAt: string | null;
                        qualifiedAt: string | null;
                        lovedAt: string | null;
                     };
                  };
               }[];
               metadata: {
                  page: number;
                  itemsPerPage: number;
                  totalItems: number;
                  totalPages: number;
               };
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/scores/${id}/history`,
            method: 'GET',
            query: query,
            format: 'json',
            ...params
         }),

      /**
       * No description
       *
       * @tags Score
       * @name ScoreControllerDownloadReplay
       * @request GET:/api/v2/scores/{id}/replay
       * @response `200` `void`
       */
      scoreControllerDownloadReplay: ({ id }: ScoreControllerDownloadReplayParams, params: RequestParams = {}) =>
         this.request<void, any>({
            path: `/api/v2/scores/${id}/replay`,
            method: 'GET',
            ...params
         }),

      /**
 * No description
 *
 * @tags Score
 * @name ScoreControllerGetScoreStats
 * @request GET:/api/v2/scores/{id}/stats
 * @response `200` `{
    totalScore: number,
    maxScore: number,
    passed: boolean,
    failTime: number,
    endTime: number,
    maxCombo: number,
    "max115Streak": number | null,
    fcAcc: number,
    accLeft: number,
    accRight: number,
    leftPreswing: number,
    rightPreswing: number,
    leftPostswing: number,
    rightPostswing: number,
    leftTimeDependence: number,
    rightTimeDependence: number,
    leftTiming: number,
    rightTiming: number,
  /**
   * @maxItems 3
   * @minItems 3
   *\/
    leftAverageCut: ((number))[],
  /**
   * @maxItems 3
   * @minItems 3
   *\/
    rightAverageCut: ((number))[],
    leftMiss: number,
    rightMiss: number,
    leftBadCuts: number,
    rightBadCuts: number,
    leftBombs: number,
    rightBombs: number,
    leftSaberHitOffset: number,
    rightSaberHitOffset: number,
    noteSpawnOffset: number,
    averageHeight: number,
    averageHeadPosition: {
    x: number,
    y: number,
    z: number,

},
    scoreGraph: (number)[],
    gridCutDetails: {
    grid: ({
    count: number,
    avgScore: number,
    left: ({
    count: number,
    avgScore: number,

})[],
    right: ({
    count: number,
    avgScore: number,

})[],

})[],
    summaryGrids: (({
    count: number,
    avgScore: number,

})[])[],

},
    handSummary: ({
    label: string,
    left: {
    count: number,
    avgScore: number,
    avgTd: number,

},
    right: {
    count: number,
    avgScore: number,
    avgTd: number,

},

})[],
    accuracyDistribution: {
    leftTotal: number,
    rightTotal: number,
    leftCount: (number)[],
    rightCount: (number)[],
    leftTd: (number | null)[],
    rightTd: (number | null)[],
    timingStdDev: (number | null)[],

},
    accuracyTimeline: {
    times: (number)[],
    left: {
    fullSwing: (number)[],
    actual: (number)[],

},
    right: {
    fullSwing: (number)[],
    actual: (number)[],

},
    total: {
    fullSwing: (number)[],
    actual: (number)[],

},

},
    underswingStats: {
    count: number,
    fcScore: number,
    fullSwingScore: number,
    fullSwingFcScore: number,
    maxCutScore: number,
    fcAcc: number,
    fullSwingAcc: number,
    fullSwingFcAcc: number,

},

}` Detailed replay statistics for a score
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 * @response `500` `({
    statusCode: 500,
    error: "Internal Server Error",
    code: "EXTERNAL_SERVICE_ERROR",
    message: string,
    details: {
    service: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "DATABASE_WRITE_ERROR",
    message: string,
    details: {
    operation: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "INTERNAL_SERVER_ERROR",
    message: string,

})` Internal Server Error
 */
      scoreControllerGetScoreStats: ({ id }: ScoreControllerGetScoreStatsParams, params: RequestParams = {}) =>
         this.request<
            {
               totalScore: number;
               maxScore: number;
               passed: boolean;
               failTime: number;
               endTime: number;
               maxCombo: number;
               max115Streak: number | null;
               fcAcc: number;
               accLeft: number;
               accRight: number;
               leftPreswing: number;
               rightPreswing: number;
               leftPostswing: number;
               rightPostswing: number;
               leftTimeDependence: number;
               rightTimeDependence: number;
               leftTiming: number;
               rightTiming: number;
               /**
                * @maxItems 3
                * @minItems 3
                */
               leftAverageCut: number[];
               /**
                * @maxItems 3
                * @minItems 3
                */
               rightAverageCut: number[];
               leftMiss: number;
               rightMiss: number;
               leftBadCuts: number;
               rightBadCuts: number;
               leftBombs: number;
               rightBombs: number;
               leftSaberHitOffset: number;
               rightSaberHitOffset: number;
               noteSpawnOffset: number;
               averageHeight: number;
               averageHeadPosition: {
                  x: number;
                  y: number;
                  z: number;
               };
               scoreGraph: number[];
               gridCutDetails: {
                  grid: {
                     count: number;
                     avgScore: number;
                     left: {
                        count: number;
                        avgScore: number;
                     }[];
                     right: {
                        count: number;
                        avgScore: number;
                     }[];
                  }[];
                  summaryGrids: {
                     count: number;
                     avgScore: number;
                  }[][];
               };
               handSummary: {
                  label: string;
                  left: {
                     count: number;
                     avgScore: number;
                     avgTd: number;
                  };
                  right: {
                     count: number;
                     avgScore: number;
                     avgTd: number;
                  };
               }[];
               accuracyDistribution: {
                  leftTotal: number;
                  rightTotal: number;
                  leftCount: number[];
                  rightCount: number[];
                  leftTd: (number | null)[];
                  rightTd: (number | null)[];
                  timingStdDev: (number | null)[];
               };
               accuracyTimeline: {
                  times: number[];
                  left: {
                     fullSwing: number[];
                     actual: number[];
                  };
                  right: {
                     fullSwing: number[];
                     actual: number[];
                  };
                  total: {
                     fullSwing: number[];
                     actual: number[];
                  };
               };
               underswingStats: {
                  count: number;
                  fcScore: number;
                  fullSwingScore: number;
                  fullSwingFcScore: number;
                  maxCutScore: number;
                  fcAcc: number;
                  fullSwingAcc: number;
                  fullSwingFcAcc: number;
               };
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
            | (
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'EXTERNAL_SERVICE_ERROR';
                      message: string;
                      details: {
                         service: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'DATABASE_WRITE_ERROR';
                      message: string;
                      details: {
                         operation: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'INTERNAL_SERVER_ERROR';
                      message: string;
                   }
              )
         >({
            path: `/api/v2/scores/${id}/stats`,
            method: 'GET',
            format: 'json',
            ...params
         })
   };
   adminBadge = {
      /**
 * No description
 *
 * @tags AdminBadge
 * @name AdminBadgeControllerGetAllBadges
 * @request GET:/api/v2/admin/badges
 * @response `200` `({
    id: number,
    image: string,
    description: string,

})[]` All badges
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 */
      adminBadgeControllerGetAllBadges: (params: RequestParams = {}) =>
         this.request<
            {
               id: number;
               image: string;
               description: string;
            }[],
            {
               statusCode: 401;
               error: 'Unauthorized';
               code: 'UNAUTHORIZED';
               message: string;
            }
         >({
            path: `/api/v2/admin/badges`,
            method: 'GET',
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags AdminBadge
 * @name AdminBadgeControllerCreateBadge
 * @request POST:/api/v2/admin/badges
 * @response `200` `{
    id: number,
    image: string,
    description: string,

}` Created badge
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `500` `({
    statusCode: 500,
    error: "Internal Server Error",
    code: "EXTERNAL_SERVICE_ERROR",
    message: string,
    details: {
    service: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "DATABASE_WRITE_ERROR",
    message: string,
    details: {
    operation: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "INTERNAL_SERVER_ERROR",
    message: string,

})` Internal Server Error
 */
      adminBadgeControllerCreateBadge: (data: AdminBadgeControllerCreateBadgePayload, params: RequestParams = {}) =>
         this.request<
            {
               id: number;
               image: string;
               description: string;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | (
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'EXTERNAL_SERVICE_ERROR';
                      message: string;
                      details: {
                         service: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'DATABASE_WRITE_ERROR';
                      message: string;
                      details: {
                         operation: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'INTERNAL_SERVER_ERROR';
                      message: string;
                   }
              )
         >({
            path: `/api/v2/admin/badges`,
            method: 'POST',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags AdminBadge
 * @name AdminBadgeControllerUpdateBadge
 * @request PUT:/api/v2/admin/badges/{id}
 * @response `200` `{
    id: number,
    image: string,
    description: string,

}` Updated badge
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 * @response `500` `({
    statusCode: 500,
    error: "Internal Server Error",
    code: "EXTERNAL_SERVICE_ERROR",
    message: string,
    details: {
    service: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "DATABASE_WRITE_ERROR",
    message: string,
    details: {
    operation: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "INTERNAL_SERVER_ERROR",
    message: string,

})` Internal Server Error
 */
      adminBadgeControllerUpdateBadge: (
         { id }: AdminBadgeControllerUpdateBadgeParams,
         data: AdminBadgeControllerUpdateBadgePayload,
         params: RequestParams = {}
      ) =>
         this.request<
            {
               id: number;
               image: string;
               description: string;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
            | (
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'EXTERNAL_SERVICE_ERROR';
                      message: string;
                      details: {
                         service: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'DATABASE_WRITE_ERROR';
                      message: string;
                      details: {
                         operation: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'INTERNAL_SERVER_ERROR';
                      message: string;
                   }
              )
         >({
            path: `/api/v2/admin/badges/${id}`,
            method: 'PUT',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags AdminBadge
 * @name AdminBadgeControllerDeleteBadge
 * @request DELETE:/api/v2/admin/badges/{id}
 * @response `200` `{
    success: boolean,

}` Badge deletion result
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      adminBadgeControllerDeleteBadge: ({ id }: AdminBadgeControllerDeleteBadgeParams, params: RequestParams = {}) =>
         this.request<
            {
               success: boolean;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/admin/badges/${id}`,
            method: 'DELETE',
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags AdminBadge
 * @name AdminBadgeControllerAssignBadge
 * @request POST:/api/v2/admin/badges/{id}/assign/{playerId}
 * @response `200` `{
    success: boolean,

}` Badge assignment result
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 * @response `500` `({
    statusCode: 500,
    error: "Internal Server Error",
    code: "EXTERNAL_SERVICE_ERROR",
    message: string,
    details: {
    service: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "DATABASE_WRITE_ERROR",
    message: string,
    details: {
    operation: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "INTERNAL_SERVER_ERROR",
    message: string,

})` Internal Server Error
 */
      adminBadgeControllerAssignBadge: ({ id, playerId }: AdminBadgeControllerAssignBadgeParams, params: RequestParams = {}) =>
         this.request<
            {
               success: boolean;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
            | (
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'EXTERNAL_SERVICE_ERROR';
                      message: string;
                      details: {
                         service: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'DATABASE_WRITE_ERROR';
                      message: string;
                      details: {
                         operation: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'INTERNAL_SERVER_ERROR';
                      message: string;
                   }
              )
         >({
            path: `/api/v2/admin/badges/${id}/assign/${playerId}`,
            method: 'POST',
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags AdminBadge
 * @name AdminBadgeControllerUnassignBadge
 * @request DELETE:/api/v2/admin/badges/{id}/assign/{playerId}
 * @response `200` `{
    success: boolean,

}` Badge removal result
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      adminBadgeControllerUnassignBadge: ({ id, playerId }: AdminBadgeControllerUnassignBadgeParams, params: RequestParams = {}) =>
         this.request<
            {
               success: boolean;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/admin/badges/${id}/assign/${playerId}`,
            method: 'DELETE',
            format: 'json',
            ...params
         })
   };
   adminLeaderboard = {
      /**
 * No description
 *
 * @tags AdminLeaderboard
 * @name AdminLeaderboardControllerRankLeaderboard
 * @request POST:/api/v2/admin/leaderboards/{id}/rank
 * @response `200` `{
    success: boolean,
    affectedPlayers: number,

}` Rank result with affected player count
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 * @response `500` `({
    statusCode: 500,
    error: "Internal Server Error",
    code: "EXTERNAL_SERVICE_ERROR",
    message: string,
    details: {
    service: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "DATABASE_WRITE_ERROR",
    message: string,
    details: {
    operation: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "INTERNAL_SERVER_ERROR",
    message: string,

})` Internal Server Error
 */
      adminLeaderboardControllerRankLeaderboard: (
         { id, ...query }: AdminLeaderboardControllerRankLeaderboardParams,
         data: AdminLeaderboardControllerRankLeaderboardPayload,
         params: RequestParams = {}
      ) =>
         this.request<
            {
               success: boolean;
               affectedPlayers: number;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
            | (
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'EXTERNAL_SERVICE_ERROR';
                      message: string;
                      details: {
                         service: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'DATABASE_WRITE_ERROR';
                      message: string;
                      details: {
                         operation: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'INTERNAL_SERVER_ERROR';
                      message: string;
                   }
              )
         >({
            path: `/api/v2/admin/leaderboards/${id}/rank`,
            method: 'POST',
            query: query,
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags AdminLeaderboard
 * @name AdminLeaderboardControllerUnrankLeaderboard
 * @request POST:/api/v2/admin/leaderboards/{id}/unrank
 * @response `200` `{
    success: boolean,
    affectedPlayers: number,

}` Unrank result with affected player count
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 * @response `500` `({
    statusCode: 500,
    error: "Internal Server Error",
    code: "EXTERNAL_SERVICE_ERROR",
    message: string,
    details: {
    service: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "DATABASE_WRITE_ERROR",
    message: string,
    details: {
    operation: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "INTERNAL_SERVER_ERROR",
    message: string,

})` Internal Server Error
 */
      adminLeaderboardControllerUnrankLeaderboard: (
         { id, ...query }: AdminLeaderboardControllerUnrankLeaderboardParams,
         params: RequestParams = {}
      ) =>
         this.request<
            {
               success: boolean;
               affectedPlayers: number;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
            | (
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'EXTERNAL_SERVICE_ERROR';
                      message: string;
                      details: {
                         service: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'DATABASE_WRITE_ERROR';
                      message: string;
                      details: {
                         operation: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'INTERNAL_SERVER_ERROR';
                      message: string;
                   }
              )
         >({
            path: `/api/v2/admin/leaderboards/${id}/unrank`,
            method: 'POST',
            query: query,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags AdminLeaderboard
 * @name AdminLeaderboardControllerRecalculatePP
 * @request POST:/api/v2/admin/leaderboards/{id}/pp
 * @response `200` `{
    success: boolean,
    affectedPlayers: number,

}` PP recalculation result with affected player count
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      adminLeaderboardControllerRecalculatePP: ({ id, ...query }: AdminLeaderboardControllerRecalculatePPParams, params: RequestParams = {}) =>
         this.request<
            {
               success: boolean;
               affectedPlayers: number;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/admin/leaderboards/${id}/pp`,
            method: 'POST',
            query: query,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags AdminLeaderboard
 * @name AdminLeaderboardControllerSetManualPP
 * @request POST:/api/v2/admin/leaderboards/{id}/pp-manual
 * @response `200` `{
    success: boolean,
    affectedPlayers: number,

}` Manual PP update result with affected player count
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 * @response `500` `({
    statusCode: 500,
    error: "Internal Server Error",
    code: "EXTERNAL_SERVICE_ERROR",
    message: string,
    details: {
    service: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "DATABASE_WRITE_ERROR",
    message: string,
    details: {
    operation: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "INTERNAL_SERVER_ERROR",
    message: string,

})` Internal Server Error
 */
      adminLeaderboardControllerSetManualPP: (
         { id, ...query }: AdminLeaderboardControllerSetManualPPParams,
         data: AdminLeaderboardControllerSetManualPPPayload,
         params: RequestParams = {}
      ) =>
         this.request<
            {
               success: boolean;
               affectedPlayers: number;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
            | (
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'EXTERNAL_SERVICE_ERROR';
                      message: string;
                      details: {
                         service: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'DATABASE_WRITE_ERROR';
                      message: string;
                      details: {
                         operation: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'INTERNAL_SERVER_ERROR';
                      message: string;
                   }
              )
         >({
            path: `/api/v2/admin/leaderboards/${id}/pp-manual`,
            method: 'POST',
            query: query,
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags AdminLeaderboard
 * @name AdminLeaderboardControllerQualifyLeaderboard
 * @request POST:/api/v2/admin/leaderboards/{id}/qualify
 * @response `200` `{
    success: boolean,

}` Qualification result
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 * @response `500` `({
    statusCode: 500,
    error: "Internal Server Error",
    code: "EXTERNAL_SERVICE_ERROR",
    message: string,
    details: {
    service: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "DATABASE_WRITE_ERROR",
    message: string,
    details: {
    operation: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "INTERNAL_SERVER_ERROR",
    message: string,

})` Internal Server Error
 */
      adminLeaderboardControllerQualifyLeaderboard: (
         { id, ...query }: AdminLeaderboardControllerQualifyLeaderboardParams,
         params: RequestParams = {}
      ) =>
         this.request<
            {
               success: boolean;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
            | (
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'EXTERNAL_SERVICE_ERROR';
                      message: string;
                      details: {
                         service: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'DATABASE_WRITE_ERROR';
                      message: string;
                      details: {
                         operation: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'INTERNAL_SERVER_ERROR';
                      message: string;
                   }
              )
         >({
            path: `/api/v2/admin/leaderboards/${id}/qualify`,
            method: 'POST',
            query: query,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags AdminLeaderboard
 * @name AdminLeaderboardControllerLoveLeaderboard
 * @request POST:/api/v2/admin/leaderboards/{id}/love
 * @response `200` `{
    success: boolean,

}` Love status result
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 * @response `500` `({
    statusCode: 500,
    error: "Internal Server Error",
    code: "EXTERNAL_SERVICE_ERROR",
    message: string,
    details: {
    service: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "DATABASE_WRITE_ERROR",
    message: string,
    details: {
    operation: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "INTERNAL_SERVER_ERROR",
    message: string,

})` Internal Server Error
 */
      adminLeaderboardControllerLoveLeaderboard: ({ id, ...query }: AdminLeaderboardControllerLoveLeaderboardParams, params: RequestParams = {}) =>
         this.request<
            {
               success: boolean;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
            | (
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'EXTERNAL_SERVICE_ERROR';
                      message: string;
                      details: {
                         service: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'DATABASE_WRITE_ERROR';
                      message: string;
                      details: {
                         operation: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'INTERNAL_SERVER_ERROR';
                      message: string;
                   }
              )
         >({
            path: `/api/v2/admin/leaderboards/${id}/love`,
            method: 'POST',
            query: query,
            format: 'json',
            ...params
         })
   };
   adminPermission = {
      /**
 * No description
 *
 * @tags AdminPermission
 * @name AdminPermissionControllerListPermissions
 * @request GET:/api/v2/admin/permissions
 * @response `200` `({
    name: string,
    value: number,

})[]` List of all available permissions
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 */
      adminPermissionControllerListPermissions: (params: RequestParams = {}) =>
         this.request<
            {
               name: string;
               value: number;
            }[],
            {
               statusCode: 401;
               error: 'Unauthorized';
               code: 'UNAUTHORIZED';
               message: string;
            }
         >({
            path: `/api/v2/admin/permissions`,
            method: 'GET',
            format: 'json',
            ...params
         })
   };
   adminScore = {
      /**
 * No description
 *
 * @tags AdminScore
 * @name AdminScoreControllerDeleteScore
 * @request DELETE:/api/v2/admin/scores/{id}
 * @response `200` `{
    success: boolean,

}` Score deletion result
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      adminScoreControllerDeleteScore: ({ id }: AdminScoreControllerDeleteScoreParams, params: RequestParams = {}) =>
         this.request<
            {
               success: boolean;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/admin/scores/${id}`,
            method: 'DELETE',
            format: 'json',
            ...params
         })
   };
   adminUser = {
      /**
 * No description
 *
 * @tags AdminUser
 * @name AdminUserControllerBanPlayer
 * @request POST:/api/v2/admin/user/{id}/ban
 * @response `200` `{
    success: boolean,

}` Ban result
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      adminUserControllerBanPlayer: (
         { id }: AdminUserControllerBanPlayerParams,
         data: AdminUserControllerBanPlayerPayload,
         params: RequestParams = {}
      ) =>
         this.request<
            {
               success: boolean;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/admin/user/${id}/ban`,
            method: 'POST',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags AdminUser
 * @name AdminUserControllerUnbanPlayer
 * @request POST:/api/v2/admin/user/{id}/unban
 * @response `200` `{
    success: boolean,

}` Unban result
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      adminUserControllerUnbanPlayer: ({ id }: AdminUserControllerUnbanPlayerParams, params: RequestParams = {}) =>
         this.request<
            {
               success: boolean;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/admin/user/${id}/unban`,
            method: 'POST',
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags AdminUser
 * @name AdminUserControllerSilencePlayer
 * @request POST:/api/v2/admin/user/{id}/silence
 * @response `200` `{
    success: boolean,

}` Silence result
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      adminUserControllerSilencePlayer: (
         { id }: AdminUserControllerSilencePlayerParams,
         data: AdminUserControllerSilencePlayerPayload,
         params: RequestParams = {}
      ) =>
         this.request<
            {
               success: boolean;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/admin/user/${id}/silence`,
            method: 'POST',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags AdminUser
 * @name AdminUserControllerUnsilencePlayer
 * @request POST:/api/v2/admin/user/{id}/unsilence
 * @response `200` `{
    success: boolean,

}` Unsilence result
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      adminUserControllerUnsilencePlayer: ({ id }: AdminUserControllerUnsilencePlayerParams, params: RequestParams = {}) =>
         this.request<
            {
               success: boolean;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/admin/user/${id}/unsilence`,
            method: 'POST',
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags AdminUser
 * @name AdminUserControllerUpdateRoleText
 * @request POST:/api/v2/admin/user/{id}/role-text
 * @response `200` `{
    success: boolean,

}` Role text update result
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      adminUserControllerUpdateRoleText: (
         { id }: AdminUserControllerUpdateRoleTextParams,
         data: AdminUserControllerUpdateRoleTextPayload,
         params: RequestParams = {}
      ) =>
         this.request<
            {
               success: boolean;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/admin/user/${id}/role-text`,
            method: 'POST',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags AdminUser
 * @name AdminUserControllerAdminResetCountry
 * @request POST:/api/v2/admin/user/{id}/reset-country
 * @response `200` `{
    success: boolean,

}` Country reset result
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      adminUserControllerAdminResetCountry: (
         { id }: AdminUserControllerAdminResetCountryParams,
         data: AdminUserControllerAdminResetCountryPayload,
         params: RequestParams = {}
      ) =>
         this.request<
            {
               success: boolean;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/admin/user/${id}/reset-country`,
            method: 'POST',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags AdminUser
 * @name AdminUserControllerUpdatePermissions
 * @request POST:/api/v2/admin/user/{id}/permissions
 * @response `200` `{
    success: boolean,
    permissions: number,

}` Permission update result
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      adminUserControllerUpdatePermissions: (
         { id }: AdminUserControllerUpdatePermissionsParams,
         data: AdminUserControllerUpdatePermissionsPayload,
         params: RequestParams = {}
      ) =>
         this.request<
            {
               success: boolean;
               permissions: number;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/admin/user/${id}/permissions`,
            method: 'POST',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags AdminUser
 * @name AdminUserControllerMergePlayer
 * @request POST:/api/v2/admin/user/{id}/merge
 * @response `200` `{
    success: true,
    targetPlayerId: string,
    publicPlayerId: string,
    mergedPublicPlayerIds: (string)[],

}` Account merge result
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `403` `{
    statusCode: 403,
    error: "Forbidden",
    code: "FORBIDDEN",
    message: string,
    details?: {
    reason: string,

},

}` Forbidden
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 * @response `500` `({
    statusCode: 500,
    error: "Internal Server Error",
    code: "EXTERNAL_SERVICE_ERROR",
    message: string,
    details: {
    service: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "DATABASE_WRITE_ERROR",
    message: string,
    details: {
    operation: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "INTERNAL_SERVER_ERROR",
    message: string,

})` Internal Server Error
 */
      adminUserControllerMergePlayer: (
         { id }: AdminUserControllerMergePlayerParams,
         data: AdminUserControllerMergePlayerPayload,
         params: RequestParams = {}
      ) =>
         this.request<
            {
               success: true;
               targetPlayerId: string;
               publicPlayerId: string;
               mergedPublicPlayerIds: string[];
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 403;
                 error: 'Forbidden';
                 code: 'FORBIDDEN';
                 message: string;
                 details?: {
                    reason: string;
                 };
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
            | (
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'EXTERNAL_SERVICE_ERROR';
                      message: string;
                      details: {
                         service: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'DATABASE_WRITE_ERROR';
                      message: string;
                      details: {
                         operation: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'INTERNAL_SERVER_ERROR';
                      message: string;
                   }
              )
         >({
            path: `/api/v2/admin/user/${id}/merge`,
            method: 'POST',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params
         })
   };
   adminVersion = {
      /**
 * No description
 *
 * @tags AdminVersion
 * @name AdminVersionControllerGetVersions
 * @request GET:/api/v2/admin/versions
 * @response `200` `({
    id: number,
    hash: string,
    version: string,
    platform: string,
    whitelisted: boolean,
    createdAt: string,

})[]` All mod versions
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 */
      adminVersionControllerGetVersions: (params: RequestParams = {}) =>
         this.request<
            {
               id: number;
               hash: string;
               version: string;
               platform: string;
               whitelisted: boolean;
               createdAt: string;
            }[],
            {
               statusCode: 401;
               error: 'Unauthorized';
               code: 'UNAUTHORIZED';
               message: string;
            }
         >({
            path: `/api/v2/admin/versions`,
            method: 'GET',
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags AdminVersion
 * @name AdminVersionControllerCreateVersion
 * @request POST:/api/v2/admin/versions
 * @response `200` `{
    id: number,
    hash: string,
    version: string,
    platform: string,
    whitelisted: boolean,
    createdAt: string,

}` Created version
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `500` `({
    statusCode: 500,
    error: "Internal Server Error",
    code: "EXTERNAL_SERVICE_ERROR",
    message: string,
    details: {
    service: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "DATABASE_WRITE_ERROR",
    message: string,
    details: {
    operation: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "INTERNAL_SERVER_ERROR",
    message: string,

})` Internal Server Error
 */
      adminVersionControllerCreateVersion: (data: AdminVersionControllerCreateVersionPayload, params: RequestParams = {}) =>
         this.request<
            {
               id: number;
               hash: string;
               version: string;
               platform: string;
               whitelisted: boolean;
               createdAt: string;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | (
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'EXTERNAL_SERVICE_ERROR';
                      message: string;
                      details: {
                         service: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'DATABASE_WRITE_ERROR';
                      message: string;
                      details: {
                         operation: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'INTERNAL_SERVER_ERROR';
                      message: string;
                   }
              )
         >({
            path: `/api/v2/admin/versions`,
            method: 'POST',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags AdminVersion
 * @name AdminVersionControllerUpdateWhitelist
 * @request POST:/api/v2/admin/versions/{id}/whitelist
 * @response `200` `{
    success: boolean,
    promotedScores?: number,

}` Whitelist update result
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      adminVersionControllerUpdateWhitelist: (
         { id }: AdminVersionControllerUpdateWhitelistParams,
         data: AdminVersionControllerUpdateWhitelistPayload,
         params: RequestParams = {}
      ) =>
         this.request<
            {
               success: boolean;
               promotedScores?: number;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/admin/versions/${id}/whitelist`,
            method: 'POST',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags AdminVersion
 * @name AdminVersionControllerDeleteVersion
 * @request DELETE:/api/v2/admin/versions/{id}
 * @response `200` `{
    success: boolean,

}` Version deletion result
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      adminVersionControllerDeleteVersion: ({ id }: AdminVersionControllerDeleteVersionParams, params: RequestParams = {}) =>
         this.request<
            {
               success: boolean;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/admin/versions/${id}`,
            method: 'DELETE',
            format: 'json',
            ...params
         })
   };
   user = {
      /**
 * No description
 *
 * @tags User
 * @name UserControllerGetMe
 * @request GET:/api/v2/user/@me
 * @response `200` `{
    id: string,
    name: string,
    role: string | null,
    avatar: string,
    bio: string | null,
    country: string,
    permissions: number,
    banned: boolean,
    inactive: boolean,
    stats: {
    rank: number,
    countryRank: number,

},
    relationships: {
    following: ({
    id: string,
    relation: "platform-friend" | "follow",

})[],
    mutuals: ({
    id: string,
    relation: "platform-friend" | "follow",

})[],

},

}` Current authenticated player profile
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      userControllerGetMe: (params: RequestParams = {}) =>
         this.request<
            {
               id: string;
               name: string;
               role: string | null;
               avatar: string;
               bio: string | null;
               country: string;
               permissions: number;
               banned: boolean;
               inactive: boolean;
               stats: {
                  rank: number;
                  countryRank: number;
               };
               relationships: {
                  following: {
                     id: string;
                     relation: 'platform-friend' | 'follow';
                  }[];
                  mutuals: {
                     id: string;
                     relation: 'platform-friend' | 'follow';
                  }[];
               };
            },
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/user/@me`,
            method: 'GET',
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags User
 * @name UserControllerGetMyInfo
 * @request GET:/api/v2/user/my-info
 * @response `200` `{
    country: string,
    ip: string,

}` Client IP and country info
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 */
      userControllerGetMyInfo: (params: RequestParams = {}) =>
         this.request<
            {
               country: string;
               ip: string;
            },
            {
               statusCode: 401;
               error: 'Unauthorized';
               code: 'UNAUTHORIZED';
               message: string;
            }
         >({
            path: `/api/v2/user/my-info`,
            method: 'GET',
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags User
 * @name UserControllerGetQuestKey
 * @request GET:/api/v2/user/quest-key
 * @response `200` `{
    questKey: string,

}` Quest authentication key
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      userControllerGetQuestKey: (params: RequestParams = {}) =>
         this.request<
            {
               questKey: string;
            },
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/user/quest-key`,
            method: 'GET',
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags User
 * @name UserControllerCanResetCountry
 * @request GET:/api/v2/user/can-reset-country
 * @response `200` `{
    canReset: boolean,
    lastReset: string | null,

}` Country reset eligibility status
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 */
      userControllerCanResetCountry: (params: RequestParams = {}) =>
         this.request<
            {
               canReset: boolean;
               lastReset: string | null;
            },
            {
               statusCode: 401;
               error: 'Unauthorized';
               code: 'UNAUTHORIZED';
               message: string;
            }
         >({
            path: `/api/v2/user/can-reset-country`,
            method: 'GET',
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags User
 * @name UserControllerResetCountry
 * @request POST:/api/v2/user/reset-country
 * @response `200` `{
    success: boolean,

}` Country reset result
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      userControllerResetCountry: (params: RequestParams = {}) =>
         this.request<
            {
               success: boolean;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/user/reset-country`,
            method: 'POST',
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags User
 * @name UserControllerUpdateBio
 * @request POST:/api/v2/user/update-bio
 * @response `200` `{
    success: boolean,

}` Bio update result
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      userControllerUpdateBio: (data: UserControllerUpdateBioPayload, params: RequestParams = {}) =>
         this.request<
            {
               success: boolean;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/user/update-bio`,
            method: 'POST',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags User
 * @name UserControllerUpdateName
 * @request POST:/api/v2/user/update-name
 * @response `200` `{
    success: boolean,

}` Name update result
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      userControllerUpdateName: (data: UserControllerUpdateNamePayload, params: RequestParams = {}) =>
         this.request<
            {
               success: boolean;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/user/update-name`,
            method: 'POST',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags User
 * @name UserControllerUploadAvatar
 * @request POST:/api/v2/user/avatar
 * @response `200` `{
    success: boolean,

}` Avatar upload result
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 * @response `500` `({
    statusCode: 500,
    error: "Internal Server Error",
    code: "EXTERNAL_SERVICE_ERROR",
    message: string,
    details: {
    service: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "DATABASE_WRITE_ERROR",
    message: string,
    details: {
    operation: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "INTERNAL_SERVER_ERROR",
    message: string,

})` Internal Server Error
 */
      userControllerUploadAvatar: (data: UserControllerUploadAvatarPayload, params: RequestParams = {}) =>
         this.request<
            {
               success: boolean;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
            | (
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'EXTERNAL_SERVICE_ERROR';
                      message: string;
                      details: {
                         service: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'DATABASE_WRITE_ERROR';
                      message: string;
                      details: {
                         operation: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'INTERNAL_SERVER_ERROR';
                      message: string;
                   }
              )
         >({
            path: `/api/v2/user/avatar`,
            method: 'POST',
            body: data,
            type: ContentType.FormData,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags User
 * @name UserControllerGetReplaySlots
 * @request GET:/api/v2/user/replay-slots
 * @response `200` `{
    used: number,
    limit: number,
    slots: ({
    scoreId: number,
    leaderboardId: number,
    retentionState: "FREE" | "SUPPORTER" | "ARCHIVED" | "PRUNE_CANDIDATE",
    source: string,
    releasedAt: string | null,

})[],
    claimable: ({
    scoreId: number,
    leaderboardId: number,
    retentionState: "FREE" | "SUPPORTER" | "ARCHIVED" | "PRUNE_CANDIDATE",
    source: string,
    releasedAt: string | null,

})[],

}` Replay slot usage and claimable replays
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      userControllerGetReplaySlots: (params: RequestParams = {}) =>
         this.request<
            {
               used: number;
               limit: number;
               slots: {
                  scoreId: number;
                  leaderboardId: number;
                  retentionState: 'FREE' | 'SUPPORTER' | 'ARCHIVED' | 'PRUNE_CANDIDATE';
                  source: string;
                  releasedAt: string | null;
               }[];
               claimable: {
                  scoreId: number;
                  leaderboardId: number;
                  retentionState: 'FREE' | 'SUPPORTER' | 'ARCHIVED' | 'PRUNE_CANDIDATE';
                  source: string;
                  releasedAt: string | null;
               }[];
            },
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/user/replay-slots`,
            method: 'GET',
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags User
 * @name UserControllerRefreshPatreonBenefits
 * @request POST:/api/v2/user/patreon/refresh
 * @response `200` `{
    success: true,
    supporterStatus: "supporter" | "pp-farmer" | "none",

}` Refresh Patreon supporter benefits for the current user
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 * @response `500` `({
    statusCode: 500,
    error: "Internal Server Error",
    code: "EXTERNAL_SERVICE_ERROR",
    message: string,
    details: {
    service: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "DATABASE_WRITE_ERROR",
    message: string,
    details: {
    operation: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "INTERNAL_SERVER_ERROR",
    message: string,

})` Internal Server Error
 */
      userControllerRefreshPatreonBenefits: (params: RequestParams = {}) =>
         this.request<
            {
               success: true;
               supporterStatus: 'supporter' | 'pp-farmer' | 'none';
            },
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
            | (
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'EXTERNAL_SERVICE_ERROR';
                      message: string;
                      details: {
                         service: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'DATABASE_WRITE_ERROR';
                      message: string;
                      details: {
                         operation: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'INTERNAL_SERVER_ERROR';
                      message: string;
                   }
              )
         >({
            path: `/api/v2/user/patreon/refresh`,
            method: 'POST',
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags User
 * @name UserControllerRedeemScoreSaber2Badge
 * @request POST:/api/v2/user/perks/score-saber-2-badge
 * @response `200` `{
    success: boolean,

}` Redeem the ScoreSaber 2 launch supporter badge
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 * @response `500` `({
    statusCode: 500,
    error: "Internal Server Error",
    code: "EXTERNAL_SERVICE_ERROR",
    message: string,
    details: {
    service: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "DATABASE_WRITE_ERROR",
    message: string,
    details: {
    operation: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "INTERNAL_SERVER_ERROR",
    message: string,

})` Internal Server Error
 */
      userControllerRedeemScoreSaber2Badge: (params: RequestParams = {}) =>
         this.request<
            {
               success: boolean;
            },
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
            | (
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'EXTERNAL_SERVICE_ERROR';
                      message: string;
                      details: {
                         service: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'DATABASE_WRITE_ERROR';
                      message: string;
                      details: {
                         operation: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'INTERNAL_SERVER_ERROR';
                      message: string;
                   }
              )
         >({
            path: `/api/v2/user/perks/score-saber-2-badge`,
            method: 'POST',
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags User
 * @name UserControllerClaimReplaySlot
 * @request POST:/api/v2/user/replay-slots/{scoreId}
 * @response `200` `{
    scoreId: number,
    leaderboardId: number,
    retentionState: "FREE" | "SUPPORTER" | "ARCHIVED" | "PRUNE_CANDIDATE",
    source: string,
    releasedAt: string | null,

}` Claim a current-best replay into a replay slot
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      userControllerClaimReplaySlot: ({ scoreId }: UserControllerClaimReplaySlotParams, params: RequestParams = {}) =>
         this.request<
            {
               scoreId: number;
               leaderboardId: number;
               retentionState: 'FREE' | 'SUPPORTER' | 'ARCHIVED' | 'PRUNE_CANDIDATE';
               source: string;
               releasedAt: string | null;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/user/replay-slots/${scoreId}`,
            method: 'POST',
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags User
 * @name UserControllerReleaseReplaySlot
 * @request DELETE:/api/v2/user/replay-slots/{scoreId}
 * @response `200` `{
    scoreId: number,
    leaderboardId: number,
    retentionState: "FREE" | "SUPPORTER" | "ARCHIVED" | "PRUNE_CANDIDATE",
    source: string,
    releasedAt: string | null,

}` Release a replay slot
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      userControllerReleaseReplaySlot: ({ scoreId }: UserControllerReleaseReplaySlotParams, params: RequestParams = {}) =>
         this.request<
            {
               scoreId: number;
               leaderboardId: number;
               retentionState: 'FREE' | 'SUPPORTER' | 'ARCHIVED' | 'PRUNE_CANDIDATE';
               source: string;
               releasedAt: string | null;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/user/replay-slots/${scoreId}`,
            method: 'DELETE',
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags User
 * @name UserControllerGetConnections
 * @request GET:/api/v2/user/connections
 * @response `200` `({
    id: number,
    provider: "STEAM" | "OCULUS" | "PATREON" | "DISCORD",
    providerAccountId: string,
    state: "VERIFIED" | "CONNECTED",
    source: "LEGACY_IMPORT" | "GAME_AUTH" | "STEAM_OPENID" | "PATREON_OAUTH" | "DISCORD_OAUTH" | "DISCORD_BOT",
    isPrimary: boolean,
  /**
   * @format date-time
   * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
   *\/
    connectedAt: Date | null,
    tokenBacked: boolean,

})[]` Player connections
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 */
      userControllerGetConnections: (params: RequestParams = {}) =>
         this.request<
            {
               id: number;
               provider: 'STEAM' | 'OCULUS' | 'PATREON' | 'DISCORD';
               providerAccountId: string;
               state: 'VERIFIED' | 'CONNECTED';
               source: 'LEGACY_IMPORT' | 'GAME_AUTH' | 'STEAM_OPENID' | 'PATREON_OAUTH' | 'DISCORD_OAUTH' | 'DISCORD_BOT';
               isPrimary: boolean;
               /**
                * @format date-time
                * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
                */
               connectedAt: Date | null;
               tokenBacked: boolean;
            }[],
            {
               statusCode: 401;
               error: 'Unauthorized';
               code: 'UNAUTHORIZED';
               message: string;
            }
         >({
            path: `/api/v2/user/connections`,
            method: 'GET',
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags User
 * @name UserControllerSwitchPrimaryConnection
 * @request POST:/api/v2/user/connections/primary
 * @response `200` `{
    success: true,
    publicPlayerId: string,
    provider: "STEAM" | "OCULUS",

}` Primary public account id switch result
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 * @response `500` `({
    statusCode: 500,
    error: "Internal Server Error",
    code: "EXTERNAL_SERVICE_ERROR",
    message: string,
    details: {
    service: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "DATABASE_WRITE_ERROR",
    message: string,
    details: {
    operation: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "INTERNAL_SERVER_ERROR",
    message: string,

})` Internal Server Error
 */
      userControllerSwitchPrimaryConnection: (data: UserControllerSwitchPrimaryConnectionPayload, params: RequestParams = {}) =>
         this.request<
            {
               success: true;
               publicPlayerId: string;
               provider: 'STEAM' | 'OCULUS';
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
            | (
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'EXTERNAL_SERVICE_ERROR';
                      message: string;
                      details: {
                         service: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'DATABASE_WRITE_ERROR';
                      message: string;
                      details: {
                         operation: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'INTERNAL_SERVER_ERROR';
                      message: string;
                   }
              )
         >({
            path: `/api/v2/user/connections/primary`,
            method: 'POST',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags User
 * @name UserControllerStartOculusEmailMerge
 * @request POST:/api/v2/user/account-merge/oculus-email/start
 * @response `200` `{
    challengeId: string,
    expiresAt: string,
    resendAvailableAt: string,

}` Start an Oculus email proof challenge for account merge
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `500` `({
    statusCode: 500,
    error: "Internal Server Error",
    code: "EXTERNAL_SERVICE_ERROR",
    message: string,
    details: {
    service: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "DATABASE_WRITE_ERROR",
    message: string,
    details: {
    operation: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "INTERNAL_SERVER_ERROR",
    message: string,

})` Internal Server Error
 */
      userControllerStartOculusEmailMerge: (data: UserControllerStartOculusEmailMergePayload, params: RequestParams = {}) =>
         this.request<
            {
               challengeId: string;
               expiresAt: string;
               resendAvailableAt: string;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | (
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'EXTERNAL_SERVICE_ERROR';
                      message: string;
                      details: {
                         service: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'DATABASE_WRITE_ERROR';
                      message: string;
                      details: {
                         operation: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'INTERNAL_SERVER_ERROR';
                      message: string;
                   }
              )
         >({
            path: `/api/v2/user/account-merge/oculus-email/start`,
            method: 'POST',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags User
 * @name UserControllerVerifyOculusEmailMerge
 * @request POST:/api/v2/user/account-merge/oculus-email/verify
 * @response `200` `{
    challengeId: string,
  /**
   * @format date-time
   * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
   *\/
    expiresAt: Date,
    targetPlayer: {
    id: string,
    name: string,
    country: string,
    provider: "STEAM" | "OCULUS",
    providerAccountId: string,
    publicPlayerId: string,

},
    sourcePlayer: {
    id: string,
    name: string,
    country: string,
    provider: "STEAM" | "OCULUS",
    providerAccountId: string,
    publicPlayerId: string,

},

}` Verify an Oculus email proof and create an account merge challenge
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `403` `{
    statusCode: 403,
    error: "Forbidden",
    code: "FORBIDDEN",
    message: string,
    details?: {
    reason: string,

},

}` Forbidden
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 * @response `500` `({
    statusCode: 500,
    error: "Internal Server Error",
    code: "EXTERNAL_SERVICE_ERROR",
    message: string,
    details: {
    service: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "DATABASE_WRITE_ERROR",
    message: string,
    details: {
    operation: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "INTERNAL_SERVER_ERROR",
    message: string,

})` Internal Server Error
 */
      userControllerVerifyOculusEmailMerge: (data: UserControllerVerifyOculusEmailMergePayload, params: RequestParams = {}) =>
         this.request<
            {
               challengeId: string;
               /**
                * @format date-time
                * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
                */
               expiresAt: Date;
               targetPlayer: {
                  id: string;
                  name: string;
                  country: string;
                  provider: 'STEAM' | 'OCULUS';
                  providerAccountId: string;
                  publicPlayerId: string;
               };
               sourcePlayer: {
                  id: string;
                  name: string;
                  country: string;
                  provider: 'STEAM' | 'OCULUS';
                  providerAccountId: string;
                  publicPlayerId: string;
               };
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 403;
                 error: 'Forbidden';
                 code: 'FORBIDDEN';
                 message: string;
                 details?: {
                    reason: string;
                 };
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
            | (
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'EXTERNAL_SERVICE_ERROR';
                      message: string;
                      details: {
                         service: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'DATABASE_WRITE_ERROR';
                      message: string;
                      details: {
                         operation: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'INTERNAL_SERVER_ERROR';
                      message: string;
                   }
              )
         >({
            path: `/api/v2/user/account-merge/oculus-email/verify`,
            method: 'POST',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags User
 * @name UserControllerGetAccountMergeChallenge
 * @request GET:/api/v2/user/account-merge/{challengeId}
 * @response `200` `{
    challengeId: string,
  /**
   * @format date-time
   * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
   *\/
    expiresAt: Date,
    targetPlayer: {
    id: string,
    name: string,
    country: string,
    provider: "STEAM" | "OCULUS",
    providerAccountId: string,
    publicPlayerId: string,

},
    sourcePlayer: {
    id: string,
    name: string,
    country: string,
    provider: "STEAM" | "OCULUS",
    providerAccountId: string,
    publicPlayerId: string,

},

}` Account merge challenge preview
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `403` `{
    statusCode: 403,
    error: "Forbidden",
    code: "FORBIDDEN",
    message: string,
    details?: {
    reason: string,

},

}` Forbidden
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 * @response `500` `({
    statusCode: 500,
    error: "Internal Server Error",
    code: "EXTERNAL_SERVICE_ERROR",
    message: string,
    details: {
    service: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "DATABASE_WRITE_ERROR",
    message: string,
    details: {
    operation: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "INTERNAL_SERVER_ERROR",
    message: string,

})` Internal Server Error
 */
      userControllerGetAccountMergeChallenge: ({ challengeId }: UserControllerGetAccountMergeChallengeParams, params: RequestParams = {}) =>
         this.request<
            {
               challengeId: string;
               /**
                * @format date-time
                * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
                */
               expiresAt: Date;
               targetPlayer: {
                  id: string;
                  name: string;
                  country: string;
                  provider: 'STEAM' | 'OCULUS';
                  providerAccountId: string;
                  publicPlayerId: string;
               };
               sourcePlayer: {
                  id: string;
                  name: string;
                  country: string;
                  provider: 'STEAM' | 'OCULUS';
                  providerAccountId: string;
                  publicPlayerId: string;
               };
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 403;
                 error: 'Forbidden';
                 code: 'FORBIDDEN';
                 message: string;
                 details?: {
                    reason: string;
                 };
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
            | (
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'EXTERNAL_SERVICE_ERROR';
                      message: string;
                      details: {
                         service: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'DATABASE_WRITE_ERROR';
                      message: string;
                      details: {
                         operation: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'INTERNAL_SERVER_ERROR';
                      message: string;
                   }
              )
         >({
            path: `/api/v2/user/account-merge/${challengeId}`,
            method: 'GET',
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags User
 * @name UserControllerConfirmAccountMerge
 * @request POST:/api/v2/user/account-merge/{challengeId}/confirm
 * @response `200` `{
    success: true,
    targetPlayerId: string,
    publicPlayerId: string,
    mergedPublicPlayerIds: (string)[],

}` Account merge result
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `403` `{
    statusCode: 403,
    error: "Forbidden",
    code: "FORBIDDEN",
    message: string,
    details?: {
    reason: string,

},

}` Forbidden
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 * @response `500` `({
    statusCode: 500,
    error: "Internal Server Error",
    code: "EXTERNAL_SERVICE_ERROR",
    message: string,
    details: {
    service: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "DATABASE_WRITE_ERROR",
    message: string,
    details: {
    operation: string,

},

} | {
    statusCode: 500,
    error: "Internal Server Error",
    code: "INTERNAL_SERVER_ERROR",
    message: string,

})` Internal Server Error
 */
      userControllerConfirmAccountMerge: ({ challengeId }: UserControllerConfirmAccountMergeParams, params: RequestParams = {}) =>
         this.request<
            {
               success: true;
               targetPlayerId: string;
               publicPlayerId: string;
               mergedPublicPlayerIds: string[];
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 403;
                 error: 'Forbidden';
                 code: 'FORBIDDEN';
                 message: string;
                 details?: {
                    reason: string;
                 };
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
            | (
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'EXTERNAL_SERVICE_ERROR';
                      message: string;
                      details: {
                         service: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'DATABASE_WRITE_ERROR';
                      message: string;
                      details: {
                         operation: string;
                      };
                   }
                 | {
                      statusCode: 500;
                      error: 'Internal Server Error';
                      code: 'INTERNAL_SERVER_ERROR';
                      message: string;
                   }
              )
         >({
            path: `/api/v2/user/account-merge/${challengeId}/confirm`,
            method: 'POST',
            format: 'json',
            ...params
         }),

      /**
 * No description
 *
 * @tags User
 * @name UserControllerRemoveConnection
 * @request DELETE:/api/v2/user/connections/{provider}
 * @response `200` `{
    success: boolean,

}` Connection removal result
 * @response `400` `({
    statusCode: 400,
    error: "Bad Request",
    code: "VALIDATION_ERROR",
    message: string,
    details?: {
    field?: string,

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "REQUEST_VALIDATION_ERROR",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

} | {
    statusCode: 400,
    error: "Bad Request",
    code: "INVALID_PATH_PARAMETER",
    message: string,
    details: {
    errors: ({
    path: string,
    message: string,

})[],

},

})` Bad Request
 * @response `401` `{
    statusCode: 401,
    error: "Unauthorized",
    code: "UNAUTHORIZED",
    message: string,

}` Unauthorized
 * @response `404` `{
    statusCode: 404,
    error: "Not Found",
    code: "NOT_FOUND",
    message: string,
    details?: {
    resource: string,
    id?: (string | number),

},

}` Not Found
 */
      userControllerRemoveConnection: ({ provider }: UserControllerRemoveConnectionParams, params: RequestParams = {}) =>
         this.request<
            {
               success: boolean;
            },
            | (
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'VALIDATION_ERROR';
                      message: string;
                      details?: {
                         field?: string;
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'REQUEST_VALIDATION_ERROR';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
                 | {
                      statusCode: 400;
                      error: 'Bad Request';
                      code: 'INVALID_PATH_PARAMETER';
                      message: string;
                      details: {
                         errors: {
                            path: string;
                            message: string;
                         }[];
                      };
                   }
              )
            | {
                 statusCode: 401;
                 error: 'Unauthorized';
                 code: 'UNAUTHORIZED';
                 message: string;
              }
            | {
                 statusCode: 404;
                 error: 'Not Found';
                 code: 'NOT_FOUND';
                 message: string;
                 details?: {
                    resource: string;
                    id?: string | number;
                 };
              }
         >({
            path: `/api/v2/user/connections/${provider}`,
            method: 'DELETE',
            format: 'json',
            ...params
         })
   };
}
