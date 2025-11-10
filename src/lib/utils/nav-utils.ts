export interface NavItem {
   href: string;
   icon: string;
   label: string;
   ariaLabel?: string;
}

export interface SocialLink {
   href: string;
   icon: string;
   title: string;
}

export const navItems = [
   { href: '/leaderboards', label: 'Maps', icon: 'fa fa-map', ariaLabel: 'Maps' },
   { href: '/rankings', label: 'Rankings', icon: 'fa fa-medal', ariaLabel: 'Rankings' },
   { href: '/ranking/requests', label: 'Rank Requests', icon: 'fa fa-list', ariaLabel: 'Rank Requests' },
   { href: '/scores', label: 'Score Feed', icon: 'fa fa-rss', ariaLabel: 'Score Feed' }
] satisfies readonly NavItem[];

export const socialLinks = [
   { href: 'https://discord.scoresaber.com', icon: 'fab fa-discord', title: 'Join our Discord!' },
   { href: 'https://patreon.com/scoresaber', icon: 'fab fa-patreon', title: 'Support us on Patreon ❤️' },
   { href: 'https://x.com/scoresaber', icon: 'fab fa-x-twitter', title: 'Follow us on X' }
] satisfies readonly SocialLink[];

export function isCurrent(href: string, currentPath: string): boolean {
   if (!href) {
      return false;
   }

   if (href === '/') {
      return currentPath === '/';
   }

   return currentPath === href || currentPath.startsWith(`${href}/`);
}

export function lockBodyScroll(): void {
   if (typeof document === 'undefined') {
      return;
   }
   document.body.style.overflow = 'hidden';
   document.body.style.position = 'fixed';
   document.body.style.width = '100%';
}

export function unlockBodyScroll(): void {
   if (typeof document === 'undefined') {
      return;
   }
   document.body.style.overflow = '';
   document.body.style.position = '';
   document.body.style.width = '';
}
