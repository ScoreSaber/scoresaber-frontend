<script type="ts">
   import type { Player } from '$lib/models/PlayerData';
   import PlayerLink from '$lib/components/player/player-link.svelte';
   import WeeklyChange from '$lib/components/player/weekly-change.svelte';
   const isExpanded: boolean = false;
   export let player: Player;
</script>

<tr class="table-item">
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
   tr.table-item td {
      background-color: #323232;
   }
   tr.table-item:hover td {
      background-color: #3c3c3c;
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
</style>
