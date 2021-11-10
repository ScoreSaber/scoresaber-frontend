import { onMount, onDestroy } from 'svelte';
import { CACHE_EXPIRY_IN_MINUTES } from '$lib/utils/env';
import { get, writable } from 'svelte/store';
import { DefaultCache, CacheItem } from './cache';
import queryString from 'query-string';
import { browser } from '$app/env';
import { requestCancel } from '$lib/global-store';

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
         if (refreshOptions) {
            if (refreshOptions.newUrl) {
               key = refreshOptions.newUrl;
            }
            if (!refreshOptions.softRefresh) {
               data.set(null);
               error.set(null);
            }
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
               rawData = await options.fetcher(key, { withCredentials: true, cancelToken: get(requestCancel).token });
               const expiry = new Date();
               expiry.setTime(expiry.getTime() + parseInt(CACHE_EXPIRY_IN_MINUTES) * 60000);
               cache.set(key, new CacheItem({ data: rawData, expiresAt: expiry }));
            }
            data.set(rawData);
            if (options.onSuccess) {
               options.onSuccess(rawData);
            }
         } catch (ex) {
            error.set(ex);
            if (options.onError) {
               options.onError(ex);
            }
         }
      };

      if (browser) {
         let lastFocus: number | null = null;

         function subscribeFocus() {
            const focusHandler = () => {
               if (!options.ignoreSubscriptions) {
                  const now = Date.now();
                  if (lastFocus === null || now - lastFocus > 5000) {
                     lastFocus = now;
                     console.log(`Regained focus, refreshing ${key}`);
                     refresh({ forceRevalidate: true, softRefresh: true });
                  }
               }
            };
            window.addEventListener('focus', focusHandler);
            return () => window.removeEventListener('focus', focusHandler);
         }

         function subscribeOnline() {
            const onlineHandler = () => {
               if (!options.ignoreSubscriptions) {
                  console.log(`User is back online, refreshing ${key}`);
                  refresh({ forceRevalidate: true, softRefresh: true });
               }
            };
            window.addEventListener('online', onlineHandler);
            return () => window.removeEventListener('online', onlineHandler);
         }

         function subscribeVisibilityChange() {
            const visibilityChangeHandler = () => {
               if (document.visibilityState === 'visible') {
                  if (!options.ignoreSubscriptions) {
                     const now = Date.now();
                     if (lastFocus === null || now - lastFocus > 5000) {
                        lastFocus = now;
                        console.log(`Regained focus, refreshing ${key}`);
                        refresh({ forceRevalidate: true, softRefresh: true });
                     }
                  }
               }
            };
            window.addEventListener('visibilitychange', visibilityChangeHandler);
            return () => window.removeEventListener('visibilitychange', visibilityChangeHandler);
         }

         const unsubFocus = subscribeFocus();
         const unsubOnline = subscribeOnline();
         const unsubVisibility = subscribeVisibilityChange();

         onDestroy(() => {
            unsubFocus();
            unsubOnline();
            unsubVisibility();
         });
      }
      onDestroy(() => unsubscribe?.());
      return { data, error, refresh };
   }
}
export interface OnSuccess {
   (data: any): void;
}

export interface OnError {
   (error: any): void;
}

export type AccioFetcher<D = any> = (...props: any[]) => Promise<D>;
export interface AccioOptions<D = any> {
   fetcher: AccioFetcher<D>;
   query: string;
   onSuccess: OnSuccess;
   onError: OnError;
   ignoreSubscriptions: boolean;
   cancelToken?: any;
}

export interface AccioRefreshOptions {
   newUrl?: string;
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
   onSuccess: null,
   onError: null,
   ignoreSubscriptions: false
};

export const createAccio = <D = any>(options?: Partial<AccioOptions<D>>) => new Accio();
export let accio = createAccio();
const cache = new DefaultCache();

export const useAccio = <D = any, E = Error>(key: string, options?: Partial<AccioOptions<D>>) => {
   return accio.useAccio<D, E>(key, options);
};
