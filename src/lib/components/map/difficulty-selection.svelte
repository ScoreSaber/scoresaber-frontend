<script lang="ts">
   import { getDifficultyStyle, getDifficultyLabel } from '$lib/utils/helpers';

   import type { Difficulty } from '$lib/models/LeaderboardData';
   import type { RankingDifficulty } from '$lib/models/Ranking';

   export let diffs: Difficulty[] = null;
   export let rankingDiffs: RankingDifficulty[] = null;
   export let currentDiff: Difficulty;
</script>

<div class="difficulty-tabs">
   <div class="tabs-container">
      {#if diffs}
         {#each diffs as difficulty}
            <a
               href="/leaderboard/{difficulty.leaderboardId}"
               data-sveltekit-preload-data
               data-sveltekit-noscroll
               class="tab-item {getDifficultyStyle(difficulty)} {currentDiff.difficulty === difficulty.difficulty ? 'active' : ''}"
            >
               <span>{getDifficultyLabel(difficulty)}</span>
            </a>
         {/each}
      {:else}
         {#each rankingDiffs as difficulty}
            <a
               href="/ranking/request/{difficulty.requestId}"
               data-sveltekit-preload-data
               data-sveltekit-noscroll
               class="tab-item {getDifficultyStyle(difficulty)} {currentDiff.difficulty === difficulty.difficulty ? 'active' : ''}"
            >
               <span>{getDifficultyLabel(difficulty)}</span>
            </a>
         {/each}
      {/if}
   </div>
</div>

<style>
   .difficulty-tabs {
      margin-bottom: 1.5rem;
      border-bottom: 1px solid var(--borderColor);
   }

   .tabs-container {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      overflow-x: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
   }

   .tabs-container::-webkit-scrollbar {
      display: none;
   }

   .tab-item {
      display: flex;
      align-items: center;
      padding: 0.75rem 1rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--muted);
      text-decoration: none;
      border-bottom: 2px solid transparent;
      margin-bottom: -1px;
      transition: all 0.2s ease;
      white-space: nowrap;
      position: relative;
   }

   .tab-item:hover {
      color: var(--textColor);
      background-color: var(--foregroundItem);
      border-radius: 6px 6px 0 0;
   }

   .tab-item.active {
      color: var(--textColor);
      border-bottom-color: currentColor;
      font-weight: 600;
   }

   .tab-item.easy.active {
      border-bottom-color: var(--easy);
      color: var(--easy);
   }

   .tab-item.normal.active {
      border-bottom-color: var(--normal);
      color: var(--normal);
   }

   .tab-item.hard.active {
      border-bottom-color: var(--hard);
      color: var(--hard);
   }

   .tab-item.expert.active {
      border-bottom-color: var(--expert);
      color: var(--expert);
   }

   .tab-item.expert-plus.active {
      border-bottom-color: var(--expert-plus);
      color: var(--expert-plus);
   }

   .tab-item span {
      display: inline-block;
   }
</style>
