'use client';

import { useEffect, useRef, type MouseEvent, type PointerEvent, type ReactNode } from 'react';

import { cn } from '@/shared/format/helpers';

const DEFAULT_MAX_DODGES = 3;
const REST_MS = 6000;
const MARGIN = 8;
const MOVE_MS = 200;
const TAP_GUARD_MS = 1000;

const wiggle = (el: HTMLElement) => {
   el.style.transformOrigin = '50% 90%';
   el.animate(
      [
         { transform: 'rotate(0deg)', scale: '1 1', easing: 'ease-out' },
         { transform: 'rotate(0deg)', scale: '1.25 0.7', offset: 0.12, easing: 'ease-in-out' },
         { transform: 'rotate(0deg)', scale: '0.92 1.1', offset: 0.26, easing: 'ease-in-out' },
         { transform: 'rotate(-9deg)', scale: '1.04 0.96', offset: 0.4, easing: 'ease-in-out' },
         { transform: 'rotate(9deg)', scale: '1.04 0.96', offset: 0.55, easing: 'ease-in-out' },
         { transform: 'rotate(-6deg)', scale: '1.02 0.98', offset: 0.7, easing: 'ease-in-out' },
         { transform: 'rotate(3deg)', scale: '1 1', offset: 0.84, easing: 'ease-in-out' },
         { transform: 'rotate(0deg)', scale: '1 1' }
      ],
      { duration: 750 }
   );
};

export function Runaway({
   enabled,
   maxDodges = DEFAULT_MAX_DODGES,
   className,
   children
}: {
   enabled: boolean;
   maxDodges?: number;
   className?: string;
   children: ReactNode;
}) {
   const ref = useRef<HTMLDivElement>(null);
   const innerRef = useRef<HTMLDivElement>(null);
   const offset = useRef({ x: 0, y: 0 });
   const dodges = useRef(0);
   const restTimer = useRef<number | null>(null);
   const wiggleTimer = useRef<number | null>(null);
   const ignoredTapTimer = useRef<number | null>(null);
   const ignoreClick = useRef(false);

   const settle = () => {
      dodges.current = 0;
      offset.current = { x: 0, y: 0 };
      if (ref.current) {
         ref.current.style.transform = '';
         ref.current.style.zIndex = '';
      }
   };

   useEffect(
      () => () => {
         if (restTimer.current) window.clearTimeout(restTimer.current);
         if (wiggleTimer.current) window.clearTimeout(wiggleTimer.current);
         if (ignoredTapTimer.current) window.clearTimeout(ignoredTapTimer.current);
      },
      []
   );

   const moveAway = (clientX: number, clientY: number) => {
      const el = ref.current;
      if (!el || dodges.current >= maxDodges) return false;

      dodges.current += 1;
      if (restTimer.current) window.clearTimeout(restTimer.current);
      restTimer.current = window.setTimeout(settle, REST_MS);

      const rect = el.getBoundingClientRect();
      const angle = Math.atan2(rect.top + rect.height / 2 - clientY, rect.left + rect.width / 2 - clientX) + (Math.random() - 0.5);
      const distance = 90 + Math.random() * 70;
      const baseLeft = rect.left - offset.current.x;
      const baseTop = rect.top - offset.current.y;
      offset.current = {
         x: Math.min(Math.max(offset.current.x + Math.cos(angle) * distance, MARGIN - baseLeft), window.innerWidth - rect.width - MARGIN - baseLeft),
         y: Math.min(Math.max(offset.current.y + Math.sin(angle) * distance, MARGIN - baseTop), window.innerHeight - rect.height - MARGIN - baseTop)
      };
      el.style.transform = `translate(${offset.current.x}px, ${offset.current.y}px)`;
      el.style.zIndex = '60';

      if (wiggleTimer.current) window.clearTimeout(wiggleTimer.current);
      wiggleTimer.current = window.setTimeout(() => {
         if (innerRef.current) wiggle(innerRef.current);
      }, MOVE_MS);

      return true;
   };

   const onPointerEnter = (event: PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === 'mouse') moveAway(event.clientX, event.clientY);
   };

   const onPointerDownCapture = (event: PointerEvent<HTMLDivElement>) => {
      if (event.pointerType !== 'touch') return;

      if (!moveAway(event.clientX, event.clientY)) {
         ignoreClick.current = false;
         if (ignoredTapTimer.current) window.clearTimeout(ignoredTapTimer.current);
         ignoredTapTimer.current = null;
         return;
      }

      event.preventDefault();
      event.stopPropagation();
      ignoreClick.current = true;
      if (ignoredTapTimer.current) window.clearTimeout(ignoredTapTimer.current);
      ignoredTapTimer.current = window.setTimeout(() => {
         ignoreClick.current = false;
         ignoredTapTimer.current = null;
      }, TAP_GUARD_MS);
   };

   const onClickCapture = (event: MouseEvent<HTMLDivElement>) => {
      if (!ignoreClick.current) return;

      event.preventDefault();
      event.stopPropagation();
      ignoreClick.current = false;
      if (ignoredTapTimer.current) window.clearTimeout(ignoredTapTimer.current);
      ignoredTapTimer.current = null;
   };

   if (!enabled) return className ? <div className={className}>{children}</div> : children;

   return (
      <div
         ref={ref}
         className={cn('relative transition-transform duration-200 ease-out', className)}
         onPointerEnter={onPointerEnter}
         onPointerDownCapture={onPointerDownCapture}
         onClickCapture={onClickCapture}
      >
         <div ref={innerRef} className="flex">
            {children}
         </div>
      </div>
   );
}
