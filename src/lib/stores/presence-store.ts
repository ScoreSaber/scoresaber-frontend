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

         const presence = new Presence(channel);

         let state: UserState = null;

         presence.onJoin((id) => {
            if(id === userId && (!state || state.scene === Scene.Offline)) {
               state = {scene: Scene.Online};
               console.log("join", state);
               cb(state);
            }
         });
         presence.onLeave(id => {
            if(id == userId) {
               state = {scene: Scene.Offline};
               console.log("leave", state);
               cb(state);
            }
         });

         cb(state);

         channel.on('state_changed', (v) => {
            cb(v);
         });

         return () => {
            channel.leave();
         };
      }
   } satisfies Readable<UserState>);
