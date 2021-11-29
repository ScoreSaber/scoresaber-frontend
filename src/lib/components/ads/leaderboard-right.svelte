<script>
   import { onMount } from 'svelte';
   import { dev } from '$app/env';
   import permissions from '$lib/utils/permissions';
   import { userData } from '$lib/global-store';
   $: showAd = true;
   onMount(() => {
      try {
         window.adsbygoogle = window.adsbygoogle;
         window.adsbygoogle.push({});
      } catch (ex) {}
      console.log('1');
      if (!window.canRunAds) {
         showAd = false;
      }
      userData.subscribe((u) => {
         if (u) {
            if (permissions.checkPermissionNumber(u.permissions, permissions.security.SUPPORTER)) {
               showAd = false;
            }
         }
      });
   });
</script>

{#if showAd}
   <div class="ad">
      <ins
         class="adsbygoogle"
         style="display:block"
         data-ad-format="fluid"
         data-ad-layout-key="-fg-1j+1l-o1+1ae"
         data-ad-client="ca-pub-9829527932347716"
         data-ad-slot="6830139879"
         data-adtest={dev ? 'on' : 'off'}
      >
         <div class="ad-subtext">
            Ads help keep ScoreSaber alive, if you'd like to remove ads, consider supporting us on <a
               target="_blank"
               rel="external"
               href="https://patreon.com/scoresaber"
            >
               Patreon</a
            > ❤️
         </div></ins
      >
   </div>
{/if}

<style>
   .ad-subtext {
      color: var(--textColor);
      text-decoration: none !important;
   }
   @media only screen and (max-width: 769px) {
      .ad {
         display: none;
      }
   }
</style>
