<script type="ts">
   import type { LeaderboardPlayer, Player, PlayerScore } from '$lib/models/PlayerData';
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
   import ClassicPagination from '../common/classic-pagination.svelte';
   import ArrowPagination from '../common/arrow-pagination.svelte';
   import { requestCancel, updateCancelToken } from '$lib/utils/accio/canceler';
   import { useAccio } from '$lib/utils/accio';
   import type { AccioRefreshOptions } from '$lib/utils/accio';
   import axios from '$lib/utils/fetcher';
   import type { Writable } from 'svelte/store';
   import Error from '../common/error.svelte';
   import LeaderboardGrid from '../leaderboard/leaderboard-grid.svelte';
   export let score: PlayerScore;
   export let row: number = 0;
   export let pageDirection: number = 1;
   export let openModal: (score: PlayerScore, player?: LeaderboardPlayer | Player) => void;
   export let expanded: boolean = false;

   const scoresPerPage = 12;

   let leaderboardData: Score[];
   let loadLeaderboardDataLoading: boolean = false;
   let leaderboardPage: number = Math.ceil(score.score.rank / 12);
   let leaderboardPageDirection: number = 1;

   $: expanded && loadLeaderboardData();

   async function loadLeaderboardData() {
      if (expanded && !leaderboardData) {
         getLeaderboardData();
      }
   }

   let scoreData: Writable<Score[]>;
   let scoreDataError: Writable<globalThis.Error>;
   let refreshScores: (refreshOptions?: AccioRefreshOptions) => Promise<void>;

   async function changePage(page: number) {
      $requestCancel.cancel('Filter Changed');
      updateCancelToken();
      let oldPage = leaderboardPage;
      leaderboardPageDirection = page > oldPage ? 1 : -1;
      setTimeout(async () => {
         leaderboardPage = page;
         await getLeaderboardData();
      });
   }

   async function getLeaderboardData() {
      loadLeaderboardDataLoading = true;
      if (!scoreData) {
         let {
            data: tmpScoreData,
            error: tmpScoreDataError,
            refresh: tmpRefreshScores
         } = useAccio<Score[]>(
            queryString.stringifyUrl({
               url: `/api/leaderboard/by-id/${score.leaderboard.id}/scores`,
               query: { page: leaderboardPage }
            }),
            { fetcher: axios }
         );
         scoreData = tmpScoreData;
         scoreDataError = tmpScoreDataError;
         refreshScores = tmpRefreshScores;
      }
      await refreshScores({
         newUrl: queryString.stringifyUrl({
            url: `/api/leaderboard/by-id/${score.leaderboard.id}/scores`,
            query: { page: leaderboardPage }
         })
      });
      loadLeaderboardDataLoading = false;
   }

   function modalOpen(newScore: Score) {
      let leaderboardScore = leaderboardData.find((score) => score.id === newScore.id);
      openModal(
         {
            score: newScore,
            leaderboard: score.leaderboard
         },
         leaderboardScore.leaderboardPlayerInfo
      );
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
      <div>
         <div class="tableWrapper">
            <LeaderboardGrid
               leaderboardScores={$scoreData}
               leaderboard={score.leaderboard}
               pageDirection={leaderboardPageDirection}
               showScoreModal={modalOpen}
            />
         </div>
         {#if $scoreData && !loadLeaderboardDataLoading}
            <div class="pagination desktop tablet">
               <ClassicPagination totalItems={score.leaderboard.plays} pageSize={scoresPerPage} currentPage={leaderboardPage} {changePage} />
            </div>
            <div class="mobile">
               <ArrowPagination pageClicked={changePage} page={leaderboardPage} maxPages={Math.ceil(score.leaderboard.plays / scoresPerPage)} />
            </div>
         {:else}
            <Loader />
         {/if}
         {#if $scoreDataError}
            <Error message={$scoreDataError.toString()} />
         {/if}
      </div>
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
      padding: 7px 0;
      .leaderboard {
         grid-row: 2;
         grid-column: 1 / span 4;
         max-height: 0px;
         transition: max-height var(--transitionTime) ease-out;
         overflow: hidden;
         > div {
            padding: 5px 20px;
         }
         &.expanded {
            max-height: 800px;
         }
         * {
            z-index: 1;
            position: relative;
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

   .pagination {
      display: flex;
      width: 100%;
      justify-content: center;
      align-items: center;
      margin: 15px 0;
   }

   @media only screen and (min-width: 769px) {
      .mobile {
         display: none;
      }
   }
   @media only screen and (max-width: 769px) {
      .desktop {
         display: none;
      }
      .table-item {
         grid-template-columns: 20px 1fr;
         padding: 12px;
         > div:not(.background, .leaderboard) {
            grid-row: 2 !important;
         }
         > div:nth-child(2) {
            grid-row: 1 !important;
            grid-column: 1 / span 2;
            .rank-info {
               flex-flow: row nowrap;
               justify-content: space-between;
               width: 100%;
            }
         }
         > div:nth-child(3) {
            grid-column: 1;
         }
         > div:nth-child(4) {
            grid-column: 2;
         }
         > div:nth-child(5) {
            grid-row: 3 !important;
            grid-column: 1 / span 2;
            display: flex;
            flex-flow: row wrap;
            justify-content: center;
            > div {
               display: contents;
            }
         }

         .leaderboard {
            grid-row: 4 !important;
            > div {
               padding: 5px 0px;
            }
            .tableWrapper {
               overflow-x: auto;
               margin-bottom: 8px;
            }
         }
      }
   }
</style>
