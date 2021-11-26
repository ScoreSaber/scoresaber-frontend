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
   $: loading = true;
   $: firstLoad = true;
   let pageDirection = 1;

   type rankingsQuery = {
      page: number;
      countries: string;
      regions: string;
      search: string;
   };

   $: pageQuery = pageQueryStore<rankingsQuery>({
      page: 1,
      countries: null,
      regions: null,
      search: null
   });

   $: regionFilters = filters.regionFilter.filter((x) => ($pageQuery.regions?.split(',') ?? []).includes(x.key));
   $: countryFilters = filters.countryFilter.filter((x) => ($pageQuery.countries?.split(',') ?? []).includes(x.key));

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
      { fetcher: axios, onSuccess: onRankingsSuccess }
   );

   const {
      data: playerCount,
      error: playerCountError,
      refresh: refreshPlayerCount
   } = useAccio<number>(
      queryString.stringifyUrl({
         url: '/api/players/count',
         query: queryString.parse($page.query.toString())
      }),
      { fetcher: axios }
   );

   function onRankingsSuccess() {
      if (firstLoad) {
         firstLoad = false;
      }
   }

   function changePage(newPage: number) {
      $requestCancel.cancel('Filter Changed');
      updateCancelToken();
      pageDirection = newPage > $pageQuery.page ? 1 : -1;
      pageQuery.updateSingle('page', newPage);
   }

   const pageUnsubscribe = page.subscribe(async (p) => {
      if (browser) {
         loading = true;
         await refreshRankings({
            newUrl: queryString.stringifyUrl({
               url: '/api/players',
               query: queryString.parse(p.query.toString())
            }),
            softRefresh: true
         });
         if (filterChanged) {
            await refreshPlayerCount({
               newUrl: queryString.stringifyUrl({
                  url: '/api/players/count',
                  query: queryString.parse(p.query.toString())
               }),
               softRefresh: true
            });
            filterChanged = false;
         }
         loading = false;
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
      search = search.trim();
      if (search) {
         if (search.length >= 3) {
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
               bind:selectedItems={countryFilters}
               initialItems={$pageQuery.countries}
               filterName={'Country'}
               withCountryImages={true}
               filterUpdated={countryFilterUpdated}
            />
         {/if}
         {#if $pageQuery.countries === null}
            <Filter
               items={filters.regionFilter}
               bind:selectedItems={regionFilters}
               initialItems={$pageQuery.regions}
               filterName={'Region'}
               filterUpdated={regionFilterUpdated}
            />
         {/if}
      </div>
      <div class="divider" />
      <div class="advancedSearch">
         <TextInput icon="fa-search" onInput={searchUpdated} value={$pageQuery.search} />
      </div>
   </div>
   {#if firstLoad && loading && !$playerCountError}
      <Loader />
   {/if}
   {#if $rankingsError || $playerCountError}
      <Error error={$rankingsError || $playerCountError} />
   {/if}
   {#if !firstLoad}
      <div class="window has-shadow noheading">
         {#if loading}
            <Loader displayOver={true} />
         {/if}
         <div class={loading ? ' blur' : ''}>
            <ArrowPagination pageClicked={changePage} page={$pageQuery.page} maxPages={Math.ceil($playerCount / playersPerPage)} />
            <div in:fly={{ y: -20, duration: 1000 }} class="ranking">
               <div class="gridTable mb-4">
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
                     <PlayerRow
                        row={i + 1}
                        {pageDirection}
                        {player}
                        countryFiltered={$pageQuery.countries !== null}
                        pageNumber={$pageQuery.page - 1}
                     />
                  {/each}
               </div>
            </div>
         </div>

         {#if $rankingsError || $playerCountError}
            <Error error={$rankingsError || $playerCountError} />
         {/if}
         {#if !firstLoad}
            <ArrowPagination pageClicked={changePage} page={$pageQuery.page} maxPages={Math.ceil($playerCount / playersPerPage)} />
         {/if}
      </div>
   {/if}
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

   .blur {
      filter: blur(3px) saturate(1.2);
      transition: 0.25s filter linear;
   }
   .window {
      position: relative;
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
