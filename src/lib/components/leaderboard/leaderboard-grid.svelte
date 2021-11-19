<script lang="ts">
   import type { LeaderboardInfo, Score } from '$lib/models/LeaderboardData';

   import LeaderboardRow from '$lib/components/leaderboard/leaderboard-row.svelte';

   export let leaderboardScores: Score[];
   export let leaderboard: LeaderboardInfo;
   export let showScoreModal: (score: Score) => void;
   export let pageDirection: number = 1;
   export let playerHighlight: string = undefined;
</script>

<div
   class="gridTable"
   style="--rows: 1fr 5fr {(leaderboardScores ?? []).filter((score) => score.modifiers.length > 0).length
      ? '2fr 2fr 2fr 2fr 2fr'
      : '2fr 2fr 2fr 2fr'}"
>
   <div class="header">
      <div />
      <div />
      <div class="centered">Time Set</div>
      <div class="centered">Score</div>
      {#if (leaderboardScores ?? []).filter((score) => score.modifiers.length > 0).length > 0}
         <div class="centered">Mods</div>
      {/if}
      <div class="centered">Accuracy</div>
      <div class="centered">PP</div>
   </div>
   {#each leaderboardScores ?? [] as score, i (score.id)}
      <LeaderboardRow
         highlighted={playerHighlight === score.leaderboardPlayerInfo.id}
         {score}
         {leaderboard}
         otherScores={leaderboardScores ?? []}
         {showScoreModal}
         row={i + 2}
         {pageDirection}
      />
   {/each}
</div>

<style lang="scss">
   .gridTable {
      display: grid;
      grid-template-columns: 1fr;
      min-width: 500px;
      margin-bottom: 10px;
      .header {
         font-weight: bold;
         grid-row: 1;
      }
      .centered {
         text-align: center;
      }
      > div {
         display: grid;
         grid-template-columns: var(--rows);
      }
   }
</style>
