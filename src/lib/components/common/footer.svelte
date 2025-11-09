<script lang="ts">
   // import { onMount } from 'svelte';

   // import { snowVisible } from '$lib/stores/global-store';

   import CookieConsent from './cookie-consent.svelte';

   // onMount(() => {
   //    const snowDisabled = localStorage.getItem('snow-disabled-2024');
   //    if (snowDisabled == undefined) {
   //       localStorage.setItem('snow-disabled-2024', 'false');
   //       toggleSnow(true);
   //    } else {
   //       if (snowDisabled == 'false') {
   //          toggleSnow(true);
   //       }
   //    }
   // });
   // function toggleSnow(fromMount = false) {
   //    snowVisible.set(!$snowVisible);
   //    if (!fromMount) {
   //       if ($snowVisible) {
   //          localStorage.setItem('snow-disabled-2024', 'false');
   //       } else {
   //          localStorage.setItem('snow-disabled-2024', 'true');
   //       }
   //    }
   // }
</script>

<CookieConsent />

<footer class="site-footer">
   <div class="container">
      <a class="logo-link" href="/">
         <img src="/images/logo.svg" alt="ScoreSaber logo" class="logo" />
         <span class="logo-wordmark"><strong>ScoreSaber</strong></span>
      </a>

      <p class="credits">
         <strong>ScoreSaber</strong> by <a href="https://x.com/Umbranoxus">Umbranox</a> &amp; <a href="/team">Team</a>
      </p>

      <nav class="social-links" aria-label="Social links">
         <a href="https://discord.gg/scoresaber" target="_blank" rel="noopener" class="social-link" title="Join our Discord!">
            <i class="fab fa-discord fa-lg" />
         </a>
         <a href="https://patreon.com/scoresaber" target="_blank" rel="noopener" class="social-link" title="Support us on Patreon ❤️">
            <i class="fab fa-patreon fa-lg" />
         </a>
         <a href="https://bsky.app/profile/scoresaber.com" target="_blank" rel="noopener" class="social-link" title="Follow us on Bluesky">
            <i class="fab fa-bluesky fa-lg" />
         </a>
         <a href="https://x.com/scoresaber" target="_blank" rel="noopener" class="social-link" title="Follow us on X">
            <i class="fab fa-x-twitter fa-lg" />
         </a>
         <a href="https://youtube.com/@ScoreSaberOfficial" target="_blank" rel="noopener" class="social-link" title="Subscribe on YouTube">
            <i class="fab fa-youtube fa-lg" />
         </a>
         <a href="https://github.com/Umbranoxio/ScoreSaber-Frontend" target="_blank" rel="noopener" class="social-link" title="Contribute on GitHub">
            <i class="fab fa-github fa-lg" />
         </a>
         <a href="https://wiki.scoresaber.com" target="_blank" rel="noopener" class="social-link" title="Wiki">
            <i class="fas fa-book-open fa-lg" />
         </a>
         <a href="https://docs.scoresaber.com" target="_blank" rel="noopener" class="social-link" title="API Documentation">
            <i class="fas fa-book fa-lg" />
         </a>
         <a href="https://scoresaber.store" target="_blank" rel="noopener" class="social-link" title="Get ScoreSaber merch!">
            <i class="fas fa-tshirt fa-lg" />
         </a>
      </nav>

      <p class="legal">
         <a href="/legal/privacy">Privacy Policy</a>
      </p>
   </div>
</footer>

<style>
   .site-footer {
      border-top: 1px solid var(--borderColor);
      background: rgba(12, 12, 15, 0.85);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      padding: 3rem 1.5rem;
      position: relative;
   }

   .container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      text-align: center;
   }

   .logo-link {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      text-decoration: none;
      color: var(--textColor);
      font-weight: 600;
      transition: color 0.2s ease;
   }

   .logo-link:hover {
      color: var(--scoreSaberYellow);
   }

   .logo {
      width: 28px;
      height: 28px;
      display: block;
   }

   .logo-wordmark {
      display: inline;
   }

   .credits {
      color: rgba(255, 255, 255, 0.75);
      font-size: 0.95rem;
      margin: 0;
   }

   .credits a {
      color: rgba(255, 255, 255, 0.85);
      text-decoration: none;
      transition: color 0.2s ease;
   }

   .credits a:hover {
      color: var(--scoreSaberYellow);
   }

   .social-links {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
   }

   .social-link {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 0.85rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.04);
      color: rgba(255, 255, 255, 0.7);
      transition: background 0.2s ease, color 0.2s ease;
      text-decoration: none;
   }

   .social-link:hover {
      background: rgba(255, 255, 255, 0.08);
      color: var(--scoreSaberYellow);
   }

   .legal {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.85rem;
      margin: 0;
   }

   .legal a {
      color: rgba(255, 255, 255, 0.6);
      text-decoration: none;
      transition: color 0.2s ease;
   }

   .legal a:hover {
      color: var(--scoreSaberYellow);
   }

   @media (max-width: 640px) {
      .site-footer {
         padding: 2rem 1rem;
      }

      .container {
         gap: 1.25rem;
      }
   }
</style>
