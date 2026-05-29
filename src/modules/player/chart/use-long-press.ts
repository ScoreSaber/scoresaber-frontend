import { useCallback, useRef } from 'react';

const LONG_PRESS_MS = 500;

export function useLongPress<T>(onClick: (value: T, isMultiSelect: boolean) => void) {
   const ref = useRef<{ timer: ReturnType<typeof setTimeout> | undefined; fired: boolean }>({ timer: undefined, fired: false });

   const handlePointerDown = useCallback(
      (value: T) => {
         ref.current.fired = false;
         ref.current.timer = setTimeout(() => {
            ref.current.fired = true;
            onClick(value, true);
         }, LONG_PRESS_MS);
      },
      [onClick]
   );

   const handlePointerUp = useCallback(
      (value: T, shiftKey: boolean) => {
         clearTimeout(ref.current.timer);
         if (!ref.current.fired) {
            onClick(value, shiftKey);
         }
      },
      [onClick]
   );

   const handlePointerCancel = useCallback(() => {
      clearTimeout(ref.current.timer);
      ref.current.fired = false;
   }, []);

   return { handlePointerDown, handlePointerUp, handlePointerCancel };
}
