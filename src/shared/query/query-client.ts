import { QueryClient } from '@tanstack/react-query';

export function createQueryClient() {
   return new QueryClient({
      defaultOptions: {
         queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false
         }
      }
   });
}
