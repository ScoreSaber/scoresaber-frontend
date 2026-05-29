'use client';

import { Link } from '@tanstack/react-router';
import { Plug, Sparkles, UserCircle2 } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { buildSettingsHref, SETTINGS_TABS, type SettingsTab } from '@/modules/settings/settings-tabs';

const TAB_ICONS: Record<SettingsTab, React.ReactNode> = {
   account: <UserCircle2 className="size-3" />,
   connections: <Plug className="size-3" />,
   perks: <Sparkles className="size-3" />
};

export function SettingsNav({ activeTab }: { activeTab: SettingsTab }) {
   const t = useTranslations();
   return (
      <Tabs value={activeTab}>
         <TabsList variant="pill">
            {SETTINGS_TABS.map((tab) => (
               <TabsTrigger key={tab} value={tab} asChild>
                  <Link to={buildSettingsHref(tab)} resetScroll={false}>
                     {TAB_ICONS[tab]}
                     {tab === 'account'
                        ? t('settings.tabs.account')
                        : tab === 'connections'
                          ? t('settings.tabs.connections')
                          : t('settings.tabs.perks')}
                  </Link>
               </TabsTrigger>
            ))}
         </TabsList>
      </Tabs>
   );
}
