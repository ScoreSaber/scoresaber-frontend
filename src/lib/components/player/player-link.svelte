<script lang="ts">
   import CountryImage from '$lib/components/image/country-image.svelte';
   import * as permissions from '$lib/utils/permissions';
   import type { Player } from '$lib/models/PlayerData';

   export let player: Player;
   export let destination: string;
   export let external: boolean = false;
   export let countryImage: boolean = true;

   export function getPlayerClass(player: Player): string {
      if (permissions.checkPermissionNumber(player.permissions, permissions.PANDA)) {
         return `panda`;
      }

      if (permissions.checkPermissionNumber(player.permissions, permissions.QATHead)) {
         return `qat-head`;
      }

      if (permissions.checkPermissionNumber(player.permissions, permissions.NAT)) {
         return `nat`;
      }

      if (permissions.checkPermissionNumber(player.permissions, permissions.RT)) {
         return `ranking-team`;
      }

      if (permissions.checkPermissionNumber(player.permissions, permissions.QAT)) {
         return `qat`;
      }

      //williums
      if (player.id == '76561198182060577') {
         return 'williums';
      }
      if (player.role == 'Supporter') {
         return 'level-2-supporter';
      }
      return 'default';
   }
</script>

{#if external}
   <a rel="external" target="_blank" href={destination}>
      {#if countryImage}
         <CountryImage country={player.country} />
      {/if}
      <span class={getPlayerClass(player)}>{player.name}</span>
   </a>
{:else}
   <a href={destination}>
      {#if countryImage}
         <CountryImage country={player.country} />
      {/if}
      <span class={getPlayerClass(player)}>{player.name}</span>
   </a>
{/if}

<style>
   span.panda {
      color: #ff03e3;
   }
   span.qat-head {
      color: #ff006f;
   }
   span.nat {
      color: #0b64f0;
   }
   span.ranking-team {
      color: #1abc9c;
   }
   span.qat {
      color: #f70000;
   }
   span.level-2-supporter {
      color: #f96854;
   }
</style>
