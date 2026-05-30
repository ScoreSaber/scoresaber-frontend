import { createFileRoute } from '@tanstack/react-router';
import { useTranslations } from 'use-intl';

import { Card } from '@/components/ui/card';

import { cn } from '@/shared/format/helpers';

function PrivacyPolicyPage() {
   const t = useTranslations('legal.privacy');

   return (
      <div className="legal-print-page mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
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
                  <p className="text-muted-foreground text-xs tracking-wide uppercase">{t('lastUpdated')}</p>
               </header>

               <p>
                  This Privacy Policy explains how ScoreSaber handles personal information when you use ScoreSaber websites, APIs, game services,
                  mods, leaderboards, replays, rank requests, moderation systems, Discord bot features, ScoreSaber Hub at{' '}
                  <a href="https://hub.scoresaber.com/">hub.scoresaber.com</a>, ScoreSaber Wiki at{' '}
                  <a href="https://wiki.scoresaber.com/">wiki.scoresaber.com</a>, ScoreSaber Cloud at{' '}
                  <a href="https://cloud.scoresaber.com/">cloud.scoresaber.com</a>, and related services.
               </p>
               <p>
                  ScoreSaber is operated from Melbourne, Australia. Production servers are hosted with Hetzner in Finland and Germany. Replay, avatar,
                  cover, and generated media storage uses Cloudflare R2 with the storage location set to Western Europe (WEUR). ScoreSaber Wiki is a
                  public documentation and wiki site hosted on GitHub Pages.
               </p>
               <p>
                  ScoreSaber Cloud at <a href="https://cloud.scoresaber.com/">cloud.scoresaber.com</a> is a Nextcloud-based team storage service for
                  ScoreSaber team and content members. It is used for video production material such as gameplay recordings, voice overs, video
                  project files, exports, and related team files. It is hosted with Hetzner in Germany and supports Discord login. It is separate from
                  user replay uploads and is not a general cloud storage service for ScoreSaber users.
               </p>
               <p>
                  For the services we operate, ScoreSaber is the controller of the personal information described in this policy. Contact us at{' '}
                  <a href="mailto:privacy@scoresaber.com">privacy@scoresaber.com</a> with privacy questions or requests.
               </p>
               <p>
                  We do not sell personal information. We do not use third-party advertising cookies, cookie-based third-party analytics, or
                  cross-context behavioural advertising on the website.
               </p>

               <h2>Information we collect</h2>
               <p>The information we collect depends on how you use ScoreSaber. It may include:</p>
               <ul>
                  <li>
                     <strong>Account and profile information:</strong> player IDs, display names, previous names, avatars, country, bio, badges,
                     roles, permissions, account status, connected accounts, supporter status, follows, platform friends, account recovery records,
                     and account merge records.
                  </li>
                  <li>
                     <strong>Sign-in and contact information:</strong> email addresses used for email login, account recovery, account merge, or Hub
                     sign-in; keyed email proofs where we avoid storing the raw email, including for Meta/Oculus account recovery or matching;
                     provider account IDs; authentication, session, token, and audit records; IP address; and user agent. The Hub supports Discord and
                     email sign-in. If you use Discord there, we collect the email address Discord provides.
                  </li>
                  <li>
                     <strong>Game, score, replay, and API information:</strong> platform authentication data, platform player IDs, platform friend
                     IDs, game and plugin versions, map and leaderboard identifiers, scores, modifiers, misses, bad cuts, combo, PP, ranks, score
                     history, replay files, replay-derived statistics, gameplay telemetry needed to validate and display replays, API requests, replay
                     views, device or headset identifiers, IP address, and detected country.
                  </li>
                  <li>
                     <strong>User content and community information:</strong> bios, avatars, rank request descriptions, comments, votes, Discord bot
                     commands, linked player URLs or IDs, appeals, supporter and role-sync records, and other content or records you submit.
                  </li>
                  <li>
                     <strong>Moderation and anti-cheat information:</strong> reports, evidence, reviewer actions, staff notes, score validation
                     results, anti-cheat records, account restrictions, and records needed to operate and moderate the service.
                  </li>
                  <li>
                     <strong>ScoreSaber Cloud information:</strong> for authorised users of the cloud.scoresaber.com team storage service, account
                     identifiers, names, usernames, email addresses, Discord account details provided during sign-in, uploaded files, file and folder
                     names, file metadata, comments, shares, permissions, activity records, sync records, device or app tokens, and security logs.
                  </li>
                  <li>
                     <strong>Wiki and documentation information:</strong> wiki page requests, documentation search and interface preferences,
                     contribution records if you work with the wiki repository, and technical logs created when you browse or maintain the wiki.
                  </li>
                  <li>
                     <strong>Technical and security information:</strong> request logs, IP address, user agent, request metadata, timestamps, response
                     status, session and rate-limit identifiers, cookies, local storage values, security events, error details, metrics, and website
                     performance data.
                  </li>
               </ul>
               <p>
                  We do not ask you to provide sensitive information. If you choose to put sensitive information in public profile text, comments, or
                  other user content, that information may be processed and displayed like the rest of that content.
               </p>

               <h2>How we collect information</h2>
               <p>We collect information directly from you when you sign in, change settings, edit a profile, upload media, or submit content.</p>
               <p>
                  We collect information from game clients, ScoreSaber mods, APIs, background workers, and connected services when you authenticate,
                  submit scores, upload or view replays, link accounts, use supporter or leaderboard features, or use the Discord bot.
               </p>
               <p>
                  We collect information from ScoreSaber Hub, ScoreSaber Wiki, and ScoreSaber Cloud when you use those services. We also collect
                  information through cookies, local storage, logs, metrics, security tools, server infrastructure, and service providers.
               </p>

               <h2>How we use information</h2>
               <p>We use personal information to:</p>
               <ul>
                  <li>create, authenticate, secure, recover, merge, and administer accounts;</li>
                  <li>
                     operate profiles, leaderboards, rankings, scores, replays, maps, rank requests, realms, comments, public APIs, and related
                     features;
                  </li>
                  <li>
                     operate ScoreSaber Hub, ScoreSaber Wiki, and ScoreSaber Cloud, including sign-in, documentation, file sharing, sync, and team
                     production workflows;
                  </li>
                  <li>validate scores, detect cheating, investigate abuse, enforce rules, moderate content, and protect leaderboard integrity;</li>
                  <li>provide account linking, supporter benefits, Discord role sync, email login codes, and service notifications;</li>
                  <li>remember preferences, maintain sessions, rate-limit traffic, prevent fraud or automated abuse, and secure the service;</li>
                  <li>monitor reliability, debug errors, improve performance, and keep operational records;</li>
                  <li>respond to legal requests, enforce terms, resolve disputes, and protect ScoreSaber, users, and the community.</li>
               </ul>

               <h2>European and UK legal bases</h2>
               <p>Where GDPR, UK GDPR, or similar law requires a legal basis, we rely on:</p>
               <ul>
                  <li>
                     <strong>Contract:</strong> to provide the ScoreSaber features you request, including accounts, sessions, profiles, score
                     submissions, leaderboards, replays, connected accounts, and supporter features.
                  </li>
                  <li>
                     <strong>Legitimate interests:</strong> to keep leaderboards fair, prevent cheating and abuse, secure accounts, rate-limit
                     traffic, moderate content, investigate disputes, maintain logs, measure performance, and improve the service.
                  </li>
                  <li>
                     <strong>Consent:</strong> where we ask for consent, including optional connected-service features or non-essential cookies or
                     tracking.
                  </li>
                  <li>
                     <strong>Legal obligations:</strong> where we need to keep or disclose information to comply with law or protect legal claims.
                  </li>
               </ul>
               <p>
                  You may object where we rely on legitimate interests. We may continue processing where the law allows, including for compelling
                  grounds, legal reasons, or service-integrity reasons.
               </p>

               <h2>Public information</h2>
               <p>
                  ScoreSaber is a public leaderboard service. Public pages and API responses may be viewed, indexed, copied, screenshotted, archived,
                  or re-shared by others.
               </p>
               <p>Public information may include:</p>
               <ul>
                  <li>player IDs, display names, avatars, country, bio, badges, roles, selected profile details, follows, and supporter status;</li>
                  <li>
                     scores, ranks, PP, score history, leaderboard positions, maps, replay availability, replay files, and replay-derived statistics;
                  </li>
                  <li>rank request descriptions, comments, votes, statuses, reviewer actions, and public moderation states where shown.</li>
               </ul>
               <p>
                  We do not intentionally publish raw email addresses, raw IP addresses, session tokens, OAuth tokens, one-time passwords, private
                  staff notes, or authentication secrets as part of public profiles.
               </p>
               <p>
                  Public APIs may return the same public leaderboard, profile, score, replay, rank request, and moderation information. ScoreSaber
                  Wiki pages and wiki source contributions may be public. Files stored on cloud.scoresaber.com are intended for authorised team access
                  unless a team member or administrator shares a file, folder, or link with others.
               </p>

               <h2>Cookies, storage, and analytics</h2>
               <p>
                  We use cookies and local storage for sign-in, OAuth security, rate limiting, language, theme, saved filters, cloud.scoresaber.com
                  file access, and similar functions. Our <a href="/legal/cookies-policy">Cookies Policy</a> explains the main browser storage used by
                  ScoreSaber services.
               </p>
               <p>
                  We use Cloudflare Web Analytics for aggregate traffic and performance metrics, including page load and Core Web Vitals reporting.
                  Cloudflare says this service does not use cookies or local storage to collect usage metrics and does not track individual end users
                  across Cloudflare customers.
               </p>

               <h2>Disclosures</h2>
               <p>We disclose personal information only as needed to operate, secure, and support ScoreSaber. Recipients may include:</p>
               <ul>
                  <li>the public, where information is shown on public pages or returned through public APIs;</li>
                  <li>Hetzner, which hosts ScoreSaber servers in Finland and Germany, including ScoreSaber Cloud storage in Germany;</li>
                  <li>
                     Cloudflare, including R2 storage in Western Europe (WEUR), proxy and security services, Web Analytics, and related
                     infrastructure;
                  </li>
                  <li>
                     GitHub, including GitHub Pages hosting, source control, collaboration, and public documentation workflows for ScoreSaber Wiki;
                  </li>
                  <li>Steam, Meta/Oculus, Patreon, Discord, BeatSaver, and similar services when you connect accounts or use related features;</li>
                  <li>email delivery providers used to send login codes and account messages;</li>
                  <li>Discord channels, bots, or role sync features used for staff, moderation, supporter, or community workflows;</li>
                  <li>staff, contractors, reviewers, moderators, anti-cheat reviewers, and service operators who need access to run the service;</li>
                  <li>
                     courts, regulators, law enforcement, or other parties where required by law or needed to protect rights, safety, or security.
                  </li>
               </ul>
               <p>We may publish aggregated or de-identified statistics that do not reasonably identify a particular person.</p>

               <h2>Overseas storage and transfers</h2>
               <p>
                  ScoreSaber is operated from Australia, but the service is global. Your information may be stored or processed in Australia, Finland,
                  Germany, Western Europe, the United States, or other countries where our providers operate.
               </p>
               <p>
                  For transfers from the EEA, UK, or other places with transfer rules, we rely on provider safeguards, regional storage settings where
                  practical, and other lawful transfer mechanisms that apply to the service.
               </p>

               <h2>Security</h2>
               <p>
                  We use technical and organisational measures to protect personal information, including access controls, encrypted transport, secure
                  session cookies, credential protections, rate limiting, and operational monitoring.
               </p>
               <p>
                  No online service can guarantee perfect security. Keep your connected accounts secure and contact us quickly if you believe your
                  ScoreSaber account or a connected account has been compromised.
               </p>

               <h2>Retention</h2>
               <p>
                  We keep personal information for as long as needed to operate ScoreSaber, preserve leaderboard integrity, resolve disputes, enforce
                  rules, comply with legal obligations, and protect the service.
               </p>
               <ul>
                  <li>
                     Public profiles, scores, leaderboard history, rank request records, moderation records, and anti-cheat records may be retained
                     for long periods.
                  </li>
                  <li>
                     Session, OAuth state, and one-time code records expire or are pruned according to their purpose, but related audit records may be
                     kept.
                  </li>
                  <li>
                     Connected account records, Quest authentication keys, and Meta/Oculus email proof records may be kept while needed for login,
                     account recovery, account merges, and service integrity.
                  </li>
                  <li>
                     Replay files, avatars, covers, generated media, and replay-derived statistics may be retained, made public, deleted, or pruned
                     according to leaderboard and storage rules.
                  </li>
                  <li>
                     Files, shares, comments, versions, trash records, and backups on cloud.scoresaber.com may be kept until deleted by an authorised
                     user or administrator, or for as long as reasonably needed for team operations, recovery, security, and legal reasons.
                  </li>
                  <li>
                     Logs, metrics, and security records are kept for as long as reasonably needed for operations, debugging, abuse prevention, and
                     security.
                  </li>
               </ul>
               <p>
                  Some information cannot be fully deleted without damaging public leaderboard records, anti-cheat history, moderation history, or
                  service integrity. Where deletion is not practical, we will consider hiding, de-identifying, or restricting the information.
               </p>

               <h2>Automated review and anti-cheat</h2>
               <p>
                  ScoreSaber uses automated systems, replay analysis, score validation rules, and anti-cheat tools to assess scores, replays,
                  accounts, and submissions. These systems may help decide whether a score or account is accepted, hidden, flagged, limited, or sent
                  for staff review.
               </p>
               <p>
                  Automated systems can produce incorrect results. Important enforcement actions that affect an account or a player's standing can be
                  reviewed by staff where reasonably possible. Contact us if you think an automated, anti-cheat, or moderation decision about you is
                  wrong.
               </p>

               <h2>Your choices and rights</h2>
               <p>
                  You can update some information in ScoreSaber settings, including profile details, avatar, bio, country, account connections, and
                  replay settings where available.
               </p>
               <p>
                  You can ask us to access, correct, delete, export, or restrict personal information we hold about you. You can also object to
                  certain processing or withdraw consent where processing is based on consent. We may need to verify your identity before acting on a
                  request.
               </p>
               <p>
                  We may decline or limit a request where the law allows, including to protect other users, preserve public leaderboard records,
                  maintain moderation or anti-cheat history, comply with legal obligations, or protect the security and integrity of the service.
               </p>
               <p>
                  To make a privacy request or complaint, email <a href="mailto:privacy@scoresaber.com">privacy@scoresaber.com</a>. Tell us what you
                  are asking for and include enough information for us to identify the relevant account or record.
               </p>
               <p>
                  Where GDPR or UK GDPR applies, we aim to respond without undue delay and within 1 month. If a request is complex or you make many
                  requests, we may extend the response period where the law allows and tell you within the first month.
               </p>
               <p>
                  Rights vary by country. If privacy laws such as the Australian Privacy Act, GDPR, UK GDPR, or applicable US state privacy laws apply
                  to you, we will handle requests under those laws where required.
               </p>
               <p>
                  If you are in Australia and you are not satisfied with how we handle a privacy complaint, you may be able to contact the Office of
                  the Australian Information Commissioner. If you are in the EEA or UK, you may also be able to complain to your local data protection
                  authority.
               </p>

               <h2>Children</h2>
               <p>
                  ScoreSaber is not directed to children under 13. If you are under the age required to consent to online services in your country,
                  use ScoreSaber only with permission from a parent or guardian. Contact us if you believe a child has provided personal information
                  to ScoreSaber without proper permission.
               </p>

               <h2>Third-party links and services</h2>
               <p>
                  ScoreSaber links to third-party services and content, including connected account providers, Discord, GitHub, BeatSaver, mod
                  download sources, and community sites. Those services are responsible for their own privacy practices.
               </p>

               <h2>Changes</h2>
               <p>
                  We may update this Privacy Policy as ScoreSaber changes. The "last updated" date shows when this page was last changed. If a change
                  is important, we may also announce it through the website, Discord, or another reasonable channel.
               </p>

               <h2>Contact us</h2>
               <p>For privacy requests, complaints, or questions, contact us at:</p>
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

export const Route = createFileRoute('/legal/privacy')({
   head: () => ({
      meta: [
         { title: 'Privacy Policy | ScoreSaber!' },
         {
            name: 'description',
            content: 'Read the ScoreSaber privacy policy'
         }
      ]
   }),
   component: PrivacyPolicyPage
});
