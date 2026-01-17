<script lang="ts">
   import { onMount } from 'svelte';

   import { snowVisible } from '$lib/stores/global-store';

   import CookieConsent from './cookie-consent.svelte';
   import Button from './button.svelte';

   export let mobile = false;

   // onMount(() => {
   //    const snowDisabled = localStorage.getItem('snow-disabled-2025');
   //    if (snowDisabled == undefined) {
   //       localStorage.setItem('snow-disabled-2025', 'false');
   //       snowVisible.set(true);
   //    } else {
   //       if (snowDisabled == 'false') {
   //          snowVisible.set(true);
   //       }
   //    }
   // });
   // function toggleSnow() {
   //    snowVisible.set(!$snowVisible);
   //    if ($snowVisible) {
   //       localStorage.setItem('snow-disabled-2025', 'false');
   //    } else {
   //       localStorage.setItem('snow-disabled-2025', 'true');
   //    }
   // }
</script>

{#if !mobile}
   <CookieConsent />
{/if}

<footer class="site-footer" class:mobile class:desktop-only={!mobile}>
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

      <!-- <Button onClicked={toggleSnow} title={$snowVisible ? 'Disable Snow' : 'Enable Snow'} icon="snowflake" /> -->
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

   .site-footer.mobile {
      background: transparent;
      backdrop-filter: none;
      -webkit-backdrop-filter: none;
      padding: 1.5rem 0 0 0;
      margin-top: auto;
   }

   .site-footer.desktop-only {
      display: block;
   }

   @media (max-width: 960px) {
      .site-footer.desktop-only {
         display: none;
      }
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

   .site-footer.mobile .container {
      gap: 1rem;
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

   .site-footer.mobile .logo {
      width: 24px;
      height: 24px;
   }

   .logo-wordmark {
      display: inline;
   }

   .credits {
      color: rgba(255, 255, 255, 0.75);
      font-size: 0.95rem;
      margin: 0;
   }

   .site-footer.mobile .credits {
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.85rem;
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

   .site-footer.mobile .social-links {
      gap: 0.4rem;
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

   .site-footer.mobile .social-link {
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 0.75rem;
   }

   .legal {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.85rem;
      margin: 0;
   }

   .site-footer.mobile .legal {
      color: rgba(255, 255, 255, 0.55);
      font-size: 0.8rem;
   }

   .legal a {
      color: rgba(255, 255, 255, 0.6);
      text-decoration: none;
      transition: color 0.2s ease;
   }

   .site-footer.mobile .legal a {
      color: rgba(255, 255, 255, 0.55);
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
