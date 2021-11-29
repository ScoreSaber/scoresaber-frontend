<script>
   import { onMount } from 'svelte';
   import { dev } from '$app/env';

   onMount(() => {
      window.adsbygoogle = window.adsbygoogle;
      window.adsbygoogle.push({});
   });
</script>

<div class="ad mb-2">
   <ins
      class="adsbygoogle horizontal"
      style="display:block"
      data-ad-client="ca-pub-9829527932347716"
      data-ad-slot="1489526746"
      data-full-width-responsive="false"
      data-adtest={dev ? 'on' : 'off'}
   />
</div>

<style>
   .horizontal {
      width: 320px;
      height: 100px;
   }
   .ad {
      width: 100%;
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
