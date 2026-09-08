'use client';

import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';

import { computeDenyahSections } from '@/modules/player/chart/use-denyah-overlay';
import { isDenyahFlipClearFor } from '@/modules/player/denyah/denyah-flip-schedule';
import { useDenyahMode } from '@/modules/player/denyah/denyah-mode-context';
import type { PlayerControllerGetPlayerHistoryItem } from '@/shared/api/generated/ApiParams';

const VARIANTS = [
   { src: '/images/denyah-skeleton-near.webp', durationMs: 1250, height: '78%', weight: 6 },
   { src: '/images/denyah-skeleton-far.webp', durationMs: 2250, height: '78%', weight: 3 },
   { src: '/images/denyah-skeleton-charge.webp', durationMs: 2600, height: '92%', weight: 1 }
];

const EYES = {
   good: { x: 0.505, y: 0.53 },
   bad: { x: 0.47, y: 0.48 }
};

const MIN_DELAY_MS = 10_000;
const EXTRA_DELAY_MS = 50_000;
const BLOCKED_RETRY_MS = 1500;

type Pass = { variant: (typeof VARIANTS)[number]; id: number };

function pickVariant() {
   const total = VARIANTS.reduce((sum, variant) => sum + variant.weight, 0);
   let roll = Math.random() * total;
   for (const variant of VARIANTS) {
      roll -= variant.weight;
      if (roll <= 0) return variant;
   }
   return VARIANTS[0];
}

export function DenyahSkeletonOverlay({
   rankHistory,
   showEyes,
   faceOverlayRef
}: {
   rankHistory: PlayerControllerGetPlayerHistoryItem[];
   showEyes: boolean;
   faceOverlayRef: RefObject<HTMLDivElement | null>;
}) {
   const active = useDenyahMode();
   const [pass, setPass] = useState<Pass | null>(null);
   const rootRef = useRef<HTMLDivElement>(null);
   const inViewRef = useRef(false);

   useEffect(() => {
      const root = rootRef.current;
      if (!active || !root) return;

      const observer = new IntersectionObserver(
         ([entry]) => {
            inViewRef.current = entry.isIntersecting;
         },
         { threshold: 0.5 }
      );
      observer.observe(root);
      return () => observer.disconnect();
   }, [active]);

   useEffect(() => {
      if (!active || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      for (const variant of VARIANTS) new Image().src = variant.src;

      const timers: number[] = [];
      const wait = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
      let id = 0;
      const schedule = () => wait(MIN_DELAY_MS + Math.random() * EXTRA_DELAY_MS, runSequence);
      const runSequence = () => {
         const variant = pickVariant();
         if (!inViewRef.current || !isDenyahFlipClearFor(variant.durationMs)) {
            wait(BLOCKED_RETRY_MS, runSequence);
            return;
         }
         setPass({ variant, id: ++id });
         wait(variant.durationMs, () => {
            setPass(null);
            schedule();
         });
      };
      schedule();

      return () => timers.forEach((timer) => window.clearTimeout(timer));
   }, [active]);

   useEffect(() => {
      const overlay = faceOverlayRef.current;
      if (!overlay) return;
      overlay.style.transition = 'filter 400ms ease';
      overlay.style.filter = pass ? 'grayscale(1)' : '';
      return () => {
         overlay.style.filter = '';
      };
   }, [pass, faceOverlayRef]);

   const sections = useMemo(() => (active ? computeDenyahSections(rankHistory.map((entry) => entry.rank)) : []), [active, rankHistory]);

   if (!active) return null;

   const tileWidth = sections.length > 0 ? 100 / sections.length + 1 : 0;

   return (
      <div ref={rootRef} className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
         {pass &&
            showEyes &&
            sections.map((section, i) => {
               const eye = section.isGood ? EYES.good : EYES.bad;
               const left = (section.posPercent / 100) * (100 - tileWidth) + eye.x * tileWidth;
               return (
                  <span
                     key={i}
                     className="absolute text-3xl"
                     style={{ left: `${left}%`, top: `${eye.y * 100}%`, transform: 'translate(-50%, -50%)' }}
                  >
                     👀
                  </span>
               );
            })}
         {pass && (
            <img
               key={pass.id}
               src={`${pass.variant.src}#${pass.id}`}
               alt=""
               aria-hidden
               className="absolute bottom-0 left-0 w-full"
               style={{ height: pass.variant.height, objectFit: 'fill' }}
               draggable={false}
            />
         )}
      </div>
   );
}
