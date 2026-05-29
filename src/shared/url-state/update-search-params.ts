import type { SearchParamsRecord } from '@/shared/url-state/search-params';

export function updateSearchParams<T extends SearchParamsRecord>(
   current: T | undefined,
   updates: Partial<SearchParamsRecord>,
   resetKeys: readonly (keyof T)[] = []
): T {
   const next: SearchParamsRecord = { ...current };

   for (const key of resetKeys) {
      next[String(key)] = undefined;
   }

   for (const [key, value] of Object.entries(updates)) {
      next[key] = value === '' ? undefined : value;
   }

   return next as T;
}
