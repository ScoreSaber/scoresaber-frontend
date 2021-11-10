<script type="ts">
   import type { PlayerScore } from '$lib/models/PlayerData';
   import FormattedDate from '../common/formatted-date.svelte';
   import SmallSongInfo from '../leaderboard/small-song-info.svelte';
   import { rankToPage } from '$lib/utils/helpers';
   import PlayerScoreComponent from './player-score.svelte';
   import { fly } from 'svelte/transition';
   export let score: PlayerScore;
   export let row: number = 0;
</script>

<div class="table-item" style={`--row: ${row}`}>
   <div
      in:fly|local={{ x: 100, duration: 300, delay: 40 * (row - 1) }}
      out:fly|local={{ x: -100, duration: 300, delay: 40 * (row - 1) }}
      class="background"
      style={`--bgURL: url(${score.leaderboard.coverImage})`}
   />
   <div in:fly|local={{ x: 100, duration: 300, delay: 40 * (row - 1) }} out:fly|local={{ x: -100, duration: 300, delay: 40 * (row - 1) }}>
      <div class="rank-info">
         <span>
            <i class="fas fa-globe-americas" title="Ranking" />
            <a title="Ranking" href={`/leaderboard/${score.leaderboard.id}?page=${rankToPage(score.score.rank, 12)}`}
               >#{score.score.rank.toLocaleString('en-US')}</a
            >
         </span>
         <FormattedDate date={score.score.timeSet} />
      </div>
   </div>
   <div in:fly|local={{ x: 100, duration: 300, delay: 40 * (row - 1) }} out:fly|local={{ x: -100, duration: 300, delay: 40 * (row - 1) }}>
      <SmallSongInfo leaderboard={score.leaderboard} />
   </div>
   <div in:fly|local={{ x: 100, duration: 300, delay: 40 * (row - 1) }} out:fly|local={{ x: -100, duration: 300, delay: 40 * (row - 1) }}>
      <PlayerScoreComponent {score} />
   </div>
</div>

<style>
   .rank-info {
      width: 100px;
      display: flex;
      flex-direction: column;
      text-align: center;
      height: 100%;
      justify-content: center;
   }
   .table-item > div {
      position: relative;
      grid-row: var(--row) / span 1;
      padding: 5px;
      margin: 5px 0;
   }
   .table-item > div:nth-child(2) {
      grid-column: 1;
      border-radius: 8px 0 0 8px;
      display: flex;
      align-items: center;
      height: 100%;
   }
   .table-item > div:nth-child(3) {
      grid-column: 2;
      padding: 12px 5px;
   }
   .table-item > div:nth-child(4) {
      grid-column: 3;
      border-radius: 0 8px 8px 0;
   }
   .table-item {
      display: contents;
      position: relative;
   }
   .fas.fa-globe-americas {
      height: 11px;
      width: 16px;
      cursor: help;
   }
   .background {
      grid-column: 1 / span 3;
      position: absolute;
      top: 0;
      bottom: 0;
      background-position: 50% !important;
      background-repeat: no-repeat !important;
      background-size: cover !important;
      z-index: 0;
      border-radius: 8px;
      background: linear-gradient(to left, rgba(36, 36, 36, 0.93), rgb(33, 33, 33)) repeat scroll 0% 0%,
         rgba(0, 0, 0, 0) var(--bgURL) repeat scroll 0% 0%;
      grid-row: var(--row) / span 1;
   }
</style>
