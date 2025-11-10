<script type="ts">
   import PlayerLink from '$lib/components/player/player-link.svelte';
   import FormattedDate from '$lib/components/common/formatted-date.svelte';

   import { HMDs } from '$lib/utils/helpers';

   import type { LeaderboardPlayer, Player, PlayerScore } from '$lib/models/PlayerData';

   export let score: PlayerScore;
   export let player: Player | LeaderboardPlayer;

   if (player == undefined) {
      player = score.score.leaderboardPlayerInfo;
   }

   function getAccuracy() {
      let scoreCalc = score.score.baseScore;
      let maxScore = score.leaderboard.maxScore;

      return (scoreCalc / maxScore) * 100;
   }
</script>

<div class="score-modal">
   <div
      class="bg-image"
      style={`background: linear-gradient(to left, rgba(12, 12, 15, 0.92), rgba(22, 27, 34, 0.95)) repeat scroll 0% 0%, rgba(0, 0, 0, 0) url(${score.leaderboard.coverImage}) repeat scroll 0% 0%`}
   />
   <div class="media">
      <div class="media-content is-clipped">
         <div class="player-info mb-2">
            <img src={player.profilePicture} alt={player.name} title={player.name} class="image rounded is-24x24" />
            <b>
               <PlayerLink {player} destination={`/u/${player.id}`} />
            </b>
            <span class="text-muted">
               <FormattedDate date={new Date(score.score.timeSet)} />
               {#if score.score.deviceHmd}
                  on <b>{score.score.deviceHmd}</b>
               {:else}
                  on <b>{HMDs[score.score.hmd]}</b>
               {/if}
            </span>
         </div>
         <div class="scores">
            <div class="score">Score<br /><b>{score.score.modifiedScore.toLocaleString('en-US')}</b></div>
            {#if score.leaderboard.maxScore}
               <div class="score {new Date(score.score.timeSet).getTime() / 1000 <= 1558474032 ? 'old-score' : ''}">
                  Accuracy<br /><b>{getAccuracy().toFixed(2)}%</b>
               </div>
            {/if}
            {#if score.leaderboard.ranked}
               <div class="score" style="background-color: var(--ppColour)">
                  PP
                  <br />
                  <b>
                     <span title="Performance Points"
                        >{score.score.pp.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span
                     ><span class="ppLabel">pp</span>
                  </b>
               </div>
            {/if}
         </div>
         <div class="scores">
            {#if score.score.modifiers.length > 0}
               <div class="score">
                  Mods<br /><b>{score.score.modifiers}</b> (x{score.score.multiplier.toFixed(2)})
               </div>
            {/if}
            <div class="score">
               Full Combo<br /><b><i class="fas {score.score.fullCombo ? 'fa-check' : 'fa-times'}" /></b>
            </div>
            {#if !score.score.fullCombo}
               <div class="score">
                  Max Combo<br /><b>{score.score.maxCombo}</b>
               </div>
               <div class="score">
                  Bad Cuts<br /><b>{score.score.badCuts}</b>
               </div>
               <div class="score">
                  Missed Notes<br /><b>{score.score.missedNotes}</b>
               </div>
            {/if}
         </div>
         <div class="scores">
            {#if score.score.deviceHmd}
               <div class="score">
                  Headset<br /><b>{score.score.deviceHmd}</b>
               </div>
            {:else}
               <div class="score">
                  Headset<br /><b>{HMDs[score.score.hmd]}</b>
               </div>
            {/if}
            {#if score.score.deviceControllerLeft}
               <div class="score">
                  Left Controller<br /><b>{score.score.deviceControllerLeft}</b>
               </div>
            {/if}
            {#if score.score.deviceControllerRight}
               <div class="score">
                  Right Controller<br /><b>{score.score.deviceControllerRight}</b>
               </div>
            {/if}
         </div>
      </div>
   </div>
</div>
