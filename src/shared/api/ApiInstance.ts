import { Api } from './generated/Api';

import { env } from '@/env';

const customFetch = Object.assign(
   (input: RequestInfo | URL, init?: RequestInit) =>
      fetch(input, {
         ...init,
         credentials: 'include'
      }),
   {
      preconnect: (...args: Parameters<typeof fetch.preconnect>) => fetch.preconnect(...args)
   }
);

export const api = new Api({
   baseUrl: env.NEXT_PUBLIC_API_URL.replace(/\/$/, ''),
   baseApiParams: { secure: true, credentials: 'include' },
   securityWorker: () => ({}),
   customFetch
});
