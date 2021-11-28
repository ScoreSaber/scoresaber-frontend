<script lang="ts">
   import CountryImage from '$lib/components/image/country-image.svelte';
   import Permissions from '$lib/utils/permissions';
   import type { LeaderboardPlayer, Player } from '$lib/models/PlayerData';

   export let player: Player | LeaderboardPlayer;
   export let destination: string | null;
   export let external: boolean = false;
   export let countryImage: boolean = true;

   let playerClass : string;
   let playerTitle : string;
   $: ([playerClass, playerTitle] = getPlayerClassAndTitle(player));

   export function getPlayerClassAndTitle(player: Player | LeaderboardPlayer): [string, string] {
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

{#if destination !== null}
   {#if external}
      <a title={playerTitle} rel="external" target="_blank" href={destination} class="player-link">
         {#if countryImage}
            <CountryImage country={player.country}/>
         {/if}
         <span class={playerClass}>{player.name}</span>
      </a>
   {:else}
      <a title={playerTitle} href={destination}>
         {#if countryImage}
            <CountryImage country={player.country}/>
         {/if}
         <span class={playerClass}>{player.name}</span>
      </a>
   {/if}
{:else}
   {#if countryImage}
      <CountryImage country={player.country}/>
   {/if}
   <span class={playerClass}>{player.name}</span>
{/if}

<style lang="scss">
   .williums {
      width: max-content;
      background: linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet, indigo, blue, green, yellow, orange, red);
      color: transparent;
      background-size: 300px 100%;
      background-position: top 50%;
      animation: gay 8s linear infinite;
      background-clip: text;
      -webkit-background-clip: text;
   }

   @keyframes gay {
      0% {
         background-position: 300px 0;
      }
      100% {
         background-position: 0 0;
      }
   }
   a {
      display: flex;
      align-items: flex-start;
      span:not(:first-child) {
         margin-left: 5px;
      }
   }
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
   a span:hover {
      color: var(--scoreSaberYellow)!important;
   }
   span.default {
      color: var(--alternate);
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
