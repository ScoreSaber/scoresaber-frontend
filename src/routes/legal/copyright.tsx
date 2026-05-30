import { createFileRoute } from '@tanstack/react-router';
import { useTranslations } from 'use-intl';

import { CopyrightNoticeTemplate } from './-copyright-notice-template';

import { Card } from '@/components/ui/card';

import { cn } from '@/shared/format/helpers';

function CopyrightTakedownPolicyPage() {
   const t = useTranslations('legal.copyright');

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
                  '[&_ol]:text-muted-foreground',
                  '[&_strong]:font-semibold [&_strong]:text-foreground',
                  '[&_a]:text-primary [&_a]:underline-offset-4 [&_a:hover]:underline'
               )}
            >
               <header className="space-y-1">
                  <h1>{t('pageTitle')}</h1>
                  <p className="text-muted-foreground text-xs tracking-wide uppercase">{t('lastUpdated')}</p>
               </header>

               <p>
                  This Copyright Takedown Policy explains how to report copyright concerns involving ScoreSaber websites, leaderboards, map pages,
                  replay features, APIs, and related services. ScoreSaber is operated from Melbourne, Australia.
               </p>
               <p>
                  ScoreSaber primarily stores cover art and related display media for maps and leaderboards. ScoreSaber does not host BeatSaver
                  beatmap packages or audio files. It may display map metadata and links to BeatSaver or other third-party services.
               </p>
               <p>
                  Copyright notices should be sent by email to <a href="mailto:contact@scoresaber.com">contact@scoresaber.com</a>.
               </p>

               <h2>What we can review</h2>
               <p>ScoreSaber can review copyright complaints about material or references it controls, including:</p>
               <ul>
                  <li>cover art, cached images, or generated display media stored by ScoreSaber;</li>
                  <li>ScoreSaber map, leaderboard, profile, replay, or API pages that display allegedly infringing material;</li>
                  <li>ScoreSaber-controlled links or references to third-party pages that you identify as infringing.</li>
               </ul>
               <p>
                  If your complaint concerns a beatmap package, audio file, or other material hosted by BeatSaver, send that complaint to BeatSaver
                  through its <a href="https://www.beatsaver.com/policy/dmca">copyright/DMCA page</a>. ScoreSaber cannot remove files hosted by
                  BeatSaver, but may review whether to remove or disable ScoreSaber links, cached cover art, or references it controls.
               </p>

               <h2>Copyright takedown notices</h2>
               <p>
                  To ask us to remove or disable access to material based on copyright, send a written notice to{' '}
                  <a href="mailto:contact@scoresaber.com">contact@scoresaber.com</a> with the subject line <strong>Copyright takedown notice</strong>.
                  Include:
               </p>
               <ul>
                  <li>your physical or electronic signature;</li>
                  <li>whether you are the copyright owner, exclusive licensee, or authorised agent;</li>
                  <li>identification of the copyright work you say is infringed, or a representative list of works;</li>
                  <li>
                     identification of the ScoreSaber material, page, link, or reference you want reviewed, with enough information for us to find it,
                     such as ScoreSaber URLs, map IDs, leaderboard IDs, image URLs, or BeatSaver URLs;
                  </li>
                  <li>your name, mailing address, telephone number, and email address;</li>
                  <li>
                     a statement that you believe in good faith that the disputed storage, display, link, or reference is not authorised by the
                     copyright owner, an exclusive licensee, an agent, or the law;
                  </li>
                  <li>a statement that you have taken reasonable steps to ensure that the information and statements in your notice are accurate.</li>
               </ul>

               <h2>Template</h2>
               <p>You may use this template in the body of your email:</p>
               <CopyrightNoticeTemplate />

               <h2>How we handle notices</h2>
               <p>After receiving a copyright notice, we may:</p>
               <ul>
                  <li>ask for more information if the notice does not identify the work, material, link, or sender clearly enough;</li>
                  <li>remove or disable access to cover art, cached images, generated media, links, references, or other material we control;</li>
                  <li>notify an affected user or source where reasonably appropriate;</li>
                  <li>keep records of the notice, our review, and any action taken;</li>
                  <li>restrict accounts or access for repeat or serious infringement concerns.</li>
               </ul>
               <p>
                  We may take no action where a notice is incomplete, appears abusive, does not involve copyright, or concerns material that
                  ScoreSaber does not host or control.
               </p>

               <h2>Responses from affected users</h2>
               <p>
                  If material, a link, or a reference you provided was removed or disabled after a copyright notice and you believe that was a
                  mistake, you may email <a href="mailto:contact@scoresaber.com">contact@scoresaber.com</a> with the subject line{' '}
                  <strong>Copyright response</strong>.
               </p>
               <p>Your response should include:</p>
               <ul>
                  <li>your physical or electronic signature;</li>
                  <li>identification of the material, link, or reference affected and where it appeared before removal or disabling;</li>
                  <li>a statement that you believe the action was taken by mistake, with your reasons;</li>
                  <li>
                     a statement that you have taken reasonable steps to ensure that the information and statements in your response are accurate;
                  </li>
                  <li>your name, mailing address, telephone number, and email address.</li>
               </ul>
               <p>
                  We may forward your response to the original notice sender. We may restore or enable access to material, links, or references where
                  appropriate.
               </p>

               <h2>Misuse</h2>
               <p>
                  Do not submit false or misleading copyright notices. False or misleading notices or responses may have legal consequences. This
                  process is for copyright claims only. For privacy, trademark, harassment, defamation, or other non-copyright concerns, contact us at{' '}
                  <a href="mailto:contact@scoresaber.com">contact@scoresaber.com</a>.
               </p>

               <h2>Changes</h2>
               <p>
                  We may update this Copyright Takedown Policy as ScoreSaber changes. The "last updated" date shows when this page was last changed.
               </p>

               <h2>Contact us</h2>
               <p>Copyright notices, responses, and related questions should be sent to:</p>
               <ul>
                  <li>
                     Email: <a href="mailto:contact@scoresaber.com">contact@scoresaber.com</a>
                  </li>
               </ul>
            </article>
         </Card>
      </div>
   );
}

export const Route = createFileRoute('/legal/copyright')({
   head: () => ({
      meta: [
         { title: 'Copyright Takedown Policy | ScoreSaber!' },
         {
            name: 'description',
            content: 'Read the ScoreSaber copyright takedown policy'
         }
      ]
   }),
   component: CopyrightTakedownPolicyPage
});
