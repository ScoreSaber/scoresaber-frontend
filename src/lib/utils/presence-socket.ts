import { Socket } from 'phoenix';

import { PRESENCE_URL } from './env';

// And connect to the path in "lib/score_saber_realtime_web/endpoint.ex". We pass the
// token for authentication. Read below how it should be used.
const socket =
   typeof window !== 'undefined' &&
   new Socket(PRESENCE_URL, {
      params: {}
   });

if (socket) socket.connect();

export default socket;

enum State {
   Menu = 'menu',
   InGame = 'playing'
}

/// Unix timestamp serialised to a string
type Timestamp = string;

export interface StateChangeEvent {
   timestamp: Timestamp;
   state: State;
}

export enum GameMode {
   Solo = 'solo',
   Multiplayer = 'multi',
   Practice = 'practice'
}

export interface LiveSongInfo {
   timestamp: Timestamp;
   mode: GameMode;

   name: string;
   subName?: string;
   authorName: string;
   artist: string;
   type: string; // Standard, Lawless, OneSaber etc
   hash: string;
   difficulty: number;

   duration: number; // Song duration in seconds
   startTime?: number; // Start time if in practice mode
   playSpeed?: number; // Playback speed, from either practice mode or speed modifies
}

export enum PauseType {
   Pause = 'pause',
   Unpause = 'unpause'
}
export interface PauseUnpauseEvent {
   timestamp: Timestamp;
   songTime: number; // Time since start of song in seconds

   eventType: PauseType;
}
