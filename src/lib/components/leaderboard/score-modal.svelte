<script type="ts">
   import PlayerLink from '$lib/components/player/player-link.svelte';
   import FormattedDate from '$lib/components/common/formatted-date.svelte';

   import { HMDs } from '$lib/utils/helpers';

   import type { LeaderboardInfo, Score } from '$lib/models/LeaderboardData';

   export let score: Score;
   export let leaderboard: LeaderboardInfo;

   function getAccuracy() {
      let scoreCalc = score.baseScore;
      let maxScore = leaderboard.maxScore;

      return (scoreCalc / maxScore) * 100;
   }
</script>

<div class="score-modal">
   <div
      class="bg-image"
      style={`background: linear-gradient(to left, rgba(12, 12, 15, 0.92), rgba(22, 27, 34, 0.95)) repeat scroll 0% 0%, rgba(0, 0, 0, 0) url(${leaderboard.coverImage}) repeat scroll 0% 0%`}
   />
   <div class="media">
      <div class="media-content is-clipped">
         <div class="player-info mb-2">
            <img
               src={score.leaderboardPlayerInfo.profilePicture}
               alt={score.leaderboardPlayerInfo.name}
               title={score.leaderboardPlayerInfo.name}
               class="image rounded is-24x24"
            />
            <b><PlayerLink player={score.leaderboardPlayerInfo} destination={`/u/${score.leaderboardPlayerInfo.id}`} /></b>
            <span class="text-muted"
               ><FormattedDate date={new Date(score.timeSet)} />
               {#if score.deviceHmd}
                  on <b>{score.deviceHmd}</b>
               {:else}
                  on <b>{HMDs[score.hmd]}</b>
               {/if}
            </span>
         </div>
         <div class="scores">
            <div class="score">Score<br /><b>{score.modifiedScore.toLocaleString('en-US')}</b></div>
            {#if leaderboard.maxScore}
               <div class="score {new Date(score.timeSet).getTime() / 1000 <= 1558474032 ? 'old-score' : ''}">
                  Accuracy<br /><b>{getAccuracy().toFixed(2)}%</b>
               </div>
            {/if}
            {#if leaderboard.ranked}
               <div class="score" style="background-color: var(--ppColour)">
                  PP<br /><b
                     ><span title="Performance Points"
                        >{score.pp.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span
                     ><span class="ppLabel">pp</span></b
                  >
               </div>
            {/if}
         </div>
         <div class="scores">
            {#if score.modifiers.length > 0}
               <div class="score">
                  Mods<br /><b>{score.modifiers}</b> (x{score.multiplier.toFixed(2)})
               </div>
            {/if}
            <div class="score">
               Full Combo<br /><b><i class="fas {score.fullCombo ? 'fa-check' : 'fa-times'}" /></b>
            </div>
            {#if !score.fullCombo}
               <div class="score">
                  Max Combo<br /><b>{score.maxCombo}</b>
               </div>
               <div class="score">
                  Bad Cuts<br /><b>{score.badCuts}</b>
               </div>
               <div class="score">
                  Missed Notes<br /><b>{score.missedNotes}</b>
               </div>
            {/if}
         </div>
         <div class="scores">
            {#if score.deviceHmd}
               <div class="score">
                  Headset<br /><b>{score.deviceHmd}</b>
               </div>
            {:else}
               <div class="score">
                  Headset<br /><b>{HMDs[score.hmd]}</b>
               </div>
            {/if}
            {#if score.deviceControllerLeft}
               <div class="score">
                  Left Controller<br /><b>{score.deviceControllerLeft}</b>
               </div>
            {/if}
            {#if score.deviceControllerRight}
               <div class="score">
                  Right Controller<br /><b>{score.deviceControllerRight}</b>
               </div>
            {/if}
         </div>
      </div>
   </div>
</div>
