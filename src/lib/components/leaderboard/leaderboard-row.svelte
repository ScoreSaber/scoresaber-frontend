<script type="ts">
   import PlayerLink from '$lib/components/player/player-link.svelte';
   import type { Score } from '$lib/models/LeaderboardData';
   export let score: Score;
</script>

<tr class="table-item">
   <td class="rank" width="5px">
      <span class="rank">#{score.rank}</span>
   </td>
   <td class="player">
      <img
         src={score.leaderboardPlayerInfo.profilePicture}
         alt={score.leaderboardPlayerInfo.name}
         title={score.leaderboardPlayerInfo.name}
         class="image rounded is-24x24"
      />
      <span class="playerName"><PlayerLink player={score.leaderboardPlayerInfo} destination={`/u/${score.leaderboardPlayerInfo.playerId}`} /></span>
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
</style>
