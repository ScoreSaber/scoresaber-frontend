<script lang="ts">
   import type { LeaderboardInfo, Score } from '$lib/models/LeaderboardData';

   import LeaderboardRow from '$lib/components/leaderboard/leaderboard-row.svelte';

   export let leaderboardScores: Score[];
   export let leaderboard: LeaderboardInfo;
   export let showScoreModal: (score: Score, leaderboard: LeaderboardInfo) => void;
   export let pageDirection: number = 1;
   export let playerHighlight: string = undefined;
   let transitioning: boolean[] = [];

   const hasModifiers = (leaderboardScores ?? []).filter((score) => score.modifiers.length > 0).length > 0;
   let columns = leaderboard.ranked ? 4 : 2;
   if (hasModifiers) columns++;
</script>

<div class="gridTable" style="--columns: 1fr 5fr repeat({columns}, 2fr)" class:transitioning={transitioning.some((t) => t)}>
   <div class="header">
      <div />
      <div />
      <div class="centered">Time Set</div>
      <div class="centered">Score</div>
      {#if hasModifiers}
         <div class="centered">Mods</div>
      {/if}
      {#if leaderboard.maxScore}
         <div class="centered">Accuracy</div>
      {/if}
      {#if leaderboard.ranked}
         <div class="centered">PP</div>
      {/if}
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
         bind:transitioning={transitioning[i]}
      />
   {/each}
</div>

<style lang="scss">
   .gridTable {
      display: grid;
      grid-template-columns: 1fr;
      min-width: 500px;
      margin-bottom: 10px;
      &.transitioning {
         overflow: hidden;
      }
      .header {
         font-weight: bold;
         grid-row: 1;
      }
      .centered {
         text-align: center;
      }
      > div {
         display: grid;
         grid-template-columns: var(--columns);
      }
   }
</style>
