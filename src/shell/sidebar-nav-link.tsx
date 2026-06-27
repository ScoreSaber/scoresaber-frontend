import type { ReactNode } from 'react';

import type { AppNavRoute } from '@/shell/nav-data';
import { NavLink as PersistedNavLink } from '@/shell/nav-link';

function SidebarNavLink({
   route,
   children,
   className,
   external,
   href,
   onNavigateAction
}: {
   route?: AppNavRoute;
   children: ReactNode;
   className: string;
   external?: boolean;
   href?: string;
   onNavigateAction?: () => void;
}) {
   if (external) {
      return (
         <a href={href ?? '#'} target="_blank" rel="noreferrer" className={className} onClick={onNavigateAction}>
            {children}
         </a>
      );
   }

   return (
      <PersistedNavLink route={route ?? 'home'} className={className} onClick={onNavigateAction}>
         {children}
      </PersistedNavLink>
   );
}

export { SidebarNavLink };
