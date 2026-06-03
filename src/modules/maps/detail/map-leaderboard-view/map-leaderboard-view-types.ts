import type {
   LeaderboardControllerGetLeaderboardByIdResponse,
   LeaderboardControllerGetLeaderboardScoresByIdPivot,
   LeaderboardControllerGetLeaderboardScoresByIdResponse,
   MapControllerGetMapByIdResponse
} from '@/shared/api/generated/ApiParams';
import type { CountryRegionFilterValue } from '@/shared/country-region';
import type { SearchParamsRecord } from '@/shared/url-state/search-params';

type RankRequest = NonNullable<MapControllerGetMapByIdResponse['rankRequest']>;

type LeaderboardScores = LeaderboardControllerGetLeaderboardScoresByIdResponse | null;

type MapLeaderboardTab = 'leaderboard' | 'rank-request';
type MapLeaderboardRouteName = 'map' | 'mapDifficulty';

type LeaderboardSearchParams = SearchParamsRecord & {
   page?: number;
   search?: string;
   scope?: CountryRegionFilterValue;
   pivot?: LeaderboardControllerGetLeaderboardScoresByIdPivot;
   highlight?: number;
   tab?: MapLeaderboardTab;
};

interface MapLeaderboardViewProps {
   routeName: MapLeaderboardRouteName;
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

export type { LeaderboardScores, LeaderboardSearchParams, MapLeaderboardRouteName, MapLeaderboardTab, MapLeaderboardViewProps, RankRequest };
