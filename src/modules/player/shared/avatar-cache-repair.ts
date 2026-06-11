import { Result } from 'better-result';
import { z } from 'zod';

import { readStorageJson, removeStorageValue, writeStorageJson } from '@/shared/result/storage';

const EXPIRES_AT = Date.parse('2026-07-15T00:00:00Z');
const STORAGE_KEY = 'avatar-cache-repair-v1';
const MAX_TRACKED_FILES = 5000;

const repairStateSchema = z.union([z.literal('skip'), z.array(z.string())]);

let repaired: Set<string> | 'skip' | null = null;
let persistTimer: ReturnType<typeof setTimeout> | null = null;
let cleanedUp = false;

export function repairCachedAvatar(src: unknown) {
   if (typeof src !== 'string' || !src.includes('/avatars/')) return;

   if (Date.now() > EXPIRES_AT) {
      if (!cleanedUp) {
         cleanedUp = true;
         removeStorageValue(STORAGE_KEY);
      }
      return;
   }

   repaired ??= loadRepairState();
   if (repaired === 'skip') return;

   const file = src.slice(src.lastIndexOf('/') + 1);
   if (repaired.has(file) || repaired.size >= MAX_TRACKED_FILES) return;

   repaired.add(file);
   schedulePersist();
   void Result.tryPromise(() => fetch(src, { cache: 'reload', mode: 'no-cors' }));
}

function loadRepairState(): Set<string> | 'skip' {
   const stored = Result.unwrapOr(readStorageJson(STORAGE_KEY, repairStateSchema), null);
   if (stored === 'skip') return 'skip';
   if (stored) return new Set(stored);

   if (isFreshBrowser()) {
      writeStorageJson(STORAGE_KEY, 'skip');
      return 'skip';
   }

   return new Set();
}

function isFreshBrowser() {
   return Result.unwrapOr(Result.try({ try: () => localStorage.length === 0, catch: (cause: unknown) => cause }), false);
}

function schedulePersist() {
   if (persistTimer) return;
   persistTimer = setTimeout(() => {
      persistTimer = null;
      if (repaired instanceof Set) writeStorageJson(STORAGE_KEY, [...repaired]);
   }, 1000);
}
