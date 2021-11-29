<script>
   import { onMount } from 'svelte';
   import { dev } from '$app/env';

   onMount(() => {
      try {
         window.adsbygoogle = window.adsbygoogle;
         window.adsbygoogle.push({});
      } catch (ex) {}
   });
</script>

<div class="ad">
   <ins
      class="adsbygoogle"
      style="display:block"
      data-ad-format="fluid"
      data-ad-layout-key="-fg-1j+1l-o1+1ae"
      data-ad-client="ca-pub-9829527932347716"
      data-ad-slot="6830139879"
      data-adtest={dev ? 'on' : 'off'}
   />
</div>

<style>
   @media only screen and (max-width: 769px) {
      .ad {
         display: none;
      }
   }
</style>
