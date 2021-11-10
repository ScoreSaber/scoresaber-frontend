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

export function createMultiQueryStore(props: string[], initialValues: string[]) {
   var query = undefined;
   return {
      subscribe: (h) => {
         return page.subscribe((p) => {
            query = queryString.parse(p.query.toString());
            h(props.map((p, i) => {
               return {
                  [p]: query[p] || initialValues[i]
               }
            }).reduce((a, b) => { return { ...a, ...b } }));
         });
      },
      update: async (prop: string, v: any) => {
         if (v === null) {
            delete query[prop];
         } else {
            query[prop] = v;
         }
         const urlSearchParams = new URLSearchParams(query);
         const g = `?${urlSearchParams.toString()}`;
         goto(g, { keepfocus: true, noscroll: true });
      },
      updateMultiple: async (props: string[], vals: any[]) => {
         props.forEach((p, i) => {
            if (vals[i] === null) {
               delete query[p];
            } else {
               query[p] = vals[i];
            }
         });
         const urlSearchParams = new URLSearchParams(query);
         const g = `?${urlSearchParams.toString()}`;
         goto(g, { keepfocus: true, noscroll: true });
      }
   };
}
