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
   }
   .stat-item {
      display: inline-block;
      background-color: var(--foregroundItem);
      color: var(--textColor);
      padding: 5px 10px 5px 10px;
      border-radius: 10px;
      margin: 0 5px 5px 0;
      cursor: default;
   }
   .stat-item.ranked {
      background-color: var(--ppColourDark);
   }
   .stat-title {
      font-weight: 700;
   }
   .stat-spacer {
      border-left: 1px solid var(--textColor);
      width: 0;
      height: 15px;
      margin-left: 7px;
      margin-top: 1px;
      padding-right: 10px;
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
