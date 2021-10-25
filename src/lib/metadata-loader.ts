export async function loadMetadata(fetch: Function, url: string) {
   const isBrowser = typeof window === 'object' && typeof document === 'object';
   if (!isBrowser) {
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
