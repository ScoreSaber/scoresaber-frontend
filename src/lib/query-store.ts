import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { get, writable } from 'svelte/store';
import queryString from 'query-string';

export const queryChangeTimeout = writable(null);

export function pageQueryStore<T extends object>(props: T) {
   let queryStore = writable<Partial<T>>(props);
   let initialLoad = true;
   page.subscribe((p) => {
      let query = queryString.parse(p.query.toString(), { parseNumbers: true });
      let newParams: T = props;
      for (let key in query) {
         if (key in props) newParams[key] = query[key];
      }
      // for the first load keep initial prop values i.e. page = 1
      if (!initialLoad) {
         for (const key in props) {
            if (!(key in query)) newParams[key] = null;
         }
      }
      if (initialLoad) initialLoad = false;
      queryStore.set(newParams);
   });
   // removes null values from query string
   const queryFilter = (query: Partial<T>) => {
      return Object.keys(query).filter((key) => query[key] !== null).map((key) => {
         return { [key]: query[key] };
      }).reduce((a, b) => ({ ...a, ...b }), {});
   }
   return {
      subscribe: queryStore.subscribe,
      updateSingle: async (prop: keyof T, v: any): Promise<void> => {
         let query = get(queryStore);
         query[prop] = v;
         const urlSearchParams = new URLSearchParams(queryFilter(query));
         const g = `?${urlSearchParams.toString()}`;
         goto(g, { keepfocus: true, noscroll: true });
      },
      update: async (props: Partial<T>): Promise<void> => {
         let query = get(queryStore);
         Object.keys(props).forEach((p) => {
            query[p] = props[p];
         });
         const urlSearchParams = new URLSearchParams(queryFilter(query));
         const g = `?${urlSearchParams.toString()}`;
         goto(g, { keepfocus: true, noscroll: true });
      }
   };
}
