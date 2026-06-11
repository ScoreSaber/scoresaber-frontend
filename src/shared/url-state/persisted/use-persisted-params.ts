'use client';

import { useCallback, useEffect, useTransition } from 'react';

import { useRouter } from '@tanstack/react-router';

import {
   buildPersistedSearchStorageUpdates,
   loadPersistedSearchStorage,
   type PersistedSearchKey,
   resolvePersistedSearch,
   savePersistedSearchStorage,
   writePersistedSearchCookie
} from '@/shared/url-state/persisted/storage';
import { getRouteHref, navigateToRoute, type RouteLocation, type RouteLocationBuilder } from '@/shared/url-state/route-location';
import type { SearchParamsRecord } from '@/shared/url-state/search-params';
import { updateSearchParams } from '@/shared/url-state/update-search-params';
import { useRouteHrefPreload } from '@/shared/url-state/use-route-href-preload';

interface UsePersistedParamsOptions<TSearch extends SearchParamsRecord & { page?: number }, TLocation> {
   storageKey: string;
   search?: TSearch;
   buildLocation: RouteLocationBuilder<TSearch, TLocation>;
   parseSearch: (search: SearchParamsRecord) => TSearch | null;
   persistedKeys?: readonly PersistedSearchKey<TSearch>[];
   legacyStorageKeys?: Partial<Record<PersistedSearchKey<TSearch>, string>>;
   resetKeys?: readonly (keyof TSearch)[];
}

interface RouteUpdateOptions<TSearch extends SearchParamsRecord> {
   resetKeys?: readonly (keyof TSearch)[];
   scroll?: boolean;
}

function usePersistedParams<TSearch extends SearchParamsRecord & { page?: number }, TLocation>({
   storageKey,
   search,
   buildLocation,
   parseSearch,
   persistedKeys = [],
   legacyStorageKeys = {},
   resetKeys = ['page']
}: UsePersistedParamsOptions<TSearch, TLocation>) {
   const router = useRouter();
   const { schedulePreload, cancelPreload } = useRouteHrefPreload();
   const [isPending, startTransition] = useTransition();

   const persistLocationValues = useCallback(
      (location: RouteLocation<TLocation>) => {
         if (persistedKeys.length === 0) return;

         const next = new URL(getRouteHref(router, location), window.location.href).searchParams;
         savePersistedSearchStorage(
            storageKey,
            buildPersistedSearchStorageUpdates(persistedKeys, (key) => next.get(key) || undefined)
         );
      },
      [persistedKeys, router, storageKey]
   );

   const buildRouteLocation = useCallback(
      (updates: Partial<TSearch>, options?: Pick<RouteUpdateOptions<TSearch>, 'resetKeys'>) =>
         buildLocation(updateSearchParams(search, updates, options?.resetKeys ?? resetKeys)),
      [buildLocation, resetKeys, search]
   );
   const buildUrl = useCallback(
      (updates: Partial<TSearch>, options?: Pick<RouteUpdateOptions<TSearch>, 'resetKeys'>) =>
         getRouteHref(router, buildRouteLocation(updates, options)),
      [buildRouteLocation, router]
   );

   const navigate = useCallback(
      (method: 'push' | 'replace', updates: Partial<TSearch>, options?: RouteUpdateOptions<TSearch>) => {
         const location = buildRouteLocation(updates, options);
         persistLocationValues(location);
         startTransition(() => navigateToRoute(router, location, { replace: method === 'replace', resetScroll: options?.scroll }));
      },
      [buildRouteLocation, persistLocationValues, router]
   );

   const push = useCallback((updates: Partial<TSearch>, options?: RouteUpdateOptions<TSearch>) => navigate('push', updates, options), [navigate]);
   const replace = useCallback(
      (updates: Partial<TSearch>, options?: RouteUpdateOptions<TSearch>) => navigate('replace', updates, options),
      [navigate]
   );
   const preload = useCallback(
      (updates: Partial<TSearch>, options?: RouteUpdateOptions<TSearch>) => schedulePreload(buildRouteLocation(updates, options)),
      [buildRouteLocation, schedulePreload]
   );
   const preloadClearAll = useCallback(() => schedulePreload(buildLocation(undefined)), [buildLocation, schedulePreload]);

   const clearAll = useCallback(
      (options?: { scroll?: boolean }) => {
         if (persistedKeys.length > 0)
            savePersistedSearchStorage(
               storageKey,
               buildPersistedSearchStorageUpdates(persistedKeys, () => undefined)
            );
         startTransition(() => navigateToRoute(router, buildLocation(undefined), { resetScroll: options?.scroll }));
      },
      [buildLocation, router, storageKey, persistedKeys]
   );

   // restore persisted params on mount when URL is missing them
   useEffect(() => {
      if (persistedKeys.length === 0) return;
      const stored = loadPersistedSearchStorage(storageKey);
      writePersistedSearchCookie(storageKey, stored);
      const { updates, migrated } = resolvePersistedSearch({ search, parseSearch, stored, persistedKeys, legacyStorageKeys });

      if (Object.keys(migrated).length > 0) savePersistedSearchStorage(storageKey, migrated);
      if (Object.keys(updates).length === 0) return;
      startTransition(() => navigateToRoute(router, buildLocation(updateSearchParams(search, updates)), { replace: true }));
   }, []);

   return {
      isPending,
      buildUrl,
      navigate: push,
      replace,
      preload,
      preloadClearAll,
      cancelPreload,
      clearAll,
      loadStorage: () => loadPersistedSearchStorage(storageKey),
      saveStorage: (updates: Record<string, string | undefined>) => savePersistedSearchStorage(storageKey, updates)
   };
}

export { usePersistedParams };
