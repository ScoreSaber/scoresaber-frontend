import { onMount, onDestroy } from 'svelte';
import { writable } from 'svelte/store';
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

      const refresh = async (refreshOptions?: Partial<AccioRefreshOptions<D>>) => {
         data.set(null);
         error.set(null);
         if (refreshOptions.query) {
            key = `${rootKey}${refreshOptions.query}`;
         }
         await loadData(key);
      };
      const loadData = async (key: string) => {
         try {
            const rawData = await options.fetcher(key);
            data.set(rawData);
            if (options.dataLoaded) {
               options.dataLoaded(rawData);
            }
         } catch (ex) {
            error.set(ex);
         }
      };
      onDestroy(() => unsubscribe?.());
      return { data, error, refresh };
   }
}

export interface DataLoaded {
   (data: any): void;
}

export type AccioFetcher<D = any> = (...props: any[]) => Promise<D>;
export interface AccioOptions<D = any> {
   /**
    * Determines the fetcher function to use.
    */
   fetcher: AccioFetcher<D>;
   query: string;
   dataLoaded: DataLoaded;
}

export interface AccioRefreshOptions<D = any> {
   /**
    * Determines the fetcher function to use.
    */
   query?: string;
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

export const createSWR = <D = any>(options?: Partial<AccioOptions<D>>) => new Accio();
export let swr = createSWR();

export const useAccio = <D = any, E = Error>(key: string, options?: Partial<AccioOptions<D>>) => {
   return swr.useAccio<D, E>(key, options);
};
