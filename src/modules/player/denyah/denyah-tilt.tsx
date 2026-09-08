'use client';

import { useEffect, type RefObject } from 'react';

import { reportDenyahFlipTimings, resetDenyahFlipTimings } from '@/modules/player/denyah/denyah-flip-schedule';

const TILT_MS = 3600;
const FAST_RATE = 14;
const FAST_MS = 3000;
const FLIP_EVERY_MS = 26_000;
const FLIP_TURN_MS = 900;
const FLIP_HOLD_MS = 2000;
const FLIP_BOUNCE_MS = 650;

export function DenyahTilt({ targetRef, onFlipChange }: { targetRef: RefObject<HTMLDivElement | null>; onFlipChange: (flipping: boolean) => void }) {
   useEffect(() => {
      const root = targetRef.current;
      if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const animation = root.animate([{ rotate: '1.2deg' }, { rotate: '2.8deg' }], {
         duration: TILT_MS,
         direction: 'alternate',
         iterations: Infinity,
         easing: 'ease-in-out'
      });

      const triggered = new WeakSet<Element>();
      let calmTimer: number | null = null;
      const onPointerOver = (event: PointerEvent) => {
         const button = event.target instanceof Element ? event.target.closest('[data-pagination] a, [data-pagination] button') : null;
         if (!button || triggered.has(button)) return;
         triggered.add(button);
         animation.playbackRate = FAST_RATE;
         if (calmTimer) window.clearTimeout(calmTimer);
         calmTimer = window.setTimeout(() => {
            animation.playbackRate = 1;
         }, FAST_MS);
      };

      const flipTotal = FLIP_TURN_MS * 2 + FLIP_HOLD_MS + FLIP_BOUNCE_MS;
      const at = (ms: number) => ms / flipTotal;
      const impactMs = FLIP_TURN_MS + FLIP_HOLD_MS + FLIP_TURN_MS;
      let flipAnimation: Animation | null = null;
      let flipEndTimer: number | null = null;
      reportDenyahFlipTimings(0, Date.now() + FLIP_EVERY_MS);
      const flipInterval = window.setInterval(() => {
         reportDenyahFlipTimings(Date.now() + flipTotal, Date.now() + FLIP_EVERY_MS);
         onFlipChange(true);
         if (flipEndTimer) window.clearTimeout(flipEndTimer);
         flipEndTimer = window.setTimeout(() => onFlipChange(false), flipTotal);
         flipAnimation = root.animate(
            [
               { rotate: '2deg', easing: 'ease-in-out' },
               { rotate: '188deg', offset: at(FLIP_TURN_MS) },
               { rotate: '188deg', offset: at(FLIP_TURN_MS + FLIP_HOLD_MS), easing: 'ease-in' },
               { rotate: '2deg', offset: at(impactMs), easing: 'ease-out' },
               { rotate: '17deg', offset: at(impactMs + 200), easing: 'ease-in' },
               { rotate: '2deg', offset: at(impactMs + 380), easing: 'ease-out' },
               { rotate: '7deg', offset: at(impactMs + 500), easing: 'ease-in' },
               { rotate: '2deg' }
            ],
            { duration: flipTotal }
         );
      }, FLIP_EVERY_MS);

      root.addEventListener('pointerover', onPointerOver);
      return () => {
         root.removeEventListener('pointerover', onPointerOver);
         if (calmTimer) window.clearTimeout(calmTimer);
         if (flipEndTimer) window.clearTimeout(flipEndTimer);
         window.clearInterval(flipInterval);
         flipAnimation?.cancel();
         animation.cancel();
         resetDenyahFlipTimings();
      };
   }, [onFlipChange, targetRef]);

   return null;
}
