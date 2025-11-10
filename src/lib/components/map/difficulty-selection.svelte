<script lang="ts">
   import { onMount } from 'svelte';

   import { goto } from '$app/navigation';

   import { getDifficultyStyle, getDifficultyLabel } from '$lib/utils/helpers';

   import type { Difficulty } from '$lib/models/LeaderboardData';
   import type { RankingDifficulty } from '$lib/models/Ranking';

   export let diffs: Difficulty[] = null;
   export let rankingDiffs: RankingDifficulty[] = null;
   export let currentDiff: Difficulty;

   let containerElement: HTMLDivElement;
   let showLeftIndicator = false;
   let showRightIndicator = false;

   function updateScrollIndicators() {
      if (!containerElement) return;

      const { scrollLeft, scrollWidth, clientWidth } = containerElement;
      showLeftIndicator = scrollLeft > 10;
      showRightIndicator = scrollLeft < scrollWidth - clientWidth - 10;
   }

   function handleDifficultyClick(event: MouseEvent, url: string) {
      event.preventDefault();
      goto(url, { keepfocus: true, noscroll: true, replaceState: true });
   }

   onMount(() => {
      updateScrollIndicators();

      const handleResize = () => updateScrollIndicators();
      window.addEventListener('resize', handleResize);

      return () => {
         window.removeEventListener('resize', handleResize);
      };
   });
</script>

<div class="difficulty-tabs" class:show-left={showLeftIndicator} class:show-right={showRightIndicator}>
   <div class="tabs-container" bind:this={containerElement} on:scroll={updateScrollIndicators}>
      {#if diffs}
         {#each diffs as difficulty}
            <a
               href="/leaderboard/{difficulty.leaderboardId}"
               on:click={(e) => handleDifficultyClick(e, `/leaderboard/${difficulty.leaderboardId}`)}
               data-sveltekit-preload-data
               class="tab-item {getDifficultyStyle(difficulty)} {currentDiff.difficulty === difficulty.difficulty ? 'active' : ''}"
            >
               <span>{getDifficultyLabel(difficulty)}</span>
            </a>
         {/each}
      {:else}
         {#each rankingDiffs as difficulty}
            <a
               href="/ranking/request/{difficulty.requestId}"
               on:click={(e) => handleDifficultyClick(e, `/ranking/request/${difficulty.requestId}`)}
               data-sveltekit-preload-data
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
      padding: 0.5rem;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 8px;
      border: 1px solid var(--borderColor);
      position: relative;
   }

   .difficulty-tabs::before,
   .difficulty-tabs::after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      width: 40px;
      pointer-events: none;
      z-index: 1;
      opacity: 0;
      transition: opacity 0.3s ease;
   }

   .difficulty-tabs::before {
      left: 0;
      background: linear-gradient(to right, rgba(23, 24, 31, 0.95), transparent);
      border-radius: 8px 0 0 8px;
   }

   .difficulty-tabs::after {
      right: 0;
      background: linear-gradient(to left, rgba(23, 24, 31, 0.95), transparent);
      border-radius: 0 8px 8px 0;
   }

   .difficulty-tabs.show-left::before {
      opacity: 1;
   }

   .difficulty-tabs.show-right::after {
      opacity: 1;
   }

   .tabs-container {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      overflow-x: auto;
      overflow-y: hidden;
      scrollbar-width: none;
      -ms-overflow-style: none;
      -webkit-overflow-scrolling: touch;
      scroll-behavior: smooth;
      scroll-snap-type: x proximity;
      scroll-padding: 0.5rem;
   }

   .tabs-container::-webkit-scrollbar {
      display: none;
   }

   @media (max-width: 768px) {
      .tabs-container {
         justify-content: flex-start;
         scroll-snap-type: x mandatory;
      }
   }

   .tab-item {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.65rem 1.25rem;
      font-size: 0.875rem;
      font-weight: 600;
      line-height: 1;
      color: var(--textColor);
      text-decoration: none;
      transition: all 0.2s ease;
      white-space: nowrap;
      position: relative;
      opacity: 0.5;
      border-radius: 6px;
      background: transparent;
      border: 1px solid transparent;
      flex-shrink: 0;
      scroll-snap-align: center;
      -webkit-tap-highlight-color: transparent;
   }

   @media (max-width: 768px) {
      .tab-item {
         min-width: min-content;
         touch-action: pan-x;
      }
   }

   .tab-item:hover {
      opacity: 0.8;
      background: rgba(255, 255, 255, 0.05);
   }

   .tab-item.active {
      opacity: 1;
   }

   .tab-item.easy {
      color: var(--easy);
   }

   .tab-item.easy.active {
      background: rgba(59, 178, 115, 0.1);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border-color: rgba(59, 178, 115, 0.3);
   }

   .tab-item.easy.active:hover {
      background: rgba(59, 178, 115, 0.15);
      border-color: var(--easy);
   }

   .tab-item.normal {
      color: var(--normal);
   }

   .tab-item.normal.active {
      background: rgba(89, 175, 255, 0.1);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border-color: rgba(89, 175, 255, 0.3);
   }

   .tab-item.normal.active:hover {
      background: rgba(89, 175, 255, 0.15);
      border-color: var(--normal);
   }

   .tab-item.hard {
      color: var(--hard);
   }

   .tab-item.hard.active {
      background: rgba(255, 136, 0, 0.1);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border-color: rgba(255, 136, 0, 0.3);
   }

   .tab-item.hard.active:hover {
      background: rgba(255, 136, 0, 0.15);
      border-color: var(--hard);
   }

   .tab-item.expert {
      color: var(--expert);
   }

   .tab-item.expert.active {
      background: rgba(239, 83, 80, 0.1);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border-color: rgba(239, 83, 80, 0.3);
   }

   .tab-item.expert.active:hover {
      background: rgba(239, 83, 80, 0.15);
      border-color: var(--expert);
   }

   .tab-item.expert-plus {
      color: var(--expert-plus);
   }

   .tab-item.expert-plus.active {
      background: rgba(138, 71, 255, 0.1);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border-color: rgba(138, 71, 255, 0.3);
   }

   .tab-item.expert-plus.active:hover {
      background: rgba(138, 71, 255, 0.15);
      border-color: var(--expert-plus);
   }

   .tab-item span {
      display: inline-block;
   }
</style>
