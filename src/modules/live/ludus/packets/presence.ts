import type { LudusReplayScore, LudusRoomPlayerState, LudusRoomState } from '@/modules/live/ludus/packets/protobuf';
import type { LudusState } from '@/modules/live/ludus/packets/types';

export type LudusPlayerPresence = {
   matchId: string;
   room: LudusRoomState | null;
   playerState: LudusRoomPlayerState | null;
   score: LudusReplayScore | null;
   connected: boolean;
   loadedSong: boolean;
   playing: boolean;
};

export function getPublicPlayerMatchId(playerId: string) {
   return `player:${playerId}`;
}

export function getLudusPlayerPresence(
   state: Pick<LudusState, 'status' | 'rooms' | 'scores'>,
   playerId: string,
   matchId = getPublicPlayerMatchId(playerId)
): LudusPlayerPresence {
   const room = state.rooms.find((item) => item.matchId === matchId) ?? null;
   const playerState = room?.playerStates.find((item) => item.playerId === playerId) ?? null;
   const score = state.scores.find((item) => item.matchId === matchId && item.playerId === playerId) ?? null;
   const connected = state.status === 'connected' && (Boolean(playerState) || Boolean(room?.playerIds.includes(playerId)));
   const loadedSong = Boolean(room?.loadedSong);

   return {
      matchId,
      room,
      playerState,
      score,
      connected,
      loadedSong,
      playing: connected && (loadedSong || playerState?.playState === 'PLAYING' || score?.streamState === 'LIVE')
   };
}
