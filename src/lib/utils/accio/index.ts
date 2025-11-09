import { onMount, onDestroy } from 'svelte';
import { get, writable } from 'svelte/store';
import axios from 'axios';

import { browser } from '$app/env';

import type { ScoreSaberError } from '$lib/models/GenericResponses';

import { DefaultCache, CacheItem } from './cache';
import { requestCancel } from './canceler';

const cache = new DefaultCache();
const CACHE_TTL = 10 * 60000; // 10 minutes

export class AccioError {
   name: string;
   message: string;
   stack?: string;
   status?: number;

   constructor(name?: string, message?: string, stack?: string, status?: number) {
      this.name = name ?? 'Error';
      this.message = message ?? 'An error occurred';
      this.stack = stack;
      this.status = status;
   }
}

export type AccioFetcher<D = any> = (url: string, config?: any) => Promise<D>;

export interface AccioOptions<D = any> {
   fetcher?: AccioFetcher<D>;
   onSuccess?: (data: D) => void;
   onError?: (error: any) => void;
   ignoreSubscriptions?: boolean;
   withCredentials?: boolean;
}

export interface AccioRefreshOptions {
   newUrl?: string;
   softRefresh?: boolean;
   forceRevalidate?: boolean;
   bypassInitialCheck?: boolean;
   silent?: boolean;
}

const defaultFetcher = <D>(url: string): Promise<D> => {
   return fetch(url).then((res) => {
      if (!res.ok) throw Error('Not a 2XX response.');
      return res.json();
   });
};

function createAccioError(ex: any): AccioError {
   if (axios.isAxiosError(ex)) {
      const scoreSaberError = ex.response?.data as ScoreSaberError;
      return {
         name: ex.name,
         message: scoreSaberError?.errorMessage || ex.message || 'Unknown error',
         stack: ex.stack,
         status: ex.response?.status
      };
   }
   return {
      name: ex.name,
      message: ex.message,
      stack: ex.stack
   };
}

export function useAccio<D>(key: string, options: Partial<AccioOptions<D>> = {}) {
   const opts = {
      fetcher: options.fetcher || defaultFetcher,
      withCredentials: options.withCredentials !== undefined ? options.withCredentials : true,
      ignoreSubscriptions: options.ignoreSubscriptions || false,
      onSuccess: options.onSuccess,
      onError: options.onError
   };

   const data = writable<D | undefined>(undefined);
   const error = writable<AccioError | undefined>(undefined);
   const loading = writable<boolean>(false);
   const initialLoadComplete = writable<boolean>(true);
   let curRequest: Promise<D> | undefined;
   let currentKey = key;
   let lastFocus: number | null = null;

   const refresh = async (refreshOptions?: Partial<AccioRefreshOptions>) => {
      if (!get(initialLoadComplete) && !refreshOptions?.bypassInitialCheck) {
         return console.warn('Refresh Canceled: Called before initial load');
      }
      if (curRequest) return console.warn('Refresh Canceled: Request in progress');

      if (refreshOptions?.newUrl) currentKey = refreshOptions.newUrl;
      if (!refreshOptions?.softRefresh) data.set(null);
      error.set(null);

      await loadData(currentKey, refreshOptions?.forceRevalidate, refreshOptions?.silent);
   };

   const loadData = async (key: string, forceRevalidate = false, silent = false) => {
      if (!silent) loading.set(true);
      try {
         let rawData: D | undefined;

         if (!forceRevalidate) {
            const cachedData = cache.has(key) ? cache.get<D>(key) : null;
            if (cachedData && !cachedData.hasExpired()) {
               rawData = cachedData.data as D;
            }
         }

         if (!rawData) {
            if (!curRequest) {
               curRequest = opts.fetcher(key, {
                  withCredentials: opts.withCredentials,
                  cancelToken: get(requestCancel).token
               });
            }
            rawData = await curRequest;
            const expiry = new Date(Date.now() + CACHE_TTL);
            cache.set(key, new CacheItem({ data: rawData, expiresAt: expiry }));
         }

         data.set(rawData);
         opts.onSuccess?.(rawData);
      } catch (ex) {
         if (axios.isCancel(ex)) {
            console.warn('Request cancelled:', ex.message);
            curRequest = undefined;
            loading.set(false);
            if (!get(initialLoadComplete)) initialLoadComplete.set(true);
            return;
         }
         error.set(createAccioError(ex));
         opts.onError?.(ex);
      } finally {
         curRequest = undefined;
         if (!silent) loading.set(false);
         if (!get(initialLoadComplete)) initialLoadComplete.set(true);
      }
   };

   const handleRefresh = () => {
      if (opts.ignoreSubscriptions) return;
      const now = Date.now();
      if (lastFocus === null || now - lastFocus > 5000) {
         lastFocus = now;
         console.log(`Regained focus, refreshing ${currentKey}`);
         refresh({ forceRevalidate: true, softRefresh: true, silent: true });
      }
   };

   const handleOnline = () => {
      if (opts.ignoreSubscriptions) return;
      console.log(`User is back online, refreshing ${currentKey}`);
      refresh({ forceRevalidate: true, softRefresh: true, silent: true });
   };

   const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') handleRefresh();
   };

   onMount(() => {
      loadData(key);
   });

   if (browser) {
      window.addEventListener('focus', handleRefresh);
      window.addEventListener('online', handleOnline);
      window.addEventListener('visibilitychange', handleVisibilityChange);

      onDestroy(() => {
         window.removeEventListener('focus', handleRefresh);
         window.removeEventListener('online', handleOnline);
         window.removeEventListener('visibilitychange', handleVisibilityChange);
      });
   }

   return { data, error, refresh, loading, initialLoadComplete };
}
