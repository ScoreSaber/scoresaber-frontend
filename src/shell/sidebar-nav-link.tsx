import type { ReactNode } from 'react';

import type { AppNavRoute } from '@/shell/nav-data';
import { NavLink as PersistedNavLink } from '@/shell/nav-link';

type SidebarNavLinkProps = {
   children: ReactNode;
   className: string;
   onNavigateAction?: () => void;
} & ({ external: true; href: string } | { external?: false; route: AppNavRoute });

function SidebarNavLink(props: SidebarNavLinkProps) {
   const { children, className, onNavigateAction } = props;

   if (props.external) {
      return (
         <a href={props.href} target="_blank" rel="noreferrer" className={className} onClick={onNavigateAction}>
            {children}
         </a>
      );
   }

   return (
      <PersistedNavLink route={props.route} className={className} onClick={onNavigateAction}>
         {children}
      </PersistedNavLink>
   );
}

export { SidebarNavLink };
