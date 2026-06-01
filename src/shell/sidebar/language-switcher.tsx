'use client';

import { useTransition } from 'react';

import { useRouter } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { Languages } from 'lucide-react';
import { useLocale } from 'use-intl';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import type { Locale } from '@/i18n/config';
import { localeNames } from '@/i18n/config';
import { cn } from '@/shared/format/helpers';
import { setLocale } from '@/shared/i18n/actions/public';
import { useSidebar } from '@/shell/sidebar-provider';

const navLinkClass = 'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors';
const inactiveClass = 'text-muted-foreground hover:bg-accent/50 hover:text-primary';

type LanguageSwitcherProps = {
   className?: string;
   contentClassName?: string;
   open?: boolean;
   onOpenChangeAction?: (open: boolean) => void;
};

export function LanguageSwitcher({ className, contentClassName, open, onOpenChangeAction }: LanguageSwitcherProps) {
   const locale = useLocale();
   const router = useRouter();
   const { visibleLocales } = useSidebar();
   const setLocaleAction = useServerFn(setLocale);
   const [pending, startTransition] = useTransition();

   function handleChange(value: string) {
      startTransition(async () => {
         await setLocaleAction({ data: value });
         router.invalidate();
      });
   }

   return (
      <Select value={locale} onValueChange={handleChange} disabled={pending} open={open} onOpenChange={onOpenChangeAction}>
         <SelectTrigger
            className={cn(
               navLinkClass,
               inactiveClass,
               "dark:hover:bg-accent/50 h-auto w-full justify-start border-none bg-transparent shadow-none focus:ring-0 *:data-[slot=select-value]:flex-1 dark:bg-transparent [&_svg:not([class*='text-'])]:text-current",
               className
            )}
         >
            <Languages className="size-4 shrink-0 text-current" />
            <SelectValue />
         </SelectTrigger>
         <SelectContent className={contentClassName}>
            {visibleLocales.map((loc: Locale) => (
               <SelectItem key={loc} value={loc} className="cursor-pointer">
                  {localeNames[loc]}
               </SelectItem>
            ))}
         </SelectContent>
      </Select>
   );
}
