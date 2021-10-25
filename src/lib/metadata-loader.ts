import { dev } from '$app/env';
import { API_URL } from '$lib/utils/env';

export async function loadMetadata(fetch: Function, url: string) {
   const isBrowser = typeof window === 'object' && typeof document === 'object';
   if (!isBrowser) {
      if (dev) {
         if (url.startsWith('/api')) {
            url = `${API_URL}${url}`;
         }
      }
      console.log('running metadata fetcher');
      const res = await fetch(url);
      if (res.ok) {
         return {
            props: {
               metadata: await res.json()
            }
         };
      }

      return {};
   } else {
      return {};
   }
}
