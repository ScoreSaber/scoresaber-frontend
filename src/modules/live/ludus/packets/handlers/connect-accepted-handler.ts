import { defineLudusPacketHandler } from '@/modules/live/ludus/packets/handler';

export const connectAcceptedHandler = defineLudusPacketHandler('CONNECT_ACCEPTED', (context, envelope) => {
   context.clearSocketErrorTimeout();
   context.updateState((current) => ({
      ...current,
      status: 'connected',
      connectionId: envelope.connectionId,
      clientType: envelope.clientType,
      roomContext: envelope.roomContext,
      tournamentId: envelope.tournamentId,
      currentMatchId: envelope.currentMatchId,
      error: null
   }));
   context.startHeartbeat(envelope.heartbeatIntervalMs);
});
