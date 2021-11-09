<script type="ts">
   import PlayerLink from '$lib/components/player/player-link.svelte';
   import type { LeaderboardInfo, Score } from '$lib/models/LeaderboardData';
   import { getDifficultyLabel, getDifficultyOrStarValue, getDifficultyStyle } from '$lib/utils/helpers';
   import FormattedDate from '../common/formatted-date.svelte';
   export let score: Score;
   export let leaderboard: LeaderboardInfo;
   export let otherScores: Score[];

   $: isVisible = false;

   function getAccuracy() {
      let scoreCalc = score.baseScore;
      let maxScore = leaderboard.maxScore;

      return (scoreCalc / maxScore) * 100;
   }

   export function setVisibility(visible: boolean): any {
      isVisible = visible;
   }

   const HMDs = {
      0: 'Unknown',
      1: 'Oculus Rift CV1',
      2: 'Vive',
      4: 'Vive Pro',
      8: 'Windows Mixed Reality',
      16: 'Rift S',
      32: 'Oculus Quest',
      64: 'Valve Index',
      128: 'Vive Cosmos'
   };
</script>

<div class="modal {isVisible ? 'is-active' : ''}">
   <div class="modal-background" />
   <div class="modal-content">
      <div class="card map-card" style="background-color: var(--gray)">
         <div
            class="bg-image"
            style={`background: linear-gradient(to left, rgba(36, 36, 36, 0.93), rgb(33, 33, 33)) repeat scroll 0% 0%, rgba(0, 0, 0, 0) url(${leaderboard.coverImage}) repeat scroll 0% 0%`}
         />
         <div class="card-content">
            <div class="content">
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
                        <span><FormattedDate date={new Date(score.timeSet)} /></span>
                     </div>
                     Score:
                     <b>{score.modifiedScore.toLocaleString('en-US')}</b><br />
                     {#if leaderboard.maxScore}
                        Accuracy:
                        <b class={new Date(score.timeSet).getTime() / 1000 <= 1558474032 ? 'old-score' : ''}>{getAccuracy().toFixed(2)}%</b><br />
                     {/if}
                     {#if leaderboard.ranked}
                        PP: <b
                           ><span title="Performance Points" class="pp"
                              >{score.pp.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span
                           ><span class="pp ppLabel">pp</span></b
                        ><br />
                     {/if}<br />
                     {#if otherScores.filter((score) => score.modifiers.length > 0).length > 0}
                        Mods:
                        <b>{score.modifiers}</b> (x{score.multiplier})<br />
                     {/if}
                     Full Combo: <b><i class="fas {score.fullCombo ? 'fa-check' : 'fa-times'}" /></b><br />
                     {#if !score.fullCombo}
                        Max Combo: <b>{score.maxCombo}</b><br />
                        Bad Cuts: <b>{score.badCuts}</b><br />
                        Missed Notes: <b>{score.missedNotes}</b><br />
                     {/if}<br />
                     HMD: <b>{HMDs[score.hmd]}</b><br />
                  </div>
                  <div class="media-right">
                     <figure class="image is-96x96 mr-0 ml-0">
                        <img src={leaderboard.coverImage} alt="Map Cover" class="map-cover" />
                     </figure>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
   <button class="modal-close is-large" aria-label="close" on:click={() => (isVisible = false)} />
</div>

<style>
   .old-score {
      color: red;
   }

   .player-info {
      display: flex;
      align-items: center;
      gap: 0.4rem;
   }

   .media-content {
      color: white;
   }

   .bg-image {
      position: absolute;
      height: 100%;
      width: 100%;
      background-position: 50% !important;
      background-repeat: no-repeat !important;
      background-size: cover !important;
      z-index: -1;
      border-radius: 5px;
   }

   .map-card {
      z-index: 1;
      color: var(--textColor);
      background: none;
   }
</style>
