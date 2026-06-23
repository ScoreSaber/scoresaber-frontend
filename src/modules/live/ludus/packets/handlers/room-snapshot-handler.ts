import { defineLudusPacketHandler } from '@/modules/live/ludus/packets/handler';
import type { LudusReplayScore, LudusRoomState } from '@/modules/live/ludus/packets/protobuf';

export const roomSnapshotHandler = defineLudusPacketHandler('ROOM_SNAPSHOT', (context, envelope) => {
   context.updateState((current) => ({
      ...current,
      rooms: envelope.rooms,
      scores: pruneReplayScoresForRoomSnapshot(current.scores, envelope.rooms)
   }));
});

function pruneReplayScoresForRoomSnapshot(scores: LudusReplayScore[], rooms: LudusRoomState[]) {
   const roomStatesByMatchId = new Map(rooms.map((room) => [room.matchId, new Map(room.playerStates.map((player) => [player.playerId, player]))]));

   return scores.filter((score) => {
      const roomStates = roomStatesByMatchId.get(score.matchId);
      if (!roomStates) return true;

      return roomStates.get(score.playerId)?.playState === 'PLAYING';
   });
}
