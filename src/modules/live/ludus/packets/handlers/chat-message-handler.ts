import { defineLudusPacketHandler } from '@/modules/live/ludus/packets/handler';
import type { LudusChatMessage } from '@/modules/live/ludus/packets/protobuf';

const maxChatMessages = 500;

export const chatMessageHandler = defineLudusPacketHandler('CHAT_MESSAGE', (context, envelope) => {
   context.updateState((current) => ({
      ...current,
      chatMessages: appendChatMessage(current.chatMessages, envelope.message)
   }));
});

export function appendChatMessage(messages: LudusChatMessage[], message: LudusChatMessage) {
   const key = chatMessageKey(message);
   const existingIndex = messages.findIndex((item) => chatMessageKey(item) === key);
   if (existingIndex >= 0) {
      const next = messages.slice();
      next[existingIndex] = message;
      return next;
   }

   return [...messages, message].sort((left, right) => compareSequence(left.roomSequence, right.roomSequence)).slice(-maxChatMessages);
}

export function chatMessageKey(message: LudusChatMessage) {
   return message.messageId || `${message.matchId}:${message.roomSequence}`;
}

function compareSequence(left: string, right: string) {
   const diff = BigInt(left || '0') - BigInt(right || '0');
   if (diff < 0n) return -1;
   if (diff > 0n) return 1;
   return 0;
}
