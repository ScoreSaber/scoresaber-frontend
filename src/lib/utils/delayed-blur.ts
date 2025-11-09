import { onDestroy } from 'svelte';
import { derived, type Readable } from 'svelte/store';

interface DelayedBlurOptions {
   delayMs?: number;
}

export function useDelayedBlur(
   isLoading: Readable<boolean>,
   options: DelayedBlurOptions = {}
): Readable<boolean> {
   const { delayMs = 200 } = options;

   let timeoutId: ReturnType<typeof setTimeout> | null = null;
   let currentValue = false;

   const store = derived(isLoading, ($isLoading, set) => {
      if ($isLoading) {
         if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
         }
         currentValue = true;
         set(true);
      } else {
         if (timeoutId) {
            clearTimeout(timeoutId);
         }
         
         timeoutId = setTimeout(() => {
            currentValue = false;
            set(false);
            timeoutId = null;
         }, delayMs);
      }
   }, currentValue);

   onDestroy(() => {
      if (timeoutId) {
         clearTimeout(timeoutId);
         timeoutId = null;
      }
   });

   return store;
}

