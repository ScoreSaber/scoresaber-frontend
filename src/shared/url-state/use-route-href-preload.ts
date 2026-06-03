'use client';

import { useCallback, useEffect, useRef } from 'react';

import { useRouter } from '@tanstack/react-router';

import { parseUrlSearch } from '@/shared/url-state/search-serializer';

const ROUTE_PRELOAD_DELAY_MS = 30;

export function useRouteHrefPreload() {
   const router = useRouter();
   const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

   const cancelPreload = useCallback(() => {
      if (timeoutRef.current === null) return;

      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
   }, []);

   const preloadNow = useCallback(
      (href: string) => {
         const url = new URL(href, window.location.href);

         void router.preloadRoute({
            to: url.pathname,
            search: parseUrlSearch(url.search),
            hash: url.hash ? url.hash.slice(1) : undefined
         });
      },
      [router]
   );

   const schedulePreload = useCallback(
      (href: string) => {
         cancelPreload();
         timeoutRef.current = setTimeout(() => {
            timeoutRef.current = null;
            preloadNow(href);
         }, ROUTE_PRELOAD_DELAY_MS);
      },
      [cancelPreload, preloadNow]
   );

   useEffect(() => cancelPreload, [cancelPreload]);

   return { schedulePreload, preloadNow, cancelPreload };
}
