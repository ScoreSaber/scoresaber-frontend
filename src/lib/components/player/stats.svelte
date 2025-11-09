<script lang="ts">
   import dateFormat from 'dateformat';

   import type { Player } from '$lib/models/PlayerData';

   export let player: Player;
   export let small = false;
</script>

<div class="stats-container">
   <div class="stat-item ranked">
      <span class="stat-title">Ranked Play Count</span>
      <span class="stat-spacer" />
      <span class="stat-content">{player.scoreStats ? player.scoreStats.rankedPlayCount.toLocaleString('en-US') : '0'}</span>
   </div>

   <div class="stat-item ranked">
      {#if small}
         <span class="stat-title">Ranked Score</span>
      {:else}
         <span class="stat-title">Total Ranked Score</span>
      {/if}
      <span class="stat-spacer" />
      <span class="stat-content">{player.scoreStats ? player.scoreStats.totalRankedScore.toLocaleString('en-US') : '0'}</span>
   </div>

   <div class="stat-item ranked">
      {#if small}
         <span class="stat-title">Avg Ranked Acc</span>
      {:else}
         <span class="stat-title">Average Ranked Accuracy</span>
      {/if}
      <span class="stat-spacer" />
      <span class="stat-content">{player.scoreStats ? player.scoreStats.averageRankedAccuracy.toFixed(2) : '0'}%</span>
   </div>

   <div class="stat-item">
      <span class="stat-title">Total Play Count</span>
      <span class="stat-spacer" />
      <span class="stat-content">{player.scoreStats ? player.scoreStats.totalPlayCount.toLocaleString('en-US') : '0'}</span>
   </div>

   <div class="stat-item">
      <span class="stat-title">Total Score</span>
      <span class="stat-spacer" />
      <span class="stat-content">{player.scoreStats ? player.scoreStats.totalScore.toLocaleString('en-US') : '0'}</span>
   </div>

   <div class="stat-item">
      {#if small}
         <span class="stat-title">Replay Views</span>
      {:else}
         <span class="stat-title">Replays Watched by Others</span>
      {/if}
      <span class="stat-spacer" />
      <span class="stat-content">{player.scoreStats ? player.scoreStats.replaysWatched.toLocaleString('en-US') : '0'}</span>
   </div>

   <div class="stat-item">
      <span class="stat-title">Joined</span>
      <span class="stat-spacer" />
      <span class="stat-content has-hover" title={dateFormat(player.firstSeen, 'dddd, mmmm dS, yyyy, h:MM:ss TT')}>
         {new Date(player.firstSeen).toLocaleString('en-us', { month: 'long', year: 'numeric' })}
      </span>
   </div>

   {#if player.role}
      <div class="stat-item">
         <span class="stat-title">Role</span>
         <span class="stat-spacer" />
         <span class="stat-content">{player.role}</span>
      </div>
   {/if}
</div>

<style>
   .stats-container {
      display: flex;
      flex-wrap: wrap;
      gap: 0.375rem;
      align-items: center;
   }
   .stat-item {
      display: inline-flex;
      align-items: center;
      background-color: var(--foregroundItem);
      color: var(--textColor);
      padding: 0.25rem 0.5rem;
      border: 1px solid var(--borderColor);
      border-radius: 4px;
      cursor: default;
      transition: border-color 0.2s ease, background-color 0.2s ease;
      font-size: 0.8125rem;
      line-height: 1.4;
      white-space: nowrap;
   }
   .stat-item.ranked {
      background-color: var(--ppColourDark);
      border-color: rgba(137, 146, 232, 0.3);
      color: #fff;
   }
   .stat-item.ranked .stat-title {
      color: rgba(255, 255, 255, 0.85);
      font-size: 0.75rem;
   }
   .stat-item.ranked .stat-content {
      color: #fff;
      font-weight: 600;
      font-size: 0.8125rem;
   }
   .stat-title {
      font-weight: 500;
      color: var(--muted);
      font-size: 0.75rem;
   }
   .stat-spacer {
      border-left: 1px solid var(--borderColor);
      width: 0;
      height: 12px;
      margin-left: 0.375rem;
      margin-right: 0.375rem;
      opacity: 0.5;
   }
   .stat-item.ranked .stat-spacer {
      border-left-color: rgba(255, 255, 255, 0.25);
      height: 12px;
   }
   .stat-content {
      font-weight: 500;
      color: var(--textColor);
      font-size: 0.8125rem;
   }
   @media only screen and (max-width: 769px) {
      .stats-container {
         justify-content: center;
         max-width: 100%;
      }
   }
   .has-hover {
      cursor: help;
   }
</style>
