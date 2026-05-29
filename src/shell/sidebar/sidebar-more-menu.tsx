'use client';

import { useEffect, useState, useTransition } from 'react';

import { getRouteApi, useRouter } from '@tanstack/react-router';
import { Book, ExternalLink, Loader2, LogOut, Settings, Shield } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

import { useAuth } from '@/modules/auth';
import { logout } from '@/modules/auth/actions/member';
import { githubLink } from '@/shell/nav-data';
import { SidebarAppSettings } from '@/shell/sidebar/sidebar-app-settings';

const privacyRoute = getRouteApi('/legal/privacy');
const settingsAccountRoute = getRouteApi('/settings/account');

type SidebarMoreMenuProps = {
   trigger: React.ReactNode;
   side?: 'top' | 'right' | 'bottom' | 'left';
   align?: 'start' | 'center' | 'end';
};

export function SidebarMoreMenu({ trigger, side = 'top', align = 'end' }: SidebarMoreMenuProps) {
   const { user } = useAuth();
   const router = useRouter();
   const [mounted, setMounted] = useState(false);
   const [open, setOpen] = useState(false);
   const [isLanguageOpen, setIsLanguageOpen] = useState(false);
   const [pending, startTransition] = useTransition();
   const tNav = useTranslations();
   const tSidebar = useTranslations();
   const menuActionClass = 'text-muted-foreground h-8 w-full cursor-pointer justify-start rounded-md px-2.5 text-[13px]';

   useEffect(() => {
      setMounted(true);
   }, []);

   function handleLogout() {
      startTransition(async () => {
         await logout();
         await router.invalidate();
      });
   }

   function handleOpenChange(nextOpen: boolean) {
      if (!nextOpen && isLanguageOpen) {
         return;
      }

      setOpen(nextOpen);

      if (!nextOpen) {
         setIsLanguageOpen(false);
      }
   }

   // avoid radix id drift on fresh loads:
   // https://github.com/radix-ui/primitives/issues/3700
   // https://github.com/shadcn-ui/ui/issues/1018
   if (!mounted) {
      return <>{trigger}</>;
   }

   return (
      <Popover open={open} onOpenChange={handleOpenChange}>
         <PopoverTrigger asChild>{trigger}</PopoverTrigger>
         <PopoverContent
            side={side}
            align={align}
            collisionPadding={16}
            onInteractOutside={(event) => {
               if (isLanguageOpen) {
                  event.preventDefault();
               }
            }}
            className="w-68 p-0 sm:w-70"
         >
            <div className="flex flex-col gap-3 p-3">
               <SidebarAppSettings isLanguageOpen={isLanguageOpen} onLanguageOpenChangeAction={setIsLanguageOpen} />

               <Separator />
               <div className="flex flex-col gap-1">
                  <Button asChild variant="ghost" size="sm" className={menuActionClass}>
                     <a href="https://docs.scoresaber.com" target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
                        <span className="flex min-w-0 items-center gap-2">
                           <Book data-icon />
                           <span className="truncate">{tNav('nav.apiDocs')}</span>
                        </span>
                        <ExternalLink data-icon className="ml-auto" aria-hidden="true" />
                     </a>
                  </Button>
                  <Button asChild variant="ghost" size="sm" className={menuActionClass}>
                     <a href={githubLink.href} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
                        <span className="flex min-w-0 items-center gap-2">
                           <githubLink.Icon data-icon className="fill-current" aria-hidden="true" />
                           <span className="truncate">{githubLink.label}</span>
                        </span>
                        <ExternalLink data-icon className="ml-auto" aria-hidden="true" />
                     </a>
                  </Button>
                  <Button asChild variant="ghost" size="sm" className={menuActionClass}>
                     <privacyRoute.Link onClick={() => setOpen(false)}>
                        <span className="flex min-w-0 items-center gap-2">
                           <Shield data-icon />
                           <span className="truncate">{tSidebar('sidebar.privacyPolicy')}</span>
                        </span>
                     </privacyRoute.Link>
                  </Button>
               </div>
            </div>

            {user && (
               <>
                  <Separator />
                  <div className="flex flex-col gap-1 p-2">
                     <Button asChild variant="ghost" size="sm" className={menuActionClass}>
                        <settingsAccountRoute.Link onClick={() => setOpen(false)}>
                           <Settings data-icon />
                           {tSidebar('sidebar.settings')}
                        </settingsAccountRoute.Link>
                     </Button>
                     <Button variant="ghost" size="sm" onClick={handleLogout} disabled={pending} className={menuActionClass}>
                        {pending ? <Loader2 data-icon className="animate-spin" /> : <LogOut data-icon />}
                        {tSidebar('sidebar.logOut')}
                     </Button>
                  </div>
               </>
            )}
         </PopoverContent>
      </Popover>
   );
}
