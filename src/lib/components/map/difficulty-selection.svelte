<script lang="ts">
   import { getDifficultyStyle, getDifficultyLabel } from '$lib/utils/helpers';

   import type { Difficulty } from '$lib/models/LeaderboardData';
   import type { RankingDifficulty } from '$lib/models/Ranking';

   export let diffs: Difficulty[] = null;
   export let rankingDiffs: RankingDifficulty[] = null;
   export let currentDiff: Difficulty;
</script>

<div class="tabs is-centered">
   <ul class="m-0">
      {#if diffs}
         {#each diffs as difficulty}
            <li>
               <a
                  href="/leaderboard/{difficulty.leaderboardId}"
                  class={getDifficultyStyle(difficulty) + ' ' + (currentDiff.difficulty === difficulty.difficulty ? 'selected' : '')}
               >
                  <span>{getDifficultyLabel(difficulty)}</span>
               </a>
            </li>
         {/each}
      {:else}
         {#each rankingDiffs as difficulty}
            <li>
               <a
                  href="/ranking/request/{difficulty.requestId}"
                  class={getDifficultyStyle(difficulty) + ' ' + (currentDiff.difficulty === difficulty.difficulty ? 'selected' : '')}
               >
                  <span>{getDifficultyLabel(difficulty)}</span>
               </a>
            </li>
         {/each}
      {/if}
   </ul>
</div>

<style>
   .tabs a.easy {
      border-bottom-color: var(--easy);
      color: var(--easy);
   }

   .tabs a.normal {
      border-bottom-color: var(--normal);
      color: var(--normal);
   }

   .tabs a.hard {
      border-bottom-color: var(--hard);
      color: var(--hard);
   }

   .tabs a.expert {
      border-bottom-color: var(--expert);
      color: var(--expert);
   }

   .tabs a.expert-plus {
      border-bottom-color: var(--expert-plus);
      color: var(--expert-plus);
   }
</style>
