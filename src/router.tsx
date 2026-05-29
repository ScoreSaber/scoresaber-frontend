import { QueryClient } from '@tanstack/react-query';
import { createRouter } from '@tanstack/react-router';

import { routeTree } from './routeTree.gen';

import { RouteNotFound } from '@/shared/components/error/not-found-card';
import { RouteError } from '@/shared/components/error/route-error';
import { createQueryClient } from '@/shared/query/query-client';
import { parseUrlSearch, stringifyUrlSearch } from '@/shared/url-state/search-serializer';

export interface RouterContext {
   queryClient: QueryClient;
}

export function getRouter() {
   const queryClient = createQueryClient();
   const router = createRouter({
      routeTree,
      context: { queryClient },
      defaultPreload: 'intent',
      defaultViewTransition: false,
      defaultNotFoundComponent: RouteNotFound,
      defaultErrorComponent: RouteError,
      scrollRestoration: true,
      parseSearch: parseUrlSearch,
      stringifySearch: stringifyUrlSearch
   });

   return router;
}

declare module '@tanstack/react-router' {
   interface Register {
      router: ReturnType<typeof getRouter>;
   }
}
