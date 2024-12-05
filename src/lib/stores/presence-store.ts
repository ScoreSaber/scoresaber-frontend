import type { Readable } from 'svelte/store';

import { Presence } from 'phoenix';

import socket, { type LiveSongInfo, type PauseUnpauseEvent } from '$lib/utils/presence-socket';

export enum Scene {
   Offline = 'offline',
   Menu = 'menu',
   Online = 'online',
   Playing = 'playing'
}

export type UserState =
   | null
   | { scene: Scene.Offline }
   | { scene: Scene.Online }
   | { scene: Scene.Menu }
   | { scene: Scene.Playing; currentMap: LiveSongInfo; lastPause?: PauseUnpauseEvent };

export const userPresence = (userId: bigint | string) =>
   ({
      subscribe(cb) {
         const channel = socket.channel(`user_profile:${userId}`);
         channel.join();

         let state: UserState = null;

         cb(state);

         channel.on('state_changed', (v) => {
            state = v;
            cb(state);
         });

         return () => {
            channel.leave();
         };
      }
   } satisfies Readable<UserState>);
