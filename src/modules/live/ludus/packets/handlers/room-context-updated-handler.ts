import { defineLudusPacketHandler } from '@/modules/live/ludus/packets/handler';

export const roomContextUpdatedHandler = defineLudusPacketHandler('ROOM_CONTEXT_UPDATED', (context, envelope) => {
   context.updateState((current) => ({
      ...current,
      clientType: envelope.clientType,
      roomContext: envelope.roomContext,
      tournamentId: envelope.tournamentId,
      currentMatchId: envelope.currentMatchId
   }));
});
