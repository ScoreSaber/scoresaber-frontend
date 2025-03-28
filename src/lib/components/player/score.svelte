<script type="ts">
   import type { Writable } from 'svelte/store';

   import { fly } from 'svelte/transition';
   import queryString from 'query-string';

   import SmallSongInfo from '$lib/components/leaderboard/small-song-info.svelte';
   import FormattedDate from '$lib/components/common/formatted-date.svelte';
   import Loader from '$lib/components/common/loader.svelte';
   import ClassicPagination from '$lib/components/common/classic-pagination.svelte';
   import ArrowPagination from '$lib/components/common/arrow-pagination.svelte';
   import Error from '$lib/components/common/error.svelte';
   import LeaderboardGrid from '$lib/components/leaderboard/leaderboard-grid.svelte';

   import type { AccioRefreshOptions } from '$lib/utils/accio';
   import axios from '$lib/utils/fetcher';
   import { rankToPage } from '$lib/utils/helpers';
   import { useAccio } from '$lib/utils/accio';
   import { requestCancel, updateCancelToken } from '$lib/utils/accio/canceler';

   import type { Score, ScoreCollection } from '$lib/models/LeaderboardData';
   import type { LeaderboardPlayer, Player, PlayerScore } from '$lib/models/PlayerData';

   import PlayerScoreComponent from './player-score.svelte';

   export let score: PlayerScore;
   export let row = 0;
   export let pageDirection = 1;
   export let openModal: (score: PlayerScore, player?: LeaderboardPlayer | Player) => void;
   export let expanded = false;
   export let playerId: string = undefined;

   let leaderboardData: ScoreCollection;
   let leaderboardDataLoading = false;
   let leaderboardPage: number = Math.ceil(score.score.rank / 12);
   let leaderboardPageDirection = 1;

   $: expanded && loadLeaderboardData();

   async function loadLeaderboardData() {
      if (expanded && !leaderboardData) {
         getLeaderboardData();
      }
   }

   let scoreData: Writable<ScoreCollection>;
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
      leaderboardDataLoading = true;
      if (!scoreData) {
         let {
            data: tmpScoreData,
            error: tmpScoreDataError,
            refresh: tmpRefreshScores
         } = useAccio<ScoreCollection>(
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
         }),
         bypassInitialCheck: true
      });
      leaderboardDataLoading = false;
   }

   function modalOpen(newScore: Score) {
      openModal(
         {
            score: newScore,
            leaderboard: score.leaderboard
         },
         newScore.leaderboardPlayerInfo
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
         <FormattedDate short={true} date={score.score.timeSet} />
      </div>
   </div>
   <div>
      <div
         on:click={() => (expanded = !expanded)}
         on:keydown={(e) => e.key === 'Enter' && (expanded = !expanded)}
         class="arrowWrapper"
         role="button"
         tabindex="0"
      >
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
      {#if leaderboardDataLoading}
         <Loader displayOver={true} />
      {/if}
      <div class:blur={leaderboardDataLoading}>
         {#if $scoreData && !leaderboardDataLoading}
            <div class="tableWrapper">
               <LeaderboardGrid
                  leaderboardScores={$scoreData.scores}
                  leaderboard={score.leaderboard}
                  pageDirection={leaderboardPageDirection}
                  showScoreModal={modalOpen}
                  playerHighlight={playerId}
               />
            </div>
            <div class="pagination desktop tablet">
               <ClassicPagination
                  totalItems={$scoreData.metadata.total}
                  pageSize={$scoreData.metadata.itemsPerPage}
                  currentPage={leaderboardPage}
                  {changePage}
               />
            </div>
            <div class="mobile">
               <ArrowPagination
                  pageClicked={changePage}
                  page={leaderboardPage}
                  maxPages={$scoreData.metadata.total}
                  pageSize={$scoreData.metadata.itemsPerPage}
                  withFirstLast={true}
               />
            </div>
         {/if}
         {#if $scoreDataError}
            <Error error={$scoreDataError} />
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
   .table-item > div {
      z-index: 1;
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
         position: relative;
         .blur {
            filter: blur(3px) saturate(1.2);
            transition: 0.25s filter linear;
         }
         > div {
            padding: 5px 20px;
         }
         &.expanded {
            max-height: 800px;
            min-height: 200px;
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
      justify-content: center;
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
