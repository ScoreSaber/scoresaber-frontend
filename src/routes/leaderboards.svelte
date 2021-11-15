<script lang="ts">
   import { onDestroy, onMount } from 'svelte';
   import Navbar from '$lib/components/common/navbar.svelte';
   import Footer from '$lib/components/common/footer.svelte';
   import Loader from '$lib/components/common/loader.svelte';
   import Error from '$lib/components/common/error.svelte';
   import axios from '$lib/utils/fetcher';
   import queryString from 'query-string';
   import { useAccio } from '$lib/utils/accio';
   import { createQueryStore } from '$lib/query-store';
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
      LeaderboardFilterOptions,
      LeaderboardInfoCollection,
      SortDirection
   } from '$lib/models/LeaderboardData';
   import ClassicPagination from '$lib/components/common/classic-pagination.svelte';

   import Slider from '@bulatdashiev/svelte-slider';

   const playersPerPage = 50;

   $: currentPage = createQueryStore('page', 1);
   $: verified = createQueryStore('verified', 1);
   $: ranked = createQueryStore('ranked', 0);
   $: minStar = createQueryStore('minStar', 1);
   $: maxStar = createQueryStore('maxStar', 20);
   $: category = createQueryStore('category', 1);
   $: sort = createQueryStore('sort', 0);
   $: search = createQueryStore('search', '');

   let rangeStars: number[] = [];

   let filters: LeaderboardFilterOptions;

   function refreshFilters() {
      filters = {
         verified: $verified == 1 ? true : false,
         ranked: $ranked == 1 ? true : false,
         minStar: $minStar,
         maxStar: $maxStar,
         category: getCategoryFromNumber(parseInt($category)),
         sortDirection: getSortDirectionFromNumber(parseInt($sort))
      };
   }

   let searchValue;

   onMount(() => {
      rangeStars = [parseInt($minStar), parseInt($maxStar)];
      searchValue = $search;
      refreshFilters();
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
      $currentPage = newPage;
   }

   function toggleVerified(event) {
      $verified = $verified === 1 ? 0 : 1;
      toggleFilters();
      setTimeout(() => (event.target.checked = filters.verified), 0);
   }

   function toggleRanked(event) {
      $ranked = $ranked === 1 ? 0 : 1;
      toggleFilters();
      setTimeout(() => (event.target.checked = filters.ranked), 0);
   }

   function changeCategory(event) {
      $category = getNumberFromCategory(event.target.value);
      toggleFilters();
   }

   function changeSortDirection(event) {
      $sort = getNumberFromSortDirection(event.currentTarget.value);
      toggleFilters();
   }

   function changeSearch(event) {
      if (event.target.value.length > 3) {
         $search = event.target.value;
         toggleFilters();
      } else {
         $search = null;
      }
   }

   let debounceTimer;
   function changeRangeStars(event) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
         $minStar = event.detail[0];
         setTimeout(() => {
            $maxStar = event.detail[1];
            toggleFilters();
         }, 10);
      }, 300);
   }

   function toggleFilters() {
      refreshFilters();
      refreshLeaderboards({
         newUrl: queryString.stringifyUrl({
            url: '/api/leaderboards',
            query: queryString.parse($page.query.toString())
         })
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
                           <th class="map" />
                           <th class="plays centered">Plays</th>
                           <th class="plays-daily centered">Plays (24h)</th>
                        </tr>
                     </thead>
                     <tbody>
                        {#each $leaderboards.leaderboards as leaderboard}
                           <tr class="table-item">
                              <td class="map"><SmallSongInfo {leaderboard} /></td>
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
               <ClassicPagination totalItems={$leaderboards.totalCount} pageSize={14} currentPage={$currentPage} changePage={(e) => changePage(e)} />
            {:else if !$leaderboardsError}
               <Loader />
            {/if}
            {#if $leaderboardsError}
               <Error message={$leaderboardsError.toString()} />
            {/if}
         </div>
      </div>
      <div class="column is-4">
         <div class="window has-shadow noheading">
            <div class="mb-2">Search Terms</div>
            <input class="input mb-2" value={searchValue} on:input={(e) => changeSearch(e)} placeholder="Search..." />
         </div>
         <div class="window has-shadow noheading">
            <label class="checkbox">
               <input type="checkbox" checked={filters?.verified} on:click|preventDefault={toggleVerified} />
               Only show verified leaderboards
            </label>
            <label class="checkbox">
               <input type="checkbox" checked={filters?.ranked} on:click|preventDefault={toggleRanked} />
               Only show ranked leaderboards
            </label>
         </div>
         <div class="window has-shadow noheading">
            <div class="mb-2">Sort By</div>
            <div class="select">
               <select value={filters?.category} on:change={changeCategory}>
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
                     checked={filters?.sortDirection === SortDirection.Descending}
                     value={SortDirection.Descending}
                  />
                  Descending
               </label>
               <label class="radio">
                  <input
                     type="radio"
                     name="sortOrder"
                     on:change={changeSortDirection}
                     checked={filters?.sortDirection === SortDirection.Ascending}
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

<Footer />

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

   td.map img {
      width: 24px;
      height: 24px;
      border-radius: 15%;
      vertical-align: middle;
   }

   td.map .songInfo {
      overflow-wrap: break-word;
      padding-left: 7px;
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
