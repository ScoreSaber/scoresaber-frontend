'use client';

import { useEffect, useState } from 'react';

import { getRouteApi } from '@tanstack/react-router';
import { useLocation } from '@tanstack/react-router';
import { ChevronLeft, ChevronRight, CircleEllipsis, LogIn, Search } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { Button } from '@/components/ui/button';
import { Kbd } from '@/components/ui/kbd';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { useAuth } from '@/modules/auth';
import { PlayerAvatar } from '@/modules/player/shared/player-avatar';
import { useOmniSearch } from '@/modules/search';
import { Image } from '@/shared/components/image';
import { cn } from '@/shared/format/helpers';
import { isNavActive, navItems, secondaryItems } from '@/shell/nav-data';
import { NavLink } from '@/shell/nav-link';
import { activeClass, disabledClass, inactiveClass, navLinkClass, SidebarNav } from '@/shell/sidebar-nav';
import { useSidebar } from '@/shell/sidebar-provider';
import { SidebarMoreMenu } from '@/shell/sidebar/sidebar-more-menu';

const homeRoute = getRouteApi('/');
const loginRoute = getRouteApi('/login');
const playerRoute = getRouteApi('/u/$playerId');

function CollapsedSidebar({ onExpand }: { onExpand: () => void }) {
   const location = useLocation();
   const pathname = location.pathname;
   const searchParams = new URLSearchParams(location.searchStr);
   const { user } = useAuth();
   const { setOpen: setSearchOpen } = useOmniSearch();
   const tNav = useTranslations();
   const tSidebar = useTranslations();

   const iconLink = cn(navLinkClass, inactiveClass, 'justify-center px-0');
   const search = searchParams.toString();
   const currentPath = search ? `${pathname}?${search}` : pathname;

   function navLabel(key: string) {
      return key === 'home'
         ? tNav('nav.home')
         : key === 'search'
           ? tNav('nav.search')
           : key === 'maps'
             ? tNav('nav.maps')
             : key === 'rankings'
               ? tNav('nav.rankings')
               : key === 'rankRequests'
                 ? tNav('nav.rankRequests')
                 : key === 'requests'
                   ? tNav('nav.requests')
                   : key === 'wiki'
                     ? tNav('nav.wiki')
                     : key === 'feedbackHub'
                       ? tNav('nav.feedbackHub')
                       : key === 'questInstaller'
                         ? tNav('nav.questInstaller')
                         : key === 'team'
                           ? tNav('nav.team')
                           : tNav('nav.apiDocs');
   }

   return (
      <>
         {/* logo */}
         <div className="flex justify-center p-3">
            <homeRoute.Link aria-label="ScoreSaber Home">
               <Image src="/scoresaber.svg" width={24} height={24} alt={tSidebar('sidebar.scoreSaberLogoAlt')} priority />
            </homeRoute.Link>
         </div>

         <Separator />

         {/* nav */}
         <nav className="flex flex-1 flex-col gap-1 overflow-x-hidden overflow-y-auto p-2">
            <Tooltip>
               <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => setSearchOpen(true)} className={cn(iconLink, 'w-full cursor-pointer')}>
                     <Search data-icon />
                  </Button>
               </TooltipTrigger>
               <TooltipContent side="right">{tNav('nav.search')}</TooltipContent>
            </Tooltip>
            {navItems.map((item) => (
               <Tooltip key={item.key}>
                  <TooltipTrigger asChild>
                     {item.disabled ? (
                        <span className={cn(navLinkClass, disabledClass, 'justify-center px-0')} aria-disabled="true">
                           {item.icon}
                        </span>
                     ) : (
                        <NavLink
                           route={item.route}
                           className={cn(navLinkClass, isNavActive(pathname, item.route) ? activeClass : inactiveClass, 'justify-center px-0')}
                        >
                           {item.icon}
                        </NavLink>
                     )}
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.disabled ? tNav('nav.comingSoon') : navLabel(item.key)}</TooltipContent>
               </Tooltip>
            ))}

            <Separator className="my-2" />

            {secondaryItems.map((item) => (
               <Tooltip key={item.key}>
                  <TooltipTrigger asChild>
                     {item.external ? (
                        <a href={item.href} target="_blank" rel="noreferrer" className={cn(navLinkClass, inactiveClass, 'justify-center px-0')}>
                           {item.icon}
                        </a>
                     ) : (
                        <NavLink
                           route={item.route}
                           className={cn(navLinkClass, isNavActive(pathname, item.route) ? activeClass : inactiveClass, 'justify-center px-0')}
                        >
                           {item.icon}
                        </NavLink>
                     )}
                  </TooltipTrigger>
                  <TooltipContent side="right">{navLabel(item.key)}</TooltipContent>
               </Tooltip>
            ))}
         </nav>

         <Separator />

         {/* bottom */}
         <div className="flex flex-col gap-1 p-2">
            {user ? (
               <Tooltip>
                  <TooltipTrigger asChild>
                     <playerRoute.Link params={{ playerId: user.id }} search={{ page: 1, sort: 'top' }} className={iconLink}>
                        <PlayerAvatar src={user.avatar} playerId={user.id} alt={user.name} width={24} height={24} className="size-6 rounded-md" />
                     </playerRoute.Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{user.name}</TooltipContent>
               </Tooltip>
            ) : (
               <Tooltip>
                  <TooltipTrigger asChild>
                     <Button variant="ghost" asChild className={cn(iconLink, 'cursor-pointer')}>
                        <loginRoute.Link search={pathname === '/login' ? {} : { redirectTo: currentPath }}>
                           <LogIn data-icon />
                        </loginRoute.Link>
                     </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">{tSidebar('sidebar.logIn')}</TooltipContent>
               </Tooltip>
            )}
            <div className="flex justify-center">
               <SidebarMoreMenu
                  side="top"
                  trigger={
                     <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-muted-foreground hover:text-foreground rounded-full"
                        aria-label={tSidebar('sidebar.more')}
                     >
                        <CircleEllipsis data-icon />
                     </Button>
                  }
               />
            </div>
            <Tooltip>
               <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={onExpand} className={cn(iconLink, 'w-full cursor-pointer')}>
                     <ChevronRight data-icon />
                  </Button>
               </TooltipTrigger>
               <TooltipContent side="right">{tSidebar('sidebar.expand')}</TooltipContent>
            </Tooltip>
         </div>
      </>
   );
}

function ExpandedSidebar({ onCollapse }: { onCollapse: () => void }) {
   const tSidebar = useTranslations();
   const [isMac, setIsMac] = useState(false);
   const [mounted, setMounted] = useState(false);

   useEffect(() => {
      setMounted(true);
      setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent));
   }, []);

   const shortcut = mounted && !isMac ? 'Ctrl+Shift+S' : '⌘⇧S';

   return (
      <>
         <SidebarNav />
         <div className="px-3 pb-3">
            <Button variant="ghost" size="sm" onClick={onCollapse} className={cn(navLinkClass, inactiveClass, 'w-full justify-start')}>
               <ChevronLeft data-icon />
               <span className="flex-1 text-left">{tSidebar('sidebar.collapse')}</span>
               <Kbd>{shortcut}</Kbd>
            </Button>
         </div>
      </>
   );
}

export function Sidebar() {
   const { collapsed, toggle } = useSidebar();

   return (
      <aside
         className={cn(
            'bg-background fixed top-0 left-0 z-40 hidden h-screen flex-col border-r transition-[width] duration-200 ease-in-out lg:flex',
            collapsed ? 'w-14' : 'w-61 3xl:w-68'
         )}
      >
         {collapsed ? <CollapsedSidebar onExpand={toggle} /> : <ExpandedSidebar onCollapse={toggle} />}
      </aside>
   );
}
