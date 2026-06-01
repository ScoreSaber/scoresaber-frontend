import '@/styles/globals.css';

import type { ReactNode } from 'react';

import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getCookie } from '@tanstack/react-start/server';
import { IntlProvider } from 'use-intl';

import { env } from '@/env';
import { getLocale, getMessages, getVisibleLocales } from '@/i18n/server';
import type { RouterContext } from '@/router';
import { api } from '@/shared/api/server-api';
import { cn } from '@/shared/format/helpers';
import { optionalApi } from '@/shared/result/api';
import { absoluteSiteUrl, SITE_DESCRIPTION, SITE_NAME, buildSeoHead } from '@/shared/seo/metadata';
import { parseServerTheme, THEME_COOKIE_NAME, THEME_MEDIA_QUERY, THEME_STORAGE_KEY } from '@/shared/ui-adjacent/theme';
import { AppShell } from '@/shell/app-shell';

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
type RootMessages = Record<string, JsonValue>;

const themeInitScript = `(function(){var theme='system';try{var stored=localStorage.getItem('${THEME_STORAGE_KEY}');if(stored==='light'||stored==='dark'||stored==='system')theme=stored}catch(e){}var resolved=theme==='system'?(window.matchMedia('${THEME_MEDIA_QUERY}').matches?'dark':'light'):theme;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);root.style.colorScheme=resolved;try{document.cookie='${THEME_COOKIE_NAME}='+theme+'; Path=/; Max-Age=31536000; SameSite=Lax'}catch(e){}})()`;
const criticalPaintStyles = `@layer theme,base,components,utilities;@layer base{*,::after,::before,::backdrop,::file-selector-button{border-color:var(--border,hsl(0 0% 20%))}body{background:var(--background,hsl(240 10% 4%));color:var(--foreground,hsl(60 7% 90%))}}@layer utilities{.app-container{margin-inline:auto;padding-inline:2rem;max-width:1300px}}`;
const chunkLoadRecoveryScript = `(function(){var key='scoresaber:chunk-reload';var retryMs=60000;function message(error){return error&&typeof error.message==='string'?error.message:String(error||'')}function isChunkLoadError(error){var text=message(error);return text.indexOf('Failed to fetch dynamically imported module')!==-1||text.indexOf('Importing a module script failed')!==-1||text.indexOf('Unable to preload CSS')!==-1}function shouldReload(){try{var now=Date.now();var previous=JSON.parse(sessionStorage.getItem(key)||'null');if(previous&&previous.href===location.href&&now-previous.time<retryMs)return false;sessionStorage.setItem(key,JSON.stringify({href:location.href,time:now}));return true}catch(e){return false}}function reloadOnce(){if(shouldReload())location.reload()}window.addEventListener('vite:preloadError',function(event){if(!isChunkLoadError(event.payload))return;event.preventDefault();reloadOnce()});window.addEventListener('unhandledrejection',function(event){if(!isChunkLoadError(event.reason))return;event.preventDefault();reloadOnce()});window.addEventListener('error',function(event){if(!isChunkLoadError(event.error||event.message))return;event.preventDefault();reloadOnce()})})()`;

const getRootData = createServerFn({ method: 'GET' }).handler(async () => {
   const token = getCookie('token');
   const user = token && token !== 'null' ? await optionalApi(api.user.userControllerGetMe().then((r) => r.data)) : null;
   const initialTheme = parseServerTheme(getCookie(THEME_COOKIE_NAME)) ?? null;
   const locale = await getLocale();
   const messages = (await getMessages()) as RootMessages;
   const visibleLocales = getVisibleLocales();

   return {
      user,
      initialTheme,
      locale,
      messages,
      visibleLocales,
      debugBreakpoints: env.DEBUG_BREAKPOINTS,
      debugPageBackground: env.DEBUG_PAGE_BACKGROUND,
      debugReactScan: env.NODE_ENV !== 'production' && env.DEBUG_REACT_SCAN
   };
});

export const Route = createRootRouteWithContext<RouterContext>()({
   head: () => ({
      meta: [
         { charSet: 'utf-8' },
         { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
         { name: 'theme-color', content: '#facc15' },
         { name: 'application-name', content: SITE_NAME },
         { name: 'apple-mobile-web-app-title', content: SITE_NAME },
         ...buildSeoHead().meta,
         {
            'script:ld+json': {
               '@context': 'https://schema.org',
               '@type': 'WebSite',
               name: SITE_NAME,
               url: absoluteSiteUrl('/'),
               description: SITE_DESCRIPTION
            }
         }
      ],
      links: [
         { rel: 'icon', href: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
         { rel: 'icon', href: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
         { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
         { rel: 'manifest', href: '/site.webmanifest' },
         { rel: 'preload', href: '/fonts/geist-latin-400-normal.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
         { rel: 'preload', href: '/fonts/geist-latin-500-normal.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
         { rel: 'preload', href: '/fonts/geist-latin-600-normal.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
         { rel: 'preload', href: '/fonts/geist-latin-700-normal.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
         { rel: 'preload', href: '/fonts/GeistPixel-Square.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
         { rel: 'preconnect', href: 'https://cdn.scoresaber.com' }
      ]
   }),
   loader: () => getRootData(),
   component: RootComponent
});

function RootComponent() {
   const data = Route.useLoaderData();
   const { queryClient } = Route.useRouteContext();

   return (
      <RootDocument locale={data.locale} initialTheme={data.initialTheme} debugReactScan={data.debugReactScan}>
         <IntlProvider locale={data.locale} messages={data.messages} timeZone="UTC">
            <AppShell
               initialUser={data.user}
               messages={data.messages}
               visibleLocales={data.visibleLocales}
               queryClient={queryClient}
               debugBreakpoints={data.debugBreakpoints}
               debugPageBackground={data.debugPageBackground}
            >
               <Outlet />
            </AppShell>
         </IntlProvider>
      </RootDocument>
   );
}

function RootDocument({
   locale,
   initialTheme,
   debugReactScan,
   children
}: {
   locale: string;
   initialTheme: string | null;
   debugReactScan: boolean;
   children: ReactNode;
}) {
   return (
      <html
         lang={locale}
         className={initialTheme ?? undefined}
         style={initialTheme ? { colorScheme: initialTheme } : undefined}
         suppressHydrationWarning
      >
         <head>
            <script
               id="chunk-load-recovery"
               data-cfasync="false"
               dangerouslySetInnerHTML={{ __html: chunkLoadRecoveryScript }}
               suppressHydrationWarning
            />
            <script id="theme-init" dangerouslySetInnerHTML={{ __html: themeInitScript }} suppressHydrationWarning />
            <style id="critical-paint" dangerouslySetInnerHTML={{ __html: criticalPaintStyles }} />
            <HeadContent />
            {debugReactScan && <script src="https://unpkg.com/react-scan/dist/auto.global.js" crossOrigin="anonymous" />}
         </head>
         <body className={cn('bg-background relative min-h-screen font-sans antialiased')}>
            {children}
            <Scripts />
         </body>
      </html>
   );
}
