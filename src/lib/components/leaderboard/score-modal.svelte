<script type="ts">
   import PlayerLink from '$lib/components/player/player-link.svelte';
   import type { LeaderboardInfo, Score } from '$lib/models/LeaderboardData';
   import { getDifficultyLabel, getDifficultyOrStarValue, getDifficultyStyle } from '$lib/utils/helpers';
   import { fly } from 'svelte/transition';
   import FormattedDate from '../common/formatted-date.svelte';
   export let score: Score;
   export let leaderboard: LeaderboardInfo;
   export let otherScores: Score[];

   let modalDiv: HTMLDivElement;

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

{#if isVisible}
   <div style="position: absolute;">
      <div class="modal {isVisible ? 'is-active' : ''} modal-radius" transition:fly={{ y: 50 }} on:introstart on:outroend>
         <div class="modal-background" on:click={() => setVisibility(false)} />
         <div class="modal-content">
            <div class="card map-card">
               <div
                  class="bg-image"
                  style={`background: linear-gradient(to left, rgba(36, 36, 36, 0.93), rgb(33, 33, 33)) repeat scroll 0% 0%, rgba(0, 0, 0, 0) url(${leaderboard.coverImage}) repeat scroll 0% 0%`}
               />
               <div class="card-content">
                  <div class="content">
                     <button class="modal-close is-large" aria-label="close" on:click={() => setVisibility(false)} />

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
                              <span class="text-muted"><FormattedDate date={new Date(score.timeSet)} /> on <b>{HMDs[score.hmd]}</b></span>
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
                              {#if otherScores.filter((score) => score.modifiers.length > 0).length > 0}
                                 <div class="score">
                                    Mods<br /><b>{score.modifiers}</b> (x{score.multiplier})
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
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
{/if}

<style>
   .text-muted {
      color: var(--muted);
   }

   .scores {
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      align-items: center;
      margin-top: 0.8rem;
      text-align: center;
      gap: 0.5rem;
   }

   .score {
      background-color: var(--foregroundItem);
      padding: 0.2rem 0.3rem;
      border-radius: 5px;
      flex-grow: 1;
   }

   .old-score {
      background-color: rgb(163, 0, 0);
   }

   .modal-radius {
      border-radius: 0.5rem;
   }

   .modal-close {
      position: absolute;
      right: 1rem;
      top: 1rem;
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
      border-radius: 10px;
   }

   .card {
      background: none;
   }

   .map-card {
      z-index: 1;
      color: var(--textColor);
      background: none;
   }
</style>
