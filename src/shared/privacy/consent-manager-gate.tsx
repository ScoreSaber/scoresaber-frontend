'use client';

import { useEffect, useState } from 'react';

import { useLocation } from '@tanstack/react-router';
import { Result } from 'better-result';

import { dynamic } from '@/shared/components/dynamic';
import { consentStorageKey } from '@/shared/privacy/consent-storage';
import { readStorageValue } from '@/shared/result/storage';

const ConsentManager = dynamic(() => import('@/shared/privacy/consent-manager').then((mod) => mod.ConsentManager));

export function ConsentManagerGate() {
   const pathname = useLocation({ select: (location) => location.pathname });
   const [shouldRender, setShouldRender] = useState(false);

   useEffect(() => {
      setShouldRender(Result.unwrapOr(readStorageValue(consentStorageKey), null) === null);
   }, []);

   if (pathname === '/') return null;

   return shouldRender ? <ConsentManager /> : null;
}
