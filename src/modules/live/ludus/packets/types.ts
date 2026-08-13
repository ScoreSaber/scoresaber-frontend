import type {
   LudusEnvelope,
   LudusChatMessage,
   LudusClientKind,
   LudusPromptResponse,
   LudusReplayScore,
   LudusRoomContext,
   LudusRoomState,
   LudusStartMapCommand
} from '@/modules/live/ludus/packets/protobuf';

export type LudusStatus = 'idle' | 'connecting' | 'connected' | 'closed' | 'error';
export type LudusPacketBytes = Uint8Array<ArrayBuffer>;

export type LudusState = {
   status: LudusStatus;
   websocketUrl: string | null;
   connectionId: string;
   clientType: LudusClientKind | 'UNSPECIFIED';
   roomContext: LudusRoomContext | null;
   tournamentId: string;
   currentMatchId: string;
   error: string | null;
   rooms: LudusRoomState[];
   scores: LudusReplayScore[];
   roomCountdowns: LudusStartMapCommand[];
   promptResponses: LudusPromptResponse[];
   chatMessages: LudusChatMessage[];
};

export type LudusPacketContext = {
   updateState(update: (current: LudusState) => LudusState): void;
   send(bytes: LudusPacketBytes): void;
   reconnect(websocketUrl: string, delayMs: number): void;
   clearSocketErrorTimeout(): void;
   startHeartbeat(intervalMs: number): void;
};

export type LudusEnvelopeOf<Type extends LudusEnvelope['type']> = Extract<LudusEnvelope, { type: Type }>;
export type LudusHandledEnvelope =
   | LudusEnvelopeOf<'CONNECT_ACCEPTED'>
   | LudusEnvelopeOf<'ROOM_CONTEXT_UPDATED'>
   | LudusEnvelopeOf<'RECONNECT_REQUESTED'>
   | LudusEnvelopeOf<'ROOM_SNAPSHOT'>
   | LudusEnvelopeOf<'STREAM_SNAPSHOT'>
   | LudusEnvelopeOf<'START_MAP_COMMAND'>
   | LudusEnvelopeOf<'RETURN_TO_MENU_COMMAND'>
   | LudusEnvelopeOf<'PROMPT_RESPONSE'>
   | LudusEnvelopeOf<'CHAT_MESSAGE'>
   | LudusEnvelopeOf<'CHAT_SNAPSHOT'>
   | LudusEnvelopeOf<'ERROR'>;
