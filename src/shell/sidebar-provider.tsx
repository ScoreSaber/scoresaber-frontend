'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import type { Locale } from '@/i18n/config';

const SidebarContext = createContext<{ collapsed: boolean; toggle: () => void; visibleLocales: Locale[] }>({
   collapsed: false,
   toggle: () => {},
   visibleLocales: []
});

export function SidebarProvider({ visibleLocales, children }: { visibleLocales: Locale[]; children: React.ReactNode }) {
   const [collapsed, setCollapsed] = useState(false);
   const toggle = useCallback(() => setCollapsed((prev) => !prev), []);

   useEffect(() => {
      function handleKeyDown(e: KeyboardEvent) {
         if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 's') {
            e.preventDefault();
            toggle();
         }
      }
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
   }, [toggle]);

   const value = useMemo(() => ({ collapsed, toggle, visibleLocales }), [collapsed, toggle, visibleLocales]);

   return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
   return useContext(SidebarContext);
}
