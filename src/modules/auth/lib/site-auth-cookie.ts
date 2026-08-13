export const siteAuthCookieMaxAge = 30 * 24 * 60 * 60;

export function getSiteAuthCookieDomain(hostname: string) {
   if (process.env.NODE_ENV === 'production' && (hostname === 'scoresaber.com' || hostname.endsWith('.scoresaber.com'))) {
      return '.scoresaber.com';
   }

   if (process.env.NODE_ENV !== 'production') {
      if (hostname === 'scoresaber.local' || hostname.endsWith('.scoresaber.local')) return '.scoresaber.local';
      if (hostname === 'scoresaber.localhost' || hostname.endsWith('.scoresaber.localhost')) {
         return '.scoresaber.localhost';
      }
   }

   return undefined;
}
