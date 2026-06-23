import { defineLudusPacketHandler } from '@/modules/live/ludus/packets/handler';

export const reconnectRequestedHandler = defineLudusPacketHandler('RECONNECT_REQUESTED', (context, envelope) => {
   context.reconnect(envelope.websocketUrl, envelope.retryAfterMs);
});
