<script type="ts">
   import PlayerLink from '$lib/components/player/player-link.svelte';
   import FormattedDate from '$lib/components/common/formatted-date.svelte';

   import type { LeaderboardInfo, Score } from '$lib/models/LeaderboardData';

   export let score: Score;
   export let leaderboard: LeaderboardInfo;
   export let otherScores: Score[];
   export let highlighted = false;

   export let showScoreModal: any;

   function openScoreDetails(score: Score, leaderboard: LeaderboardInfo): any {
      showScoreModal(score, leaderboard);
   }

   export let row = 1;
</script>

<div class="table-item" class:highlighted style="grid-row: {row} / span 1;">
   <div class="rank">
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
      <span><FormattedDate short={true} date={new Date(score.timeSet)} /></span>
   </div>
   <div class="score centered">
      <span
         class="score"
         on:click={() => openScoreDetails(score, leaderboard)}
         on:keydown={(e) => e.key === 'Enter' && openScoreDetails(score, leaderboard)}
         tabindex="0"
         role="button"
      >
         {score.modifiedScore.toLocaleString('en-US')}
      </span>
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
      grid-template-columns: var(--columns);
      background-color: var(--gray);
      border: 1px solid var(--borderColor);
      margin: 2.5px 1px;
      padding: 5px;
      border-radius: 6px;
      grid-column: 1;
      .centered {
         text-align: center;
      }
      &:hover {
         background-color: var(--gray-light);
         border-color: var(--gray-light);
      }
   }
   .rank {
      padding-right: 7px;
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
      border-bottom: 1px dotted var(--white);
      cursor: pointer;
   }

   .highlighted {
      border: 2px solid var(--scoreSaberYellow);
   }
</style>
