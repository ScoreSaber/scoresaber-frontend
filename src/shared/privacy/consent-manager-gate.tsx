'use client';

import { useEffect, useState } from 'react';

import { useLocation } from '@tanstack/react-router';
import { Result } from 'better-result';

import { dynamic } from '@/shared/components/dynamic';
import { consentStorageKey } from '@/shared/privacy/consent-storage';
import { readStorageValue } from '@/shared/result/storage';

const ConsentManager = dynamic(() => import('@/shared/privacy/consent-manager').then((mod) => mod.ConsentManager));
const CONSENT_IDLE_TIMEOUT_MS = 1500;
const CONSENT_FALLBACK_DELAY_MS = 800;

export function ConsentManagerGate() {
   const pathname = useLocation({ select: (location) => location.pathname });
   const [shouldRender, setShouldRender] = useState(false);

   useEffect(() => {
      setShouldRender(false);

      if (pathname === '/') return;
      if (Result.unwrapOr(readStorageValue(consentStorageKey), null) !== null) return;

      const renderConsentManager = () => setShouldRender(true);

      if (window.requestIdleCallback) {
         const idleId = window.requestIdleCallback(renderConsentManager, { timeout: CONSENT_IDLE_TIMEOUT_MS });
         return () => window.cancelIdleCallback(idleId);
      }

      const timeoutId = window.setTimeout(renderConsentManager, CONSENT_FALLBACK_DELAY_MS);
      return () => window.clearTimeout(timeoutId);
   }, [pathname]);

   if (pathname === '/') return null;

   return shouldRender ? <ConsentManager /> : null;
}
