import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { get, writable } from 'svelte/store';
import queryString from 'query-string';

export const queryChangeTimeout = writable(null);

export function pageQueryStore<T extends object, Key extends keyof T>(props: T) {
   var query = undefined;
   return {
      subscribe: (h): T => {
         return page.subscribe((p) => {
            query = queryString.parse(p.query.toString(), { parseNumbers: true });
            let newParams: T = props;
            for (let key in query) {
               if (key in props) newParams[key] = query[key];
            }
            for (const key in props) {
               if (!(key in query)) newParams[key] = null;
            }
            h(newParams);
         });
      },
      updateSingle: async (prop: Key, v: any): Promise<void> => {
         if (v === null) {
            delete query[prop];
         } else {
            query[prop] = v;
         }
         const urlSearchParams = new URLSearchParams(query);
         const g = `?${urlSearchParams.toString()}`;
         goto(g, { keepfocus: true, noscroll: true });
      },
      update: async (props: Partial<T>): Promise<void> => {
         Object.keys(props).forEach((p) => {
            if (props[p] === null) {
               delete query[p];
            } else {
               query[p] = props[p];
            }
         });
         const urlSearchParams = new URLSearchParams(query);
         const g = `?${urlSearchParams.toString()}`;
         goto(g, { keepfocus: true, noscroll: true });
      }
   };
}
