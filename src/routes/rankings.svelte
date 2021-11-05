<script lang="ts">
   import type { Player } from '$lib/models/PlayerData';
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
   import CountryChip from '$lib/components/rankings/country-chip.svelte';
   import AddCountry from '$lib/components/rankings/add-country.svelte';
   import type { countryData } from '$lib/models/CountryData';
   import RegionFilter from '$lib/components/rankings/region-filter.svelte';
   import RegionChip from '$lib/components/rankings/region-chip.svelte';

   const playersPerPage = 50;

   $: currentPage = createQueryStore('page', 1, queryChanged);

   $: regions = createQueryStore('regions', undefined, queryChanged);
   $: filteredRegions = $regions ? (<string>$regions).split(',') : [];
   $: countryStore = createQueryStore('countries', undefined, queryChanged);
   $: filteredCountries = filteredRegions.length <= 0 ? ($countryStore ? (<string>$countryStore)?.split(',') : []) : null;

   $: regionCountries = countryData.filter((x) => filteredRegions.includes(x.region)).map((c) => c['alpha-2']);
   $: query = queryString.stringify({
      page: $currentPage,
      countries: filteredRegions.length > 0 ? regionCountries.join(',') : filteredCountries.length > 0 ? filteredCountries.join(',') : undefined
   });

   const {
      data: rankings,
      error: rankingsError,
      refresh: refreshRankings
   } = useAccio<Player[]>(
      queryString.stringifyUrl({
         url: '/api/players',
         query: queryString.parse(query)
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
         query: queryString.parse(query)
      }),
      { fetcher: axios }
   );

   let countryData: countryData[] = [];
   (async () => {
      countryData = await axios('https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/all/all.json');
   })();

   function changePage(newPage: number) {
      $currentPage = newPage;
   }

   function queryChanged(newQuery: string) {}

   function removeCountry(country: string) {
      filteredCountries = filteredCountries.filter((c) => c !== country);
      $countryStore = filteredCountries.length > 0 ? filteredCountries.join(',') : null;
   }

   function addCountry(country: string) {
      filteredCountries.push(country);
      $countryStore = filteredCountries.join(',');
   }

   function removeRegion(region: string) {
      filteredRegions = filteredRegions.filter((r) => r !== region);
      $regions = filteredRegions.length > 0 ? filteredRegions.join(',') : null;
   }

   function addRegion(region: string) {
      filteredRegions.push(region);
      $regions = filteredRegions.join(',');
   }

   $: refreshRankings({ query: '?' + query });
</script>

<head>
   <title>Rankings | ScoreSaber!</title>
</head>

<Navbar />

<div class="section">
   <div class="window has-shadow noheading">
      {#if $playerCount && $rankings && $playerCount}
         <ArrowPagination pageClicked={changePage} page={parseInt($currentPage)} maxPages={Math.ceil($playerCount / playersPerPage)} />
      {/if}
      {#if $rankings && $playerCount}
         <div class="countries">
            {#if filteredCountries && filteredCountries.length > 0 && filteredRegions.length === 0}
               {#each filteredCountries as country}
                  <CountryChip {country} remove={removeCountry} />
               {/each}
            {/if}
            {#if filteredRegions.length === 0}
               <AddCountry {addCountry} selectedCountries={filteredCountries} {countryData} />
            {/if}
         </div>
         <div class="countries">
            {#if filteredRegions && filteredRegions.length > 0}
               {#each filteredRegions as region}
                  <RegionChip {region} remove={removeRegion} />
               {/each}
            {/if}
            <RegionFilter {addRegion} selectedRegions={filteredRegions} {countryData} />
         </div>
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

   .countries {
      display: flex;
      flex-flow: row wrap;
   }
</style>
