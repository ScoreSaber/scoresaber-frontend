'use client';

import { Link } from '@tanstack/react-router';
import { Sparkles, Video } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { buildSettingsPerksLocation, PERKS_SUB_TABS, type PerksSubTab } from '@/modules/settings/settings-tabs';

const TAB_ICONS: Record<PerksSubTab, React.ReactNode> = {
   overview: <Sparkles className="size-3" />,
   replays: <Video className="size-3" />
};

export function PerksSubNav({ activeSubTab, children }: { activeSubTab: PerksSubTab; children: React.ReactNode }) {
   const t = useTranslations();

   return (
      <Tabs value={activeSubTab} orientation="vertical" className="flex-col gap-4 md:flex-row md:gap-6">
         <TabsList variant="sidebar" className="md:w-44">
            {PERKS_SUB_TABS.map((tab) => (
               <TabsTrigger key={tab} value={tab} className="h-auto min-h-8 text-left leading-snug whitespace-normal" asChild>
                  <Link {...buildSettingsPerksLocation(tab)} resetScroll={false}>
                     {TAB_ICONS[tab]}
                     <span className="min-w-0 break-words">
                        {tab === 'overview' ? t('settings.perks.tabs.overview') : t('settings.perks.tabs.replays')}
                     </span>
                  </Link>
               </TabsTrigger>
            ))}
         </TabsList>
         <div className="min-w-0 flex-1">{children}</div>
      </Tabs>
   );
}
