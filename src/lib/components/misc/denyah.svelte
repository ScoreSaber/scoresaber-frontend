<script lang="ts">
   import type { Player } from '$lib/models/PlayerData';

   import { onMount } from 'svelte';
   export let playerId: string;
   onMount(() => {
      if (playerId == '76561198064659288') {
         document.getElementById('page').style.transform = 'rotateZ(6deg)';
      } else {
         document.getElementById('page').style.transform = 'rotateZ(0deg)';
      }
   });
</script>
