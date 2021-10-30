<script lang="ts">
   import type { Player } from '$lib/models/PlayerData';
   import Navbar from '$lib/components/common/navbar.svelte';
   import Footer from '$lib/components/common/footer.svelte';
   import Loader from '$lib/components/common/loader.svelte';
   import Error from '$lib/components/common/error.svelte';
   import PlayerLink from '$lib/components/player/player-link.svelte';
   import WeeklyChange from '$lib/components/player/weekly-change.svelte';
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
                  <tr>
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
                     <tr class="table-item">
                        <td class="rank" width="5px">
                           <span class="rank">#{player.rank}</span>
                        </td>
                        <td class="player">
                           <img src={player.profilePicture} alt={player.name} title={player.name} class="image rounded is-24x24" />
                           <span class="playerName"><PlayerLink {player} destination={`/u/${player.id}`} /></span>
                           <!-- <span class="playerName">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span> -->
                        </td>
                        <td class="pp centered">
                           <span class="pp">{player.pp.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span><span class="pp ppLabel">pp</span>
                        </td>

                        <td class="total-play-count centered">
                           <span>{player.scoreStats.totalPlayCount}</span>
                        </td>
                        <td class="ranked-play-count centered">
                           <span>{player.scoreStats.rankedPlayCount}</span>
                        </td>
                        <td class="ranked-acc centered">
                           <span>{player.scoreStats.averageRankedAccuracy.toFixed(2)}%</span>
                        </td>
                        <td class="difference centered">
                           <WeeklyChange {player} />
                        </td>
                     </tr>
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
      vertical-align: bottom;
   }
   td.player {
      white-space: nowrap;
      display: flex;
      align-items: flex-end;
   }
   span.playerName {
      font-weight: 700;
      margin-left: 10px;
      display: block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
   }
   tr.table-item {
      background-color: #323232;
   }
   tr.table-item:hover {
      background-color: #3c3c3c;
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
</style>
