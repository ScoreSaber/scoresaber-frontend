<script lang="ts">
   import { onDestroy, onMount } from 'svelte';
   import queryString from 'query-string';
   import Slider from '@bulatdashiev/svelte-slider';

   import { browser } from '$app/env';
   import { page } from '$app/stores';

   import { pageQueryStore } from '$lib/stores/query-store';
   import { defaultBackground } from '$lib/stores/global-store';

   import ClassicPagination from '$lib/components/common/classic-pagination.svelte';
   import SmallSongInfo from '$lib/components/leaderboard/small-song-info.svelte';
   import TextInput from '$lib/components/common/text-input.svelte';
   import Error from '$lib/components/common/error.svelte';
   import Loader from '$lib/components/common/loader.svelte';
   import ArrowPagination from '$lib/components/common/arrow-pagination.svelte';
   import RankedVideoBlock from '$lib/components/common/ranked-video-block.svelte';

   import { requestCancel, updateCancelToken } from '$lib/utils/accio/canceler';
   import { useAccio } from '$lib/utils/accio';
   import { useDelayedBlur } from '$lib/utils/delayed-blur';
   import axios from '$lib/utils/fetcher';
   import { rankedBatch, getBatchTitle } from '$lib/config/ranked-batch';

   import {
      Category,
      getCategoryFromNumber,
      getNumberFromCategory,
      getNumberFromSortDirection,
      getSortDirectionFromNumber,
      type LeaderboardInfoCollection,
      SortDirection
   } from '$lib/models/LeaderboardData';

   let rangeStars: number[] = [];

   type leaderboardsQuery = {
      page: number;
      verified: number;
      ranked: 0 | 1;
      qualified: 0 | 1;
      minStar: number;
      maxStar: number;
      category: 1 | 2 | 3 | 4;
      sort: 0 | 1;
      search: string;
   };

   $: pageQuery = pageQueryStore<leaderboardsQuery>({
      page: 1,
      verified: 1,
      ranked: 0,
      qualified: 0,
      minStar: 0,
      maxStar: 20,
      category: 1,
      sort: 0,
      search: null
   });

   onMount(() => {
      rangeStars = [$pageQuery.minStar, $pageQuery.maxStar];
   });

   const {
      data: leaderboards,
      error: leaderboardsError,
      loading: isLoading,
      refresh: refreshLeaderboards
   } = useAccio<LeaderboardInfoCollection>(
      queryString.stringifyUrl({
         url: '/api/leaderboards',
         query: queryString.parse($page.url.searchParams.toString())
      }),
      { fetcher: axios }
   );

   const showBlur = useDelayedBlur(isLoading, { delayMs: 200 });

   function changePage(newPage: number) {
      $requestCancel.cancel('Page Changed');
      updateCancelToken();
      pageQuery.updateSingle('page', newPage);
   }

   function toggleVerified(event) {
      $requestCancel.cancel('Filter Changed');
      updateCancelToken();
      pageQuery.updateSingle('verified', event.target.checked ? 1 : 0);
   }

   function toggleRanked(event) {
      $requestCancel.cancel('Filter Changed');
      updateCancelToken();
      pageQuery.updateSingle('ranked', event.target.checked ? 1 : 0);

      if ($pageQuery.qualified == 1) {
         pageQuery.updateSingle('qualified', 0);
      }
   }

   function toggleQualified(event) {
      $requestCancel.cancel('Filter Changed');
      updateCancelToken();
      pageQuery.updateSingle('qualified', event.target.checked ? 1 : 0);
      if ($pageQuery.ranked == 1) {
         pageQuery.updateSingle('ranked', 0);
      }
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
      if (search) {
         if (search.length > 3) {
            pageQuery.update({
               page: 1,
               search
            });
         } else {
            pageQuery.updateSingle('search', null);
         }
      } else {
         pageQuery.updateSingle('search', null);
      }
   }
   let debounceTimer;
   function changeRangeStars(event) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
         $requestCancel.cancel('Filter Changed');
         updateCancelToken();
         pageQuery.update({
            page: 1,
            minStar: parseInt(event.detail[0]),
            maxStar: parseInt(event.detail[1])
         });
      }, 500);
   }

   const pageUnsubscribe = page.subscribe((p) => {
      if (browser) {
         refreshLeaderboards({
            newUrl: queryString.stringifyUrl({
               url: '/api/leaderboards',
               query: queryString.parse(p.url.searchParams.toString())
            }),
            softRefresh: true
         });
      }
   });

   defaultBackground();

   onDestroy(pageUnsubscribe);
</script>

<head>
   <title>Leaderboards | ScoreSaber!</title>
</head>

<div class="bg-content">
   <div class="section">
      <div class="columns">
         <div class="column is-8">
            {#if $leaderboardsError}
               <Error error={$leaderboardsError} />
            {/if}

            {#if $leaderboards}
               <div class="window has-shadow noheading" aria-busy={$isLoading || $showBlur}>
                  {#if $showBlur}
                     <Loader displayOver={true} />
                  {/if}

                  <div class="content" class:blur={$showBlur}>
                     <div class="ranking">
                        <table>
                           <thead>
                              <tr class="headers">
                                 <th class="map" />
                                 <th class="plays centered desktop">Plays</th>
                                 <th class="plays-daily centered desktop">Last 24h</th>
                              </tr>
                           </thead>
                           <tbody>
                              {#each $leaderboards.leaderboards as leaderboard}
                                 <tr class="table-item">
                                    <td class="map"
                                       ><SmallSongInfo {leaderboard} margin={false} /><span class="text-muted mobile plays">
                                          <b>{leaderboard.plays.toLocaleString('en-US')}</b> plays ({leaderboard.dailyPlays.toLocaleString('en-US')} in
                                          the last 24h)</span
                                       ></td
                                    >
                                    <td class="plays centered desktop">
                                       {leaderboard.plays.toLocaleString('en-US')}
                                    </td>
                                    <td class="plays-daily centered desktop">
                                       {leaderboard.dailyPlays.toLocaleString('en-US')}
                                    </td>
                                 </tr>
                              {/each}
                           </tbody>
                        </table>
                     </div>
                     <br />
                     <div class="desktop">
                        <ClassicPagination totalItems={$leaderboards.metadata.total} pageSize={14} currentPage={$pageQuery.page} {changePage} />
                     </div>
                     <div class="mobile">
                        <ArrowPagination
                           pageClicked={changePage}
                           page={$pageQuery.page}
                           pageSize={$leaderboards.metadata.itemsPerPage}
                           maxPages={$leaderboards.metadata.total}
                        />
                     </div>
                  </div>
               </div>
            {:else if $isLoading}
               <div class="window has-shadow noheading">
                  <div class="loader-placeholder">
                     <Loader />
                  </div>
               </div>
            {/if}
         </div>
         <div class="column is-4">
            <div class="window has-shadow noheading">
               <div class="mb-2">Search Terms</div>
               <TextInput icon="fa-search" onInput={searchUpdated} value={$pageQuery.search} />
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
               <label class="checkbox">
                  <input type="checkbox" checked={$pageQuery.qualified == 1} on:click|preventDefault={toggleQualified} />
                  Only show qualified leaderboards
               </label>
            </div>
            <div class="window has-shadow noheading">
               <div class="mb-2">Sort By</div>
               <div class="select">
                  <select value={getCategoryFromNumber($pageQuery.category)} on:change={changeCategory}>
                     <option value={Category.Trending}>Trending</option>
                     <option value={Category.DateRanked}>Date Ranked</option>
                     <option value={Category.DateQualified}>Date Qualified</option>
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
                        checked={getSortDirectionFromNumber($pageQuery.sort) === SortDirection.Descending}
                        value={SortDirection.Descending}
                     />
                     Descending
                  </label>
                  <label class="radio">
                     <input
                        type="radio"
                        name="sortOrder"
                        on:change={changeSortDirection}
                        checked={getSortDirectionFromNumber($pageQuery.sort) === SortDirection.Ascending}
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
            <RankedVideoBlock
               videoId={rankedBatch.videoId}
               title={getBatchTitle(rankedBatch.month)}
               dismissMessage="If you dismiss this video, it won't be shown again on this page until the next ranked batch. Are you sure?"
            />
         </div>
      </div>
   </div>
</div>

<style lang="scss">
   .bg-content {
      min-height: 100vh;
   }

   .window {
      position: relative;
   }

   .content {
      transition: filter 0.25s ease;

      &.blur {
         filter: blur(3px) saturate(1.2);
         pointer-events: none;
      }
   }

   .loader-placeholder {
      display: flex;
      justify-content: center;
      padding: 4rem 0;
   }
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
      border: 1px solid var(--borderColor);
   }
   tr.table-item:hover td {
      background-color: var(--gray-light);
      border-color: var(--gray-light);
   }
   td:first-child {
      border-left-style: solid;
      border-top-left-radius: 6px;
      border-bottom-left-radius: 6px;
   }
   td:last-child {
      border-right-style: solid;
      border-bottom-right-radius: 6px;
      border-top-right-radius: 6px;
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

      .desktop {
         display: none;
      }

      .map {
         border-radius: 6px;
      }
   }

   @media only screen and (min-width: 769px) {
      .mobile {
         display: none !important;
      }
   }

   @media (max-width: 512px) {
      .headers {
         display: none;
      }

      .headers th:not(.player, .rank) {
         display: none;
      }

      table {
         margin-top: 0;
      }
   }

   .mobile.plays {
      display: block;
      margin-left: 2px;
      margin-top: 0.4rem;
   }

   .window .checkbox {
      display: flex;
      align-items: center;
      padding: 0.75rem 0;
      cursor: pointer;
      transition: color 0.2s ease;
      color: var(--textColor);

      &:hover {
         color: var(--scoreSaberYellow);
      }

      input[type='checkbox'] {
         width: 1.125rem;
         height: 1.125rem;
         margin-right: 0.75rem;
         margin-top: 0;
         margin-bottom: 0;
         cursor: pointer;
         accent-color: var(--scoreSaberYellow);
         flex-shrink: 0;
      }

      &:not(:last-child) {
         margin-bottom: 0;
      }
   }
</style>
