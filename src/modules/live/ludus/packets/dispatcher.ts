import type { LudusPacketHandler } from '@/modules/live/ludus/packets/handler';
import { chatMessageHandler } from '@/modules/live/ludus/packets/handlers/chat-message-handler';
import { chatSnapshotHandler } from '@/modules/live/ludus/packets/handlers/chat-snapshot-handler';
import { connectAcceptedHandler } from '@/modules/live/ludus/packets/handlers/connect-accepted-handler';
import { errorHandler } from '@/modules/live/ludus/packets/handlers/error-handler';
import { promptResponseHandler } from '@/modules/live/ludus/packets/handlers/prompt-response-handler';
import { reconnectRequestedHandler } from '@/modules/live/ludus/packets/handlers/reconnect-requested-handler';
import { returnToMenuCommandHandler } from '@/modules/live/ludus/packets/handlers/return-to-menu-command-handler';
import { roomContextUpdatedHandler } from '@/modules/live/ludus/packets/handlers/room-context-updated-handler';
import { roomSnapshotHandler } from '@/modules/live/ludus/packets/handlers/room-snapshot-handler';
import { startMapCommandHandler } from '@/modules/live/ludus/packets/handlers/start-map-command-handler';
import { streamSnapshotHandler } from '@/modules/live/ludus/packets/handlers/stream-snapshot-handler';
import type { LudusEnvelope } from '@/modules/live/ludus/packets/protobuf';
import type { LudusPacketContext } from '@/modules/live/ludus/packets/types';

export class LudusPacketDispatcher {
   private readonly handlers = new Map<LudusEnvelope['type'], LudusPacketHandler>();

   constructor(handlers: LudusPacketHandler[]) {
      for (const handler of handlers) {
         this.handlers.set(handler.type, handler);
      }
   }

   dispatch(context: LudusPacketContext, envelope: LudusEnvelope) {
      this.handlers.get(envelope.type)?.handle(context, envelope);
   }
}

export function createLudusPacketDispatcher() {
   return new LudusPacketDispatcher([
      connectAcceptedHandler,
      roomContextUpdatedHandler,
      reconnectRequestedHandler,
      roomSnapshotHandler,
      streamSnapshotHandler,
      startMapCommandHandler,
      returnToMenuCommandHandler,
      promptResponseHandler,
      chatMessageHandler,
      chatSnapshotHandler,
      errorHandler
   ]);
}
