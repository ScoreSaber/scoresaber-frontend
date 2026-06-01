'use client';

import { ExternalLink } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';

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
            <div className="flex items-center justify-between gap-2">
               <p className="text-foreground text-xs font-medium">{tCommon('common.language')}</p>
               <Button asChild variant="ghost" size="xs" className="text-muted-foreground h-6 cursor-pointer px-1.5 text-[11px] font-medium">
                  <a
                     href="https://crowdin.com/project/scoresaber-website"
                     target="_blank"
                     rel="noreferrer"
                     aria-label={tCommon('sidebar.helpTranslateAria')}
                  >
                     <span>{tCommon('sidebar.helpTranslate')}</span>
                     <ExternalLink className="size-3" aria-hidden="true" />
                  </a>
               </Button>
            </div>
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
