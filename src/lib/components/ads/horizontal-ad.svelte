<script>
   import { onMount } from 'svelte';
   import { dev } from '$app/env';

   onMount(() => {
      window.adsbygoogle = window.adsbygoogle;
      window.adsbygoogle.push({});
   });
</script>

<div class="ad">
   <ins
      class="adsbygoogle"
      style="display:inline-block;width:1054px;height:100px"
      data-ad-client="ca-pub-9829527932347716"
      data-ad-slot="8027014930"
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
