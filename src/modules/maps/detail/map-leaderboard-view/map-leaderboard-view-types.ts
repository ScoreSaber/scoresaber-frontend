import type {
   LeaderboardControllerGetLeaderboardScoresByIdPivot,
   LeaderboardControllerGetLeaderboardScoresByIdResponse,
   MapControllerGetMapByIdResponse
} from '@/shared/api/generated/ApiParams';
import type { CountryRegionFilterValue } from '@/shared/country-region';
import type { RouteLocationBuilder } from '@/shared/url-state/route-location';
import type { SearchParamsRecord } from '@/shared/url-state/search-params';

type RankRequest = NonNullable<MapControllerGetMapByIdResponse['rankRequest']>;

type MapLeaderboard = MapControllerGetMapByIdResponse['leaderboards'][number];

type LeaderboardScores = LeaderboardControllerGetLeaderboardScoresByIdResponse | null;

type MapLeaderboardTab = 'leaderboard' | 'insights' | 'rank-request';
type MapLeaderboardRouteName = 'map' | 'mapDifficulty';
type LeaderboardScopeSearch = CountryRegionFilterValue | 'country' | 'region';

type LeaderboardSearchParams = SearchParamsRecord & {
   page: number;
   search?: string;
   scope?: LeaderboardScopeSearch;
   pivot?: LeaderboardControllerGetLeaderboardScoresByIdPivot;
   highlight?: number;
   tab?: MapLeaderboardTab;
};

interface MapLeaderboardViewProps<TLocation> {
   routeName: MapLeaderboardRouteName;
   mapInfo: MapControllerGetMapByIdResponse;
   leaderboard: MapLeaderboard;
   leaderboardScores: LeaderboardScores;
   search: LeaderboardSearchParams;
   currentPage: number;
   currentSearch?: string;
   highlight?: number;
   rankRequest?: RankRequest | null;
   defaultTab?: MapLeaderboardTab;
   buildLocation: RouteLocationBuilder<LeaderboardSearchParams, TLocation>;
   parseSearch: (search: SearchParamsRecord) => LeaderboardSearchParams | null;
}

export type {
   LeaderboardScores,
   LeaderboardSearchParams,
   MapLeaderboard,
   MapLeaderboardRouteName,
   MapLeaderboardTab,
   MapLeaderboardViewProps,
   RankRequest
};
