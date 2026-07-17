import { DEFAULT_GAME_MODE, getGameModeFromRawDifficulty } from '@/shared/format/strings';

type GameModeLeaderboard = {
   rawDifficulty: string;
};

type DifficultyLeaderboard = {
   difficulty: number;
};

type IdentifiedLeaderboard = {
   id: number;
};

export function getDisplayLeaderboards<T extends GameModeLeaderboard & DifficultyLeaderboard>(
   leaderboards: T[],
   gameMode = DEFAULT_GAME_MODE,
   ascending = true
) {
   const filteredLeaderboards = leaderboards.filter((leaderboard) => getGameModeFromRawDifficulty(leaderboard.rawDifficulty) === gameMode);
   const visibleLeaderboards = filteredLeaderboards.length > 0 ? filteredLeaderboards : leaderboards;
   return [...visibleLeaderboards].sort((a, b) => (ascending ? a.difficulty - b.difficulty : b.difficulty - a.difficulty));
}

export function getDefaultLeaderboardId<T extends GameModeLeaderboard & DifficultyLeaderboard & IdentifiedLeaderboard>(
   leaderboards: T[],
   gameMode = DEFAULT_GAME_MODE
) {
   return getDisplayLeaderboards(leaderboards, gameMode, false)[0].id;
}

export function getAvailableGameModes<T extends GameModeLeaderboard>(leaderboards: T[]) {
   return [...new Set(leaderboards.map((leaderboard) => getGameModeFromRawDifficulty(leaderboard.rawDifficulty)))].sort((a, b) =>
      a === DEFAULT_GAME_MODE ? -1 : b === DEFAULT_GAME_MODE ? 1 : 0
   );
}
