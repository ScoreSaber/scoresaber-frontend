<script type="ts">
   import type { Player } from '$lib/models/PlayerData';
   import PlayerLink from '$lib/components/player/player-link.svelte';
   import CountryImage from '$lib/components/image/country-image.svelte';
   import WeeklyChange from '$lib/components/player/weekly-change.svelte';
   import Stats from '$lib/components/player/stats.svelte';
   import { rankToPage } from '$lib/utils/helpers';
   import { fly } from 'svelte/transition';
   let isExpanded: boolean = false;
   export let player: Player;
   export let row: number = 1;
   export let pageDirection: number = 1;
   export let countryFiltered: boolean = false;
   export let pageNumber: number = 1;

   const toggleExpanded = () => (isExpanded = !isExpanded);
</script>

<div
   in:fly|local={{ x: 100 * pageDirection, duration: 300, delay: 10 * (row - 1) }}
   out:fly|local={{ x: -100 * pageDirection, duration: 300, delay: 10 * (row - 1) }}
   class="table-item {isExpanded ? 'expanded' : ''}"
   on:click={toggleExpanded}
   style="grid-row: {row * 2};"
>
   {#if countryFiltered}
      <div class="rank" width="5px">
         <span class="rank">#{(row + pageNumber * 50).toLocaleString('en-US')}</span>
         <span class="global-rank">(#{player.rank.toLocaleString('en-US')})</span>
      </div>
   {:else}
      <div class="rank" width="5px">
         <span class="rank">#{player.rank.toLocaleString('en-US')}</span>
      </div>
   {/if}
   <div class="player">
      <img src={player.profilePicture} alt={player.name} title={player.name} class="image rounded is-24x24" />
      <span class="playerName"><PlayerLink {player} destination={`/u/${player.id}`} /></span>
      <!-- <span class="playerName">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span> -->
   </div>
   <div class="pp centered">
      <span class="pp">{player.pp.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span><span class="pp ppLabel">pp</span>
   </div>

   <div class="total-play-count centered">
      <span>{player.scoreStats.totalPlayCount.toLocaleString('en-US')}</span>
   </div>
   <div class="ranked-play-count centered">
      <span>{player.scoreStats.rankedPlayCount.toLocaleString('en-US')}</span>
   </div>
   <div class="ranked-acc centered">
      <span>{player.scoreStats.averageRankedAccuracy.toFixed(2)}%</span>
   </div>
   <div class="difference centered">
      <WeeklyChange {player} />
   </div>
</div>
<div class="infobox-row" style="grid-row: {row * 2 + 1};">
   <div colspan="2" class="infobox-container">
      <div class="infobox{isExpanded ? ' is-expanded' : ''}">
         <div class="infobox-content">
            <div class="infobox-upper">
               <img
                  src={player.profilePicture}
                  alt={player.name}
                  title={player.name}
                  class="profile-image image rounded is-64x64 has-text-weight-semibold"
               />
               <div class="player is-size-4">{player.name}</div>
               <div>
                  <CountryImage country={player.country} />
                  <a title="Country Ranking" href={`/rankings?page=${rankToPage(player.countryRank, 50)}&countries=${player.country.toLowerCase()}`}
                     >#{player.countryRank}</a
                  > <span class="separator" />
                  <span title="Performance Points" class="pp">{player.pp.toLocaleString('en-US', { minimumFractionDigits: 2 })}pp</span>
               </div>
            </div>
            <div>
               <Stats {player} small={true} />
            </div>
            <a href="/u/{player.id}" class="full-profile-link">Full profile &rsaquo;</a>
         </div>
      </div>
   </div>
</div>

<style lang="scss">
   .table-item {
      display: grid;
      grid-template-columns: 100px 3fr 2fr 2fr 2fr 3fr 2fr;
      border-radius: 5px;
      margin: 2.5px 2px;
      background-color: var(--gray);
      padding: 8px;
      transition: all 0.25s ease;
      grid-column: 1;
      &:hover {
         background-color: var(--gray-light);
      }
      .centered {
         text-align: center;
         display: flex;
         justify-content: center;
         align-items: center;
      }
      .rank,
      .player,
      .country-rank {
         display: flex;
         align-items: center;
      }
      .rank,
      .country-rank {
         padding-right: 5px;
      }
      .global-rank {
         text-overflow: ellipsis;
         overflow: hidden;
         margin-right: 5px;
         font-size: 12px;
      }
   }
   .player {
      white-space: nowrap;
      display: flex;
      align-items: flex-end;
      overflow: hidden;
   }
   .player span {
      overflow: hidden;
   }
   span.playerName {
      font-weight: 700;
      margin-left: 10px;
      display: flex;
   }

   .infobox-upper {
      gap: 0 10px;
   }

   .profile-image {
      grid-row: 1 / span 2;
   }

   .infobox {
      height: 0;
      transition: all 0.25s ease;
      margin-top: -10px;
      margin-bottom: 5px;
      box-sizing: border-box;
      overflow: hidden;
      pointer-events: none;
      background-color: #3c3c3c;
      border-radius: 0 0 5px 5px;
      grid-column: 1;
      &:not(.is-expanded) {
         background-color: var(--gray);
      }
   }

   .full-profile-link {
      display: inline-block;
      padding: 8px 15px;
      margin-top: 5px;
      border-radius: 5px;
      background: #fff1;
   }

   .infobox-content {
      padding: 25px;
      opacity: 0;
      transition: inherit;
      position: sticky;
   }

   .infobox.is-expanded .infobox-content {
      opacity: 1;
   }

   .infobox-row,
   .infobox-container {
      margin: 0 1px;
      padding: 0;
   }

   .infobox-row {
      display: none;
   }

   .separator {
      display: inline-block;
      height: 1.5em;
      margin: 5px 5px;
      vertical-align: middle;
      width: 1px;
      background: #7f7f7f;
   }
   @media (max-width: 512px) {
      div.table-item:hover,
      div.table-item.expanded {
         background-color: #3c3c3c;
      }

      div.table-item {
         cursor: pointer;
         background-color: #323232;
      }

      div.table-item.expanded {
         border-radius: 5px 5px 0 0;
      }
      .rank {
         width: max-content;
      }

      .infobox-row {
         display: flex;
         align-items: center;
      }
      .table-item:hover,
      .table-item.expanded {
         background-color: #3c3c3c;
      }

      .infobox-row {
         margin-bottom: 5px;
      }
      .table-item div:not(.player, .rank, .pp, .ranked-acc, .difference) {
         display: none;
      }

      .table-item {
         grid-template-columns: minmax(2.5rem, min-content) auto auto;
         grid-template-rows: auto auto;
         grid-row-gap: .25rem;
         grid-column-gap: .25rem;
      }

      .table-item > .rank,
      .table-item > .country-rank {
         padding-right: 0;
      }

      .table-item > .player {
         grid-column: 2/span 2;
      }

      .table-item > .pp {
         grid-column-start: 2;
         display: inline-flex;
         justify-content: flex-start;
      }

      .table-item > .ranked-acc{
         grid-column-start: 3;
         display: inline-flex;
         justify-content: flex-start;
      }

      .table-item > .difference {
         grid-column-start: 1;
         grid-row-start: 2;
         justify-content: flex-start;
         padding-left: .6rem;
      }
   }

   .infobox.is-expanded {
      height: 100%;
      width: 100%;
      pointer-events: all;
      opacity: 1;
   }

   .infobox :global(.stats-container) {
      justify-content: start !important;
   }

   .infobox .player {
      overflow: hidden;
      text-overflow: ellipsis;
   }
</style>
