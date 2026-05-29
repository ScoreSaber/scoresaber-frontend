'use client';

import { useTranslations } from 'use-intl';

import { LanguageSwitcher } from '@/shell/sidebar/language-switcher';
import { SidebarThemeSelector } from '@/shell/sidebar/sidebar-theme-selector';

type SidebarAppSettingsProps = {
   isLanguageOpen: boolean;
   onLanguageOpenChangeAction: (open: boolean) => void;
};

export function SidebarAppSettings({ isLanguageOpen, onLanguageOpenChangeAction }: SidebarAppSettingsProps) {
   const tCommon = useTranslations();

   return (
      <div className="flex flex-col gap-3">
         <SidebarThemeSelector />
         <div className="flex flex-col gap-1.5">
            <p className="text-foreground text-xs font-medium">{tCommon('common.language')}</p>
            <LanguageSwitcher
               className="h-8 rounded-md px-2.5 py-1.5 text-[13px]"
               contentClassName="min-w-34"
               open={isLanguageOpen}
               onOpenChangeAction={onLanguageOpenChangeAction}
            />
         </div>
      </div>
   );
}
