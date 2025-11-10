<script lang="ts">
   import queryString from 'query-string';
   import { onDestroy, setContext } from 'svelte';
   import { writable } from 'svelte/store';

   import { browser } from '$app/env';
   import { page } from '$app/stores';

   import { defaultBackground } from '$lib/stores/global-store';
   import { pageQueryStore } from '$lib/stores/query-store';

   import Error from '$lib/components/common/error.svelte';
   import Filter from '$lib/components/common/filter.svelte';
   import { FILTER_CONTEXT_KEY } from '$lib/components/common/filter-context';
   import Loader from '$lib/components/common/loader.svelte';
   import TextInput from '$lib/components/common/text-input.svelte';
   import PlayerRow from '$lib/components/player/player-row.svelte';
   import ArrowPagination from '$lib/components/common/arrow-pagination.svelte';
   import ArrowButton from '$lib/components/common/pagination/arrow-button.svelte';

   import { useAccio } from '$lib/utils/accio';
   import { requestCancel, updateCancelToken } from '$lib/utils/accio/canceler';
   import { useDelayedBlur } from '$lib/utils/delayed-blur';
   import axios from '$lib/utils/fetcher';
   import filters from '$lib/utils/filters';

   import type { PlayerCollection } from '$lib/models/PlayerData';
   import type { FilterItem } from '$lib/models/Filter';

   const expandedFilterStore = writable<string | null>(null);
   setContext(FILTER_CONTEXT_KEY, expandedFilterStore);

   interface RankingsQuery {
      page: number;
      countries: string | null;
      regions: string | null;
      search: string | null;
   }

   const MIN_SEARCH_LENGTH = 3;

   let pageDirection = 1;

   const pageQuery = pageQueryStore<RankingsQuery>({
      page: 1,
      countries: null,
      regions: null,
      search: null
   });

   $: selectedRegions = $pageQuery.regions?.split(',').map((r) => r.trim().toUpperCase()) ?? [];
   $: selectedCountries = $pageQuery.countries?.split(',').map((c) => c.trim().toUpperCase()) ?? [];

   $: regionFilters = filters.regionFilter.filter((item) => selectedRegions.includes(item.key));
   $: countryFilters = filters.countryFilter.filter((item) => selectedCountries.includes(item.key));
   $: hasLocationFilter = $pageQuery.countries !== null || $pageQuery.regions !== null;

   const {
      data: rankings,
      error: rankingsError,
      loading: isLoading,
      refresh: refreshRankings
   } = useAccio<PlayerCollection>(
      queryString.stringifyUrl({
         url: '/api/players?withMetadata=true',
         query: queryString.parse($page.url.searchParams.toString())
      }),
      { fetcher: axios }
   );

   const showBlur = useDelayedBlur(isLoading, { delayMs: 200 });

   function handlePageChange(newPage: number): void {
      $requestCancel.cancel('Page Changed');
      updateCancelToken();
      pageDirection = newPage > $pageQuery.page ? 1 : -1;
      pageQuery.updateSingle('page', newPage);
   }

   function handleCountryFilterUpdate(items: FilterItem[]): void {
      $requestCancel.cancel('Filter Changed');
      updateCancelToken();

      if (items.length === 0) {
         pageQuery.updateSingle('countries', null);
         return;
      }

      pageQuery.update({
         page: 1,
         countries: items.map((item) => item.key).join(','),
         regions: null
      });
   }

   function handleRegionFilterUpdate(items: FilterItem[]): void {
      $requestCancel.cancel('Filter Changed');
      updateCancelToken();

      if (items.length === 0) {
         pageQuery.updateSingle('regions', null);
         return;
      }

      pageQuery.update({
         page: 1,
         regions: items.map((item) => item.key).join(','),
         countries: null
      });
   }

   function handleSearchUpdate(search: string | null): void {
      $requestCancel.cancel('Search Changed');
      updateCancelToken();

      if (!search) {
         // Clear search and reset to page 1
         pageQuery.update({ page: 1, search: null });
         return;
      }

      const trimmedSearch = search.trim();
      if (trimmedSearch.length >= MIN_SEARCH_LENGTH) {
         pageQuery.update({
            page: 1,
            search: trimmedSearch
         });
      } else {
         pageQuery.update({ page: 1, search: null });
      }
   }

   const pageUnsubscribe = page.subscribe(async (p) => {
      if (!browser) return;

      await refreshRankings({
         newUrl: queryString.stringifyUrl({
            url: '/api/players',
            query: queryString.parse(p.url.searchParams.toString())
         }),
         softRefresh: true
      });
   });

   defaultBackground();

   onDestroy(pageUnsubscribe);
</script>

<head>
   <title>Rankings | ScoreSaber!</title>
</head>

<div class="section">
   <div class="rankings-container window has-shadow noheading">
      {#if $rankingsError}
         <div class="error-with-controls">
            <div class="controls-bar">
               <div class="is-hidden-mobile pagination-left" />

               <div class="controls-center">
                  <div class="filters-group">
                     {#if $pageQuery.regions === null}
                        <Filter
                           items={filters.countryFilter}
                           bind:selectedItems={countryFilters}
                           initialItems={$pageQuery.countries}
                           filterName="Country"
                           withCountryImages={true}
                           filterUpdated={handleCountryFilterUpdate}
                        />
                     {/if}
                     {#if $pageQuery.countries === null}
                        <Filter
                           items={filters.regionFilter}
                           bind:selectedItems={regionFilters}
                           initialItems={$pageQuery.regions}
                           filterName="Region"
                           filterUpdated={handleRegionFilterUpdate}
                        />
                     {/if}
                  </div>

                  <div class="divider" />

                  <div class="search-container">
                     <TextInput icon="fa-search" onInput={handleSearchUpdate} value={$pageQuery.search} />
                  </div>
               </div>

               <div class="is-hidden-mobile pagination-right" />
            </div>

            <div class="error-display">
               <Error error={$rankingsError} />
            </div>
         </div>
      {:else if $rankings}
         {#if $showBlur}
            <Loader displayOver={true} />
         {/if}

         <div class="content" class:blur={$showBlur}>
            <div class="is-hidden-desktop top-mobile-pagination">
               <ArrowPagination
                  pageClicked={handlePageChange}
                  page={$pageQuery.page}
                  pageSize={$rankings.metadata.itemsPerPage}
                  maxPages={$rankings.metadata.total}
                  withFirstLast={true}
               />
            </div>

            <div class="controls-bar">
               <div class="is-hidden-mobile pagination-left">
                  <ArrowButton icon="fa-arrow-left" on:click={() => handlePageChange($pageQuery.page - 1)} disabled={$pageQuery.page <= 1} />
               </div>

               <div class="controls-center">
                  <div class="filters-group">
                     {#if $pageQuery.regions === null}
                        <Filter
                           items={filters.countryFilter}
                           bind:selectedItems={countryFilters}
                           initialItems={$pageQuery.countries}
                           filterName="Country"
                           withCountryImages={true}
                           filterUpdated={handleCountryFilterUpdate}
                        />
                     {/if}
                     {#if $pageQuery.countries === null}
                        <Filter
                           items={filters.regionFilter}
                           bind:selectedItems={regionFilters}
                           initialItems={$pageQuery.regions}
                           filterName="Region"
                           filterUpdated={handleRegionFilterUpdate}
                        />
                     {/if}
                  </div>

                  <div class="divider" />

                  <div class="search-container">
                     <TextInput icon="fa-search" onInput={handleSearchUpdate} value={$pageQuery.search} />
                  </div>
               </div>

               <div class="is-hidden-mobile pagination-right">
                  <ArrowButton
                     icon="fa-arrow-right"
                     on:click={() => handlePageChange($pageQuery.page + 1)}
                     disabled={$pageQuery.page >= Math.ceil($rankings.metadata.total / $rankings.metadata.itemsPerPage)}
                  />
               </div>
            </div>

            <div class="ranking-table">
               <div class="table-header">
                  <div class="header-cell" />
                  <div class="header-cell" />
                  <div class="header-cell centered">Performance Points</div>
                  {#if $rankings.players?.[0]?.scoreStats}
                     <div class="header-cell centered">Total Play Count</div>
                     <div class="header-cell centered">Ranked Play Count</div>
                     <div class="header-cell centered">Average Ranked Accuracy</div>
                  {/if}
                  <div class="header-cell centered">Weekly Change</div>
               </div>

               <div class="table-body">
                  {#each $rankings.players ?? [] as player, index (player.id)}
                     <PlayerRow row={index + 1} {player} countryFiltered={hasLocationFilter} pageNumber={$pageQuery.page - 1} />
                  {/each}
               </div>
            </div>

            <div class="is-hidden-mobile bottom-desktop-pagination">
               <ArrowButton icon="fa-arrow-left" on:click={() => handlePageChange($pageQuery.page - 1)} disabled={$pageQuery.page <= 1} />
               <ArrowButton
                  icon="fa-arrow-right"
                  on:click={() => handlePageChange($pageQuery.page + 1)}
                  disabled={$pageQuery.page >= Math.ceil($rankings.metadata.total / $rankings.metadata.itemsPerPage)}
               />
            </div>

            <div class="is-hidden-desktop bottom-arrowpagination">
               <ArrowPagination
                  pageClicked={handlePageChange}
                  page={$pageQuery.page}
                  pageSize={$rankings.metadata.itemsPerPage}
                  maxPages={$rankings.metadata.total}
                  withFirstLast={true}
               />
            </div>
         </div>
      {:else if $isLoading}
         <div class="loader-placeholder">
            <Loader />
         </div>
      {/if}
   </div>
</div>

<style lang="scss">
   .rankings-container {
      position: relative;
      padding: 1rem;
   }

   .error-with-controls {
      .controls-bar {
         padding-bottom: 1rem;
         border-bottom: 1px solid var(--borderColor);
         margin-bottom: 1.5rem;
      }
   }

   .error-display {
      padding: 2rem;
      min-height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
   }

   .loader-placeholder {
      display: flex;
      justify-content: center;
      padding: 4rem 0;
      min-height: 200px;
   }

   .content {
      transition: filter 0.25s ease;

      &.blur {
         filter: blur(3px) saturate(1.2);
         pointer-events: none;
      }
   }

   .controls-bar {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      padding: 0.5rem 0;
      margin-bottom: 1rem;
      position: relative;
      overflow: visible;
   }

   .pagination-left {
      display: flex;
      align-items: center;
      justify-content: flex-start;
   }

   .pagination-right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
   }

   .controls-center {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      flex-wrap: wrap;
   }

   .filters-group {
      display: flex;
      flex-flow: row wrap;
      gap: 0.375rem;
      align-items: center;
      position: relative;
      overflow: visible;
   }

   .divider {
      width: 1px;
      height: 1.5rem;
      background-color: var(--borderColor);
      flex-shrink: 0;
      align-self: center;
   }

   .search-container {
      display: flex;
      align-items: center;
      min-width: 180px;
      max-width: 350px;
   }

   .top-mobile-pagination {
      display: none;
   }

   .bottom-arrowpagination {
      display: none;
   }

   .bottom-desktop-pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1rem;
   }

   .ranking-table {
      overflow-x: auto;
      margin: 0.5rem 0;
   }

   .table-header {
      display: grid;
      grid-template-columns: 100px 3fr 2fr 2fr 2fr 3fr 2fr;
      font-weight: bold;
      padding: 0.5rem 0.75rem;
      margin: 0.25rem 0.125rem;
      border-radius: 6px;
      background-color: var(--foregroundItem);
      border: 1px solid var(--borderColor);
   }

   .header-cell {
      padding: 0.25rem;
      white-space: nowrap;

      &.centered {
         text-align: center;
      }
   }

   .table-body {
      display: contents;
   }

   @media (max-width: 768px) {
      .top-mobile-pagination {
         display: block;
         margin-bottom: 1rem;
      }

      .bottom-arrowpagination {
         display: block;
         margin-top: 1rem;
      }

      .controls-bar {
         display: flex;
         flex-flow: column nowrap;
         gap: 0.75rem;
         align-items: stretch;
      }

      .controls-center {
         width: 100%;
      }

      .filters-group {
         width: 100%;
         justify-content: flex-start;
      }

      .divider {
         display: none;
      }

      .search-container {
         width: 100%;
         max-width: 100%;
         min-width: unset;
      }
   }

   @media (max-width: 512px) {
      .ranking-table {
         overflow-x: hidden;
      }

      .table-header {
         display: none;
      }
   }
</style>
