'use client';

import { useState, type RefObject } from 'react';

import { DenyahTextEffects } from '@/modules/player/denyah/denyah-text-effects';
import { DenyahTilt } from '@/modules/player/denyah/denyah-tilt';
import { SetPageBackground } from '@/shell/background/page-background-provider';

export function DenyahPageEffects({ targetRef, backgroundImage }: { targetRef: RefObject<HTMLDivElement | null>; backgroundImage: string }) {
   const [flipping, setFlipping] = useState(false);

   return (
      <>
         <DenyahTextEffects targetRef={targetRef} />
         <DenyahTilt targetRef={targetRef} onFlipChange={setFlipping} />
         <SetPageBackground src={backgroundImage} invertImage={flipping} reducedBlur />
      </>
   );
}
