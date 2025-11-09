<script lang="ts">
   import LeaderboardRow from '$lib/components/leaderboard/leaderboard-row.svelte';

   import type { LeaderboardInfo, Score } from '$lib/models/LeaderboardData';

   export let leaderboardScores: Score[];
   export let leaderboard: LeaderboardInfo;
   export let showScoreModal: (score: Score, leaderboard: LeaderboardInfo) => void;
   export let playerHighlight: string = undefined;

   $: hasModifiers = (leaderboardScores ?? []).filter((score) => score.modifiers.length > 0).length > 0 ? 1 : 0;
   $: columns = (leaderboard.ranked ? 4 : leaderboard.maxScore ? 3 : 2) + hasModifiers;
</script>

<div class="gridTable" style="--columns: 1fr 5fr repeat({columns}, 2fr)">
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
         padding: 0 5px;
         margin: 2.5px 1px;
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
