'use client';

import { useTranslations } from 'use-intl';

import { Separator } from '@/components/ui/separator';

import { SettingsNav } from '@/modules/settings/settings-nav';
import type { SettingsTab } from '@/modules/settings/settings-tabs';

export function SettingsShell({ activeTab, children }: { activeTab: SettingsTab; children: React.ReactNode }) {
   const t = useTranslations('settings');
   return (
      <div className="relative flex-1 overflow-hidden">
         <div className="app-container relative z-10 p-4 md:p-8">
            <div className="flex max-w-6xl flex-col gap-4">
               <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{t('pageTitle')}</h1>
               <SettingsNav activeTab={activeTab} />
               <Separator variant="fade" />
               <div className="min-w-0">{children}</div>
            </div>
         </div>
      </div>
   );
}
