import { browser } from '$app/env';

import { API_URL } from '$lib/utils/env';

// eslint-disable-next-line @typescript-eslint/ban-types
export async function loadMetadata(fetch: Function, url: string) {
   if (!browser) {
      if (url.startsWith('/api')) {
         url = `${API_URL}${url}`;
      }
      const res = await fetch(url);
      if (res.url.includes('cloudflareaccess')) {
         return {};
      }
      if (res.ok) {
         const contentType = res.headers.get('content-type');
         if (contentType && contentType.includes('application/json')) {
            try {
               return {
                  props: {
                     metadata: await res.json()
                  }
               };
            } catch (error) {
               console.error('Failed to parse JSON response:', error);
               return {};
            }
         }
      }

      return {};
   } else {
      return {};
   }
}
