export const MOBILE_VIEWPORT_MEDIA_QUERY = '(max-width: 767px)';

export function isMobileViewport() {
   if (typeof window === 'undefined') return false;
   return window.matchMedia(MOBILE_VIEWPORT_MEDIA_QUERY).matches;
}
