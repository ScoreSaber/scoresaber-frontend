import type {
   LeaderboardControllerGetLeaderboardByIdResponse,
   LeaderboardControllerGetLeaderboardScoresByIdDataItem,
   LeaderboardControllerGetLeaderboardScoresByIdPivot,
   MapControllerGetMapByIdResponse
} from '@/shared/api/generated/ApiParams';
import type { CountryRegionFilterValue } from '@/shared/country-region';
import type { SearchParamsRecord } from '@/shared/url-state/search-params';

type RankRequest = NonNullable<MapControllerGetMapByIdResponse['rankRequest']>;

type LeaderboardScores = {
   data: LeaderboardControllerGetLeaderboardScoresByIdDataItem[];
   metadata: { totalItems: number; itemsPerPage: number };
} | null;

type MapLeaderboardTab = 'leaderboard' | 'rank-request';

type LeaderboardSearchParams = SearchParamsRecord & {
   page?: number;
   search?: string;
   scope?: CountryRegionFilterValue;
   pivot?: LeaderboardControllerGetLeaderboardScoresByIdPivot;
   highlight?: number;
   tab?: MapLeaderboardTab;
};

interface MapLeaderboardViewProps {
   mapInfo: MapControllerGetMapByIdResponse;
   leaderboardInfo: LeaderboardControllerGetLeaderboardByIdResponse;
   leaderboardScores: LeaderboardScores;
   search: LeaderboardSearchParams;
   currentPage: number;
   currentSearch?: string;
   highlight?: number;
   rankRequest?: RankRequest | null;
   defaultTab?: MapLeaderboardTab;
   buildHref: (search?: LeaderboardSearchParams) => string;
   parseSearch: (search: SearchParamsRecord) => LeaderboardSearchParams | null;
}

export type { LeaderboardScores, LeaderboardSearchParams, MapLeaderboardTab, MapLeaderboardViewProps, RankRequest };
