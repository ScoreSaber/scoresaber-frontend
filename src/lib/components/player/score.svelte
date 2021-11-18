<script type="ts">
   import type { PlayerScore } from '$lib/models/PlayerData';
   import FormattedDate from '../common/formatted-date.svelte';
   import SmallSongInfo from '../leaderboard/small-song-info.svelte';
   import { rankToPage } from '$lib/utils/helpers';
   import PlayerScoreComponent from './player-score.svelte';
   import { fly } from 'svelte/transition';
   import type { Score } from '$lib/models/LeaderboardData';
   import fetcher from '$lib/utils/fetcher';
   import queryString from 'query-string';
   import LeaderboardRow from '../leaderboard/leaderboard-row.svelte';
   import Loader from '../common/loader.svelte';
   export let score: PlayerScore;
   export let row: number = 0;
   export let pageDirection: number = 1;
   export let openModal: (score: PlayerScore) => void;
   export let expanded: boolean = false;

   let leaderboardData: Score[];

   $: expanded && loadLeaderboardData();

   async function loadLeaderboardData() {
      if (expanded && !leaderboardData) {
         console.log('fetching leaderboard data');
         await fetcher<Score[]>(
            queryString.stringifyUrl({
               url: `/api/leaderboard/by-id/${score.leaderboard.id}/scores`,
               query: { page: Math.floor(score.score.rank / 12) }
            }),
            { withCredentials: true }
         ).then((info) => (leaderboardData = info));
         console.log(leaderboardData);
      }
   }
</script>

<div
   class="table-item"
   style={`--row: ${row}`}
   in:fly|local={{ x: 100 * pageDirection, duration: 300, delay: 40 * (row - 1) }}
   out:fly|local={{ x: -100 * pageDirection, duration: 300, delay: 40 * (row - 1) }}
>
   <div class="background" style={`--bgURL: url(${score.leaderboard.coverImage})`} />
   <div>
      <div class="rank-info">
         <span>
            <i class="fas fa-globe-americas" title="Ranking" />
            <a title="Ranking" href={`/leaderboard/${score.leaderboard.id}?page=${rankToPage(score.score.rank, 12)}`}
               >#{score.score.rank.toLocaleString('en-US')}</a
            >
         </span>
         <FormattedDate date={score.score.timeSet} />
      </div>
   </div>
   <div>
      <div on:click={() => (expanded = !expanded)} class="arrowWrapper">
         <span class="arrow" class:active={expanded} />
      </div>
   </div>
   <div>
      <SmallSongInfo leaderboard={score.leaderboard} />
   </div>
   <div>
      <PlayerScoreComponent {openModal} {score} />
   </div>
   <div class="leaderboard" class:expanded>
      {#if leaderboardData}
         <table>
            <thead>
               <tr class="headers">
                  <th class="rank" />
                  <th class="player" />
                  <th class="timeSet centered">Time Set</th>
                  <th class="score centered">Score</th>
                  {#if leaderboardData.filter((score) => score.modifiers.length > 0).length > 0}
                     <th class="mods centered">Mods</th>
                  {/if}
                  {#if score.leaderboard.maxScore}<th class="accuracy centered">Accuracy</th>{/if}
                  {#if score.leaderboard.ranked}<th class="pp centered">PP</th>{/if}
               </tr>
            </thead>
            <tbody>
               {#each leaderboardData as lScore}
                  <LeaderboardRow score={lScore} leaderboard={score.leaderboard} otherScores={leaderboardData} showScoreModal={() => {}} />
               {/each}
            </tbody>
         </table>
      {:else}
         <Loader />
      {/if}
   </div>
</div>

<style lang="scss">
   .rank-info {
      width: 100px;
      display: flex;
      flex-direction: column;
      text-align: center;
      height: 100%;
      justify-content: center;
   }
   .table-item > div:not(.background, .leaderboard) {
      position: relative;
      grid-row: 1;
      padding: 5px;
      margin: 5px 0;
   }
   .table-item > div:nth-child(2) {
      grid-column: 1;
      border-radius: 8px 0 0 8px;
      display: flex;
      align-items: center;
      height: 100%;
      margin: 0px;
   }
   .table-item > div:nth-child(3) {
      grid-column: 2;
      padding: 12px 5px;
   }
   .table-item > div:nth-child(4) {
      grid-column: 3;
      border-radius: 0 8px 8px 0;
   }
   .table-item {
      display: grid;
      grid-template-columns: 1fr 0.2fr 6fr 3fr;
      position: relative;
      grid-row: var(--row) / span 1;
      grid-column: 1;
      margin: 3px 0px;
      .leaderboard {
         grid-row: 2;
         grid-column: 1 / span 4;
         max-height: 0px;
         transition: max-height var(--transitionTime) ease-out;
         padding: 5px 20px;
         overflow: hidden;
         &.expanded {
            max-height: 800px;
         }
         * {
            z-index: 1;
         }
         table {
            border-collapse: separate;
            border-spacing: 0 5px;
            white-space: nowrap;
            margin-top: -15px;
            tbody {
               position: relative;
            }
         }
      }
   }

   .arrowWrapper {
      display: flex;
      flex-direction: column;
      justify-content: end;
      height: 100%;
      &:hover {
         cursor: pointer;
         .arrow {
            &:before,
            &:after {
               background-color: var(--scoreSaberYellow);
            }
         }
      }
      .arrow {
         width: 13px;
         height: 13px;
         display: inline-block;
         position: relative;
         bottom: -5px;
         left: -10px;
         transition: 0.4s ease;
         margin-top: 2px;
         text-align: left;
         transform: rotate(45deg);
         &:before,
         &:after {
            position: absolute;
            content: '';
            display: inline-block;
            width: 12px;
            height: 3px;
            background-color: #fff;
            transition: 0.4s ease;
         }
         &:after {
            position: absolute;
            transform: rotate(90deg);
            top: -5px;
            left: 5px;
         }
         &.active {
            transform: rotate(45deg) translate(-5px, -5px);
            &:before {
               transform: translate(10px, 0);
            }
            &:after {
               transform: rotate(90deg) translate(10px, 0);
            }
         }
      }
   }

   .fas.fa-globe-americas {
      height: 11px;
      width: 16px;
      cursor: help;
   }
   .background {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-position: 50% !important;
      background-repeat: no-repeat !important;
      background-size: cover !important;
      z-index: 0;
      border-radius: 8px;
      background: linear-gradient(to left, rgba(36, 36, 36, 0.93), rgb(33, 33, 33)) repeat scroll 0% 0%,
         rgba(0, 0, 0, 0) var(--bgURL) repeat scroll 0% 0%;
   }
   @media (max-width: 512px) {
      .table-item > div {
         grid-row: calc(var(--row) * 3 + 1) / span 1 !important;
      }
      .table-item > div:nth-child(2),
      .table-item > div:nth-child(3) {
         padding: 8px;
         margin-bottom: 0px;
      }
      .table-item > div:nth-child(2) {
         grid-row: calc(var(--row) * 3) / span 1 !important;
         grid-column: 1 / span 2;
         margin-top: 5px;
         margin-bottom: 0px;
         padding-bottom: 0px;
      }
      .table-item > div:nth-child(2) > div {
         flex-direction: row;
         justify-content: space-around;
         width: 100%;
      }
      .table-item > div:nth-child(3) {
         grid-column: 1 / span 2;
      }
      .table-item > div:nth-child(4) {
         margin-top: 0px;
         grid-column: 1 / span 2;
         grid-row: calc(var(--row) * 3 + 2) / span 1 !important;
      }
      .table-item > div.background {
         grid-row: calc(var(--row) * 3) / span 3 !important;
      }
   }
</style>
