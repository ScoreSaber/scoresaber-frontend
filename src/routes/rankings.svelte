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

   const playersPerPage = 50;

   $: currentPage = createQueryStore('page', 1, queryChanged);

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

   function queryChanged(newQuery: string) {
      refreshRankings({ query: newQuery });
   }
</script>

<head>
   <title>Rankings | ScoreSaber!</title>
</head>

<Navbar />

<div class="section">
   <div class="window has-shadow noheading">
      {#if $playerCount}
         <ArrowPagination pageClicked={changePage} page={parseInt($currentPage)} maxPages={Math.ceil($playerCount / playersPerPage)} />
      {/if}
      {#if $rankings && $playerCount}
         <div class="ranking">
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
      {#if $playerCount}
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
      table {
         border-spacing: 0;
      }
      .headers {
         display: none;
      }
   }
</style>
