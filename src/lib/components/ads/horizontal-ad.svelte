<script>
   import { onMount } from 'svelte';

   import { dev } from '$app/env';

   import { userData } from '$lib/stores/global-store';

   import permissions from '$lib/utils/permissions';

   $: showAd = true;

   onMount(() => {
      try {
         window.adsbygoogle.push({});
      } catch (ex) {
         console.error(ex);
      }

      if (!window.canRunAds) {
         showAd = false;
      }
      userData.subscribe((u) => {
         if (u) {
            if (
               permissions.checkPermissionNumber(u.permissions, permissions.security.SUPPORTER) ||
               permissions.checkPermissionNumber(u.permissions, permissions.groups.ALL_STAFF)
            ) {
               showAd = false;
            }
         }
      });
   });
</script>

{#if showAd}
   <div class="ad">
      <ins
         class="adsbygoogle horizontal"
         style="display:block"
         data-ad-client="ca-pub-9829527932347716"
         data-ad-slot="1489526746"
         data-full-width-responsive="false"
         data-adtest={dev ? 'on' : 'off'}
         ><div class="ad-subtext">
            Ads help keep ScoreSaber alive, if you'd like to remove ads, consider supporting us on <a
               target="_blank"
               rel="external"
               href="https://patreon.com/scoresaber"
            >
               &nbsp;Patreon</a
            > ❤️
         </div></ins
      >
   </div>
{/if}

<style>
   ins {
      margin-bottom: 50px;
   }
   .ad-subtext {
      color: var(--textColor);
      text-decoration: none !important;
      display: flex;
      justify-content: center;
   }
   .horizontal {
      width: 320px;
      height: 100px;
   }
   .ad {
      width: 100%;
   }

   @media only screen and (max-width: 769px) {
      .ad-subtext {
         display: block;
      }
   }
   @media (min-width: 500px) {
      .horizontal {
         width: 468px;
         height: 60px;
      }
   }
   @media (min-width: 800px) {
      .horizontal {
         width: 728px;
         height: 90px;
      }
   }
   @media (min-width: 1080px) {
      .horizontal {
         width: 1054px;
         height: 90px;
      }
   }
</style>
