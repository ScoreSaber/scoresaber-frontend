<script lang="ts">
   // import { onMount } from 'svelte';

   // import { snowVisible } from '$lib/stores/global-store';

   import CookieConsent from './cookie-consent.svelte';

   // onMount(() => {
   //    const snowDisabled = localStorage.getItem('snow-disabled');
   //    if (snowDisabled == undefined) {
   //       localStorage.setItem('snow-disabled', 'false');
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
   //          localStorage.setItem('snow-disabled', 'false');
   //       } else {
   //          localStorage.setItem('snow-disabled', 'true');
   //       }
   //    }
   // }
</script>

<div class="sticky-footer"><CookieConsent /></div>

<footer class="site-footer">
   <div class="container">
      <a class="logoSection" href="/">
         <img src="/images/logo.svg" alt="" class="logo" />
         ScoreSaber
      </a>
      <p>
         <strong>ScoreSaber</strong> by <a href="https://x.com/Umbranoxus">Umbranox</a> &amp;
         <a href="/team">Team</a>
      </p>
      <nav class="social-buttons">
         <a href="https://discord.gg/scoresaber" target="_blank" rel="external" title="Join our Discord!" class="square"
            ><i class="fab fa-discord fa-2x" /></a
         >
         <a href="https://patreon.com/scoresaber" target="_blank" rel="external" title="Support us on Patreon ❤️" class="square"
            ><i class="fab fa-patreon fa-2x" /></a
         >
         <a href="https://bsky.app/profile/scoresaber.com" target="_blank" rel="external" title="Follow us on Bluesky" class="square"
            ><i class="fab fa-bluesky fa-2x" /></a
         >
         <a href="https://x.com/scoresaber" target="_blank" rel="external" title="Follow us on X" class="square"
            ><i class="fab fa-x-twitter fa-2x" /></a
         >
         <a href="https://youtube.com/@ScoreSaberOfficial" target="_blank" rel="external" title="Subscribe on YouTube" class="square"
            ><i class="fab fa-youtube fa-2x" /></a
         >
         <a href="https://github.com/Umbranoxio/ScoreSaber-Frontend" target="_blank" rel="external" title="Contribute on GitHub" class="square"
            ><i class="fab fa-github fa-2x" /></a
         >
         <a href="https://wiki.scoresaber.com" target="_blank" rel="external" title="Wiki" class="square"><i class="fas fa-book-open fa-2x" /></a>
         <a href="https://docs.scoresaber.com" target="_blank" rel="external" title="API Documentation" class="square"
            ><i class="fas fa-book fa-2x" /></a
         >
         <a href="https://scoresaber.store" target="_blank" rel="external" title="Get ScoreSaber merch!" class="square"
            ><i class="fas fa-tshirt fa-2x" /></a
         >
         <!-- <button on:click={() => toggleSnow()} class="button toggle is-small is-dark mb-2" title="Toggle Snow">
            <span class="icon is-small">
               <i class="fas fa-dot-circle" />
            </span>
         </button> -->
      </nav>

      <p>
         <a href="/legal/privacy">Privacy Policy</a>
      </p>
   </div>
</footer>

<style type="scss">
   // .toggle {
   //    border-radius: 20px !important;
   // }
   .sticky-footer {
      bottom: 0;
      position: fixed;
      width: 100%;
      z-index: 99999;
   }
   .site-footer {
      font-size: 1.25em;
      padding: 3rem;
      position: relative;
   }

   .logoSection {
      display: flex;
      height: 2em;
      font-size: 1.5em;
      gap: 10px;
      margin-bottom: 1em;
      align-items: center;
      color: var(--scoreSaberYellow);
      font-weight: 600;
   }

   .social-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      padding: 15px 0;

      a {
         color: inherit;
         display: block;
         &:hover {
            color: var(--scoreSaberYellow);
         }
      }
   }

   .logoSection > img {
      height: inherit;
   }
</style>
