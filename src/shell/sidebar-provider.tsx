'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import type { Locale } from '@/i18n/config';
import { SIDEBAR_COLLAPSED_COOKIE_NAME, SIDEBAR_COOKIE_MAX_AGE } from '@/shell/sidebar-state';

const SidebarContext = createContext<{ collapsed: boolean; toggle: () => void; visibleLocales: Locale[]; isMac: boolean }>({
   collapsed: false,
   toggle: () => {},
   visibleLocales: [],
   isMac: false
});

export function SidebarProvider({
   visibleLocales,
   initialSidebarCollapsed,
   isMac,
   children
}: {
   visibleLocales: Locale[];
   initialSidebarCollapsed: boolean | null;
   isMac: boolean;
   children: React.ReactNode;
}) {
   const [collapsed, setCollapsed] = useState(initialSidebarCollapsed ?? false);
   const toggle = useCallback(() => {
      setCollapsed((prev) => {
         const next = !prev;
         document.cookie = `${SIDEBAR_COLLAPSED_COOKIE_NAME}=${next}; Path=/; Max-Age=${SIDEBAR_COOKIE_MAX_AGE}; SameSite=Lax`;
         return next;
      });
   }, []);

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

   const value = useMemo(() => ({ collapsed, toggle, visibleLocales, isMac }), [collapsed, toggle, visibleLocales, isMac]);

   return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
   return useContext(SidebarContext);
}
