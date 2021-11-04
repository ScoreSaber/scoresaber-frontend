<script lang="ts" context="module">
   import { loadMetadata } from '$lib/metadata-loader';

   export async function load({ fetch, page }) {
      return await loadMetadata(fetch, `/api/player/${page.params.index}/full`);
   }
</script>

<script lang="ts">
   import type { Player, PlayerScore } from '$lib/models/PlayerData';
   import Navbar from '$lib/components/common/navbar.svelte';
   import Footer from '$lib/components/common/footer.svelte';
   import Error from '$lib/components/common/error.svelte';
   import Button from '$lib/components/common/button.svelte';
   import FormattedDate from '$lib/components/common/formatted-date.svelte';
   import Stats from '$lib/components/player/stats.svelte';
   import Loader from '$lib/components/common/loader.svelte';
   import Badges from '$lib/components/player/badges.svelte';
   import PlayerLink from '$lib/components/player/player-link.svelte';
   import CountryImage from '$lib/components/image/country-image.svelte';
   import Meta from '$lib/components/common/meta.svelte';
   import RankChart from '$lib/components/player/rank-chart.svelte';
   import SmallSongInfo from '$lib/components/leaderboard/small-song-info.svelte';
   import queryString from 'query-string';
   import { rankToPage } from '$lib/utils/helpers';
   import { createQueryStore } from '$lib/query-store';
   import { page } from '$app/stores';
   import { fly } from 'svelte/transition';

   import axios from '$lib/utils/fetcher';
   import { useAccio } from '$lib/utils/accio';

   export let metadata: Player = undefined;

   $: sort = createQueryStore('sort', 'top', queryChanged);

   const {
      data: playerData,
      error: playerDataError,
      refresh: refreshRankings
   } = useAccio<Player>(`/api/player/${$page.params.index}/full`, { fetcher: axios, dataLoaded: playerDataLoaded });

   const {
      data: scoreData,
      error: scoreDataError,
      refresh: refreshScores
   } = useAccio<PlayerScore[]>(
      queryString.stringifyUrl({
         url: `/api/player/${$page.params.index}/scores`,
         query: queryString.parse($page.query.toString())
      }),
      { fetcher: axios }
   );

   function playerDataLoaded(playerData: Player) {
      document.title = `${playerData.name}'s Profile | ScoreSaber!`;
   }

   function queryChanged(newQuery: string) {
      refreshScores({ query: newQuery });
   }
</script>

<head>
   <title>ScoreSaber!</title>
   {#if metadata}
      <Meta
         description={`Player Ranking: #${metadata.rank}\r\nPerformance Points: ${metadata.pp.toLocaleString('en-US', {
            minimumFractionDigits: 2
         })}pp\r\nTotal Play Count: ${
            metadata.scoreStats.totalPlayCount
         }\r\nAverage Ranked Accuracy: ${metadata.scoreStats.averageRankedAccuracy.toFixed(2)}%`}
         image={metadata.profilePicture}
         title="{metadata.name}'s profile"
      />
   {/if}
</head>

<Navbar />
<div class="section">
   <div class="window has-shadow noheading">
      {#if $playerData}
         {#if !$playerData.banned}
            <div in:fly={{ x: 20, duration: 1000 }} class="columns">
               <!-- Profile picture & badges -->
               <div class="column is-narrow">
                  <div class="profile-picture">
                     <img alt={$playerData.name} title={$playerData.name} src={$playerData.profilePicture} class="image is-128x128 rounded" />
                  </div>
                  <div class="desktop">
                     <Badges player={$playerData} />
                  </div>
               </div>
               <div class="column">
                  <!-- Player name -->
                  <h5 class="title is-5 player has-text-centered-mobile">
                     <PlayerLink
                        player={$playerData}
                        external={true}
                        countryImage={true}
                        destination={`https://steamcommunity.com/profiles/${$playerData.id}`}
                     />
                     <span title="Performance Points" class="title-header spacer pp">
                        {$playerData.pp.toLocaleString('en-US', { minimumFractionDigits: 2 })}pp
                     </span>
                  </h5>

                  <h5 class="title is-5 player has-text-centered-mobile">
                     <small>
                        <span class="title-header">
                           <i class="fas fa-globe-americas" title="Global Ranking" />
                           <a title="Global Ranking" href={`/rankings?page=${rankToPage($playerData.rank, 50)}`}>#{$playerData.rank}</a>
                        </span>
                        <span class="title-header spacer">
                           <CountryImage country={$playerData.country} />
                           <a
                              title="Country Ranking"
                              href={`/rankings?page=${rankToPage($playerData.countryRank, 50)}&countries=${$playerData.country.toLowerCase()}`}
                              >#{$playerData.countryRank}</a
                           >
                        </span>
                     </small>
                  </h5>

                  <div class="stats has-text-centered-mobile">
                     <Stats player={$playerData} />
                  </div>

                  <div class="mobile">
                     <Badges player={$playerData} />
                  </div>
                  {#if !$playerData.inactive}
                     <RankChart player={$playerData} />
                  {/if}
               </div>
            </div>
         {:else}
            <span>Player banned</span>
         {/if}
      {:else if !$playerDataError}
         <Loader />
      {/if}
      {#if $playerDataError}
         <Error message={$playerDataError.toString()} />
      {/if}
   </div>
   <div in:fly={{ x: 20, duration: 1000 }} class="window has-shadow noheading">
      <div class="button-container">
         <Button isDisabled={true} poggleable={true} title={'Top Scores'} icon={'chevron-down'} />
         <Button poggleable={true} title={'Recent Scores'} icon={'clock'} />
      </div>

      {#if $scoreData && $playerData}
         {#if !$playerData.banned}
            <div in:fly={{ x: 20, duration: 1000 }} class="ranking songs">
               <table class="ranking songs">
                  <thead>
                     <tr>
                        <th width="5px" />
                        <th />
                        <th />
                     </tr>
                  </thead>
                  <tbody>
                     {#each $scoreData as score}
                        <tr class="table-item">
                           <td>
                              <div class="rank-info">
                                 <span>
                                    <i class="fas fa-globe-americas" title="Ranking" />
                                    <a title="Ranking" href={`#`}>#{score.score.rank}</a>
                                 </span>
                                 <FormattedDate date={score.score.timeSet} />
                              </div>
                           </td>
                           <td>
                              <SmallSongInfo leaderboard={score.leaderboard} />
                           </td>
                           <td />
                        </tr>
                     {/each}
                  </tbody>
               </table>
            </div>
         {/if}
      {:else if !$scoreData}
         <Loader />
      {/if}
      {#if $scoreDataError}
         <Error message={$scoreDataError.toString()} />
      {/if}
   </div>
</div>

<Footer />

<style>
   .rank-info {
      width: 100px;
      display: flex;
      flex-direction: column;
      text-align: center;
   }
   table {
      border-collapse: separate;
      border-spacing: 0 5px;
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

   td:first-child {
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
   }
   td:last-child {
      border-bottom-right-radius: 5px;
      border-top-right-radius: 5px;
   }

   tr.table-item {
      background-color: #323232;
   }
   tr.table-item:hover {
      background-color: #3c3c3c;
   }

   /* End player scores */

   .button-container {
      display: flex;
      justify-content: center;
   }

   h5.player {
      /* display: flex; a
      align-items: center; */
      margin-bottom: 0px !important;
   }
   .column.is-narrow {
      position: relative;
      width: 200px;
   }
   .profile-picture {
      display: flex;
      justify-content: center;
   }

   .title-header {
      font-size: smaller;
   }

   .title-header.spacer {
      border-left: 1px solid var(--dimmed);
      margin-left: 5px;
      padding-left: 10px;
   }

   .fas.fa-globe-americas {
      height: 11px;
      width: 16px;
      cursor: help;
   }

   .stats {
      margin-top: 5px;
   }

   @media only screen and (min-width: 769px) {
      .mobile {
         display: none;
      }
   }
   @media only screen and (max-width: 769px) {
      .column.is-narrow {
         width: 100%;
      }
      .desktop {
         display: none;
      }
   }
</style>
