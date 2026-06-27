export const siteAuthCookieMaxAge = 30 * 24 * 60 * 60;

export function getSiteAuthCookieDomain(hostname: string) {
   if (process.env.NODE_ENV === 'production' && (hostname === 'scoresaber.com' || hostname.endsWith('.scoresaber.com'))) {
      return '.scoresaber.com';
   }

   if (process.env.NODE_ENV !== 'production' && (hostname === 'scoresaber.local' || hostname.endsWith('.scoresaber.local'))) {
      return '.scoresaber.local';
   }

   return undefined;
}
