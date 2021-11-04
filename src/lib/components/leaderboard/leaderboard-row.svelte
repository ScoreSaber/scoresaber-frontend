<script type="ts">
   import PlayerLink from '$lib/components/player/player-link.svelte';
   import type { LeaderboardInfo, Score } from '$lib/models/LeaderboardData';
   import FormattedDate from '../common/formatted-date.svelte';
   export let score: Score;
   export let leaderboard: LeaderboardInfo;
</script>

<tr class="table-item">
   <td class="rank" width="5px">
      <span class="rank tag is">#{score.rank}</span>
   </td>
   <td class="player">
      <img
         src="https://cdn.scoresaber.com/avatars/steam.png"
         alt={score.leaderboardPlayerInfo.name}
         title={score.leaderboardPlayerInfo.name}
         class="image rounded is-24x24"
      />
      <span class="playerName"><PlayerLink player={score.leaderboardPlayerInfo} destination={`/u/${score.leaderboardPlayerInfo.id}`} /></span>
   </td>
   <td class="timeSet centered">
      <span><FormattedDate date={new Date(score.timeSet)} /></span>
   </td>
   <td class="score centered">
      <span>{score.baseScore.toLocaleString('en-US')}</span>
   </td>
   {#if leaderboard.maxScore}
      <td class="accuracy centered">
         <span>{(100.005115151).toFixed(2)}%</span>
      </td>
   {/if}
   <td class="pp centered">
      <span class="pp">{score.pp.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span><span class="pp ppLabel">pp</span>
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
   tr.table-item td {
      background-color: var(--gray);
   }
   tr.table-item:hover td {
      background-color: var(--gray-light);
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
