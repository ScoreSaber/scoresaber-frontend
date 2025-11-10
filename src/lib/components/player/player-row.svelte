<script type="ts">
   import { userData } from '$lib/stores/global-store';

   import PlayerLink from '$lib/components/player/player-link.svelte';
   import CountryImage from '$lib/components/image/country-image.svelte';
   import WeeklyChange from '$lib/components/player/weekly-change.svelte';
   import Stats from '$lib/components/player/stats.svelte';

   import { rankToPage } from '$lib/utils/helpers';

   import type { Player } from '$lib/models/PlayerData';

   export let player: Player;
   export let row = 1;
   export let countryFiltered = false;
   export let pageNumber = 1;

   let isExpanded = false;
   const toggleExpanded = () => (isExpanded = !isExpanded);
</script>

<div
   class="table-item {isExpanded ? 'expanded' : ''}"
   on:click={toggleExpanded}
   on:keydown={(e) => e.key === 'Enter' && toggleExpanded()}
   tabindex="0"
   role="button"
   style="grid-row: {row * 2};"
   class:highlighted={$userData?.playerId === player.id}
>
   {#if countryFiltered}
      <div class="rank">
         <span class="rank">#{(row + pageNumber * 50).toLocaleString('en-US')}</span>
         <span class="global-rank">(#{player.rank.toLocaleString('en-US')})</span>
      </div>
   {:else}
      <div class="rank">
         <span class="rank">#{player.rank.toLocaleString('en-US')}</span>
      </div>
   {/if}
   <div class="player">
      <img src={player.profilePicture} alt={player.name} title={player.name} class="image rounded is-24x24" loading="lazy" />
      <span class="playerName"><PlayerLink {player} destination={`/u/${player.id}`} /></span>
   </div>
   <div class="pp centered">
      <span class="pp">{player.pp.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span><span class="pp ppLabel"
         >pp</span
      >
   </div>
   {#if player.scoreStats}
      <div class="total-play-count centered">
         <span>{player.scoreStats.totalPlayCount.toLocaleString('en-US')}</span>
      </div>
      <div class="ranked-play-count centered">
         <span>{player.scoreStats.rankedPlayCount.toLocaleString('en-US')}</span>
      </div>
      <div class="ranked-acc centered">
         <span>{player.scoreStats.averageRankedAccuracy.toFixed(2)}%</span>
      </div>
   {/if}

   <div class="difference centered">
      <WeeklyChange {player} />
   </div>
</div>
<div class="infobox-row" style="grid-row: {row * 2 + 1};">
   <div class="infobox-container">
      <div class="infobox{isExpanded ? ' is-expanded' : ''}">
         <div class="infobox-content">
            <div class="infobox-upper">
               <img
                  src={player.profilePicture}
                  alt={player.name}
                  title={player.name}
                  class="profile-image image rounded is-64x64 has-text-weight-semibold"
                  loading="lazy"
               />
               <div class="player is-size-4">{player.name}</div>
               <div>
                  <CountryImage country={player.country} />
                  <a title="Country Ranking" href={`/rankings?page=${rankToPage(player.countryRank, 50)}&countries=${player.country.toLowerCase()}`} data-sveltekit-preload-code
                     >#{player.countryRank}</a
                  > <span class="separator" />
                  <span title="Performance Points" class="pp">{player.pp.toLocaleString('en-US', { minimumFractionDigits: 2 })}pp</span>
               </div>
            </div>
            <div>
               {#if player.scoreStats}
                  <Stats {player} small={true} />
               {/if}
            </div>
            <a href="/u/{player.id}" class="full-profile-link" data-sveltekit-preload-code>Full profile &rsaquo;</a>
         </div>
      </div>
   </div>
</div>

<style lang="scss">
   .table-item {
      display: grid;
      grid-template-columns: 100px 3fr 2fr 2fr 2fr 3fr 2fr;
      border-radius: 6px;
      margin: 2.5px 2px;
      background-color: var(--gray);
      border: 1px solid var(--borderColor);
      padding: 8px;
      transition: background-color 0.25s ease, border-color 0.25s ease;
      grid-column: 1;
      &:hover {
         background-color: var(--gray-light);
         border-color: var(--gray-light);
      }
      .centered {
         text-align: center;
         display: flex;
         justify-content: center;
         align-items: center;
      }
      .rank,
      .player {
         display: flex;
         align-items: center;
      }
      .rank {
         padding-right: 5px;
      }
      &.highlighted {
         border: 2px solid var(--scoreSaberYellow);
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
      background-color: var(--foregroundItem);
      border: 1px solid var(--borderColor);
      border-top: none;
      border-radius: 0 0 6px 6px;
      grid-column: 1;
      &:not(.is-expanded) {
         background-color: var(--gray);
      }
   }

   .full-profile-link {
      display: inline-block;
      padding: 8px 15px;
      margin-top: 5px;
      border-radius: 6px;
      background: var(--foregroundItem);
      border: 1px solid var(--borderColor);
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
         background-color: var(--gray-light);
      }

      div.table-item {
         cursor: pointer;
         background-color: var(--gray);
      }

      div.table-item.expanded {
         border-radius: 6px 6px 0 0;
         border-bottom: none !important;
         margin-bottom: 0;
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
         background-color: var(--gray-light);
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
         grid-row-gap: 0.25rem;
         grid-column-gap: 0.25rem;
      }

      .table-item > .rank {
         padding-right: 0;
      }

      .table-item > .player {
         grid-column: 2 / span 2;
      }

      .table-item > .pp {
         grid-column-start: 2;
         display: inline-flex;
         justify-content: flex-start;
      }

      .table-item > .ranked-acc {
         grid-column-start: 3;
         display: inline-flex;
         justify-content: flex-start;
      }

      .table-item > .difference {
         grid-column-start: 1;
         grid-row-start: 2;
         justify-content: flex-start;
         padding-left: 0.6rem;
      }

      .infobox {
         border: none !important;
         margin-top: 0 !important;
         margin-bottom: 0 !important;
         border-radius: 0 0 6px 6px;
      }

      .infobox-row {
         margin: 0 !important;
      }

      .infobox-container {
         margin: 0 !important;
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
