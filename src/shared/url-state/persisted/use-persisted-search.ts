'use client';

import { useEffect, useState } from 'react';

import { readPersistedSearchCookieValue } from '@/shared/url-state/persisted-search-cookie';
import { loadPersistedSearchStorage, type PersistedSearchKey, resolvePersistedSearch } from '@/shared/url-state/persisted/storage';
import type { SearchParamsRecord } from '@/shared/url-state/search-params';
import { updateSearchParams } from '@/shared/url-state/update-search-params';

interface UsePersistedSearchOptions<TSearch extends SearchParamsRecord> {
   search?: Partial<TSearch>;
   fallback: TSearch;
   parseSearch: (search: SearchParamsRecord) => TSearch | null;
   storageKey: string;
   persistedKeys: readonly PersistedSearchKey<TSearch>[];
   legacyStorageKeys?: Partial<Record<PersistedSearchKey<TSearch>, string>>;
}

function usePersistedSearch<TSearch extends SearchParamsRecord>({
   search,
   fallback,
   parseSearch,
   storageKey,
   persistedKeys,
   legacyStorageKeys = {}
}: UsePersistedSearchOptions<TSearch>) {
   const [resolvedSearch, setResolvedSearch] = useState(() => parseSearch(search ?? {}) ?? fallback);

   useEffect(() => {
      const stored = { ...loadPersistedSearchStorage(storageKey), ...readPersistedSearchCookieValue(storageKey) };
      const { updates } = resolvePersistedSearch({ search, parseSearch, stored, persistedKeys, legacyStorageKeys });

      const nextSearch = parseSearch(updateSearchParams(search, updates)) ?? fallback;
      setResolvedSearch((current) => (areSearchRecordsEqual(current, nextSearch) ? current : nextSearch));
   }, [fallback, legacyStorageKeys, parseSearch, persistedKeys, search, storageKey]);

   return resolvedSearch;
}

function areSearchRecordsEqual(left: SearchParamsRecord, right: SearchParamsRecord) {
   return JSON.stringify(left) === JSON.stringify(right);
}

export { usePersistedSearch };
