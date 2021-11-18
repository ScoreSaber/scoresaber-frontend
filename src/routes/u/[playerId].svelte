<script lang="ts" context="module">
   import { loadMetadata } from '$lib/metadata-loader';

   export async function load({ fetch, page }) {
      return await loadMetadata(fetch, `/api/player/${page.params.playerId}/full`);
   }
</script>

<script lang="ts">
   import type { Player, PlayerScore } from '$lib/models/PlayerData';
   import Error from '$lib/components/common/error.svelte';
   import Stats from '$lib/components/player/stats.svelte';
   import Loader from '$lib/components/common/loader.svelte';
   import Badges from '$lib/components/player/badges.svelte';
   import PlayerLink from '$lib/components/player/player-link.svelte';
   import CountryImage from '$lib/components/image/country-image.svelte';
   import Meta from '$lib/components/common/meta.svelte';
   import RankChart from '$lib/components/player/rank-chart.svelte';
   import queryString from 'query-string';
   import { pageQueryStore } from '$lib/query-store';
   import { rankToPage } from '$lib/utils/helpers';
   import { page } from '$app/stores';
   import { fly } from 'svelte/transition';

   import axios from '$lib/utils/fetcher';
   import { useAccio } from '$lib/utils/accio';
   import Score from '$lib/components/player/score.svelte';
   import { onDestroy } from 'svelte';
   import { browser } from '$app/env';
   import ButtonGroup, { buttonGroupItem } from '$lib/components/common/button-group.svelte';
   import ClassicPagination from '$lib/components/common/classic-pagination.svelte';
   import ArrowPagination from '$lib/components/common/arrow-pagination.svelte';
   import { requestCancel, updateCancelToken } from '$lib/utils/accio/canceler';
   import Modal, { bind } from '$lib/components/common/modal.svelte';
   import { modal, setBackground, userData } from '$lib/global-store';
   import ScoreModal from '$lib/components/player/score-modal.svelte';
   import AdminModal from '$lib/components/admin/player-admin-modal.svelte';
   import fetcher from '$lib/utils/fetcher';
   import Permissions from '$lib/utils/permissions';

   export let metadata: Player = undefined;
   const scoresPerPage = 8;
   $: pageQuery = pageQueryStore({ page: 1, sort: 'top' });

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
      refresh: refreshPlayerData
   } = useAccio<Player>(getPlayerInfoUrl($page.params.playerId), { fetcher: axios, onSuccess: (data) => setBackground(data.profilePicture) });

   const {
      data: scoreData,
      error: scoreDataError,
      refresh: refreshScores
   } = useAccio<PlayerScore[]>(getPlayerScoresUrl($page.params.playerId, $page.query.toString()), { fetcher: axios });

   const pageUnsubscribe = page.subscribe((p) => {
      if (browser) {
         refreshScores({
            newUrl: getPlayerScoresUrl(p.params.playerId, p.query.toString())
         });
         refreshPlayerData({ newUrl: getPlayerInfoUrl(p.params.playerId) });
      }
   });
   onDestroy(pageUnsubscribe);

   const sortButtons: buttonGroupItem[] = [
      {
         label: 'Top Scores',
         value: 'top',
         icon: 'trophy'
      },
      {
         label: 'Recent Scores',
         value: 'recent',
         icon: 'clock'
      }
   ];

   $: selOption = $pageQuery['sort'] ? sortButtons.find((x) => x.value == $pageQuery['sort']) : sortButtons[0];
   function sortChanged(option: buttonGroupItem) {
      $requestCancel.cancel('Filter Changed');
      pageQuery.update({
         page: 1,
         sort: option.value
      });
      updateCancelToken();
   }

   let pageDirection = 1;

   function changePage(page: number) {
      $requestCancel.cancel('Filter Changed');
      pageDirection = page > $pageQuery.page ? 1 : -1;
      pageQuery.updateSingle('page', page);
      updateCancelToken();
   }

   function openScoreModal(score: PlayerScore) {
      modal.set(bind(ScoreModal, { player: $playerData, score: score }));
   }

   function openAdminModal() {
      modal.set(bind(AdminModal, { player: $playerData, onBanClick: handleBan, onGiveRoleClick: handleGiveRole, onUnbanClick: handleUnban }));
   }

   async function handleRefresh(player: Player) {
      playerData.set(undefined);
      await fetcher(`/api/user/${player.id}/refresh`);
      refreshPlayerData({ forceRevalidate: true, softRefresh: true });
   }

   async function handleBan(player: Player, reason: string) {
      playerData.set(undefined);
      await fetcher(`/api/user/${player.id}/ban/${reason}`, { withCredentials: true });
      refreshPlayerData({ forceRevalidate: true, softRefresh: true });
   }

   async function handleUnban(player: Player) {
      playerData.set(undefined);
      await fetcher(`/api/user/${player.id}/unban`, { withCredentials: true });
      refreshPlayerData({ forceRevalidate: true, softRefresh: true });
   }

   async function handleGiveRole(player: Player, role: string) {
      playerData.set(undefined);
      await fetcher(`/api/user/${player.id}/giveRole/${role}`, { withCredentials: true });
      refreshPlayerData({ forceRevalidate: true, softRefresh: true });
   }
</script>

<head>
   <title>{$playerData ? $playerData.name + "'s Profile" : 'Profile'} | ScoreSaber!</title>
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

<div class="section">
   <div class="content">
      {#if $playerData}
         <div in:fly={{ x: 20, duration: 1000 }} class="columns">
            <!-- Profile picture & badges -->
            <div class="column is-narrow">
               <div class="profile-picture">
                  <div class="image is-128x128 rounded" style="background-image: url({$playerData.profilePicture}); background-size: cover;">
                     {#if parseInt($playerData.id) >= 70000000000000000}
                        <button on:click={() => handleRefresh($playerData)} class="button refresh is-small is-dark mt-2" title="Refresh User">
                           <span class="icon is-small">
                              <i class="fas fa-sync-alt" />
                           </span>
                        </button>
                     {/if}
                     {#if $userData && Permissions.checkPermissionNumber($userData.permissions, Permissions.groups.ADMIN)}
                        <button on:click={() => openAdminModal()} class="button admin is-small is-dark mt-2" title="Admin Actions">
                           <span class="icon is-small">
                              <i class="fas fa-users-cog" />
                           </span>
                        </button>
                     {/if}
                  </div>
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
                  {#if !$playerData.banned}
                     <span title="Performance Points" class="title-header spacer pp">
                        {$playerData.pp.toLocaleString('en-US', { minimumFractionDigits: 2 })}pp
                     </span>
                  {/if}
               </h5>

               <h5 class="title is-5 player has-text-centered-mobile">
                  {#if !$playerData.inactive && !$playerData.banned}
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
                  {/if}
                  {#if $playerData.inactive}
                     <div class="text-inactive text-muted mb-3">Inactive account</div>
                  {/if}
                  {#if $playerData.banned}
                     <div class="text-inactive text-muted mb-3">Banned account</div>
                  {/if}
               </h5>
               {#if !$playerData.banned}
                  <div class="stats has-text-centered-mobile">
                     <Stats player={$playerData} />
                  </div>
               {/if}
            </div>
         </div>
      {:else if !$playerDataError}
         <Loader />
      {/if}

      {#if $playerDataError}
         <Error message={$playerDataError.toString()} />
      {/if}
   </div>

   {#if $playerData && !$playerData.banned && !$playerData.inactive}
      <div class="window has-shadow noheading">
         <Badges player={$playerData} />
         <RankChart player={$playerData} />
      </div>
   {/if}

   {#if $scoreData && $playerData}
      {#if !$playerData.banned}
         <div in:fly={{ x: 20, duration: 1000 }} class="window has-shadow noheading">
            <div class="button-container">
               <ButtonGroup onUpdate={sortChanged} options={sortButtons} bind:selected={selOption} />
            </div>
            <div class="mobile top-arrowpagination">
               <ArrowPagination
                  pageClicked={changePage}
                  page={parseInt($pageQuery.page)}
                  maxPages={Math.ceil($playerData.scoreStats.totalPlayCount / scoresPerPage)}
               />
            </div>
            <div in:fly={{ x: 20, duration: 1000 }} class="ranking songs">
               <div class="ranking songs gridTable">
                  {#each $scoreData as score, i (score.score.id)}
                     <Score openModal={openScoreModal} {pageDirection} {score} row={i + 1} />
                  {/each}
               </div>
            </div>
            <div class="pagination desktop tablet">
               <ClassicPagination
                  totalItems={$playerData.scoreStats.totalPlayCount}
                  pageSize={scoresPerPage}
                  currentPage={$pageQuery.page}
                  changePage={(e) => changePage(e)}
               />
            </div>
            <div class="mobile">
               <ArrowPagination
                  pageClicked={changePage}
                  page={parseInt($pageQuery.page)}
                  maxPages={Math.ceil($playerData.scoreStats.totalPlayCount / scoresPerPage)}
               />
            </div>
         </div>
      {/if}
   {/if}

   {#if !$scoreData && !$scoreDataError}
      <Loader />
   {/if}
   {#if $scoreDataError}
      <Error message={$scoreDataError.toString()} />
   {/if}
</div>

<Modal show={$modal} />

<style>
   .top-arrowpagination {
      margin-top: 15px;
   }
   .gridTable {
      display: grid;
      grid-template-columns: 1fr 6fr 3fr;
      padding: 10px;
   }

   @media (max-width: 512px) {
      .gridTable {
         grid-template-columns: 80px 8fr;
      }
   }

   .button-container {
      display: flex;
      justify-content: center;
   }

   h5.player {
      display: flex;
      gap: 10px;
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
   .profile-picture .button {
      position: absolute;
      border-radius: 20px;
   }

   .profile-picture .refresh {
      right: 3px;
   }

   .profile-picture .admin {
      top: 30px;
      right: -15px;
   }

   .title-header {
      font-size: smaller;
   }

   .text-inactive {
      font-size: 14px;
      font-weight: 400;
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
      .player {
         justify-content: center;
      }
   }
</style>
