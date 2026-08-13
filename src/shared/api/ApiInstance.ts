import { Api } from './generated/Api';

import { env } from '@/env';

const customFetch = (input: RequestInfo | URL, init?: RequestInit) =>
   fetch(input, {
      ...init,
      credentials: 'include'
   });

export const api = new Api({
   baseUrl: env.NEXT_PUBLIC_API_URL.replace(/\/$/, ''),
   baseApiParams: { secure: true, credentials: 'include' },
   securityWorker: () => ({}),
   customFetch
});
