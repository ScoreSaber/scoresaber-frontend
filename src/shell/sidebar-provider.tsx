'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const SidebarContext = createContext<{ collapsed: boolean; toggle: () => void }>({
   collapsed: false,
   toggle: () => {}
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
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

   return <SidebarContext.Provider value={{ collapsed, toggle }}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
   return useContext(SidebarContext);
}
