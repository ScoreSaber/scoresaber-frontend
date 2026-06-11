import { useSyncExternalStore } from 'react';

const versions = new Map<string, number>();
const listeners = new Set<() => void>();
let snapshot = 0;

export function bumpAvatarVersion(url: string) {
   versions.set(url, (versions.get(url) ?? 0) + 1);
   snapshot += 1;
   for (const listener of listeners) listener();
}

export function useAvatarSrc(src: string | undefined) {
   useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
   if (!src) return src;
   const version = versions.get(src);
   return version ? `${src}?r=${version}` : src;
}

function subscribe(listener: () => void) {
   listeners.add(listener);
   return () => {
      listeners.delete(listener);
   };
}

function getSnapshot() {
   return snapshot;
}

function getServerSnapshot() {
   return 0;
}
