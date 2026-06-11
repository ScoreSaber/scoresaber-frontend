'use client';

import { Link } from '@tanstack/react-router';
import { CodeXml, Plug, Sparkles, UserCircle2 } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useAuth } from '@/modules/auth';
import { buildSettingsLocation, SETTINGS_TABS, type SettingsTab } from '@/modules/settings/settings-tabs';
import Permissions from '@/shared/permissions';

const TAB_ICONS: Record<SettingsTab, React.ReactNode> = {
   account: <UserCircle2 className="size-3" />,
   connections: <Plug className="size-3" />,
   perks: <Sparkles className="size-3" />,
   developer: <CodeXml className="size-3" />
};

export function SettingsNav({ activeTab }: { activeTab: SettingsTab }) {
   const t = useTranslations();
   const { user } = useAuth();
   const showDeveloper =
      activeTab === 'developer' || (!!user && Permissions.checkPermissionNumber(user.permissions, Permissions.security.EXTERNAL_DEV));
   const visibleTabs = SETTINGS_TABS.filter((tab) => tab !== 'developer' || showDeveloper);

   return (
      <Tabs value={activeTab}>
         <TabsList variant="pill">
            {visibleTabs.map((tab) => (
               <TabsTrigger key={tab} value={tab} asChild>
                  <Link {...buildSettingsLocation(tab)} resetScroll={false}>
                     {TAB_ICONS[tab]}
                     {tab === 'account'
                        ? t('settings.tabs.account')
                        : tab === 'connections'
                          ? t('settings.tabs.connections')
                          : tab === 'perks'
                            ? t('settings.tabs.perks')
                            : t('settings.tabs.developer')}
                  </Link>
               </TabsTrigger>
            ))}
         </TabsList>
      </Tabs>
   );
}
