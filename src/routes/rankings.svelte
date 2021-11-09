<script lang="ts">
   import type { Player } from '$lib/models/PlayerData';
   import { onDestroy } from 'svelte';
   import Navbar from '$lib/components/common/navbar.svelte';
   import Footer from '$lib/components/common/footer.svelte';
   import Loader from '$lib/components/common/loader.svelte';
   import Error from '$lib/components/common/error.svelte';
   import PlayerRow from '$lib/components/player/player-row.svelte';
   import ArrowPagination from '$lib/components/common/arrow-pagination.svelte';
   import axios from '$lib/utils/fetcher';
   import queryString from 'query-string';
   import { useAccio } from '$lib/utils/accio';
   import { createQueryStore } from '$lib/query-store';
   import { page } from '$app/stores';
   import { fly } from 'svelte/transition';
   import Filter from '$lib/components/common/filter.svelte';
   import filters from '$lib/utils/filters';
   import type { FilterItem } from '$lib/models/Filter';

   const playersPerPage = 50;

   $: currentPage = createQueryStore('page', 1);
   $: countries = createQueryStore('countries', undefined);
   $: regions = createQueryStore('regions', undefined);

   let filterChanged: boolean = false;

   const {
      data: rankings,
      error: rankingsError,
      refresh: refreshRankings
   } = useAccio<Player[]>(
      queryString.stringifyUrl({
         url: '/api/players',
         query: queryString.parse($page.query.toString())
      }),
      { fetcher: axios }
   );

   const {
      data: playerCount,
      error: playerCountError,
      refresh: refreshPlayerCount //TODO: Refresh on filter change (not page change)
   } = useAccio<number>(
      queryString.stringifyUrl({
         url: '/api/players/count',
         query: queryString.parse($page.query.toString())
      }),
      { fetcher: axios }
   );

   function changePage(newPage: number) {
      $currentPage = newPage;
   }

   const pageUnsubscribe = page.subscribe((p) => {
      if (typeof window !== 'undefined') {
         refreshRankings({
            newUrl: queryString.stringifyUrl({
               url: '/api/players',
               query: queryString.parse(p.query.toString())
            })
         });
         if (filterChanged) {
            refreshPlayerCount({
               newUrl: queryString.stringifyUrl({
                  url: '/api/players/count',
                  query: queryString.parse(p.query.toString())
               })
            });
            filterChanged = false;
         }
      }
   });

   function countryFilterUpdated(items: FilterItem[]) {
      if (items.length === 0) {
         $countries = null;
      } else {
         $countries = items.map((i) => i.key).join(',');
      }
      filterChanged = true;
   }

   function regionFilterUpdated(items: FilterItem[]) {
      if (items.length === 0) {
         $regions = null;
      } else {
         $regions = items.map((i) => i.key).join(',');
      }
      filterChanged = true;
   }

   onDestroy(pageUnsubscribe);
</script>

<head>
   <title>Rankings | ScoreSaber!</title>
</head>

<Navbar />

<div class="section">
   <div class="window has-shadow noheading">
      {#if $regions === undefined}
         <Filter
            items={filters.countryFilter}
            initialItems={$countries}
            filterName={'Country'}
            withCountryImages={true}
            filterUpdated={countryFilterUpdated}
         />
      {/if}
      {#if $countries === undefined}
         <Filter items={filters.regionFilter} initialItems={$regions} filterName={'Region'} filterUpdated={regionFilterUpdated} />
      {/if}
   </div>
   <div class="window has-shadow noheading">
      {#if $playerCount && $rankings && $playerCount}
         <ArrowPagination pageClicked={changePage} page={parseInt($currentPage)} maxPages={Math.ceil($playerCount / playersPerPage)} />
      {/if}
      {#if $rankings && $playerCount}
         <div in:fly={{ y: -20, duration: 1000 }} class="ranking">
            <table>
               <thead>
                  <tr class="headers">
                     <th class="rank" />
                     <th class="player" />
                     <th class="pp centered">Performance Points</th>
                     <th class="total-play-count centered">Total Play Count</th>
                     <th class="ranked-play-count centered">Ranked Play Count</th>
                     <th class="ranked-acc centered">Average Ranked Accuracy</th>
                     <th class="difference centered">Weekly Change</th>
                  </tr>
               </thead>
               <tbody>
                  {#each $rankings as player}
                     <PlayerRow {player} />
                  {/each}
               </tbody>
            </table>
         </div>
         <br />
      {:else if !$rankingsError && !$playerCountError}
         <Loader />
      {/if}
      {#if $rankingsError || $playerCountError}
         <Error message={$rankingsError.toString() || $playerCountError.toString()} />
      {/if}
      {#if $playerCount && $rankings && $playerCount}
         <ArrowPagination pageClicked={changePage} page={parseInt($currentPage)} maxPages={Math.ceil($playerCount / playersPerPage)} />
      {/if}
   </div>
</div>

<Footer />

<style>
   table {
      border-collapse: separate;
      white-space: nowrap;
      border-spacing: 0 5px;
   }
   div.ranking {
      overflow-x: auto;
   }
   .content table th {
      border: none !important;
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
