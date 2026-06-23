import { defineLudusPacketHandler } from '@/modules/live/ludus/packets/handler';
import { chatMessageKey } from '@/modules/live/ludus/packets/handlers/chat-message-handler';
import type { LudusChatMessage } from '@/modules/live/ludus/packets/protobuf';

export const chatSnapshotHandler = defineLudusPacketHandler('CHAT_SNAPSHOT', (context, envelope) => {
   context.updateState((current) => {
      const otherRooms = current.chatMessages.filter((message) => message.matchId !== envelope.matchId);
      return {
         ...current,
         chatMessages: [...otherRooms, ...uniqueMessages(envelope.messages)]
      };
   });
});

function uniqueMessages(messages: LudusChatMessage[]) {
   const seen = new Set<string>();
   const unique: LudusChatMessage[] = [];
   for (const message of messages) {
      const key = chatMessageKey(message);
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(message);
   }
   return unique;
}
