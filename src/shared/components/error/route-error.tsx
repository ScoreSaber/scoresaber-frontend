'use client';

import type { ErrorComponentProps } from '@tanstack/react-router';
import { getRouteApi, useRouter } from '@tanstack/react-router';
import { AlertCircle, RefreshCw } from 'lucide-react';

import { common, error } from '../../../../messages/en.json';

import { Button } from '@/components/ui/button';

import { ErrorCard } from '@/shared/components/error/error-card';

const homeRoute = getRouteApi('/');

export function RouteError({ error: routeError, reset }: ErrorComponentProps) {
   const router = useRouter();
   const digest = 'digest' in routeError && typeof routeError.digest === 'string' ? routeError.digest : null;

   function handleRetry() {
      reset();
      void router.invalidate();
   }

   return (
      <ErrorCard
         icon={AlertCircle}
         title={error.somethingWentWrong}
         description={error.unexpectedError}
         meta={digest && <span className="text-muted-foreground/50 font-mono text-xs">{error.errorId.replace('{digest}', digest)}</span>}
         actions={
            <>
               <Button asChild size="sm" variant="secondary" className="cursor-pointer">
                  <homeRoute.Link>{common.goHome}</homeRoute.Link>
               </Button>
               <Button size="sm" variant="default" onClick={handleRetry} className="cursor-pointer">
                  <RefreshCw data-icon="inline-start" className="size-3" />
                  {common.retry}
               </Button>
            </>
         }
      />
   );
}
