'use client';

import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

import type { Locale } from '@/i18n/config';
import { AuthProvider } from '@/modules/auth';
import { OmniSearchProvider } from '@/modules/search/search-provider';
import type { UserControllerGetMeResponse } from '@/shared/api/generated/ApiParams';
import { dynamic } from '@/shared/components/dynamic';
import { TranslationContextHighlighter, type TranslationMessages } from '@/shared/i18n/translation-context-highlighter';
import { ConsentManagerGate } from '@/shared/privacy/consent-manager-gate';
import { ThemeProvider } from '@/shared/ui-adjacent/theme-provider';
import { Breakpoints } from '@/shell/debug-breakpoints';
import { MainContent } from '@/shell/main-content';
import { MobileBottomBar } from '@/shell/mobile-bottom-bar';
import { MobileTopBar } from '@/shell/mobile-top-bar';
import { RouteTopLoader } from '@/shell/route-top-loader';
import { Sidebar } from '@/shell/sidebar';
import { SidebarProvider } from '@/shell/sidebar-provider';

const OmniSearch = dynamic(() => import('@/modules/search/omni-search').then((mod) => mod.OmniSearch));

export function AppShell({
   initialUser,
   messages,
   visibleLocales,
   initialSidebarCollapsed,
   debugBreakpoints,
   debugPageBackground,
   children
}: {
   initialUser: UserControllerGetMeResponse | null;
   messages: TranslationMessages;
   visibleLocales: Locale[];
   initialSidebarCollapsed: boolean | null;
   debugBreakpoints: boolean;
   debugPageBackground: boolean;
   children: React.ReactNode;
}) {
   return (
      <ThemeProvider>
         {debugBreakpoints && <Breakpoints />}
         <AuthProvider initialUser={initialUser}>
            <TooltipProvider>
               <OmniSearchProvider>
                  <RouteTopLoader />
                  <SidebarProvider visibleLocales={visibleLocales} initialSidebarCollapsed={initialSidebarCollapsed}>
                     <Sidebar />
                     <MobileTopBar />
                     <TranslationContextHighlighter messages={messages} />
                     <MainContent debugPageBackground={debugPageBackground}>{children}</MainContent>
                     <MobileBottomBar />
                  </SidebarProvider>
                  <OmniSearch />
                  <Toaster />
               </OmniSearchProvider>
            </TooltipProvider>
         </AuthProvider>
         <ConsentManagerGate />
      </ThemeProvider>
   );
}
