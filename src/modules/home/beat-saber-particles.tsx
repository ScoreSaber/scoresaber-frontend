import { useEffect, useRef, useState } from 'react';

import { cn } from '@/shared/format/helpers';

const COLOR = '#fff';
const DENSITY_AREA = 1100 * 900;
const DENSITY_COUNT = 96;
const SPEED_MIN = 0.08;
const SPEED_MAX = 0.36;
const OPACITY_MIN = 0.16;
const OPACITY_MAX = 0.85;
const OPACITY_SPEED = 0.45;
const SIZE_MIN = 0.7;
const SIZE_MAX = 2.3;
const SIZE_SPEED = 1.8;
const Z_LAYERS = 100;
const Z_VALUE_MAX = 8;
const Z_OPACITY_RATE = 0.7;
const ANIMATION_SPEED_SCALE = 1 / 100;
const MOVE_SPEED_SCALE = 0.5;
const SPREAD = Math.PI / 4;
const FRAME_MS = 1000 / 60;
const MAX_FRAME_STEP = 5;
const SLACK = 240;
const RESIZE_SHRINK_THRESHOLD = 200;
const TAU = Math.PI * 2;

type Particle = {
   x: number;
   y: number;
   vx: number;
   vy: number;
   size: number;
   sizeVelocity: number;
   opacity: number;
   opacityVelocity: number;
   depthScale: number;
   depthAlpha: number;
};

function createParticle(width: number, height: number, animated: boolean): Particle {
   const depth = 1 - Math.floor(Math.random() * Z_VALUE_MAX) / Z_LAYERS;
   const angle = -Math.PI / 2 - SPREAD + Math.random() * SPREAD * 2;
   const step = (SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN)) * MOVE_SPEED_SCALE * depth;

   return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: animated ? Math.cos(angle) * step : 0,
      vy: animated ? Math.sin(angle) * step : 0,
      size: SIZE_MIN + Math.random() * (SIZE_MAX - SIZE_MIN),
      sizeVelocity: animated ? SIZE_SPEED * ANIMATION_SPEED_SCALE * Math.random() * (Math.random() >= 0.5 ? 1 : -1) : 0,
      opacity: OPACITY_MIN + Math.random() * (OPACITY_MAX - OPACITY_MIN),
      opacityVelocity: animated ? OPACITY_SPEED * ANIMATION_SPEED_SCALE * Math.random() * (Math.random() >= 0.5 ? 1 : -1) : 0,
      depthScale: depth,
      depthAlpha: depth ** Z_OPACITY_RATE
   };
}

function fitParticles(particles: Particle[], width: number, height: number, animated: boolean) {
   const count = Math.round((DENSITY_COUNT * width * height) / DENSITY_AREA);

   while (particles.length > count) particles.pop();
   while (particles.length < count) particles.push(createParticle(width, height, animated));

   for (const particle of particles) {
      if (particle.x > width) particle.x = Math.random() * width;
      if (particle.y > height) particle.y = Math.random() * height;
   }
}

function updateParticles(particles: Particle[], width: number, height: number, factor: number) {
   for (const particle of particles) {
      particle.x += particle.vx * factor;
      particle.y += particle.vy * factor;

      const radius = particle.size;

      if (particle.y + radius < 0) {
         particle.y = height + radius;
         particle.x = Math.random() * width;
      } else if (particle.x + radius < 0) {
         particle.x = width + radius;
         particle.y = Math.random() * height;
      } else if (particle.x - radius > width) {
         particle.x = -radius;
         particle.y = Math.random() * height;
      }

      particle.opacity += particle.opacityVelocity * factor;
      if (particle.opacity >= OPACITY_MAX) {
         particle.opacity = OPACITY_MAX;
         particle.opacityVelocity = -particle.opacityVelocity;
      } else if (particle.opacity <= OPACITY_MIN) {
         particle.opacity = OPACITY_MIN;
         particle.opacityVelocity = -particle.opacityVelocity;
      }

      particle.size += particle.sizeVelocity * factor;
      if (particle.size >= SIZE_MAX) {
         particle.size = SIZE_MAX;
         particle.sizeVelocity = -particle.sizeVelocity;
      } else if (particle.size <= SIZE_MIN) {
         particle.size = SIZE_MIN;
         particle.sizeVelocity = -particle.sizeVelocity;
      }
   }
}

function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[], width: number, height: number, offset: number) {
   ctx.clearRect(0, 0, width, height);
   ctx.fillStyle = COLOR;

   for (const particle of particles) {
      const y = particle.y - offset;
      const radius = particle.size * particle.depthScale;

      if (y + radius < 0 || y - radius > height) continue;

      ctx.globalAlpha = particle.opacity * particle.depthAlpha;
      ctx.beginPath();
      ctx.arc(particle.x, y, radius, 0, TAU);
      ctx.fill();
   }

   ctx.globalAlpha = 1;
}

export function BeatSaberParticles() {
   const wrapperRef = useRef<HTMLDivElement>(null);
   const canvasRef = useRef<HTMLCanvasElement>(null);
   const [ready, setReady] = useState(false);

   useEffect(() => {
      const wrapper = wrapperRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');

      if (!wrapper || !canvas || !ctx) return;

      const animated = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const particles: Particle[] = [];

      let fieldWidth = 0;
      let fieldHeight = 0;
      let canvasHeight = 0;
      let offset = 0;
      let frame = 0;
      let running = false;
      let lastTime = 0;

      const measure = () => {
         const width = wrapper.clientWidth;
         const height = wrapper.clientHeight;

         if (!width || !height) return;

         const wanted = Math.min(height, window.innerHeight + SLACK * 2);
         const resizeCanvas = width !== fieldWidth || wanted > canvasHeight || wanted < canvasHeight - RESIZE_SHRINK_THRESHOLD;

         fieldWidth = width;
         fieldHeight = height;
         fitParticles(particles, fieldWidth, fieldHeight, animated);

         if (!resizeCanvas) return;

         const ratio = window.devicePixelRatio || 1;

         canvasHeight = wanted;
         canvas.style.height = `${canvasHeight}px`;
         canvas.width = Math.round(fieldWidth * ratio);
         canvas.height = Math.round(canvasHeight * ratio);
         ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      };

      const render = () => {
         const limit = fieldHeight - canvasHeight;
         let next = 0;

         if (limit > 0) {
            const top = -wrapper.getBoundingClientRect().top;
            const covered = top >= offset && top + window.innerHeight <= offset + canvasHeight;

            next = covered ? offset : Math.min(Math.max(top - SLACK, 0), limit);
         }

         if (next !== offset) {
            offset = next;
            canvas.style.transform = `translate3d(0, ${offset}px, 0)`;
         }

         drawParticles(ctx, particles, fieldWidth, canvasHeight, offset);
      };

      const tick = (time: number) => {
         frame = requestAnimationFrame(tick);

         const elapsed = time - lastTime;

         if (elapsed < FRAME_MS - 1) return;

         lastTime = time;
         updateParticles(particles, fieldWidth, fieldHeight, Math.min(elapsed / FRAME_MS, MAX_FRAME_STEP));
         render();
      };

      const start = () => {
         if (running || !animated) return;

         running = true;
         lastTime = performance.now();
         frame = requestAnimationFrame(tick);
      };

      const stop = () => {
         running = false;

         if (frame) cancelAnimationFrame(frame);
         frame = 0;
      };

      const scheduleRender = () => {
         if (running || frame) return;

         frame = requestAnimationFrame(() => {
            frame = 0;
            render();
         });
      };

      const handleResize = () => {
         measure();
         scheduleRender();
      };

      canvas.style.transform = 'translate3d(0, 0, 0)';

      measure();
      render();

      const readyFrame = requestAnimationFrame(() => setReady(true));

      if (document.hasFocus()) start();

      const observer = new ResizeObserver(handleResize);
      observer.observe(wrapper);
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', scheduleRender, { passive: true });
      window.addEventListener('focus', start);
      window.addEventListener('blur', stop);

      return () => {
         stop();
         cancelAnimationFrame(readyFrame);
         observer.disconnect();
         window.removeEventListener('resize', handleResize);
         window.removeEventListener('scroll', scheduleRender);
         window.removeEventListener('focus', start);
         window.removeEventListener('blur', stop);
      };
   }, []);

   return (
      <div
         ref={wrapperRef}
         className={cn(
            'pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-1000 ease-out motion-reduce:transition-none',
            ready && 'opacity-85'
         )}
      >
         <canvas ref={canvasRef} className="absolute inset-x-0 top-0 w-full" aria-hidden />
      </div>
   );
}
