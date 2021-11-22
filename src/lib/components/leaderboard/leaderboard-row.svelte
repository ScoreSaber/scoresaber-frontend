<script type="ts">
   import PlayerLink from '$lib/components/player/player-link.svelte';
   import type { LeaderboardInfo, Score } from '$lib/models/LeaderboardData';
   import { fly } from 'svelte/transition';
   import FormattedDate from '$lib/components/common/formatted-date.svelte';
   export let score: Score;
   export let leaderboard: LeaderboardInfo;
   export let otherScores: Score[];
   export let highlighted: boolean = false;

   export let showScoreModal: any;
   function openScoreDetails(score: Score, leaderboard: LeaderboardInfo): any {
      showScoreModal(score, leaderboard);
   }

   export let row = 1;
   export let pageDirection = 1;

   export let transitioning: boolean = false;
</script>

<div
   class="table-item"
   class:highlighted
   in:fly|local={{ x: 100 * pageDirection, duration: 300, delay: 40 * (row - 1) }}
   out:fly|local={{ x: -100 * pageDirection, duration: 300, delay: 40 * (row - 1) }}
   on:introstart={() => (transitioning = true)}
   on:outrostart={() => (transitioning = true)}
   on:outroend={() => (transitioning = false)}
   style="grid-row: {row} / span 1;"
>
   <div class="rank" width="5px">
      #{score.rank.toLocaleString('en-US')}
   </div>
   <div class="player">
      <img
         src={score.leaderboardPlayerInfo.profilePicture}
         alt={score.leaderboardPlayerInfo.name}
         title={score.leaderboardPlayerInfo.name}
         class="image rounded is-24x24"
      />
      <span class="playerName"><PlayerLink player={score.leaderboardPlayerInfo} destination={`/u/${score.leaderboardPlayerInfo.id}`} /></span>
   </div>
   <div class="timeSet centered">
      <span><FormattedDate date={new Date(score.timeSet)} /></span>
   </div>
   <div class="score centered">
      <span class="score" on:click={openScoreDetails(score, leaderboard)}>{score.modifiedScore.toLocaleString('en-US')}</span>
   </div>
   {#if otherScores.filter((score) => score.modifiers.length > 0).length > 0}
      <div class="mods centered">
         <span>{score.modifiers.length === 0 ? '-' : score.modifiers}</span>
      </div>
   {/if}
   {#if leaderboard.maxScore}
      <div class="accuracy centered {new Date(score.timeSet).getTime() / 1000 <= 1558474032 ? 'old-score' : ''}">
         <span>{((score.baseScore / leaderboard.maxScore) * 100).toFixed(2)}%</span>
      </div>
   {/if}
   {#if leaderboard.ranked}
      <div class="pp centered">
         <span title="Performance Points" class="pp">{score.pp.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span
         ><span class="pp ppLabel">pp</span>
      </div>
   {/if}
</div>

<style lang="scss">
   .table-item {
      display: grid;
      grid-template-columns: var(--rows);
      background-color: var(--gray);
      margin: 2.5px 0;
      padding: 5px;
      border-radius: 5px;
      grid-column: 1;
      .centered {
         text-align: center;
      }
      &:hover {
         background-color: var(--gray-light);
      }
   }
   .rank {
      padding-right: 7px;
   }
   .old-score {
      color: red;
   }
   div {
      border: none !important;
      border-style: solid none;
      align-items: center;
      vertical-align: bottom;
   }
   div.player {
      white-space: nowrap;
      display: flex;
      align-items: flex-end;
      overflow: hidden;
   }
   div.player span {
      overflow: hidden;
      text-overflow: ellipsis;
   }
   @media (max-width: 1024px) {
      .player {
         max-width: 55vw;
         min-width: 170px;
      }
   }
   span.playerName {
      font-weight: 700;
      margin-left: 10px;
      display: flex;
   }
   span.score {
      border-bottom: 1px dotted white;
      cursor: pointer;
   }

   .highlighted {
      outline: 1px solid var(--scoreSaberYellow);
   }
</style>
