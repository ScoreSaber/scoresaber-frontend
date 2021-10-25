<script lang="ts">
   import CountryImage from '$lib/components/image/country-image.svelte';
   import type { Player } from '$lib/models/PlayerData';

   export let player: Player;
   export let destination: string;
   export let external: boolean = false;
   export let countryImage: boolean = true;
</script>

{#if external}
   <a rel="external" target="_blank" href={destination}>
      {#if countryImage}
         <CountryImage country={player.country} />
      {/if}
      {player.name}
   </a>
{:else}
   <a href={destination}>
      {#if countryImage}
         <CountryImage country={player.country} />
      {/if}
      {player.name}
   </a>
{/if}
