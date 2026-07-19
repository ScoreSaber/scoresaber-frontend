'use client';

import { useEffect, type RefObject } from 'react';

function rewriteTree(root: Node) {
   if (root.nodeType === Node.TEXT_NODE) {
      const text = root.nodeValue;
      if (!text) return;
      const replaced = text.replace(/(\d)pp\b/g, '$1 pee pee').replace(/\bpp\b/g, 'pee pee');
      if (replaced !== text) root.nodeValue = replaced;
      return;
   }

   const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
   for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const text = node.nodeValue;
      if (!text) continue;
      const replaced = text.replace(/(\d)pp\b/g, '$1 pee pee').replace(/\bpp\b/g, 'pee pee');
      if (replaced !== text) node.nodeValue = replaced;
   }
}

export function DenyahPeePee({ targetRef }: { targetRef: RefObject<HTMLDivElement | null> }) {
   useEffect(() => {
      const root = targetRef.current;
      if (!root) return;

      rewriteTree(root);

      const observer = new MutationObserver((mutations) => {
         for (const mutation of mutations) {
            if (mutation.type === 'characterData') {
               rewriteTree(mutation.target);
            } else {
               for (const node of mutation.addedNodes) rewriteTree(node);
            }
         }
      });
      observer.observe(root, { subtree: true, childList: true, characterData: true });

      return () => observer.disconnect();
   }, [targetRef]);

   return null;
}
