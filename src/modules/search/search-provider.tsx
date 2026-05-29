'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type OmniSearchContextValue = {
   open: boolean;
   setOpen: (open: boolean) => void;
   toggle: () => void;
   initialQuery: string | null;
   openWithQuery: (query: string) => void;
   clearInitialQuery: () => void;
};

const OmniSearchContext = createContext<OmniSearchContextValue | null>(null);

export function OmniSearchProvider({ children }: { children: React.ReactNode }) {
   const [open, setOpen] = useState(false);
   const [initialQuery, setInitialQuery] = useState<string | null>(null);

   const toggle = useCallback(() => setOpen((prev) => !prev), []);

   const openWithQuery = useCallback((query: string) => {
      setInitialQuery(query);
      setOpen(true);
   }, []);

   const clearInitialQuery = useCallback(() => setInitialQuery(null), []);

   // ctrl+k / cmd+k global shortcut
   useEffect(() => {
      function handleKeyDown(e: KeyboardEvent) {
         if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === '/')) {
            e.preventDefault();
            toggle();
         }
      }
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
   }, [toggle]);

   const value = useMemo(
      () => ({ open, setOpen, toggle, initialQuery, openWithQuery, clearInitialQuery }),
      [open, setOpen, toggle, initialQuery, openWithQuery, clearInitialQuery]
   );

   return <OmniSearchContext.Provider value={value}>{children}</OmniSearchContext.Provider>;
}

export function useOmniSearch(): OmniSearchContextValue {
   const ctx = useContext(OmniSearchContext);
   if (!ctx) throw new Error('useOmniSearch must be used within OmniSearchProvider');
   return ctx;
}
