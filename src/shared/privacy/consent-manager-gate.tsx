'use client';

import { useEffect, useState } from 'react';

import { dynamic } from '@/shared/components/dynamic';
import { consentStorageKey } from '@/shared/privacy/consent-storage';

const ConsentManager = dynamic(() => import('@/shared/privacy/consent-manager').then((mod) => mod.ConsentManager));

export function ConsentManagerGate() {
   const [shouldRender, setShouldRender] = useState(false);

   useEffect(() => {
      try {
         setShouldRender(window.localStorage.getItem(consentStorageKey) === null);
      } catch {
         setShouldRender(true);
      }
   }, []);

   return shouldRender ? <ConsentManager /> : null;
}
