'use client';

import { useEffect, useRef, type MutableRefObject } from 'react';

import { useRouterState } from '@tanstack/react-router';

const minimumProgress = 0.08;
const trickleRate = 0.02;
const trickleSpeed = 200;
const transitionSpeed = 200;
const clickSettleDelay = 120;
const maxLoadDuration = 10000;

function incrementProgress(current: number, amount?: number) {
   const nextAmount = amount ?? (1 - current) * Math.min(Math.max(Math.random() * current, 0.1), 0.95);
   return Math.min(Math.max(current + nextAmount, 0), 0.994);
}

function renderProgress() {
   const existing = document.getElementById('nprogress');
   if (existing) return existing;

   document.documentElement.classList.add('nprogress-busy');
   const progress = document.createElement('div');
   progress.id = 'nprogress';
   progress.className = 'route-top-loader';
   progress.setAttribute('aria-hidden', 'true');
   progress.innerHTML = '<div class="bar" role="bar"><div class="peg"></div></div>';
   document.body.append(progress);
   return progress;
}

function removeProgress() {
   document.documentElement.classList.remove('nprogress-busy');
   document.getElementById('nprogress')?.remove();
}

export function RouteTopLoader() {
   const isLoading = useRouterState({ select: (state) => state.isLoading });
   const locationHref = useRouterState({ select: (state) => state.location.href });
   const status = useRef<number | null>(null);
   const trickleTimeout = useRef<number | null>(null);
   const doneTimeout = useRef<number | null>(null);
   const removeTimeout = useRef<number | null>(null);
   const clickSettleTimeout = useRef<number | null>(null);
   const maxLoadTimeout = useRef<number | null>(null);
   const isLoadingRef = useRef(isLoading);
   const didMount = useRef(false);

   function clearTimer(timer: MutableRefObject<number | null>) {
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = null;
   }

   function clearDoneTimers() {
      clearTimer(doneTimeout);
      clearTimer(removeTimeout);
   }

   function setProgress(next: number | null) {
      status.current = next;

      if (next == null) return;

      renderProgress();
      const bar = document.querySelector<HTMLElement>('#nprogress .bar');
      if (!bar) return;

      bar.style.transform = `translate3d(${(-1 + next) * 100}%,0,0)`;
      bar.style.opacity = next === 1 ? '0' : '1';
   }

   function queueTrickle() {
      clearTimer(trickleTimeout);
      if (status.current == null || status.current >= 1) return;

      trickleTimeout.current = window.setTimeout(() => {
         if (status.current == null) return;
         setProgress(incrementProgress(status.current, Math.random() * trickleRate));
         queueTrickle();
      }, trickleSpeed);
   }

   function start() {
      clearDoneTimers();
      clearTimer(clickSettleTimeout);
      clearTimer(maxLoadTimeout);
      setProgress(status.current == null || status.current >= 1 ? minimumProgress : status.current);
      queueTrickle();
      maxLoadTimeout.current = window.setTimeout(done, maxLoadDuration);
   }

   function done() {
      if (status.current == null) return;

      clearDoneTimers();
      clearTimer(trickleTimeout);
      clearTimer(clickSettleTimeout);
      clearTimer(maxLoadTimeout);
      setProgress(incrementProgress(status.current, 0.3 + 0.5 * Math.random()));

      doneTimeout.current = window.setTimeout(() => {
         setProgress(1);

         removeTimeout.current = window.setTimeout(() => {
            removeProgress();
            setProgress(null);
         }, transitionSpeed);
      }, transitionSpeed);
   }

   useEffect(() => {
      isLoadingRef.current = isLoading;

      if (!didMount.current) {
         didMount.current = true;
         return;
      }

      if (isLoading) start();
      else done();
   }, [isLoading]);

   useEffect(() => {
      if (didMount.current && !isLoading && status.current != null) done();
   }, [locationHref]);

   useEffect(() => {
      function handleClick(event: MouseEvent) {
         if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

         const target = event.target;
         const anchor = target instanceof Element ? target.closest('a[href]') : null;
         if (!anchor || !(anchor instanceof HTMLAnchorElement)) return;
         if (anchor.closest('[data-route-top-loader-skip]')) return;
         if (anchor.target || anchor.hasAttribute('download')) return;
         if (['tel:', 'mailto:', 'sms:', 'blob:', 'download:'].some((protocol) => anchor.href.startsWith(protocol))) return;

         const current = new URL(window.location.href);
         const next = new URL(anchor.href, window.location.href);
         if (current.hostname.replace(/^www\./, '') !== next.hostname.replace(/^www\./, '')) return;

         const currentWithoutHash = current.href.replace(current.hash, '');
         const nextWithoutHash = next.href.replace(next.hash, '');
         const isSameHref = current.href === next.href;
         const isHashAnchor = currentWithoutHash === nextWithoutHash && current.hash !== next.hash;

         start();
         if (isSameHref || isHashAnchor || !next.href.startsWith('http')) {
            done();
            return;
         }

         clickSettleTimeout.current = window.setTimeout(() => {
            if (!isLoadingRef.current) done();
         }, clickSettleDelay);
      }

      document.addEventListener('click', handleClick, true);

      return () => {
         document.removeEventListener('click', handleClick, true);
         clearTimer(trickleTimeout);
         clearTimer(clickSettleTimeout);
         clearTimer(maxLoadTimeout);
         clearDoneTimers();
         removeProgress();
      };
   }, []);

   return <span hidden data-route-top-loader="" />;
}
