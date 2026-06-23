import type { LudusState } from '@/modules/live/ludus/packets/types';

export function createLudusState(websocketUrl: string | null): LudusState {
   return {
      status: 'idle',
      websocketUrl,
      connectionId: '',
      clientType: 'UNSPECIFIED',
      roomContext: null,
      tournamentId: '',
      currentMatchId: '',
      error: null,
      rooms: [],
      scores: [],
      roomCountdowns: [],
      promptResponses: [],
      chatMessages: []
   };
}
