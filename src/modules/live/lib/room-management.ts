import type { LiveRoomPlayerListRow } from '@/modules/live/components/live-room-player-list';
import type { useLudus } from '@/modules/live/ludus/use-ludus';
import type { LiveTournamentRosterControllerListAuthorizedPlayersItem, LiveMatchRoomControllerListRoomsItem } from '@/shared/api/generated/ApiParams';

export type RoomMember = LiveMatchRoomControllerListRoomsItem['members'][number] & { active?: boolean; isBot?: boolean };

export type RoomPlayerDraft = {
   playerId: string;
   player: NonNullable<LiveTournamentRosterControllerListAuthorizedPlayersItem['player']> | null;
   teamName: string | null;
   role: 'PLAYER';
   active: boolean;
};

type LiveLudusRoom = ReturnType<typeof useLudus>['rooms'][number];

const roomPlaybackFreshMs = 5_000;

export function getRoomPlayerRows(
   roomPlayers: RoomPlayerDraft[],
   members: RoomMember[],
   ludusRoom: LiveLudusRoom | null,
   roomScores: ReturnType<typeof useLudus>['scores'],
   connectedLabel: string,
   countdownLabel: string | null
): LiveRoomPlayerListRow[] {
   const membersByPlayerId = new Map(members.map((member) => [member.playerId, member]));
   const hasLiveRoomState = ludusRoom != null;
   const connectedIds = new Set(ludusRoom?.playerIds ?? []);
   const statesByPlayerId = new Map((ludusRoom?.playerStates ?? []).map((state) => [state.playerId, state]));
   const scoresByPlayerId = new Map(roomScores.map((score) => [score.playerId, score]));

   return roomPlayers.map((player) => {
      const member = membersByPlayerId.get(player.playerId) ?? null;
      const playerState = statesByPlayerId.get(player.playerId);
      const score = scoresByPlayerId.get(player.playerId);
      const connected = hasLiveRoomState ? Boolean(playerState) || connectedIds.has(player.playerId) : Boolean(member?.connected);
      const isBot = hasLiveRoomState ? (playerState?.isBot ?? false) : (member?.isBot ?? false);

      return {
         playerId: player.playerId,
         player: player.player,
         teamName: player.teamName,
         role: player.role,
         member: member ? { ...member, connected } : null,
         active: member?.active ?? player.active,
         isBot,
         stateLabel: countdownLabel ?? (connected && !member ? connectedLabel : undefined),
         playState: playerState?.playState ?? (hasLiveRoomState ? 'IDLE' : member?.playState),
         downloadState: playerState?.downloadState ?? (hasLiveRoomState ? 'NONE' : member?.downloadState),
         readyState: playerState?.readyState ?? 'NOT_READY',
         errorMessage: playerState?.errorMessage,
         score: score
            ? {
                 rank: score.rank || null,
                 score: score.score,
                 accuracy: score.accuracy,
                 combo: score.combo,
                 notesMissed: score.notesMissed
              }
            : null
      };
   });
}

export function getRoomPlayback(ludusRoom: LiveLudusRoom | null, roomScores: ReturnType<typeof useLudus>['scores'], nowMs: number) {
   const freshScores = roomScores.filter((score) => {
      const sourceTimeMs = score.sourceServerTimeUnixMs > 0 ? score.sourceServerTimeUnixMs : score.sourceReceivedAtUnixMs;
      return nowMs - sourceTimeMs <= roomPlaybackFreshMs;
   });
   if (freshScores.length === 0) return { playing: ludusRoom?.playStatus === 'PLAYING', songPositionMs: null };

   const playingIds = new Set((ludusRoom?.playerStates ?? []).filter((player) => player.playState === 'PLAYING').map((player) => player.playerId));
   const tickingScoreIds = playingIds.size > 0 ? playingIds : new Set(freshScores.map((score) => score.playerId));
   const matchingScores = freshScores.filter((score) => tickingScoreIds.has(score.playerId));
   const tickingScores = matchingScores.length > 0 ? matchingScores : freshScores;

   return {
      playing: true,
      songPositionMs: Math.max(...tickingScores.map((score) => score.songPositionMs + Math.max(0, nowMs - score.sourceReceivedAtUnixMs)))
   };
}
