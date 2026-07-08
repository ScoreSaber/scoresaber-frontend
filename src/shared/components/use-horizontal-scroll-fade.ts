'use client';

import { useEffect, useRef, useState } from 'react';

import { cn } from '@/shared/format/helpers';

export function useHorizontalScrollFade<T extends HTMLElement = HTMLDivElement>() {
   const scrollRef = useRef<T>(null);
   const [showStartFade, setShowStartFade] = useState(false);
   const [showEndFade, setShowEndFade] = useState(false);

   useEffect(() => {
      const element = scrollRef.current;
      if (!element) return;

      const update = () => {
         const overflowX = getComputedStyle(element).overflowX;
         const scrollable = overflowX === 'auto' || overflowX === 'scroll';
         const maxScroll = element.scrollWidth - element.clientWidth;
         setShowStartFade(scrollable && element.scrollLeft > 1);
         setShowEndFade(scrollable && element.scrollLeft < maxScroll - 1);
      };

      update();
      element.addEventListener('scroll', update, { passive: true });

      const observer = new ResizeObserver(update);
      observer.observe(element);
      for (const child of element.children) observer.observe(child);

      return () => {
         element.removeEventListener('scroll', update);
         observer.disconnect();
      };
   }, []);

   const fadeClassName = cn(
      'scrollbar-none',
      showStartFade && showEndFade && 'scroll-fade-x-both',
      showStartFade && !showEndFade && 'scroll-fade-x-start',
      !showStartFade && showEndFade && 'scroll-fade-x-end'
   );

   return { scrollRef, fadeClassName };
}
