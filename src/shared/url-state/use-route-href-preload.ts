'use client';

import { useCallback, useEffect, useRef } from 'react';

import { useRouter } from '@tanstack/react-router';

import { getRouteHref, preloadRouteLocation, type RouteLocation } from '@/shared/url-state/route-location';

const ROUTE_PRELOAD_DELAY_MS = 30;

export function useRouteHrefPreload() {
   const router = useRouter();
   const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
   const getHref = useCallback(<const TLocation>(location: RouteLocation<TLocation>) => getRouteHref(router, location), [router]);

   const cancelPreload = useCallback(() => {
      if (timeoutRef.current === null) return;

      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
   }, []);

   const preloadNow = useCallback(
      <const TLocation>(location: RouteLocation<TLocation>) => {
         void preloadRouteLocation(router, location);
      },
      [router]
   );

   const schedulePreload = useCallback(
      <const TLocation>(location: RouteLocation<TLocation>) => {
         cancelPreload();
         timeoutRef.current = setTimeout(() => {
            timeoutRef.current = null;
            preloadNow(location);
         }, ROUTE_PRELOAD_DELAY_MS);
      },
      [cancelPreload, preloadNow]
   );

   useEffect(() => cancelPreload, [cancelPreload]);

   return { getHref, schedulePreload, preloadNow, cancelPreload };
}
