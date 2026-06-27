'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { useLocation } from '@tanstack/react-router';

import type { Locale } from '@/i18n/config';
import { SEEN_HOME_COOKIE_NAME, SIDEBAR_COLLAPSED_COOKIE_NAME, SIDEBAR_COOKIE_MAX_AGE } from '@/shell/sidebar-state';

const SidebarContext = createContext<{ collapsed: boolean; toggle: () => void; visibleLocales: Locale[] }>({
   collapsed: false,
   toggle: () => {},
   visibleLocales: []
});

export function SidebarProvider({
   visibleLocales,
   initialSeenHome,
   initialSidebarCollapsed,
   children
}: {
   visibleLocales: Locale[];
   initialSeenHome: boolean;
   initialSidebarCollapsed: boolean | null;
   children: React.ReactNode;
}) {
   const isHome = useLocation({ select: (location) => location.pathname === '/' });
   // make sure everyone can see the pretty new home page in its best config when
   // viewing it for the first time (even existing users), from then on the sidebar is back to being user controlled
   const [seenHome, setSeenHome] = useState(initialSeenHome);
   const [hasSidebarPreference, setHasSidebarPreference] = useState(initialSidebarCollapsed != null);
   const [collapsed, setCollapsed] = useState(initialSidebarCollapsed ?? (isHome && !initialSeenHome));
   const toggle = useCallback(() => {
      setHasSidebarPreference(true);
      setCollapsed((prev) => {
         const next = !prev;
         writeCookie(SIDEBAR_COLLAPSED_COOKIE_NAME, String(next));
         return next;
      });
   }, []);

   useEffect(() => {
      if (!isHome || seenHome) return;
      setSeenHome(true);
      writeCookie(SEEN_HOME_COOKIE_NAME, 'true');

      if (hasSidebarPreference) return;
      setHasSidebarPreference(true);
      setCollapsed(true);
      writeCookie(SIDEBAR_COLLAPSED_COOKIE_NAME, 'true');
   }, [hasSidebarPreference, isHome, seenHome]);

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

function writeCookie(name: string, value: string) {
   document.cookie = `${name}=${value}; Path=/; Max-Age=${SIDEBAR_COOKIE_MAX_AGE}; SameSite=Lax`;
}
