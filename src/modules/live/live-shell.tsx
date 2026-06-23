'use client';

import { LiveNav } from '@/modules/live/live-nav';
import type { LiveTab } from '@/modules/live/live-tabs';

export function LiveShell({
   tournamentId,
   title,
   activeTab,
   children
}: {
   tournamentId: string;
   title: string;
   activeTab: LiveTab;
   children: React.ReactNode;
}) {
   return (
      <div className="relative z-10 flex w-full flex-col gap-4 px-4 py-4 md:px-8 md:py-8">
         <div className="grid w-full max-w-none items-start gap-6 md:grid-cols-[13rem_minmax(0,1fr)]">
            <aside className="flex min-w-0 flex-col gap-4">
               <h1 className="truncate text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
               <LiveNav tournamentId={tournamentId} activeTab={activeTab} />
            </aside>
            <main className="min-w-0">{children}</main>
         </div>
      </div>
   );
}
