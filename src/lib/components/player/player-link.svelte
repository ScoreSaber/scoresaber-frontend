<script lang="ts">
   import CountryImage from '$lib/components/image/country-image.svelte';

   import Permissions from '$lib/utils/permissions';

   import type { LeaderboardPlayer, Player } from '$lib/models/PlayerData';

   export let player: Player | LeaderboardPlayer;
   export let destination: string | null;
   export let external = false;
   export let countryImage = true;

   let playerClass: string;
   let playerTitle: string;
   $: [playerClass, playerTitle] = getPlayerClassAndTitle(player);

   export function getPlayerClassAndTitle(player: Player | LeaderboardPlayer): [string, string] {
      let cssClass = 'default';
      let title = player.name;

      if (Permissions.checkPermissionNumber(player.permissions, Permissions.security.PANDA)) {
         cssClass = 'panda';
         title = 'Owner of ScoreSaber';
      }
      else if (Permissions.checkPermissionNumber(player.permissions, Permissions.security.ADMIN)) {
         cssClass = 'admin';
         title = 'ScoreSaber Admin';
      }
      else if (Permissions.checkPermissionNumber(player.permissions, Permissions.security.QATHead)) {
         cssClass = 'qat-head';
         title = 'Head of Quality Assurance';
      }
      else if (Permissions.checkPermissionNumber(player.permissions, Permissions.security.NAT)) {
         cssClass = 'nat';
         title = 'Nomination Assessment Team';
      }
      else if (Permissions.checkPermissionNumber(player.permissions, Permissions.security.RT)) {
         if (player.role.includes('Recruit')) {
            cssClass = 'rtr';
            title = 'Ranking Team Recruit';
         } else {
            cssClass = 'rt';
            title = 'Ranking Team';
         }
      }
      else if (Permissions.checkPermissionNumber(player.permissions, Permissions.security.QAT)) {
         cssClass = 'qat';
         title = 'Quality Assurance Team';
      }
      else if (Permissions.checkPermissionNumber(player.permissions, Permissions.security.PPV3)) {
         cssClass = 'ppv3';
         title = 'PPv3 Developer';
      }
      else if (Permissions.checkPermissionNumber(player.permissions, Permissions.security.DEV)) {
         cssClass = 'dev';
         title = 'A Developer for ScoreSaber';
      }
      else if (Permissions.checkPermissionNumber(player.permissions, Permissions.security.CCT)) {
         cssClass = 'cct';
         title = 'Content Creation Team';
      }
      else if (Permissions.checkPermissionNumber(player.permissions, Permissions.security.SUPPORTER)) {
         cssClass = 'supporter';
         title = 'ScoreSaber Supporter';
      }

      // individual player overrides

      // qwasyx
      if (player.id == '76561198041178440') {
         cssClass = 'gay';
      }
      // williums
      if (player.id == '76561198182060577') {
         cssClass = 'gay';
         title = 'Gay';
      }

      return [cssClass, title];
   }
</script>

{#if destination !== null}
   {#if external}
      <a title={playerTitle} rel="external" target="_blank" href={destination} class="player-link">
         {#if countryImage}
            <CountryImage country={player.country} />
         {/if}
         <span class={playerClass}>{player.name}</span>
      </a>
   {:else}
      <a title={playerTitle} href={destination}>
         {#if countryImage}
            <CountryImage country={player.country} />
         {/if}
         <span class={playerClass}>{player.name}</span>
      </a>
   {/if}
{:else}
   {#if countryImage}
      <CountryImage country={player.country} />
   {/if}
   <span class={playerClass}>{player.name}</span>
{/if}

<style lang="scss">
   .gay {
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
      transition: color 300ms;
      overflow: hidden;
      text-overflow: ellipsis;
   }
   a span:hover {
      color: var(--scoreSaberYellow) !important;
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
   span.cct {
      color: var(--cct);
   }
   span.supporter {
      color: var(--supporter);
   }
</style>
