export const siteAuthCookieMaxAge = 30 * 24 * 60 * 60;

export function getSiteAuthCookieDomain(hostname: string) {
   return process.env.NODE_ENV === 'production' && (hostname === 'scoresaber.com' || hostname.endsWith('.scoresaber.com'))
      ? '.scoresaber.com'
      : undefined;
}
