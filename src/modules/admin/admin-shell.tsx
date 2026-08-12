'use client';

import { Link, useRouterState } from '@tanstack/react-router';
import { Medal, Blocks } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function AdminShell({ children }: { children: React.ReactNode }) {
   const t = useTranslations('admin');
   const pathname = useRouterState({ select: (state) => state.location.pathname });
   const activeTab = pathname.startsWith('/admin/versions') ? 'versions' : 'badges';

   return (
      <div className="relative flex-1 overflow-hidden">
         <div className="app-container relative z-10 p-4 md:p-8">
            <div className="flex max-w-6xl flex-col gap-4">
               <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{t('title')}</h1>
               <Tabs value={activeTab}>
                  <TabsList variant="pill">
                     <TabsTrigger value="badges" asChild>
                        <Link to="/admin/badges" resetScroll={false}>
                           <Medal />
                           {t('badges.title')}
                        </Link>
                     </TabsTrigger>
                     <TabsTrigger value="versions" asChild>
                        <Link to="/admin/versions" resetScroll={false}>
                           <Blocks />
                           {t('versions.title')}
                        </Link>
                     </TabsTrigger>
                  </TabsList>
               </Tabs>
               <div className="min-w-0 border-t pt-4">{children}</div>
            </div>
         </div>
      </div>
   );
}
