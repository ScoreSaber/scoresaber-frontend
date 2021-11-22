import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { get, writable } from 'svelte/store';
import queryString from 'query-string';

export const queryChangeTimeout = writable(null);

export function createQueryStore(prop: any, initialValue: any) {
   var query = undefined;
   return {
      subscribe: (h) => {
         return page.subscribe((p) => {
            query = queryString.parse(p.query.toString());
            if (query[prop]) {
               h(query[prop]);
            } else {
               h(initialValue);
            }
         });
      },
      set: async (v: any) => {
         if (v === null) {
            delete query[prop];
         } else {
            query[prop] = v;
         }
         const urlSearchParams = new URLSearchParams(query);
         const g = `?${urlSearchParams.toString()}`;
         goto(g, { keepfocus: true, noscroll: true });
      }
   };
}

export function pageQueryStore<T extends object, Key extends keyof T>(props: T) {
   let query = undefined;

   const intParams = ['page'];

   const processProp = (name, value) => intParams.includes(name) ? parseInt(value, 10) : value;

   return {
      subscribe: (h): T => {
         return page.subscribe((p) => {
            query = queryString.parse(p.query.toString());

            h(Object.keys(props).map((p) => ({
                  [p]: processProp(p, query[p] || props[p])
            })).reduce((a, b) => ({ ...a, ...b }), {}));
         });
      },
      updateSingle: async (prop: Key, v: any): Promise<void> => {
         if (v === null) {
            delete query[prop];
         } else {
            query[prop] = processProp(prop, v);
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
               query[p] = processProp(p, props[p]);
            }
         });
         const urlSearchParams = new URLSearchParams(query);
         const g = `?${urlSearchParams.toString()}`;
         goto(g, { keepfocus: true, noscroll: true });
      }
   };
}
