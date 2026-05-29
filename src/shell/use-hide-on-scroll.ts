'use client';

import { useEffect, useRef, useState } from 'react';

export function useHideOnScroll() {
   const [hidden, setHidden] = useState(false);
   const lastY = useRef(0);

   useEffect(() => {
      function onScroll() {
         const y = window.scrollY;
         if (y < lastY.current || y < 10) {
            setHidden(false);
         } else if (y > lastY.current && y > 48) {
            setHidden(true);
         }
         lastY.current = y;
      }

      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
   }, []);

   return hidden;
}
