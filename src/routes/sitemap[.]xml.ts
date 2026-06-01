import { createFileRoute } from '@tanstack/react-router';

import { absoluteSiteUrl } from '@/shared/seo/metadata';

const sitemapPaths = ['/maps', '/rankings', '/ranking/requests', '/quest', '/team', '/legal/privacy', '/legal/cookies-policy', '/legal/copyright'];

export const Route = createFileRoute('/sitemap.xml')({
   server: {
      handlers: {
         GET: () => getSitemapXml()
      }
   }
});

function getSitemapXml() {
   const urls = sitemapPaths.map((path) => `   <url><loc>${absoluteSiteUrl(path)}</loc></url>`).join('\n');

   return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
      headers: {
         'Content-Type': 'application/xml; charset=utf-8',
         'Cache-Control': 'public, max-age=3600'
      }
   });
}
