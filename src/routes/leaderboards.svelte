<script lang="ts">
   import { onDestroy, onMount } from 'svelte';
   import Loader from '$lib/components/common/loader.svelte';
   import Error from '$lib/components/common/error.svelte';
   import axios from '$lib/utils/fetcher';
   import queryString from 'query-string';
   import { useAccio } from '$lib/utils/accio';
   import { pageQueryStore } from '$lib/query-store';
   import { page } from '$app/stores';
   import { fly } from 'svelte/transition';
   import { browser } from '$app/env';
   import SmallSongInfo from '$lib/components/leaderboard/small-song-info.svelte';
   import {
      Category,
      getCategoryFromNumber,
      getNumberFromCategory,
      getNumberFromSortDirection,
      getSortDirectionFromNumber,
      LeaderboardInfoCollection,
      SortDirection
   } from '$lib/models/LeaderboardData';
   import ClassicPagination from '$lib/components/common/classic-pagination.svelte';

   import Slider from '@bulatdashiev/svelte-slider';
   import FormattedDate from '$lib/components/common/formatted-date.svelte';
   import SearchInput from '$lib/components/common/search-input.svelte';

   import { requestCancel, updateCancelToken } from '$lib/utils/accio/canceler';

   let rangeStars: number[] = [];

   $: pageQuery = pageQueryStore({
      page: 1,
      verified: 1,
      ranked: 0,
      minStar: 1,
      maxStar: 20,
      category: 1,
      sort: 0,
      search: ''
   });

   onMount(() => {
      rangeStars = [parseInt($pageQuery.minStar), parseInt($pageQuery.maxStar)];
   });

   const {
      data: leaderboards,
      error: leaderboardsError,
      refresh: refreshLeaderboards
   } = useAccio<LeaderboardInfoCollection>(
      queryString.stringifyUrl({
         url: '/api/leaderboards',
         query: queryString.parse($page.query.toString())
      }),
      { fetcher: axios }
   );

   function changePage(newPage: number) {
      $requestCancel.cancel('Filter Changed');
      updateCancelToken();
      pageQuery.updateSingle('page', newPage);
   }

   function toggleVerified(event) {
      //setTimeout(() => (event.target.checked = filters.verified), 0);

      $requestCancel.cancel('Filter Changed');
      updateCancelToken();
      pageQuery.updateSingle('verified', event.target.checked ? 1 : 0);
   }

   function toggleRanked(event) {
      $requestCancel.cancel('Filter Changed');
      updateCancelToken();
      pageQuery.updateSingle('ranked', event.target.checked ? 1 : 0);
   }

   function changeCategory(event) {
      $requestCancel.cancel('Filter Changed');
      updateCancelToken();
      pageQuery.updateSingle('category', getNumberFromCategory(event.currentTarget.value));
   }

   function changeSortDirection(event) {
      $requestCancel.cancel('Filter Changed');
      updateCancelToken();
      pageQuery.updateSingle('sort', getNumberFromSortDirection(event.currentTarget.value));
   }

   function searchUpdated(search: string) {
      $requestCancel.cancel('Filter Changed');
      updateCancelToken();
      if (search.length > 3) {
         pageQuery.update({
            page: 1,
            search
         });
      } else {
         pageQuery.updateSingle('search', '');
      }
   }

   function changeRangeStars(event) {
      $requestCancel.cancel('Filter Changed');
      updateCancelToken();
      pageQuery.update({
         page: 1,
         minStar: parseInt(event.detail[0]),
         maxStar: parseInt(event.detail[1])
      });
   }

   const pageUnsubscribe = page.subscribe((p) => {
      if (browser) {
         refreshLeaderboards({
            newUrl: queryString.stringifyUrl({
               url: '/api/leaderboards',
               query: queryString.parse(p.query.toString())
            })
         });
      }
   });

   onDestroy(pageUnsubscribe);
</script>

<head>
   <title>Leaderboards | ScoreSaber!</title>
</head>

<div class="section">
   <div class="columns">
      <div class="column is-8">
         <div class="window has-shadow noheading">
            {#if $leaderboards}
               <div in:fly={{ y: -20, duration: 1000 }} class="ranking">
                  <table>
                     <thead>
                        <tr class="headers">
                           <th class="created_at" />
                           <th class="map" />
                           <th class="plays centered">Plays</th>
                           <th class="plays-daily centered">Last 24h</th>
                        </tr>
                     </thead>
                     <tbody>
                        {#each $leaderboards.leaderboards as leaderboard}
                           <tr class="table-item">
                              <td class="created_at">
                                 <FormattedDate date={new Date(leaderboard.createdDate)} />
                              </td>
                              <td class="map"><SmallSongInfo {leaderboard} margin={false} /></td>
                              <td class="plays centered">
                                 {leaderboard.plays.toLocaleString('en-US')}
                              </td>
                              <td class="plays-daily centered">
                                 {leaderboard.dailyPlays.toLocaleString('en-US')}
                              </td>
                           </tr>
                        {/each}
                     </tbody>
                  </table>
               </div>
               <br />
               <ClassicPagination
                  totalItems={$leaderboards.totalCount}
                  pageSize={14}
                  currentPage={$pageQuery.currentPage}
                  changePage={(e) => changePage(e)}
               />
            {:else if !$leaderboardsError}
               <Loader />
            {/if}
            {#if $leaderboardsError}
               <Error message={$leaderboardsError.toString()} status={JSON.parse(JSON.stringify($leaderboardsError)).status} />
            {/if}
         </div>
      </div>
      <div class="column is-4">
         <div class="window has-shadow noheading">
            <div class="mb-2">Search Terms</div>
            <SearchInput icon="fa-search" onSearch={searchUpdated} value={$pageQuery.search} />
         </div>
         <div class="window has-shadow noheading">
            <label class="checkbox">
               <input type="checkbox" checked={$pageQuery.verified == 1} on:click|preventDefault={toggleVerified} />
               Only show verified leaderboards
            </label>
            <label class="checkbox">
               <input type="checkbox" checked={$pageQuery.ranked == 1} on:click|preventDefault={toggleRanked} />
               Only show ranked leaderboards
            </label>
         </div>
         <div class="window has-shadow noheading">
            <div class="mb-2">Sort By</div>
            <div class="select">
               <select value={getCategoryFromNumber(parseInt($pageQuery.category))} on:change={changeCategory}>
                  <option value={Category.Trending}>Trending</option>
                  <option value={Category.DateRanked}>Date Ranked</option>
                  <option value={Category.ScoresSet}>Scores Set</option>
                  <option value={Category.StarDifficulty}>Star Difficulty</option>
                  <option value={Category.Author}>Mapper</option>
               </select>
            </div>
            <div class="control mt-2">
               <label class="radio">
                  <input
                     type="radio"
                     name="sortOrder"
                     on:change={changeSortDirection}
                     checked={getSortDirectionFromNumber(parseInt($pageQuery.sort)) === SortDirection.Descending}
                     value={SortDirection.Descending}
                  />
                  Descending
               </label>
               <label class="radio">
                  <input
                     type="radio"
                     name="sortOrder"
                     on:change={changeSortDirection}
                     checked={getSortDirectionFromNumber(parseInt($pageQuery.sort)) === SortDirection.Ascending}
                     value={SortDirection.Ascending}
                  />
                  Ascending
               </label>
            </div>
         </div>
         <div class="window has-shadow noheading">
            <div class="mb-2 mt-2">Difficulty</div>
            <b>{rangeStars[0]}</b> to <b>{rangeStars[1]}</b> stars
            <Slider max="50" step="1" bind:value={rangeStars} on:input={(e) => changeRangeStars(e)} range order />
         </div>
      </div>
   </div>
</div>

<style>
   table {
      border-collapse: separate;
      border-spacing: 0 5px;
      white-space: nowrap;
      margin-top: -15px;
   }
   div.ranking {
      overflow-x: auto;
   }
   .content table th {
      border: none !important;
   }
   td {
      border: none !important;
      border-style: solid none;
      align-items: center;
      vertical-align: middle;
   }

   tr.table-item td {
      background-color: var(--gray);
   }
   tr.table-item:hover td {
      background-color: var(--gray-light);
   }
   td:first-child {
      border-left-style: solid;
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
   }
   td:last-child {
      border-right-style: solid;
      border-bottom-right-radius: 5px;
      border-top-right-radius: 5px;
   }

   div.ranking {
      overflow-x: auto;
   }
   .content table th {
      border: none !important;
   }

   @media screen and (max-width: 769px), print {
      .columns {
         display: flex;
         flex-direction: column-reverse;
      }
   }

   @media (max-width: 512px) {
      .headers {
         display: none;
      }

      .headers th:not(.player, .rank) {
         display: none;
      }
   }
</style>
