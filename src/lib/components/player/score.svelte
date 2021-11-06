<script type="ts">
   import type { PlayerScore } from '$lib/models/PlayerData';
   import FormattedDate from '../common/formatted-date.svelte';
   import SmallSongInfo from '../leaderboard/small-song-info.svelte';
   export let score: PlayerScore;
</script>

<tr class="table-item">
   <td>
      <div class="rank-info">
         <span>
            <i class="fas fa-globe-americas" title="Ranking" />
            <a title="Ranking" href={`#`}>#{score.score.rank}</a>
         </span>
         <FormattedDate date={score.score.timeSet} />
      </div>
   </td>
   <td>
      <SmallSongInfo leaderboard={score.leaderboard} />
   </td>
   <td />
</tr>

<style>
   .rank-info {
      width: 100px;
      display: flex;
      flex-direction: column;
      text-align: center;
   }

   td {
      border: none !important;
      border-style: solid none;
      align-items: center;
      vertical-align: middle;
   }

   td:first-child {
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
   }
   td:last-child {
      border-bottom-right-radius: 5px;
      border-top-right-radius: 5px;
   }

   tr.table-item {
      background-color: #323232;
   }
   tr.table-item:hover {
      background-color: #3c3c3c;
   }

   .fas.fa-globe-americas {
      height: 11px;
      width: 16px;
      cursor: help;
   }
</style>
