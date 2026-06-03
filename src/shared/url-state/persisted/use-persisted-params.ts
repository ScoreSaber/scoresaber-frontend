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
import type { SearchParamsRecord } from '@/shared/url-state/search-params';
import { updateSearchParams } from '@/shared/url-state/update-search-params';
import { useRouteHrefPreload } from '@/shared/url-state/use-route-href-preload';

interface UsePersistedParamsOptions<TSearch extends SearchParamsRecord & { page?: number }> {
   storageKey: string;
   search?: TSearch;
   buildHref: (search?: TSearch) => string;
   parseSearch: (search: SearchParamsRecord) => TSearch | null;
   persistedKeys?: readonly PersistedSearchKey<TSearch>[];
   legacyStorageKeys?: Partial<Record<PersistedSearchKey<TSearch>, string>>;
   resetKeys?: readonly (keyof TSearch)[];
}

interface RouteUpdateOptions<TSearch extends SearchParamsRecord> {
   resetKeys?: readonly (keyof TSearch)[];
   scroll?: boolean;
}

function usePersistedParams<TSearch extends SearchParamsRecord & { page?: number }>({
   storageKey,
   search,
   buildHref,
   parseSearch,
   persistedKeys = [],
   legacyStorageKeys = {},
   resetKeys = ['page']
}: UsePersistedParamsOptions<TSearch>) {
   const router = useRouter();
   const { schedulePreload, cancelPreload } = useRouteHrefPreload();
   const [isPending, startTransition] = useTransition();

   const persistUrlValues = useCallback(
      (url: string) => {
         if (persistedKeys.length === 0) return;

         const next = new URLSearchParams(url.includes('?') ? url.split('?')[1] : '');
         savePersistedSearchStorage(
            storageKey,
            buildPersistedSearchStorageUpdates(persistedKeys, (key) => next.get(key) || undefined)
         );
      },
      [persistedKeys, storageKey]
   );

   const buildUrl = useCallback(
      (updates: Partial<TSearch>, options?: Pick<RouteUpdateOptions<TSearch>, 'resetKeys'>) =>
         buildHref(updateSearchParams(search, updates, options?.resetKeys ?? resetKeys)),
      [buildHref, resetKeys, search]
   );

   const navigate = useCallback(
      (method: 'push' | 'replace', updates: Partial<TSearch>, options?: RouteUpdateOptions<TSearch>) => {
         const url = buildUrl(updates, options);
         persistUrlValues(url);
         startTransition(() => router.navigate({ href: url, replace: method === 'replace', resetScroll: options?.scroll }));
      },
      [buildUrl, persistUrlValues, router]
   );

   const push = useCallback((updates: Partial<TSearch>, options?: RouteUpdateOptions<TSearch>) => navigate('push', updates, options), [navigate]);
   const replace = useCallback(
      (updates: Partial<TSearch>, options?: RouteUpdateOptions<TSearch>) => navigate('replace', updates, options),
      [navigate]
   );
   const preload = useCallback(
      (updates: Partial<TSearch>, options?: RouteUpdateOptions<TSearch>) => schedulePreload(buildUrl(updates, options)),
      [buildUrl, schedulePreload]
   );
   const preloadClearAll = useCallback(() => schedulePreload(buildHref(undefined)), [buildHref, schedulePreload]);

   const clearAll = useCallback(
      (options?: { scroll?: boolean }) => {
         if (persistedKeys.length > 0)
            savePersistedSearchStorage(
               storageKey,
               buildPersistedSearchStorageUpdates(persistedKeys, () => undefined)
            );
         startTransition(() => router.navigate({ href: buildHref(undefined), resetScroll: options?.scroll }));
      },
      [buildHref, router, storageKey, persistedKeys]
   );

   // restore persisted params on mount when URL is missing them
   useEffect(() => {
      if (persistedKeys.length === 0) return;
      const stored = loadPersistedSearchStorage(storageKey);
      writePersistedSearchCookie(storageKey, stored);
      const { updates, migrated } = resolvePersistedSearch({ search, parseSearch, stored, persistedKeys, legacyStorageKeys });

      if (Object.keys(migrated).length > 0) savePersistedSearchStorage(storageKey, migrated);
      if (Object.keys(updates).length === 0) return;
      startTransition(() => router.navigate({ href: buildHref(updateSearchParams(search, updates)), replace: true }));
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
