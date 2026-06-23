import { defineLudusPacketHandler } from '@/modules/live/ludus/packets/handler';
import type { LudusReplayScore } from '@/modules/live/ludus/packets/protobuf';

export const streamSnapshotHandler = defineLudusPacketHandler('STREAM_SNAPSHOT', (context, envelope) => {
   context.updateState((current) => ({
      ...current,
      rooms: envelope.snapshot.rooms.map((room) => room.room),
      scores: envelope.snapshot.rooms.flatMap((room) => room.scores.filter(isActiveReplayScore))
   }));
});

function isActiveReplayScore(score: LudusReplayScore) {
   return (
      score.streamState === 'STARTING' || score.streamState === 'LIVE' || score.streamState === 'DISCONNECTED' || score.streamState === 'RESUMING'
   );
}
