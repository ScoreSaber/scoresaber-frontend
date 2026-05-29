'use client';

import { useTranslations } from 'use-intl';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import type { Theme } from '@/shared/ui-adjacent/theme';
import { useTheme } from '@/shared/ui-adjacent/theme-provider';

const themeOptions: Theme[] = ['light', 'dark', 'system'];

export function SidebarThemeSelector() {
   const { theme, setTheme } = useTheme();
   const tSidebar = useTranslations();

   return (
      <div className="flex flex-col gap-1.5">
         <p className="text-foreground text-xs font-medium">{tSidebar('sidebar.appearance')}</p>
         <Tabs value={theme ?? 'system'} onValueChange={setTheme} className="gap-0">
            <TabsList className="bg-accent/25 h-auto w-full rounded-2xl border p-0.5">
               {themeOptions.map((option) => (
                  <TabsTrigger
                     key={option}
                     value={option}
                     className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground h-8 rounded-[0.8rem] border-transparent px-0 text-[13px] font-semibold shadow-none data-[state=active]:pointer-events-none data-[state=active]:border-transparent dark:data-[state=active]:border-transparent"
                  >
                     {option === 'light' ? tSidebar('sidebar.light') : option === 'dark' ? tSidebar('sidebar.dark') : tSidebar('sidebar.system')}
                  </TabsTrigger>
               ))}
            </TabsList>
         </Tabs>
      </div>
   );
}
