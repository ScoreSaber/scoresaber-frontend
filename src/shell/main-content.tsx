'use client';

import { cn } from '@/shared/format/helpers';
import { PageBackground } from '@/shell/background/page-background';
import { PageBackgroundProvider, usePageBackgroundConfig } from '@/shell/background/page-background-provider';
import { useSidebar } from '@/shell/sidebar-provider';

function MainContentInner({ children, debugPageBackground }: { children: React.ReactNode; debugPageBackground: boolean }) {
   const { collapsed } = useSidebar();
   const bgConfig = usePageBackgroundConfig();

   return (
      <main
         id="main-content"
         className={cn(
            'relative flex min-h-dvh flex-col pt-(--content-offset-top) pb-(--content-offset-bottom) transition-[padding-left] duration-300 ease-in-out lg:pt-0 lg:pb-0',
            collapsed ? 'lg:pl-14' : 'lg:pl-61 3xl:pl-68'
         )}
      >
         {bgConfig && <PageBackground src={bgConfig.src} candidates={bgConfig.candidates} debugPanel={debugPageBackground} />}
         {children}
      </main>
   );
}

export function MainContent({ children, debugPageBackground }: { children: React.ReactNode; debugPageBackground: boolean }) {
   return (
      <PageBackgroundProvider>
         <MainContentInner debugPageBackground={debugPageBackground}>{children}</MainContentInner>
      </PageBackgroundProvider>
   );
}
