<script lang="ts">
   import type { PlayerScore } from '$lib/models/PlayerData';

   export let score: PlayerScore;
   export let openModal: (score: PlayerScore) => void;

   function getAccuracy() {
      let scoreCalc = score.score.baseScore;
      let maxScore = score.leaderboard.maxScore;

      return ((scoreCalc / maxScore) * 100) / score.score.multiplier;
   }

   function getWeightedPP() {
      return score.score.pp * score.score.weight;
   }
</script>

<div class="scoreInfo">
   {#if score.leaderboard.maxScore || score.leaderboard.ranked}
      <div>
         {#if score.leaderboard.maxScore}
            <span title="Accuracy" class="stat acc">
               {getAccuracy().toFixed(2)}%
            </span>
         {/if}
         {#if score.leaderboard.ranked}
            <div class="stat ranked">
               <span title="Performance Points" class="info">
                  {score.score.pp.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}pp
               </span>
               <span class="small info" title={`Weighted ${(score.score.weight * 100).toFixed(2)}%`}>
                  [{getWeightedPP().toLocaleString('en-US', {
                     minimumFractionDigits: 2,
                     maximumFractionDigits: 2
                  })}pp]
               </span>
            </div>
         {/if}
      </div>
   {/if}
   <div>
      <span title="Score" class="stat" class:hide-details={score.leaderboard.maxScore || score.leaderboard.ranked} class:oldScore={new Date(score.score.timeSet).getTime() /
      1000 <= 1558474032}>
         {score.score.modifiedScore.toLocaleString('en-US')}
      </span>
      {#if score.score.modifiers}
         <span title="Modifiers" class="stat hide-details">
            {score.score.modifiers.split(',').join(', ')}
         </span>
      {/if}
      <span class="stat" class:hide-details={score.leaderboard.maxScore || score.leaderboard.ranked}>
         {#if score.score.fullCombo}
            <span title="Full Combo" class="fc">
               FC &nbsp;
               <i class="fas fa-check" />
            </span>
         {:else}
            <span class="misses" title="Missed: {score.score.missedNotes}&#13;Bad Cut: {score.score.badCuts}&#13;Max Combo: {score.score.maxCombo}">
               <i class="fas fa-times" /> &nbsp;
               {#if score.score.missedNotes || score.score.badCuts}
                  {score.score.missedNotes + score.score.badCuts}
               {:else}
                  FC
               {/if}
            </span>
         {/if}
      </span>
      <span class="stat clickable" on:click={() => openModal(score)}>
         <i class="fas fa-info-circle" />
      </span>
   </div>
</div>

<style>
   .scoreInfo {
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      height: 100%;
   }
   .scoreInfo > div {
      display: flex;
      flex-flow: row wrap;
      justify-content: end;
      align-items: center;
      height: 100%;
   }
   .scoreInfo .stat {
      margin: 4px 5px;
      padding: 5px 7px;
      border-radius: 10px;
      background-color: var(--gray-light);
      transition: background-color var(--transitionTime) ease-in-out;
      display: inline-block;
   }
   .scoreInfo .ranked {
      background-color: var(--ppColourDark);
      font-weight: bold;
   }
   .scoreInfo .small {
      font-size: 0.8em;
      color: rgba(230, 230, 230, 0.85);
   }
   .info:hover {
      cursor: help;
   }
   .fc {
      color: var(--success);
   }
   .misses,
   .oldScore {
      color: var(--danger);
   }
   .acc {
      font-weight: bold;
   }
   .clickable:hover {
      background-color: var(--gray-dark);
      cursor: pointer;
   }

   @media (max-width: 512px) {
      .hide-details {
         display: none !important;
      }
      .scoreInfo > div {
         display: contents;
      }
      .scoreInfo {
         flex-flow: row wrap;
      }
   }
</style>
