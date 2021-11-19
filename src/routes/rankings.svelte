<script lang="ts">
   import type { Player } from '$lib/models/PlayerData';
   import { onDestroy } from 'svelte';
   import Loader from '$lib/components/common/loader.svelte';
   import Error from '$lib/components/common/error.svelte';
   import PlayerRow from '$lib/components/player/player-row.svelte';
   import ArrowPagination from '$lib/components/common/arrow-pagination.svelte';
   import axios from '$lib/utils/fetcher';
   import queryString from 'query-string';
   import { useAccio } from '$lib/utils/accio';
   import { pageQueryStore } from '$lib/query-store';
   import { page } from '$app/stores';
   import { fly } from 'svelte/transition';
   import Filter from '$lib/components/common/filter.svelte';
   import filters from '$lib/utils/filters';
   import type { FilterItem } from '$lib/models/Filter';
   import { browser } from '$app/env';
   import TextInput from '$lib/components/common/text-input.svelte';
   import { requestCancel, updateCancelToken } from '$lib/utils/accio/canceler';
   import { defaultBackground } from '$lib/global-store';

   const playersPerPage = 50;
   let pageDirection = 1;

   $: pageQuery = pageQueryStore({
      page: 1,
      countries: null,
      regions: null,
      search: null
   });

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
      $requestCancel.cancel('Filter Changed');
      updateCancelToken();
      pageDirection = newPage > $pageQuery.page ? 1 : -1;
      pageQuery.updateSingle('page', newPage);
   }

   const pageUnsubscribe = page.subscribe((p) => {
      if (browser) {
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
      filterChanged = true;
      $requestCancel.cancel('Filter Changed');
      updateCancelToken();
      if (items.length === 0) {
         pageQuery.updateSingle('countries', null);
      } else {
         pageQuery.update({
            page: 1,
            countries: items.map((i) => i.key).join(','),
            regions: null
         });
      }
   }

   function regionFilterUpdated(items: FilterItem[]) {
      filterChanged = true;
      $requestCancel.cancel('Filter Changed');
      updateCancelToken();
      if (items.length === 0) {
         pageQuery.updateSingle('regions', null);
      } else {
         pageQuery.update({
            page: 1,
            regions: items.map((i) => i.key).join(','),
            countries: null
         });
      }
   }

   function searchUpdated(search: string) {
      filterChanged = true;
      $requestCancel.cancel('Filter Changed');
      updateCancelToken();
      pageQuery.update({
         page: 1,
         search
      });
   }

   defaultBackground();

   onDestroy(pageUnsubscribe);
</script>

<head>
   <title>Rankings | ScoreSaber!</title>
</head>

<div class="section">
   <div class="window has-shadow noheading filters">
      <div>
         {#if $pageQuery.regions === null}
            <Filter
               items={filters.countryFilter}
               initialItems={$pageQuery.countries}
               filterName={'Country'}
               withCountryImages={true}
               filterUpdated={countryFilterUpdated}
            />
         {/if}
         {#if $pageQuery.countries === null}
            <Filter items={filters.regionFilter} initialItems={$pageQuery.regions} filterName={'Region'} filterUpdated={regionFilterUpdated} />
         {/if}
      </div>
      <div class="divider" />
      <div class="advancedSearch">
         <TextInput icon="fa-search" onInput={searchUpdated} value={$pageQuery.search} />
      </div>
   </div>
   <div class="window has-shadow noheading">
      {#if $playerCount && $rankings && $playerCount}
         <ArrowPagination pageClicked={changePage} page={parseInt($pageQuery.page)} maxPages={Math.ceil($playerCount / playersPerPage)} />
      {/if}
      <div in:fly={{ y: -20, duration: 1000 }} class="ranking">
         <div class="gridTable">
            <div class="header">
               <div />
               <div />
               <div class="centered">Performance Points</div>
               <div class="centered">Total Play Count</div>
               <div class="centered">Ranked Play Count</div>
               <div class="centered">Average Ranked Accuracy</div>
               <div class="centered">Weekly Change</div>
            </div>
            {#each $rankings ?? [] as player, i (player.id)}
               <PlayerRow row={i + 1} {pageDirection} {player} />
            {/each}
         </div>
      </div>
      {#if $rankings && $playerCount}
         <br />
      {:else if !$rankingsError && !$playerCountError}
         <Loader />
      {/if}
      {#if $rankingsError || $playerCountError}
         <Error message={$rankingsError.toString() || $playerCountError.toString()} />
      {/if}
      {#if $playerCount && $rankings && $playerCount}
         <ArrowPagination pageClicked={changePage} page={parseInt($pageQuery.page)} maxPages={Math.ceil($playerCount / playersPerPage)} />
      {/if}
   </div>
</div>

<style lang="scss">
   .gridTable {
      display: grid;
      grid-template-columns: 100%;

      // min-width: 600px;
      .header {
         font-weight: bold;
         grid-row: 1;
         padding: 4px 8px;
         margin: 2.5px 2px;
      }
      .centered {
         text-align: center;
      }
      > div {
         display: grid;
         grid-template-columns: 0.6fr 4fr 2fr 2fr 2fr 3fr 2fr;
      }
   }
   .filters {
      display: flex;
      flex-flow: row nowrap;
      > div:not(:last-child) {
         margin-right: 1rem;
      }
      .divider {
         border: 1px solid #fff;
      }
      .advancedSearch {
         display: flex;
         align-items: center;
         flex: 1;
      }
   }
   div.ranking {
      overflow-x: auto;
   }

   @media (max-width: 512px) {
      .filters {
         flex-flow: column nowrap;
         > div:not(:last-child) {
            margin-bottom: 1rem;
         }
         .divider {
            display: none;
         }
      }
      .ranking {
         overflow-x: hidden !important;
      }

      .gridTable {
         max-width: 100%;
         .header {
            display: none;
         }
         > div {
            grid-template-columns: 40px 55vw;
         }
      }
   }
</style>
