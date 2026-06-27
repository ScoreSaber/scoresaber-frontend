export const SEEN_HOME_COOKIE_NAME = 'seen-home';
export const SIDEBAR_COLLAPSED_COOKIE_NAME = 'sidebar-collapsed';
export const SIDEBAR_COOKIE_MAX_AGE = 31536000;

export function parseSidebarCollapsedCookie(value: string | undefined) {
   if (value === 'true') return true;
   if (value === 'false') return false;
   return null;
}
