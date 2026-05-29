'use client';

import { useEffect, useState } from 'react';

type CountdownTarget = string | null | undefined;

export function useCountdownSeconds(target: CountdownTarget) {
   const [now, setNow] = useState(() => Date.now());
   const targetMs = target ? Date.parse(target) || 0 : 0;

   useEffect(() => {
      if (!targetMs) return;

      setNow(Date.now());
      const interval = window.setInterval(() => setNow(Date.now()), 1000);
      return () => window.clearInterval(interval);
   }, [targetMs]);

   if (!targetMs) return 0;

   return Math.max(0, Math.ceil((targetMs - now) / 1000));
}
