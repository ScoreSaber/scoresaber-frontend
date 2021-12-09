<script lang="ts">
   import type { Player } from '$lib/models/PlayerData';

   import { onMount } from 'svelte';
   export let playerId: string;
   onMount(() => {
      const page = document.getElementById('page');
      if (page) {
         if (playerId == '76561198064659288') {
            page.style.transform = 'rotateZ(8deg)';
            page.style.filter = 'blur(1px) hue-rotate(180deg)';
         } else {
            page.style.transform = 'rotateZ(0deg)';
            page.style.filter = 'blur(0px)';
         }
      }
   });
</script>
