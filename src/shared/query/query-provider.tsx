'use client';

import { useState } from 'react';

import { QueryClientProvider, type QueryClient } from '@tanstack/react-query';

import { createQueryClient } from './query-client';

export function QueryProvider({ queryClient: providedQueryClient, children }: { queryClient?: QueryClient; children: React.ReactNode }) {
   const [clientQueryClient] = useState(() => createQueryClient());
   const queryClient = providedQueryClient ?? clientQueryClient;

   return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
