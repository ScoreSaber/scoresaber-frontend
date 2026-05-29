'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';

export function useDebouncedCallback<TArgs extends unknown[]>(callback: (...args: TArgs) => void, delayMs: number) {
   const callbackRef = useRef(callback);
   const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

   callbackRef.current = callback;

   const cancel = useCallback(() => {
      if (!timeoutRef.current) return;

      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
   }, []);

   const run = useCallback(
      (...args: TArgs) => {
         cancel();
         timeoutRef.current = setTimeout(() => {
            callbackRef.current(...args);
            timeoutRef.current = null;
         }, delayMs);
      },
      [cancel, delayMs]
   );

   useEffect(() => cancel, [cancel]);

   return useMemo(() => ({ run, cancel }), [run, cancel]);
}
