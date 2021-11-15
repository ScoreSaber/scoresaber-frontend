<script lang="ts">
   import type { Player } from '$lib/models/PlayerData';
   export let player: Player;
</script>

<div class="stats-container">
   <div class="stat-item">
      <span class="stat-title">Total Play Count</span>
      <span class="stat-spacer" />
      <span class="stat-content">{player.scoreStats.totalPlayCount.toLocaleString('en-US')}</span>
   </div>

   <div class="stat-item ranked">
      <span class="stat-title">Ranked Play Count</span>
      <span class="stat-spacer" />
      <span class="stat-content">{player.scoreStats.rankedPlayCount.toLocaleString('en-US')}</span>
   </div>

   <div class="stat-item">
      <span class="stat-title">Total Score</span>
      <span class="stat-spacer" />
      <span class="stat-content">{player.scoreStats.totalScore.toLocaleString('en-US')}</span>
   </div>

   <div class="stat-item ranked">
      <span class="stat-title">Total Ranked Score</span>
      <span class="stat-spacer" />
      <span class="stat-content">{player.scoreStats.totalRankedScore.toLocaleString('en-US')}</span>
   </div>

   <div class="stat-item ranked">
      <span class="stat-title">Average Ranked Accuracy</span>
      <span class="stat-spacer" />
      <span class="stat-content">{player.scoreStats.averageRankedAccuracy.toFixed(2)}%</span>
   </div>
</div>

<style>
   .stats-container {
      display: flex;
      flex-wrap: wrap;
      max-width: 500px;
   }
   .stat-item {
      display: inline-block;
      background-color: var(--foregroundItem);
      color: var(--textColor);
      padding: 5px 10px 5px 10px;
      border-radius: 10px;
      margin: 0px 5px 5px 0px;
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
</style>
