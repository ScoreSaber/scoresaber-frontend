'use client';

import type { QueryClient } from '@tanstack/react-query';

import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

import { AuthProvider } from '@/modules/auth';
import { OmniSearch } from '@/modules/search';
import { OmniSearchProvider } from '@/modules/search';
import { ScoreSaber2BadgePrompt } from '@/modules/settings/score-saber-2-badge-prompt';
import type { UserControllerGetMeResponse } from '@/shared/api/generated/ApiParams';
import { QueryProvider } from '@/shared/query/query-provider';
import { ThemeProvider } from '@/shared/ui-adjacent/theme-provider';
import { Breakpoints } from '@/shell/debug-breakpoints';
import { MainContent } from '@/shell/main-content';
import { MobileBottomBar } from '@/shell/mobile-bottom-bar';
import { MobileTopBar } from '@/shell/mobile-top-bar';
import { RouteTopLoader } from '@/shell/route-top-loader';
import { Sidebar } from '@/shell/sidebar';
import { SidebarProvider } from '@/shell/sidebar-provider';

export function AppShell({
   initialUser,
   queryClient,
   debugBreakpoints,
   debugPageBackground,
   children
}: {
   initialUser: UserControllerGetMeResponse | null;
   queryClient: QueryClient;
   debugBreakpoints: boolean;
   debugPageBackground: boolean;
   children: React.ReactNode;
}) {
   return (
      <ThemeProvider>
         {debugBreakpoints && <Breakpoints />}
         <QueryProvider queryClient={queryClient}>
            <AuthProvider initialUser={initialUser}>
               <TooltipProvider>
                  <OmniSearchProvider>
                     <RouteTopLoader />
                     <SidebarProvider>
                        <Sidebar />
                        <MobileTopBar />
                        <MainContent debugPageBackground={debugPageBackground}>{children}</MainContent>
                        <MobileBottomBar />
                     </SidebarProvider>
                     <OmniSearch />
                     <ScoreSaber2BadgePrompt />
                     <Toaster />
                  </OmniSearchProvider>
               </TooltipProvider>
            </AuthProvider>
         </QueryProvider>
      </ThemeProvider>
   );
}
