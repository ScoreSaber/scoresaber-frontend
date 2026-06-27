import { defineLudusPacketHandler } from '@/modules/live/ludus/packets/handler';

export const returnToMenuCommandHandler = defineLudusPacketHandler('RETURN_TO_MENU_COMMAND', (context, envelope) => {
   context.updateState((current) => ({
      ...current,
      scores: current.scores.filter((score) => score.matchId !== envelope.matchId),
      roomCountdowns: current.roomCountdowns.filter((countdown) => countdown.matchId !== envelope.matchId)
   }));
});
