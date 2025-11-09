<script lang="ts">
   import { onMount } from 'svelte';
   import { fly } from 'svelte/transition';

   export let extraClasses = '';
   export let style = '';
   let hidden = true;

   onMount(() => {
      if (!localStorage.getItem('cookie-consent')) {
         hidden = false;
      }
   });

   function hideCookieConsent() {
      localStorage.setItem('cookie-consent', 'closed');
      hidden = true;
   }
</script>

{#if !hidden}
   <div class="cookie-banner {extraClasses}" {style} transition:fly={{ y: 100, duration: 300 }}>
      <div class="cookie-content">
         <div class="cookie-text">
            <span class="cookie-icon">🍪</span>
            <span>
               We use cookies to ensure you get the best experience. By using our website you agree to our{' '}
               <a href="/legal/privacy">Privacy Policy</a> & <a href="/legal/cookies-policy">Cookie Policy</a>.
            </span>
         </div>
         <button type="button" on:click={hideCookieConsent} aria-label="Accept cookies">
            Got it
         </button>
      </div>
   </div>
{/if}

<style>
   .cookie-banner {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      max-width: min(420px, calc(100vw - 3rem));
      z-index: 10000;
      background: var(--foregroundItem);
      border: 1px solid var(--borderColor);
      border-radius: 0.85rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
   }

   .cookie-content {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding: 1rem;
   }

   .cookie-text {
      display: flex;
      align-items: flex-start;
      gap: 0.65rem;
      color: var(--textColor);
      font-size: 0.9rem;
      line-height: 1.5;
   }

   .cookie-icon {
      font-size: 1.2rem;
      flex-shrink: 0;
      margin-top: 0.1rem;
   }

   .cookie-text a {
      color: var(--scoreSaberYellow);
      text-decoration: underline;
      font-weight: 500;
      transition: color 0.2s ease;
   }

   .cookie-text a:hover {
      color: var(--alternate);
   }

   button {
      align-self: flex-end;
      padding: 0.5rem 1.25rem;
      background: var(--scoreSaberYellow);
      color: var(--gray);
      border: 0;
      border-radius: 0.6rem;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      transition: background 0.2s ease, transform 0.15s ease;
   }

   button:hover {
      background: #ffd700;
      transform: translateY(-1px);
   }

   button:active {
      transform: translateY(0);
   }

   @media (max-width: 640px) {
      .cookie-banner {
         bottom: 1rem;
         right: 1rem;
         left: 1rem;
         max-width: none;
      }

      .cookie-content {
         padding: 0.85rem;
      }

      .cookie-text {
         font-size: 0.85rem;
      }
   }
</style>
