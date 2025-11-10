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

let scrollPosition = 0;
let scrollbarWidth = 0;
let headerHeight = 0;

export function lockBodyScroll(): void {
   if (typeof document === 'undefined' || typeof window === 'undefined') {
      return;
   }
   scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
   scrollPosition = window.scrollY || window.pageYOffset || 0;

   const header = document.querySelector('header');
   if (header) {
      headerHeight = header.offsetHeight;
   }

   if (header) {
      header.style.position = 'fixed';
      header.style.top = '0';
      header.style.left = '0';
      header.style.right = '0';
      header.style.zIndex = '100';
   }

   document.documentElement.style.overflow = 'hidden';
   document.documentElement.style.paddingRight = `${scrollbarWidth}px`;
   document.body.style.overflow = 'hidden';
   document.body.style.position = 'fixed';
   document.body.style.width = '100%';
   document.body.style.top = `-${scrollPosition}px`;
   document.body.style.paddingRight = `${scrollbarWidth}px`;

   const root = document.querySelector('.root');
   if (root) {
      (root as HTMLElement).style.paddingTop = `${headerHeight}px`;
   }
}

export function unlockBodyScroll(): void {
   if (typeof document === 'undefined' || typeof window === 'undefined') {
      return;
   }

   const root = document.querySelector('.root');
   if (root) {
      (root as HTMLElement).style.paddingTop = '';
   }

   const header = document.querySelector('header');

   if (header) {
      header.style.position = '';
      header.style.top = '';
      header.style.left = '';
      header.style.right = '';
      header.style.zIndex = '';
   }

   document.documentElement.style.overflow = '';
   document.documentElement.style.paddingRight = '';
   document.body.style.overflow = '';
   document.body.style.position = '';
   document.body.style.width = '';
   document.body.style.top = '';
   document.body.style.paddingRight = '';

   window.scrollTo(0, scrollPosition);
}
