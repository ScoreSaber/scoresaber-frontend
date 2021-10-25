import { goto, invalidate } from '$app/navigation';
import { page } from '$app/stores';
import queryString from 'query-string';

export interface QueryChanged {
   (query?: string, prop?: any): void;
}

export function createQueryStore(prop: any, initialValue: any, queryChanged?: QueryChanged) {
   var query = undefined;
   return {
      subscribe: (h) => {
         return page.subscribe((p) => {
            query = queryString.parse(p.query.toString());
            if (query[prop]) {
               h(query[prop]);
               queryChanged('?' + p.query.toString(), 0);
            } else {
               h(initialValue);
            }
         });
      },
      set: async (v: any) => {
         query[prop] = v;
         const urlSearchParams = new URLSearchParams(query);
         const g = `?${urlSearchParams.toString()}`;
         goto(g, { keepfocus: true, noscroll: true });
      }
   };
}
