<script lang="ts">
   import CountryImage from '$lib/components/image/country-image.svelte';
   import NameBadge from '$lib/components/image/name-badge.svelte';
   import Permissions from '$lib/utils/permissions';
   import type { LeaderboardPlayer, Player } from '$lib/models/PlayerData';

   export let player: Player | LeaderboardPlayer;
   export let destination: string;
   export let external: boolean = false;
   export let countryImage: boolean = true;

   $: playerClass = getPlayerClass(player);

   export function getPlayerClass(player: Player | LeaderboardPlayer): [string, string] {
      if (Permissions.checkPermissionNumber(player.permissions, Permissions.security.PANDA)) {
         return ['panda', 'Owner of ScoreSaber'];
      }

      if (Permissions.checkPermissionNumber(player.permissions, Permissions.security.ADMIN)) {
         return ['admin', 'ScoreSaber Admin'];
      }

      if (Permissions.checkPermissionNumber(player.permissions, Permissions.security.QATHead)) {
         return ['qat-head', 'Head of Quality Assurance'];
      }

      if (Permissions.checkPermissionNumber(player.permissions, Permissions.security.NAT)) {
         return ['nat', 'Nomination Assessment Team'];
      }

      if (Permissions.checkPermissionNumber(player.permissions, Permissions.security.RT)) {
         if (player.role.includes('Recruit')) {
            return ['rtr', 'Ranking Team Recruit'];
         } else {
            return ['rt', 'Ranking Team'];
         }
      }

      if (Permissions.checkPermissionNumber(player.permissions, Permissions.security.QAT)) {
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
   <a title={playerClass[1]} rel="external" target="_blank" href={destination} class="player-link">
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
   .player-link {
      display: inline-flex;
      gap: 5px;
      align-items: center;
   }
   a,
   span {
      overflow: hidden;
      text-overflow: ellipsis;
   }
   span.panda {
      color: var(--panda);
   }
   span.admin {
      color: var(--admin);
   }
   span.qat-head {
      color: var(--qat-head);
   }
   span.nat {
      color: var(--nat);
   }
   span.rt {
      color: var(--rt);
   }
   span.rtr {
      color: var(--rtr);
   }
   span.qat {
      color: var(--qat);
   }
   span.dev {
      color: var(--dev);
   }
   span.ppv3 {
      color: var(--ppv3);
   }
   span.supporter {
      color: var(--supporter);
   }
</style>
