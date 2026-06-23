import { defineLudusPacketHandler } from '@/modules/live/ludus/packets/handler';
import type { LudusStartMapCommand } from '@/modules/live/ludus/packets/protobuf';

export const startMapCommandHandler = defineLudusPacketHandler('START_MAP_COMMAND', (context, envelope) => {
   context.updateState((current) => ({
      ...current,
      roomCountdowns: upsertRoomCountdown(current.roomCountdowns, envelope.command)
   }));
});

function upsertRoomCountdown(countdowns: LudusStartMapCommand[], countdown: LudusStartMapCommand) {
   if (countdown.forceStart || countdown.countdownMs <= 0 || countdown.startTimeUnixMs <= Date.now()) {
      return countdowns.filter((item) => item.matchId !== countdown.matchId);
   }

   return [countdown, ...countdowns.filter((item) => item.matchId !== countdown.matchId)];
}
