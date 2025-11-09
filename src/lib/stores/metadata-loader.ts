import { browser } from '$app/env';

import { API_URL } from '$lib/utils/env';
import axios from '$lib/utils/fetcher';

// eslint-disable-next-line @typescript-eslint/ban-types
export async function loadMetadata(fetch: Function, url: string) {
   if (!browser) {
      if (url.startsWith('/api')) {
         url = `${API_URL}${url}`;
      }
      try {
         const data = await axios(url);
         return {
            props: {
               metadata: data
            }
         };
      } catch (error) {
         try {
            const res = await fetch(url);
            if (res.url.includes('cloudflareaccess')) {
               return {};
            }
            if (res.ok) {
               const contentType = res.headers.get('content-type');
               if (contentType && contentType.includes('application/json')) {
                  try {
                     const text = await res.text();
                     if (!text || text.trim().length === 0) {
                        return {};
                     }
                     const trimmedText = text.trim();
                     if (trimmedText.startsWith('{') || trimmedText.startsWith('[')) {
                        return {
                           props: {
                              metadata: JSON.parse(text)
                           }
                        };
                     }
                     return {};
                  } catch (parseError) {
                     console.error('Failed to parse JSON response:', parseError);
                     return {};
                  }
               }
            }
         } catch (fetchError) {
            return {};
         }
         return {};
      }
   } else {
      return {};
   }
}
