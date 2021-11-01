<script lang="ts">
   import CountryImage from '$lib/components/image/country-image.svelte';
   import NameBadge from '$lib/components/image/name-badge.svelte';
   import * as permissions from '$lib/utils/permissions';
   import type { Player } from '$lib/models/PlayerData';

   export let player: Player;
   export let destination: string;
   export let external: boolean = false;
   export let countryImage: boolean = true;

   $: playerClass = getPlayerClass(player);

   export function getPlayerClass(player: Player): [string, string] {
      if (permissions.checkPermissionNumber(player.permissions, permissions.PANDA)) {
         return ['panda', 'Owner of ScoreSaber'];
      }

      if (permissions.checkPermissionNumber(player.permissions, permissions.ADMIN)) {
         return ['admin', 'ScoreSaber Admin'];
      }

      if (permissions.checkPermissionNumber(player.permissions, permissions.QATHead)) {
         return ['qat-head', 'Head of Quality Assurance'];
      }

      if (permissions.checkPermissionNumber(player.permissions, permissions.NAT)) {
         return ['nat', 'Nomination Assessment Team'];
      }

      if (permissions.checkPermissionNumber(player.permissions, permissions.RT)) {
         if (player.role.includes('Recruit')) {
            return ['rtr', 'Ranking Team Recruit'];
         } else {
            return ['rt', 'Ranking Team'];
         }
      }

      if (permissions.checkPermissionNumber(player.permissions, permissions.QAT)) {
         return ['qat', 'Quality Assurance Team'];
      }

      //williums
      if (player.id == '76561198182060577') {
         return ['williums', 'Gay'];
      }
      if (player.role == 'Supporter') {
         return ['supporter', 'ScoreSaber Supporter'];
      }
      if (player.role == 'Developer') {
         return ['dev', 'A Developer for ScoreSaber'];
      }
      if (player.role == 'PPv3 Developer') {
         return ['ppv3', player.role];
      }
      return ['default', player.name];
   }
</script>

{#if external}
   <a title={playerClass[1]} rel="external" target="_blank" href={destination}>
      {#if countryImage}
         <CountryImage country={player.country} />
      {/if}
      <span class={playerClass[0]}>{player.name}</span>
   </a>
{:else}
   <a title={playerClass[1]} href={destination}>
      {#if countryImage}
         <CountryImage country={player.country} />
      {/if}
      <span class={playerClass[0]}>{player.name}</span>
   </a>
{/if}

<style>
   a,
   span {
      overflow: hidden;
      text-overflow: ellipsis;
   }
   span.panda {
      color: #ff03e3;
   }
   span.admin {
      color: #bfdcf9;
   }
   span.qat-head {
      color: #ff006f;
   }
   span.nat {
      color: #0b64f0;
   }
   span.rt {
      color: #1abc9c;
   }
   span.rtr {
      color: #11806a;
   }
   span.qat {
      color: #f70000;
   }
   span.dev {
      color: #111111;
   }
   span.ppv3 {
      color: #8d4eca;
   }
   span.supporter {
      color: #f96854;
   }
</style>
