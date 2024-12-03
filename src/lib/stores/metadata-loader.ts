import { browser } from '$app/env';

import { API_URL } from '$lib/utils/env';

// eslint-disable-next-line @typescript-eslint/ban-types
export async function loadMetadata(fetch: Function, url: string) {
   if (!browser) {
      if (url.startsWith('/api')) {
         url = `${API_URL}${url}`;
      }
      const res = await fetch(url, { headers: { 'accept-encoding': 'gzip' } });
      if (res.url.includes('cloudflareaccess')) {
         return {};
      }
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
