import type { LeaderboardControllerGetLeaderboardScoresByIdDataItem, PlayerControllerGetPlayerResponse } from '@/shared/api/generated/ApiParams';
import { isSteamPlayer } from '@/shared/format/helpers';
import { getPlayerRoleStyleAndTitle } from '@/shared/format/styling';

type PlayerSummarySource = PlayerControllerGetPlayerResponse | LeaderboardControllerGetLeaderboardScoresByIdDataItem['player'];

export function buildPlayerSummary(player: PlayerSummarySource, roleVariant?: 'text') {
   const [roleClassName, roleTitle] = getPlayerRoleStyleAndTitle(player, roleVariant);
   const isSteam = isSteamPlayer(player.id);

   return {
      steamHref: isSteam ? `https://steamcommunity.com/profiles/${player.id}` : null,
      roleClassName,
      roleTitle,
      hasSpecialRole: roleTitle !== null && roleTitle !== player.name,
      isSteam,
      isInactive: 'inactive' in player ? player.inactive : false,
      isBanned: 'banned' in player ? player.banned : false
   };
}
