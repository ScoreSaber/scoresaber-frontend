'use client';

import { getRouteApi, Link } from '@tanstack/react-router';
import { AlertCircle, Lock, RefreshCw, ShieldOff, Timer, Wifi, WifiOff } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';

import { ErrorCard } from '@/shared/components/error/error-card';

const homeRoute = getRouteApi('/');

interface PageErrorProps {
   status: number | null;
   message?: string;
}

type ErrorInfo = {
   icon: typeof AlertCircle;
   title: string;
   description: string;
};

export function PageError({ status, message }: PageErrorProps) {
   const t = useTranslations();
   const info: ErrorInfo = (() => {
      switch (status) {
         case 401:
            return { icon: Lock, title: t('error.notAuthenticated'), description: t('error.notAuthenticatedDesc') };
         case 403:
            return { icon: ShieldOff, title: t('error.accessDenied'), description: t('error.accessDeniedDesc') };
         case 429:
            return { icon: Timer, title: t('error.tooManyRequests'), description: t('error.tooManyRequestsDesc') };
         case 500:
            return { icon: AlertCircle, title: t('error.serverError'), description: t('error.serverErrorDesc') };
         case 502:
         case 503:
         case 504:
            return { icon: WifiOff, title: t('error.serviceUnavailable'), description: t('error.serviceUnavailableDesc') };
         case null:
            return { icon: Wifi, title: t('error.connectionError'), description: t('error.connectionErrorDesc') };
         default:
            return { icon: AlertCircle, title: t('error.somethingWentWrong'), description: t('error.unexpectedErrorLater') };
      }
   })();

   return (
      <ErrorCard
         icon={info.icon}
         title={info.title}
         description={message || info.description}
         meta={status != null && <span className="text-muted-foreground/50 font-mono text-xs">{t('error.httpStatus', { status })}</span>}
         actions={
            <>
               <Button asChild size="sm" variant="secondary" className="cursor-pointer">
                  <homeRoute.Link>{t('common.goHome')}</homeRoute.Link>
               </Button>
               <Button asChild size="sm" variant="default" className="cursor-pointer">
                  <Link to=".">
                     <RefreshCw data-icon="inline-start" />
                     {t('common.retry')}
                  </Link>
               </Button>
            </>
         }
      />
   );
}
