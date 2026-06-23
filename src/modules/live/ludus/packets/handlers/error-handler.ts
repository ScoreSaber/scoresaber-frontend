import { defineLudusPacketHandler } from '@/modules/live/ludus/packets/handler';

export const errorHandler = defineLudusPacketHandler('ERROR', (context, envelope) => {
   context.updateState((current) => ({
      ...current,
      status: envelope.retryable ? current.status : 'error',
      error: envelope.message || envelope.code
   }));
});
