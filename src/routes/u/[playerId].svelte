<script lang="ts" context="module">
   import { loadMetadata } from '$lib/metadata-loader';

   export async function load({ fetch, page }) {
      return await loadMetadata(fetch, `/api/player/${page.params.playerId}/full`);
   }
</script>

<script lang="ts">
   import type { Player, PlayerScore } from '$lib/models/PlayerData';
   import Navbar from '$lib/components/common/navbar.svelte';
   import Footer from '$lib/components/common/footer.svelte';
   import Error from '$lib/components/common/error.svelte';
   import Button from '$lib/components/common/button.svelte';
   import Stats from '$lib/components/player/stats.svelte';
   import Loader from '$lib/components/common/loader.svelte';
   import Badges from '$lib/components/player/badges.svelte';
   import PlayerLink from '$lib/components/player/player-link.svelte';
   import CountryImage from '$lib/components/image/country-image.svelte';
   import Meta from '$lib/components/common/meta.svelte';
   import RankChart from '$lib/components/player/rank-chart.svelte';
   import queryString from 'query-string';
   import { rankToPage } from '$lib/utils/helpers';
   import { createQueryStore } from '$lib/query-store';
   import { page } from '$app/stores';
   import { fly } from 'svelte/transition';

   import axios from '$lib/utils/fetcher';
   import { useAccio } from '$lib/utils/accio';
   import Score from '$lib/components/player/score.svelte';
   import { onDestroy } from 'svelte';
   import { browser } from '$app/env';
   import ButtonGroup, { buttonGroupItem } from '$lib/components/common/button-group.svelte';
   import ClassicPagination from '$lib/components/common/classic-pagination.svelte';
   import { requestCancel, updateCancelToken } from '$lib/utils/accio/canceler';

   export let metadata: Player = undefined;

   $: sort = createQueryStore('sort', 'top');
   $: currentPage = createQueryStore('page', 1);

   function getPlayerInfoUrl(playerId: string) {
      return `/api/player/${playerId}/full`;
   }

   function getPlayerScoresUrl(playerId: string, query: string) {
      return queryString.stringifyUrl({
         url: `/api/player/${playerId}/scores`,
         query: queryString.parse(query)
      });
   }

   const {
      data: playerData,
      error: playerDataError,
      refresh: refreshRankings
   } = useAccio<Player>(getPlayerInfoUrl($page.params.playerId), { fetcher: axios, onSuccess: playerDataLoaded });

   const {
      data: scoreData,
      error: scoreDataError,
      refresh: refreshScores
   } = useAccio<PlayerScore[]>(getPlayerScoresUrl($page.params.playerId, $page.query.toString()), { fetcher: axios });

   function playerDataLoaded(playerData: Player) {
      document.title = `${playerData.name}'s Profile | ScoreSaber!`;
   }

   const pageUnsubscribe = page.subscribe((p) => {
      if (browser) {
         refreshScores({
            newUrl: getPlayerScoresUrl(p.params.playerId, $page.query.toString())
         });
         refreshRankings({ newUrl: getPlayerInfoUrl(p.params.playerId) });
      }
   });
   onDestroy(pageUnsubscribe);

   const sortButtons: buttonGroupItem[] = [
      {
         label: 'Top Scores',
         value: 'top',
         icon: 'chevron-down'
      },
      {
         label: 'Recent Scores',
         value: 'recent',
         icon: 'clock'
      }
   ];

   $: selOption = $sort ? sortButtons.find((x) => x.value == $sort) : sortButtons[0];
   function sortChanged(option: buttonGroupItem) {
      $requestCancel.cancel('Filter Changed');
      $sort = option.value;
      updateCancelToken();
   }

   function changePage(page: number) {
      $requestCancel.cancel('Filter Changed');
      $currentPage = page;
      updateCancelToken();
   }
</script>

<head>
   <title>ScoreSaber!</title>
   {#if metadata}
      <Meta
         description={`Player Ranking: #${metadata.rank}\r\nPerformance Points: ${metadata.pp.toLocaleString('en-US', {
            minimumFractionDigits: 2
         })}pp\r\nTotal Play Count: ${metadata.scoreStats.totalPlayCount.toLocaleString(
            'en-US'
         )}\r\nAverage Ranked Accuracy: ${metadata.scoreStats.averageRankedAccuracy.toFixed(2)}%`}
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
                           <a title="Global Ranking" href={`/rankings?page=${rankToPage($playerData.rank, 50)}`}
                              >#{$playerData.rank.toLocaleString('en-US')}</a
                           >
                        </span>
                        <span class="title-header spacer">
                           <CountryImage country={$playerData.country} />
                           <a
                              title="Country Ranking"
                              href={`/rankings?page=${rankToPage($playerData.countryRank, 50)}&countries=${$playerData.country.toLowerCase()}`}
                              >#{$playerData.countryRank.toLocaleString('en-US')}</a
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
         <ButtonGroup onUpdate={sortChanged} options={sortButtons} bind:selected={selOption} />
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
                     {#each $scoreData as score (score.score.id)}
                        <Score {score} />
                     {/each}
                  </tbody>
               </table>
            </div>
            <div class="pagination">
               <ClassicPagination
                  totalItems={$playerData.scoreStats.totalPlayCount}
                  pageSize={8}
                  currentPage={$currentPage}
                  changePage={(e) => changePage(e)}
               />
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
   table {
      border-collapse: separate;
      border-spacing: 0 5px;
   }

   .content table th {
      border: none !important;
   }

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

   .pagination {
      display: flex;
      width: 100%;
      justify-content: center;
      align-items: center;
      margin: 15px 0;
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
