import { defineLudusPacketHandler } from '@/modules/live/ludus/packets/handler';
import type { LudusPromptResponse } from '@/modules/live/ludus/packets/protobuf';

export const promptResponseHandler = defineLudusPacketHandler('PROMPT_RESPONSE', (context, envelope) => {
   context.updateState((current) => ({
      ...current,
      promptResponses: upsertPromptResponse(current.promptResponses, envelope.response)
   }));
});

function upsertPromptResponse(responses: LudusPromptResponse[], response: LudusPromptResponse) {
   const next = responses.filter(
      (item) => item.commandId !== response.commandId || item.playerId !== response.playerId || item.matchId !== response.matchId
   );
   return [response, ...next];
}
