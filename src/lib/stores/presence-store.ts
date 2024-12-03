import type { Readable } from 'svelte/store';

import socket, { GameMode, type LiveSongInfo, type PauseUnpauseEvent } from '$lib/utils/presence-socket';

export enum Scene {
   Offline = 'offline',
   Menu = 'menu',
   Playing = 'playing'
}

export type UserState =
   | { scene: Scene.Offline }
   | { scene: Scene.Menu }
   | { scene: Scene.Playing; currentMap: LiveSongInfo; lastPause?: PauseUnpauseEvent };

export const userPresence = (userId: bigint | string) =>
   ({
      subscribe(cb) {
         const channel = socket.channel(`user_profile:${userId}`);
         channel.join();

         cb({ scene: Scene.Offline });

         channel.on('state_changed', (v) => cb(v));

         return () => {
            channel.leave();
         };
      }
   } satisfies Readable<UserState>);
