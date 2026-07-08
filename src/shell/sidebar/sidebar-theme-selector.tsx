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
            <TabsList variant="compact-pill">
               {themeOptions.map((option) => (
                  <TabsTrigger key={option} value={option} className="px-0">
                     {option === 'light' ? tSidebar('sidebar.light') : option === 'dark' ? tSidebar('sidebar.dark') : tSidebar('sidebar.system')}
                  </TabsTrigger>
               ))}
            </TabsList>
         </Tabs>
      </div>
   );
}
