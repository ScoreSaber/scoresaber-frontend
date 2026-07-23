import '@/styles/globals.css';

import type { ReactNode } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';
import { createRootRouteWithContext, HeadContent, Outlet, Scripts, useLocation } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getCookie } from '@tanstack/react-start/server';
import { IntlProvider } from 'use-intl';
import { z } from 'zod';

import { env } from '@/env';
import { parseLocale, type Locale } from '@/i18n/config';
import { getLocale, getMessages, getVisibleLocales } from '@/i18n/server';
import { readAuthCookie } from '@/modules/auth/actions/session.server';
import { getHomeBswcPromo } from '@/modules/home/actions/bswc.server';
import { BswcLiveNotice } from '@/modules/home/bswc-promo-section';
import type { RouterContext } from '@/router';
import { api } from '@/shared/api/server-api';
import { cn } from '@/shared/format/helpers';
import {
   getRouteMessagesQueryKey,
   getRouteNamespaces,
   rootShellQueryKey,
   translationNamespaceSchema,
   type TranslationNamespace
} from '@/shared/i18n/route-namespaces';
import { QueryProvider } from '@/shared/query/query-provider';
import { optionalApi } from '@/shared/result/api';
import { absoluteSiteUrl, SITE_DESCRIPTION, SITE_NAME, buildSeoHead } from '@/shared/seo/metadata';
import { parseServerTheme, THEME_COOKIE_NAME, THEME_MEDIA_QUERY, THEME_STORAGE_KEY } from '@/shared/ui-adjacent/theme';
import { AppShell } from '@/shell/app-shell';
import { parseSidebarCollapsedCookie, SIDEBAR_COLLAPSED_COOKIE_NAME } from '@/shell/sidebar-state';

const themeInitScript = `(function(){var theme='system';try{var stored=localStorage.getItem('${THEME_STORAGE_KEY}');if(stored==='light'||stored==='dark'||stored==='system')theme=stored}catch(e){}var resolved=theme==='system'?(window.matchMedia('${THEME_MEDIA_QUERY}').matches?'dark':'light'):theme;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);root.style.colorScheme=resolved;try{document.cookie='${THEME_COOKIE_NAME}='+theme+'; Path=/; Max-Age=31536000; SameSite=Lax'}catch(e){}})()`;
const criticalPaintStyles = `@layer theme,base,components,utilities;@layer base{*,::after,::before,::backdrop,::file-selector-button{border-color:var(--border,hsl(0 0% 20%))}body{background:var(--background,hsl(240 10% 4%));color:var(--foreground,hsl(60 7% 90%))}}@layer utilities{.app-container{margin-inline:auto;padding-inline:2rem;max-width:1300px}}`;
const optionalSearchString = z.preprocess((val) => (Array.isArray(val) ? val[0] : val), z.string().optional());

const rootSearchSchema = z
   .object({
      bswcLive: optionalSearchString
   })
   .passthrough();

const ROOT_DATA_STALE_MS = 5 * 60 * 1000;

const getRootShellData = createServerFn({ method: 'GET' }).handler(async () => {
   const token = readAuthCookie();
   const [user, bswc] = await Promise.all([token ? optionalApi(api.user.userControllerGetMe().then((r) => r.data)) : null, getHomeBswcPromo()]);
   const initialTheme = parseServerTheme(getCookie(THEME_COOKIE_NAME)) ?? null;
   const sidebarCollapsed = parseSidebarCollapsedCookie(getCookie(SIDEBAR_COLLAPSED_COOKIE_NAME));

   return {
      user,
      initialTheme,
      sidebarCollapsed,
      locale: await getLocale(),
      visibleLocales: getVisibleLocales(),
      bswc,
      debugBreakpoints: env.DEBUG_BREAKPOINTS,
      debugPageBackground: env.DEBUG_PAGE_BACKGROUND,
      debugReactScan: env.NODE_ENV !== 'production' && env.DEBUG_REACT_SCAN
   };
});

const getRouteMessages = createServerFn({ method: 'GET' })
   .validator(
      z.object({
         locale: z.string().transform(parseLocale),
         namespaces: z.array(translationNamespaceSchema)
      })
   )
   .handler(({ data: { locale, namespaces } }) => getMessages(locale, namespaces));

function rootShellQueryOptions() {
   return {
      queryKey: rootShellQueryKey,
      queryFn: () => getRootShellData(),
      staleTime: ROOT_DATA_STALE_MS
   };
}

function routeMessagesQueryOptions(locale: Locale, namespaces: TranslationNamespace[]) {
   return {
      queryKey: getRouteMessagesQueryKey(locale, namespaces),
      queryFn: () => getRouteMessages({ data: { locale, namespaces } }),
      staleTime: Infinity
   };
}

export const Route = createRootRouteWithContext<RouterContext>()({
   validateSearch: (search) => rootSearchSchema.parse(search),
   beforeLoad: async ({ context, location }) => {
      const shell = await context.queryClient.ensureQueryData(rootShellQueryOptions());
      await context.queryClient.ensureQueryData(routeMessagesQueryOptions(shell.locale, getRouteNamespaces(location.pathname)));
   },
   loader: {
      staleReloadMode: 'blocking',
      handler: async ({ context, location }) => {
         const shell = await context.queryClient.ensureQueryData(rootShellQueryOptions());
         const namespaces = getRouteNamespaces(location.pathname);
         const messages = await context.queryClient.ensureQueryData(routeMessagesQueryOptions(shell.locale, namespaces));

         return { shell, messages, namespaces };
      }
   },
   preload: false,
   // the loader bootstraps hydration; beforeLoad warms each destination independently
   shouldReload: false,
   head: () => ({
      meta: [
         { charSet: 'utf-8' },
         { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
         { name: 'theme-color', content: '#facc15' },
         { name: 'application-name', content: SITE_NAME },
         { name: 'apple-mobile-web-app-title', content: SITE_NAME },
         ...buildSeoHead().meta
      ],
      scripts: [
         {
            type: 'application/ld+json',
            children: JSON.stringify({
               '@context': 'https://schema.org',
               '@type': 'WebSite',
               name: SITE_NAME,
               url: absoluteSiteUrl('/'),
               description: SITE_DESCRIPTION
            })
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
   component: RootComponent
});

function RootComponent() {
   const data = Route.useLoaderData();
   const { queryClient } = Route.useRouteContext();

   if (!queryClient.getQueryData(rootShellQueryKey)) {
      queryClient.setQueryData(rootShellQueryKey, data.shell);
   }
   const initialMessagesQueryKey = getRouteMessagesQueryKey(data.shell.locale, data.namespaces);
   if (!queryClient.getQueryData(initialMessagesQueryKey)) {
      queryClient.setQueryData(initialMessagesQueryKey, data.messages);
   }

   return (
      <QueryProvider queryClient={queryClient}>
         <RootApplication />
      </QueryProvider>
   );
}

function RootApplication() {
   const search = Route.useSearch();
   const pathname = useLocation({ select: (location) => location.pathname });
   const { data: shell } = useSuspenseQuery(rootShellQueryOptions());
   const namespaces = getRouteNamespaces(pathname);
   const { data: messages } = useSuspenseQuery(routeMessagesQueryOptions(shell.locale, namespaces));
   const previewBswcLive = search.bswcLive === '1';

   return (
      <RootDocument locale={shell.locale} initialTheme={shell.initialTheme} debugReactScan={shell.debugReactScan}>
         <IntlProvider locale={shell.locale} messages={messages} timeZone="UTC">
            <AppShell
               initialUser={shell.user}
               messages={messages}
               visibleLocales={shell.visibleLocales}
               initialSidebarCollapsed={shell.sidebarCollapsed}
               debugBreakpoints={shell.debugBreakpoints}
               debugPageBackground={shell.debugPageBackground}
            >
               <BswcLiveNotice promo={shell.bswc} previewLive={previewBswcLive} />
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
            <script id="theme-init" dangerouslySetInnerHTML={{ __html: themeInitScript }} suppressHydrationWarning />
            <style id="critical-paint" dangerouslySetInnerHTML={{ __html: criticalPaintStyles }} />
            <HeadContent />
            {debugReactScan && <script src="https://unpkg.com/react-scan/dist/auto.global.js" crossOrigin="anonymous" async />}
         </head>
         <body className={cn('bg-background relative min-h-screen font-sans antialiased')}>
            {children}
            <Scripts />
         </body>
      </html>
   );
}
