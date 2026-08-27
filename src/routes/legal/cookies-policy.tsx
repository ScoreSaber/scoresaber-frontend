import { createFileRoute, getRouteApi } from '@tanstack/react-router';
import { useTranslations } from 'use-intl';

import { LegalLastUpdated } from './-last-updated';

import { Card } from '@/components/ui/card';

import { cn } from '@/shared/format/helpers';
import { buildSeoHead } from '@/shared/seo/metadata';

const privacyRoute = getRouteApi('/legal/privacy');

function BrowserStoragePolicyPage() {
   const t = useTranslations('legal.cookies');

   return (
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
         <Card className="px-6 sm:px-8">
            <article
               className={cn(
                  'space-y-4 text-sm leading-relaxed',
                  '[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:tracking-tight',
                  '[&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight',
                  '[&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold',
                  '[&_h4]:mt-4 [&_h4]:font-semibold [&_h4]:text-foreground',
                  '[&_p]:text-muted-foreground',
                  '[&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6 [&_ul]:text-muted-foreground',
                  '[&_strong]:font-semibold [&_strong]:text-foreground',
                  '[&_a]:text-primary [&_a]:underline-offset-4 [&_a:hover]:underline'
               )}
            >
               <header className="space-y-1">
                  <h1>{t('pageTitle')}</h1>
                  <LegalLastUpdated />
               </header>

               <p>
                  This Cookies Policy explains how Stratheca Pty Ltd (ACN 701 710 081), trading as ScoreSaber, uses cookies, local storage, session
                  storage, and similar browser storage on ScoreSaber websites and related web services, including ScoreSaber Hub, ScoreSaber Wiki, and
                  ScoreSaber Cloud at <a href="https://cloud.scoresaber.com/">cloud.scoresaber.com</a>. It should be read with our{' '}
                  <privacyRoute.Link>Privacy Policy</privacyRoute.Link>.
               </p>
               <p>
                  Cookies are small files stored by your browser. Local storage and session storage are browser storage areas that a website can read
                  later. ScoreSaber uses browser storage for sign-in, account security, rate limiting, language, theme, saved interface preferences,
                  and specific services described below.
               </p>
               <p>ScoreSaber does not use third-party advertising cookies or cookie-based third-party analytics on the website.</p>

               <h2>ScoreSaber website</h2>

               <h3>Authentication and sessions</h3>
               <p>
                  The <strong>token</strong> cookie keeps you signed in to the website and API. It is HTTP-only, secure in production, and normally
                  lasts up to 30 days unless you log out, the session expires, or the session is revoked.
               </p>

               <h3>OAuth, OpenID, and account linking</h3>
               <p>
                  ScoreSaber uses short-lived HTTP-only cookies to start and verify Steam OpenID, Discord OAuth, Patreon OAuth, account linking, and
                  account merge flows. These include <strong>steam-auth-state</strong>, <strong>discord-auth-state</strong>,{' '}
                  <strong>patreon-auth-state</strong>, <strong>scoresaber_oauth_intent</strong>, and <strong>scoresaber_oauth_redirect_to</strong>.
                  They normally expire after about 10 minutes.
               </p>
               <p>
                  Steam, Discord, Patreon, and other sign-in providers may set their own cookies when you visit or authenticate with them. Their
                  cookies are controlled by those providers, not ScoreSaber.
               </p>

               <h3>Security and rate limiting</h3>
               <p>
                  The <strong>ss_vid</strong> cookie stores a random visitor identifier for rate limiting, abuse prevention, and service protection.
                  It is HTTP-only, secure in production, and normally lasts up to 1 year.
               </p>
               <p>
                  Cloudflare may set cookies or process request data for security, traffic management, bot detection, or related infrastructure
                  features when those protections are active.
               </p>

               <h3>Preferences and notices</h3>
               <p>
                  ScoreSaber uses cookies and local storage to remember language, theme, filters, sort options, leaderboard views, country selections,
                  chart settings, comment form choices, and notice acknowledgements. Preference cookies usually last up to 1 year. Local storage
                  usually remains until you clear it, change the setting, or ScoreSaber replaces or removes it. Some short-lived values, such as media
                  refresh markers, expire sooner.
               </p>

               <h2>ScoreSaber Hub</h2>
               <p>
                  The Hub at <a href="https://hub.scoresaber.com/">hub.scoresaber.com</a> supports Discord and email sign-in. It may use required
                  cookies and browser storage for login sessions, OAuth or email verification state, CSRF and abuse-prevention checks, return paths,
                  and saved interface preferences. Session storage normally lasts for the login session, short-lived verification values normally last
                  only minutes, and preference storage may remain until changed or cleared.
               </p>

               <h2>ScoreSaber Wiki</h2>
               <p>
                  ScoreSaber Wiki is a public documentation site. It may use browser storage for documentation search, language, theme, navigation,
                  and similar interface preferences. Because the wiki is hosted on GitHub Pages, GitHub may process ordinary request logs. Cloudflare
                  may also process request data or set security and traffic-management cookies if Cloudflare protections are active for the wiki
                  domain.
               </p>

               <h2>ScoreSaber Cloud at cloud.scoresaber.com</h2>
               <p>
                  The cloud.scoresaber.com service is a Nextcloud-based team storage service for ScoreSaber team work. It is not ordinary user replay
                  storage or general ScoreSaber cloud storage. It uses required cookies and browser storage for login sessions, request tokens, CSRF
                  protection, SameSite checks, upload and download flows, WebDAV or sync clients, notifications, previews, sharing, and user interface
                  preferences.
               </p>
               <p>
                  cloud.scoresaber.com supports Discord login. Discord may set its own cookies during that sign-in flow, and cloud.scoresaber.com may
                  store short-lived values needed to start, verify, and complete the login.
               </p>

               <h2>Analytics without cookies</h2>
               <p>
                  ScoreSaber may use Cloudflare Web Analytics. Cloudflare Web Analytics may load a performance beacon from{' '}
                  <strong>static.cloudflareinsights.com</strong> and send page load, traffic, and Core Web Vitals metrics to Cloudflare analytics
                  endpoints. Cloudflare states that Web Analytics does not use cookies or local storage to collect usage metrics and does not track
                  individual end users across Cloudflare customers.
               </p>

               <h2>Your choices</h2>
               <p>
                  You can block or delete cookies and browser storage in your browser settings. If you do, sign-in, OAuth, rate limiting, security
                  checks, language, theme, filters, and other saved settings may stop working or may need to be set again.
               </p>

               <h2>Changes</h2>
               <p>We may update this Cookies Policy when the website changes. The "last updated" date shows when this page was last changed.</p>

               <h2>Contact us</h2>
               <p>For questions about this Cookies Policy, contact us at:</p>
               <ul>
                  <li>
                     Email: <a href="mailto:privacy@scoresaber.com">privacy@scoresaber.com</a>
                  </li>
               </ul>
            </article>
         </Card>
      </div>
   );
}

export const Route = createFileRoute('/legal/cookies-policy')({
   head: () =>
      buildSeoHead({
         title: 'Cookies Policy',
         description: 'Read the ScoreSaber cookies policy',
         path: '/legal/cookies-policy'
      }),
   component: BrowserStoragePolicyPage
});
