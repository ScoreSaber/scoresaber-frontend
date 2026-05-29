import { useTranslations } from 'use-intl';

import { Card } from '@/components/ui/card';

import { cn } from '@/shared/format/helpers';

export default function CookiesPolicyPage() {
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
                  '[&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline'
               )}
            >
               <header className="space-y-1">
                  <h1>{t('pageTitle')}</h1>
                  <p className="text-muted-foreground text-xs tracking-wide uppercase">{t('lastUpdated')}</p>
               </header>

               <p>
                  This Cookies Policy explains what Cookies are and how We use them. You should read this policy so You can understand what type of
                  cookies We use, or the information We collect using Cookies and how that information is used.
               </p>
               <p>
                  Cookies do not typically contain any information that personally identifies a user, but personal information that we store about You
                  may be linked to the information stored in and obtained from Cookies. For further information on how We use, store and keep your
                  personal data secure, see our Privacy Policy.
               </p>
               <p>We do not store sensitive personal information, such as mailing addresses, account passwords, etc. in the Cookies We use.</p>

               <h2>Interpretation and Definitions</h2>

               <h3>Interpretation</h3>
               <p>The words of which the initial letter is capitalized have meanings defined under the following conditions.</p>
               <p>The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>

               <h2>Definitions</h2>
               <p>For the purposes of this Cookies Policy:</p>
               <ul>
                  <li>
                     <strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Cookies Policy) refers to ScoreSaber.
                  </li>
                  <li>
                     <strong>You</strong> means the individual accessing or using the Website, or a company, or any legal entity on behalf of which
                     such individual is accessing or using the Website, as applicable.
                  </li>
                  <li>
                     <strong>Cookies</strong> means small files that are placed on Your computer, mobile device or any other device by a website,
                     containing details of your browsing history on that website among its many uses.
                  </li>
                  <li>Website refers to Score Saber, accessible from www.scoresaber.com.</li>
               </ul>

               <h2>The use of the Cookies</h2>

               <h3>Type of Cookies We Use</h3>
               <p>
                  Cookies can be "Persistent" or "Session" Cookies. Persistent Cookies remain on your personal computer or mobile device when You go
                  offline, while Session Cookies are deleted as soon as You close your web browser.
               </p>
               <p>We use both session and persistent Cookies for the purposes set out below:</p>

               <h3>Necessary / Essential Cookies</h3>
               <p>
                  <strong>Type:</strong> Session Cookies
               </p>
               <p>
                  <strong>Administered by:</strong> Us
               </p>
               <p>
                  <strong>Purpose:</strong> These Cookies are essential to provide You with services available through the Website and to enable You
                  to use some of its features. They help to authenticate users and prevent fraudulent use of user accounts. Without these Cookies, the
                  services that You have asked for cannot be provided, and We only use these Cookies to provide You with those services.
               </p>

               <h3>Functionality Cookies</h3>
               <p>
                  <strong>Type:</strong> Persistent Cookies
               </p>
               <p>
                  <strong>Administered by:</strong> Us
               </p>
               <p>
                  <strong>Purpose:</strong> These Cookies allow us to remember choices You make when You use the Website, such as remembering your
                  login details or language preference. The purpose of these Cookies is to provide You with a more personal experience and to avoid
                  You having to re-enter your preferences every time You use the Website.
               </p>

               <h2>Your Choices Regarding Cookies</h2>
               <p>
                  If You prefer to avoid the use of Cookies on the Website, first You must disable the use of Cookies in your browser and then delete
                  the Cookies saved in your browser associated with this website. You may use this option for preventing the use of Cookies at any
                  time.
               </p>
               <p>
                  If You do not accept Our Cookies, You may experience some inconvenience in your use of the Website and some features may not
                  function properly.
               </p>
               <p>
                  If You'd like to delete Cookies or instruct your web browser to delete or refuse Cookies, please visit the help pages of your web
                  browser.
               </p>
               <ul>
                  <li>
                     For the Chrome web browser, please visit this page from Google:{' '}
                     <a href="https://support.google.com/accounts/answer/32050" target="_blank" rel="noreferrer noopener">
                        https://support.google.com/accounts/answer/32050
                     </a>
                  </li>
                  <li>
                     For the Internet Explorer web browser, please visit this page from Microsoft:{' '}
                     <a href="http://support.microsoft.com/kb/278835" target="_blank" rel="noreferrer noopener">
                        http://support.microsoft.com/kb/278835
                     </a>
                  </li>
                  <li>
                     For the Firefox web browser, please visit this page from Mozilla:{' '}
                     <a
                        href="https://support.mozilla.org/en-US/kb/delete-cookies-remove-info-websites-stored"
                        target="_blank"
                        rel="noreferrer noopener"
                     >
                        https://support.mozilla.org/en-US/kb/delete-cookies-remove-info-websites-stored
                     </a>
                  </li>
                  <li>
                     For the Safari web browser, please visit this page from Apple:{' '}
                     <a
                        href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac"
                        target="_blank"
                        rel="noreferrer noopener"
                     >
                        https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac
                     </a>
                  </li>
               </ul>
               <p>For any other web browser, please visit your web browser's official web pages.</p>

               <h2>More Information about Cookies</h2>
               <p>You can learn more about Cookies at the following third-party websites:</p>
               <ul>
                  <li>
                     Network Advertising Initiative:{' '}
                     <a href="http://www.networkadvertising.org/" target="_blank" rel="noreferrer noopener">
                        http://www.networkadvertising.org/
                     </a>
                  </li>
               </ul>

               <h2>Contact Us</h2>
               <p>If you have any questions about this Cookies Policy, You can contact us:</p>
               <ul>
                  <li>
                     By email: <a href="mailto:privacy@scoresaber.com">privacy@scoresaber.com</a>
                  </li>
               </ul>
            </article>
         </Card>
      </div>
   );
}
