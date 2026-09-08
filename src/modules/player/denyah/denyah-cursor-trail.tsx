'use client';

import { useEffect } from 'react';

const TRAIL_IMAGES = ['/images/denyah-good.png', '/images/denyah-bad.png'];
const MIN_DISTANCE = 32;
const MAX_PARTICLES = 30;
const EMIT_INTERVAL_MS = 300;

export function DenyahCursorTrail() {
   useEffect(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const container = document.createElement('div');
      container.className = 'pointer-events-none fixed inset-0 z-50 overflow-hidden';
      document.body.appendChild(container);

      let lastX = -Infinity;
      let lastY = -Infinity;
      let spawned = 0;

      const spawn = (x: number, y: number) => {
         if (container.childElementCount >= MAX_PARTICLES) return;
         const face = document.createElement('div');
         const size = 24 + Math.random() * 10;
         Object.assign(face.style, {
            position: 'absolute',
            left: `${x}px`,
            top: `${y}px`,
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '9999px',
            backgroundImage: `url(${TRAIL_IMAGES[++spawned % 7 === 0 ? 1 : 0]})`,
            backgroundSize: '230%',
            backgroundPosition: '50% 45%',
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.35)'
         });
         container.appendChild(face);
         const drift = (Math.random() - 0.5) * 40;
         const spin = (Math.random() - 0.5) * 50;
         const animation = face.animate(
            [
               { opacity: 0.9, transform: 'translate(-50%, -50%) scale(1) rotate(0deg)' },
               { opacity: 0, transform: `translate(calc(-50% + ${drift}px), calc(-50% + 48px)) scale(0.35) rotate(${spin}deg)` }
            ],
            { duration: 900, easing: 'ease-out', fill: 'forwards' }
         );
         animation.onfinish = () => face.remove();
      };

      let emitPosition: { x: number; y: number } | null = null;

      const onMove = (event: MouseEvent) => {
         emitPosition = { x: event.clientX, y: event.clientY };
         const dx = event.clientX - lastX;
         const dy = event.clientY - lastY;
         if (dx * dx + dy * dy < MIN_DISTANCE * MIN_DISTANCE) return;
         lastX = event.clientX;
         lastY = event.clientY;
         spawn(event.clientX, event.clientY);
      };

      const drip = window.setInterval(() => {
         if (emitPosition) spawn(emitPosition.x, emitPosition.y);
      }, EMIT_INTERVAL_MS);

      window.addEventListener('mousemove', onMove, { passive: true });
      return () => {
         window.removeEventListener('mousemove', onMove);
         window.clearInterval(drip);
         container.remove();
      };
   }, []);

   return null;
}
