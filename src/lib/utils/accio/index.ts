import { onMount, onDestroy } from 'svelte';
import { CACHE_EXPIRY_IN_MINUTES } from '$lib/utils/env';
import { writable } from 'svelte/store';
import { DefaultCache, CacheItem } from './cache';
import queryString from 'query-string';

export class Accio {
   useAccio<D = any, E = Error>(key: string, options?: Partial<AccioOptions<D>>) {
      let unsubscribe: undefined | (() => void) = undefined;
      const rootKey = queryString.parseUrl(key).url;
      const data = writable<D | undefined>(undefined, () => () => unsubscribe?.());
      const error = writable<E | undefined>(undefined, () => () => unsubscribe?.());

      onMount(async () => {
         await loadData(key);
      });

      const refresh = async (refreshOptions?: Partial<AccioRefreshOptions>) => {
         if (refreshOptions.query) {
            key = `${rootKey}${refreshOptions.query}`;
         }
         if (!refreshOptions.softRefresh) {
            data.set(null);
            error.set(null);
         }
         await loadData(key, refreshOptions?.forceRevalidate);
      };

      const loadData = async (key: string, forceRevalidate = false) => {
         try {
            let rawData = undefined;
            if (!forceRevalidate) {
               if (cache.has(key)) {
                  const cachedData = cache.get(key);
                  if (!cachedData.hasExpired()) {
                     rawData = cache.get(key).data;
                  }
               }
            }

            if (!rawData) {
               rawData = await options.fetcher(key);
               const expiry = new Date();
               expiry.setTime(expiry.getTime() + parseInt(CACHE_EXPIRY_IN_MINUTES) * 60000);
               cache.set(key, new CacheItem({ data: rawData, expiresAt: expiry }));
            }
            data.set(rawData);
            if (options.dataLoaded) {
               options.dataLoaded(rawData);
            }
         } catch (ex) {
            error.set(ex);
         }
      };

      if (typeof window !== 'undefined') {
         let lastFocus: number | null = null;
         window.addEventListener('focus', () => {
            const now = Date.now();
            if (lastFocus === null || now - lastFocus > 5000) {
               lastFocus = now;
               console.log(`Regained focus, refreshing ${key}`);
               refresh({ forceRevalidate: true, softRefresh: true });
            }
         });

         window.addEventListener('online', () => {
            console.log(`User is back online, refreshing ${key}`);
            refresh({ forceRevalidate: true, softRefresh: true });
         });

         window.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
               const now = Date.now();
               if (lastFocus === null || now - lastFocus > 5000) {
                  lastFocus = now;
                  console.log(`Regained focus, refreshing ${key}`);
                  refresh({ forceRevalidate: true, softRefresh: true });
               }
            }
         });
      }
      onDestroy(() => unsubscribe?.());
      return { data, error, refresh };
   }
}
export interface DataLoaded {
   (data: any): void;
}

export type AccioFetcher<D = any> = (...props: any[]) => Promise<D>;
export interface AccioOptions<D = any> {
   fetcher: AccioFetcher<D>;
   query: string;
   dataLoaded: DataLoaded;
}

export interface AccioRefreshOptions {
   query?: string;
   softRefresh?: boolean;
   forceRevalidate?: boolean;
}

const fetcher = <D>(url: string): Promise<D> => {
   return fetch(url).then((res) => {
      if (!res.ok) throw Error('Not a 2XX response.');
      return res.json();
   });
};

export const defaultOptions: AccioOptions = {
   fetcher,
   query: null,
   dataLoaded: null
};

export const createAccio = <D = any>(options?: Partial<AccioOptions<D>>) => new Accio();
export let accio = createAccio();
const cache = new DefaultCache();

export const useAccio = <D = any, E = Error>(key: string, options?: Partial<AccioOptions<D>>) => {
   return accio.useAccio<D, E>(key, options);
};
