import type { LudusEnvelope } from '@/modules/live/ludus/packets/protobuf';
import type { LudusEnvelopeOf, LudusHandledEnvelope, LudusPacketContext } from '@/modules/live/ludus/packets/types';

export type LudusPacketHandler = {
   type: LudusHandledEnvelope['type'];
   handle(context: LudusPacketContext, envelope: LudusEnvelope): void;
};

export function defineLudusPacketHandler<Type extends LudusHandledEnvelope['type']>(
   type: Type,
   handle: (context: LudusPacketContext, envelope: LudusEnvelopeOf<Type>) => void
): LudusPacketHandler {
   return {
      type,
      handle(context, envelope) {
         if (envelope.type !== type) return;
         handle(context, envelope as LudusEnvelopeOf<Type>);
      }
   };
}
