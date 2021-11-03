<script type="ts">
   import type { Player } from '$lib/models/PlayerData';
   import PlayerLink from '$lib/components/player/player-link.svelte';
   import CountryImage from '$lib/components/image/country-image.svelte';
   import WeeklyChange from '$lib/components/player/weekly-change.svelte';
   import Stats from '$lib/components/player/stats.svelte';
   let isExpanded: boolean = false;
   export let player: Player;

   const toggleExpanded = () => (isExpanded = !isExpanded);
</script>

<tr class="table-item {isExpanded ? 'expanded' : ''}" on:click={toggleExpanded}>
   <td class="rank" width="5px">
      <span class="rank">#{player.rank}</span>
   </td>
   <td class="player">
      <img src={player.profilePicture} alt={player.name} title={player.name} class="image rounded is-24x24" />
      <span class="playerName"><PlayerLink {player} destination={`/u/${player.id}`} /></span>
      <!-- <span class="playerName">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span> -->
   </td>
   <td class="pp centered">
      <span class="pp">{player.pp.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span><span class="pp ppLabel">pp</span>
   </td>

   <td class="total-play-count centered">
      <span>{player.scoreStats.totalPlayCount}</span>
   </td>
   <td class="ranked-play-count centered">
      <span>{player.scoreStats.rankedPlayCount}</span>
   </td>
   <td class="ranked-acc centered">
      <span>{player.scoreStats.averageRankedAccuracy.toFixed(2)}%</span>
   </td>
   <td class="difference centered">
      <WeeklyChange {player} />
   </td>
</tr>
<tr class="infobox-row">
   <td colspan="2" class="infobox-container"
      ><div class="infobox{isExpanded ? ' is-expanded' : ''}">
         <div class="infobox-content">
            <div class="infobox-upper">
               <img
                  src={player.profilePicture}
                  alt={player.name}
                  title={player.name}
                  class="profile-image image rounded is-64x64 has-text-weight-semibold"
               />
               <div class="player is-size-3">{player.name}</div>
               <div><CountryImage country={player.country} /> #{player.countryRank} <span class="separator" /> {player.pp}pp</div>
            </div>
            <div>
               <Stats {player} />
            </div>
            <a href="/u/{player.id}" class="full-profile-link">Full profile &rsaquo;</a>
         </div>
      </div>
   </td>
</tr>

<style>
   td {
      border: none !important;
      border-style: solid none;
      align-items: center;
      vertical-align: bottom;
   }
   td.player {
      white-space: nowrap;
      display: flex;
      align-items: flex-end;
      overflow: hidden;
   }
   td.player span {
      overflow: hidden;
      text-overflow: ellipsis;
   }

   @media (min-width: 1024px) {
      .player {
         max-width: 250px;
      }
   }
   @media (max-width: 1024px) {
      .player {
         max-width: 55vw;
      }
   }
   span.playerName {
      font-weight: 700;
      margin-left: 10px;
      display: flex;
   }
   tr.table-item {
      border-radius: 5px;
      overflow: hidden;
   }
   tr.table-item td {
      background-color: #323232;
   }
   td:first-child {
      border-left-style: solid;
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
   }
   td:last-child {
      border-right-style: solid;
      border-bottom-right-radius: 5px;
      border-top-right-radius: 5px;
   }

   .infobox-upper {
      display: grid;
      grid-template-columns: max-content auto;
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
      margin: 0;
      padding: 0;
   }

   .infobox-row {
      display: none;
   }

   .separator {
      display: inline-block;
      height: 1.5em;
      margin: 5px 0;
      vertical-align: middle;
      width: 1px;
      background: #7f7f7f;
   }
   @media (max-width: 512px) {
      tr.table-item:hover td,
      tr.table-item.expanded td {
         background-color: #3c3c3c;
      }

      tr.table-item {
         cursor: pointer;
         background-color: #323232;
      }

      tr.table-item.expanded {
         border-radius: 5px 5px 0 0;
      }
      .rank {
         width: max-content;
      }
      .table-item,
      .infobox-row {
         display: flex;
         align-items: center;
         width: 100%;
      }
      .table-item:hover,
      .table-item.expanded {
         background-color: #3c3c3c;
      }

      .infobox-row {
         margin-bottom: 5px;
      }
      .table-item td:not(.player, .rank) {
         display: none;
      }
   }

   .infobox.is-expanded {
      height: 341px;
      pointer-events: all;
      opacity: 1;
   }

   .infobox :global(.stats-container) {
      justify-content: start !important;
   }
</style>
