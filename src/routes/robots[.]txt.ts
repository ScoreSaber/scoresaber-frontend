import { createFileRoute } from '@tanstack/react-router';

import { publicCacheControl } from '@/shared/cache-control';
import { absoluteSiteUrl } from '@/shared/seo/metadata';

export const Route = createFileRoute('/robots.txt')({
   server: {
      handlers: {
         GET: () => getRobotsTxt()
      }
   }
});

function getRobotsTxt() {
   return new Response(
      [
         'User-agent: *',
         'Allow: /',
         'Disallow: /auth/',
         'Disallow: /settings/',
         'Disallow: /health',
         `Sitemap: ${absoluteSiteUrl('/sitemap.xml')}`,
         ''
      ].join('\n'),
      {
         headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': publicCacheControl({ maxAge: 3600, sMaxAge: 3600, staleWhileRevalidate: 86400 })
         }
      }
   );
}
