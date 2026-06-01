import { createFileRoute } from '@tanstack/react-router';

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
            'Cache-Control': 'public, max-age=3600'
         }
      }
   );
}
