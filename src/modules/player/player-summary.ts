import { isSteamPlayer } from '@/shared/format/helpers';
import { getPlayerRoleStyleAndTitle, type PlayerRoleSource } from '@/shared/format/styling';

export function buildPlayerSummary(player: PlayerRoleSource, roleVariant?: 'text') {
   const [roleClassName, roleTitle] = getPlayerRoleStyleAndTitle(player, roleVariant);
   const isSteam = isSteamPlayer(player.id);

   return {
      steamHref: isSteam ? `https://steamcommunity.com/profiles/${player.id}` : null,
      roleClassName,
      roleTitle,
      hasSpecialRole: roleTitle !== null && roleTitle !== player.name,
      isSteam
   };
}
