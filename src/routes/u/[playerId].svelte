<script lang="ts" context="module">
   import { loadMetadata } from '$lib/stores/metadata-loader';

   export async function load({ fetch, params }) {
      return await loadMetadata(fetch, `/api/player/${params.playerId}/full`);
   }
</script>

<script lang="ts">
   import queryString from 'query-string';
   import { fly } from 'svelte/transition';
   import { onDestroy, onMount } from 'svelte';

   import { browser } from '$app/env';
   import { page } from '$app/stores';

   import { pageQueryStore } from '$lib/stores/query-store';
   import { modal, userData, setBackground } from '$lib/stores/global-store';

   import Error from '$lib/components/common/error.svelte';
   import Stats from '$lib/components/player/stats.svelte';
   import Loader from '$lib/components/common/loader.svelte';
   import Badges from '$lib/components/player/badges.svelte';
   import PlayerLink from '$lib/components/player/player-link.svelte';
   import CountryImage from '$lib/components/image/country-image.svelte';
   import Meta from '$lib/components/common/meta.svelte';
   import RankChart from '$lib/components/player/rank-chart.svelte';
   import Score from '$lib/components/player/score.svelte';
   import ButtonGroup, { type buttonGroupItem } from '$lib/components/common/button-group.svelte';
   import ClassicPagination from '$lib/components/common/classic-pagination.svelte';
   import ArrowPagination from '$lib/components/common/arrow-pagination.svelte';
   import Modal, { bind } from '$lib/components/common/modal.svelte';
   import ScoreModal from '$lib/components/player/score-modal.svelte';
   import CountryResetModal from '$lib/components/player/country-reset-modal.svelte';
   import AdminModal from '$lib/components/admin/player-admin-modal.svelte';
   import HorizontalAd from '$lib/components/ads/horizontal-ad.svelte';
   import Denyah from '$lib/components/misc/denyah.svelte';
   import Bio, { SaveStatus } from '$lib/components/common/bio.svelte';
   import TextInput from '$lib/components/common/text-input.svelte';

   import permissions from '$lib/utils/permissions';
   import fetcher from '$lib/utils/fetcher';
   import { requestCancel, updateCancelToken } from '$lib/utils/accio/canceler';
   import { useAccio } from '$lib/utils/accio';
   import { rankToPage } from '$lib/utils/helpers';

   import type { LeaderboardPlayer, Player, PlayerScore, PlayerScoreCollection } from '$lib/models/PlayerData';
   import type { CanResetCountryData } from '$lib/models/CanResetCountryData';
   import Presence from '$lib/components/player/presence.svelte';

   async function loadPresenceComponent() {
      const i = await import('$lib/components/player/presence.svelte');
      return i.default;
   }

   export let metadata: Player = undefined;

   type scoresQuery = {
      page: number;
      sort: 'top' | 'recent';
      search: string;
   };

   $: pageQuery = pageQueryStore<scoresQuery>({
      page: 1,
      sort: 'top',
      search: null
   });

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
   } = useAccio<Player>(getPlayerInfoUrl($page.params.playerId), {
      fetcher,
      onSuccess: (data) => setBackground(data.profilePicture)
   });

   const {
      data: scoreData,
      error: scoreDataError,
      refresh: refreshScores,
      initialLoadComplete: scoreInitialLoadComplete,
      loading: scoreDataLoading
   } = useAccio<PlayerScoreCollection>(getPlayerScoresUrl($page.params.playerId, $page.url.searchParams.toString()), { fetcher });

   const pageUnsubscribe = page.subscribe((p) => {
      if (browser && p.url.toString().indexOf('/u/') > -1) {
         refreshScores({
            newUrl: getPlayerScoresUrl(p.params.playerId, p.url.searchParams.toString()),
            softRefresh: true
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
      pageDirection = option.value === 'recent' ? 1 : -1;
      pageQuery.update({
         page: 1,
         sort: option.value as 'top' | 'recent'
      });
      updateCancelToken();
   }

   let pageDirection = 1;

   function changePage(page: number) {
      $requestCancel.cancel('Filter Changed');
      updateCancelToken();
      pageDirection = page > $pageQuery.page ? 1 : -1;
      pageQuery.updateSingle('page', page);
   }

   function openScoreModal(score: PlayerScore, player?: LeaderboardPlayer | Player) {
      modal.set(bind(ScoreModal, { player: player ?? $playerData, score: score }));
   }

   function openAdminModal() {
      modal.set(
         bind(AdminModal, {
            player: $playerData,
            onBanClick: handleBan,
            onGiveRoleClick: handleGiveRole,
            onUnbanClick: handleUnban,
            onRemoveRoleClick: handleRemoveRole,
            onOverrideRoleTextClick: handleOverrideRoleText,
            onResetCountryClick: handleResetCountryAdmin
         })
      );
   }

   async function openCountryResetModal() {
      const data = await fetcher<CanResetCountryData>(`/api/user/can-reset-country`, { withCredentials: true });

      modal.set(
         bind(CountryResetModal, {
            canResetCountry: data,
            onResetCountryClick: handleResetCountryUser
         })
      );
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

   async function handleRemoveRole(player: Player, role: string) {
      playerData.set(undefined);
      await fetcher(`/api/user/${player.id}/removeRole/${role}`, { withCredentials: true });
      refreshPlayerData({ forceRevalidate: true, softRefresh: true });
   }

   async function handleOverrideRoleText(player: Player, role: string) {
      playerData.set(undefined);
      await fetcher(`/api/user/${player.id}/overrideRoleText/${role}`, { withCredentials: true });
      refreshPlayerData({ forceRevalidate: true, softRefresh: true });
   }

   async function handleResetCountryAdmin(player: Player) {
      playerData.set(undefined);
      await fetcher(`/api/user/${player.id}/reset-country`, { withCredentials: true });
      refreshPlayerData({ forceRevalidate: true, softRefresh: true });
   }

   async function handleResetCountryUser() {
      playerData.set(undefined);
      await fetcher(`/api/user/reset-country`, { withCredentials: true });
      refreshPlayerData({ forceRevalidate: true, softRefresh: true });
   }

   function handleBioSaveStatus(status: SaveStatus) {
      switch (status) {
         case SaveStatus.Started: {
            playerData.set(undefined);
            break;
         }
         case SaveStatus.Completed: {
            refreshPlayerData({ forceRevalidate: true, softRefresh: true });
            break;
         }
      }
   }

   function searchUpdated(search: string) {
      $requestCancel.cancel('Filter Changed');
      updateCancelToken();
      if (search) {
         if (search.length > 3) {
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

   let isSteamPlayer: boolean;
   $: isSteamPlayer = $playerData?.id && parseInt($playerData.id, 10) >= 70000000000000000;
</script>

<head>
   <title>{$playerData ? $playerData.name + "'s Profile" : 'Profile'} | ScoreSaber!</title>
   {#if metadata}
      <Meta
         description={`Player Ranking: #${metadata.rank.toLocaleString('en-US')}
Performance Points: ${metadata.pp.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}pp
Total Play Count: ${metadata.scoreStats ? metadata.scoreStats.totalPlayCount.toLocaleString('en-US') : '0'}
Average Ranked Accuracy: ${metadata.scoreStats ? metadata.scoreStats.averageRankedAccuracy.toFixed(2) : '0'}%
Total Score: ${metadata.scoreStats ? metadata.scoreStats.totalScore.toLocaleString('en-US') : '0'}
Replays Watched by Others: ${metadata.scoreStats ? metadata.scoreStats.replaysWatched.toLocaleString('en-US') : '0'}`}
         image={metadata.profilePicture}
         title="{metadata.name}'s profile"
      />
   {/if}
</head>

{#if $playerData}
   <Denyah playerId={$playerData.id} />
{/if}

<div id="page" class="section">
   <div class="content">
      {#if $playerDataError}
         <Error error={$playerDataError} />
      {:else if !$playerData}
         <Loader />
      {/if}

      {#if $playerData}
         <div in:fly={{ x: 20, duration: 1000 }} class="columns">
            <!-- Profile picture & badges -->
            <div class="column is-narrow">
               <div class="profile-picture">
                  <div class="image is-128x128 rounded">
                     <img src={$playerData.profilePicture} alt="{$playerData.name}'s profile picture" />
                     {#if isSteamPlayer}
                        <button on:click={() => handleRefresh($playerData)} class="button refresh is-small is-dark mt-2" title="Refresh User">
                           <span class="icon is-small">
                              <i class="fas fa-sync-alt" />
                           </span>
                        </button>
                     {/if}
                     {#if $userData && $playerData.id == $userData.playerId}
                        <button on:click={() => openCountryResetModal()} class="button refresh-country is-small is-dark mt-2" title="Refresh country">
                           <span class="icon is-small">
                              <i class="fas fa-flag" />
                           </span>
                        </button>
                     {/if}
                     {#if $userData && permissions.checkPermissionNumber($userData.permissions, permissions.security.ADMIN)}
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
                     destination={isSteamPlayer ? `https://steamcommunity.com/profiles/${$playerData.id}` : null}
                  />
                  {#if !$playerData.banned}
                     <div class="divider" />
                     <span title="Performance Points" class="title-header pp">
                        {$playerData.pp.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}pp
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
                  {#if !$playerData.scoreStats}
                     <div class="text-inactive text-muted mb-3">New account</div>
                  {/if}
               </h5>
               {#if !$playerData.banned}
                  <div class="stats has-text-centered-mobile">
                     <Stats player={$playerData} />
                  </div>
               {/if}
            </div>
         </div>
      {/if}
   </div>

   {#if $playerData?.id && !$playerData.banned}
      <Presence playerId={$playerData?.id} />
      {#key $playerData.id}
         {#if $playerData.scoreStats}
            <div class="window has-shadow noheading">
               <Badges player={$playerData} />
               {#if !$playerData.inactive}
                  <RankChart player={$playerData} />
               {/if}
            </div>
            <Bio saveStatusUpdate={handleBioSaveStatus} player={$playerData} userData={$userData} />
         {/if}
      {/key}
   {/if}

   <HorizontalAd />

   {#if $scoreInitialLoadComplete && $playerData}
      {#if !$playerData.banned}
         <div in:fly={{ x: 20, duration: 1000 }} class="window has-shadow noheading bottomSection">
            {#if $scoreDataLoading}
               <Loader displayOver={true} />
            {/if}
            <div class="button-container">
               <ButtonGroup onUpdate={sortChanged} options={sortButtons} bind:selected={selOption} />
            </div>
            <div class="search-container">
               <div class="search">
                  <TextInput isSmall={true} onInput={searchUpdated} value={$pageQuery.search} />
               </div>
            </div>
            {#if $scoreData}
               <div class="mobile top-arrowpagination">
                  <ArrowPagination
                     pageClicked={changePage}
                     page={$pageQuery.page}
                     pageSize={$scoreData.metadata.itemsPerPage}
                     maxPages={$scoreData.metadata.total}
                     withFirstLast={true}
                  />
               </div>
               <div class="ranking songs">
                  <div class="ranking songs gridTable" class:loadingBlur={$scoreDataLoading}>
                     {#each $scoreData.playerScores ?? [] as score, i (score.score.id)}
                        <Score openModal={openScoreModal} {pageDirection} {score} row={i + 1} playerId={$playerData.id} />
                     {/each}
                  </div>
               </div>
               <div class="pagination desktop tablet">
                  <ClassicPagination
                     totalItems={$scoreData.metadata.total}
                     pageSize={$scoreData.metadata.itemsPerPage}
                     currentPage={$pageQuery.page}
                     changePage={(e) => changePage(e)}
                  />
               </div>
               <div class="mobile bottom-arrowpagination">
                  <ArrowPagination
                     pageClicked={changePage}
                     page={$pageQuery.page}
                     pageSize={$scoreData.metadata.itemsPerPage}
                     maxPages={$scoreData.metadata.total}
                     withFirstLast={true}
                  />
               </div>
            {/if}
         </div>
      {/if}
   {/if}

   {#if !$scoreData && !$scoreDataError && !$scoreInitialLoadComplete}
      <Loader />
   {/if}
   {#if $scoreDataError}
      {#if $scoreDataError.status != 404}
         <Error error={$scoreDataError} />
      {/if}
   {/if}
</div>

<Modal show={$modal} />

<style lang="scss">
   .top-arrowpagination,
   .bottom-arrowpagination {
      margin-top: 15px;
   }

   .gridTable {
      display: grid;
      grid-template-columns: 1fr;
      margin-top: 6px;
      min-height: 200px;
   }

   .bottomSection {
      position: relative;
   }

   .button-container {
      display: flex;
      justify-content: center;
   }

   .search-container {
      margin-top: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
   }

   .search {
      width: 320px;
   }

   h5.player {
      display: flex;
      gap: 10px;
      margin-bottom: 0px !important;
      .pp {
         align-self: flex-end;
      }
      .divider {
         border-left: 1px solid var(--dimmed);
      }
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

   .profile-picture .refresh-country {
      top: 30px;
      right: -15px;
   }

   .profile-picture .admin {
      right: 95px;
   }

   .profile-picture .image img {
      position: absolute;
      border-radius: 100%;
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
   @media only screen and (max-width: 512px) {
      .window {
         padding-left: 0.5rem;
         padding-right: 0.5rem;
      }
   }
</style>
