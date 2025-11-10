<script lang="ts" context="module">
   import { loadMetadata } from '$lib/stores/metadata-loader';

   export async function load({ fetch, params }) {
      return await loadMetadata(fetch, `/api/player/${params.playerId}/full`);
   }
</script>

<script lang="ts">
   import queryString from 'query-string';
   import { fly } from 'svelte/transition';
   import { onDestroy } from 'svelte';

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
   import Score from '$lib/components/player/score.svelte';
   import ButtonGroup, { type buttonGroupItem } from '$lib/components/common/button-group.svelte';
   import ClassicPagination from '$lib/components/common/classic-pagination.svelte';
   import ArrowPagination from '$lib/components/common/arrow-pagination.svelte';
   import Modal, { bind } from '$lib/components/common/modal.svelte';
   // Lazy load heavy components
   let RankChartComponent: any = null;
   $: if ($playerData?.id && !$playerData.banned && !$playerData.inactive && $playerData.scoreStats && !RankChartComponent) {
      import('$lib/components/player/rank-chart.svelte').then((mod) => {
         RankChartComponent = mod.default;
      });
   }
   const ScoreModal = () => import('$lib/components/player/score-modal.svelte');
   const CountryResetModal = () => import('$lib/components/player/country-reset-modal.svelte');
   const AdminModal = () => import('$lib/components/admin/player-admin-modal.svelte');
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

   async function openScoreModal(score: PlayerScore, player?: LeaderboardPlayer | Player) {
      const ScoreModalComponent = (await ScoreModal()).default;
      modal.set(bind(ScoreModalComponent, { player: player ?? $playerData, score: score }));
   }

   async function openAdminModal() {
      const AdminModalComponent = (await AdminModal()).default;
      modal.set(
         bind(AdminModalComponent, {
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
      const CountryResetModalComponent = (await CountryResetModal()).default;

      modal.set(
         bind(CountryResetModalComponent, {
            canResetCountry: data,
            onResetCountryClick: handleResetCountryUser
         })
      );
   }

   async function refreshPlayerWithAction(action: () => Promise<void>) {
      playerData.set(undefined);
      await action();
      refreshPlayerData({ forceRevalidate: true, softRefresh: true });
   }

   async function handleRefresh(player: Player) {
      return refreshPlayerWithAction(() => fetcher(`/api/user/${player.id}/refresh`));
   }

   async function handleBan(player: Player, reason: string) {
      return refreshPlayerWithAction(() => fetcher(`/api/user/${player.id}/ban/${reason}`, { withCredentials: true }));
   }

   async function handleUnban(player: Player) {
      return refreshPlayerWithAction(() => fetcher(`/api/user/${player.id}/unban`, { withCredentials: true }));
   }

   async function handleGiveRole(player: Player, role: string) {
      return refreshPlayerWithAction(() => fetcher(`/api/user/${player.id}/giveRole/${role}`, { withCredentials: true }));
   }

   async function handleRemoveRole(player: Player, role: string) {
      return refreshPlayerWithAction(() => fetcher(`/api/user/${player.id}/removeRole/${role}`, { withCredentials: true }));
   }

   async function handleOverrideRoleText(player: Player, role: string) {
      return refreshPlayerWithAction(() => fetcher(`/api/user/${player.id}/overrideRoleText/${role}`, { withCredentials: true }));
   }

   async function handleResetCountryAdmin(player: Player) {
      return refreshPlayerWithAction(() => fetcher(`/api/user/${player.id}/reset-country`, { withCredentials: true }));
   }

   async function handleResetCountryUser() {
      return refreshPlayerWithAction(() => fetcher(`/api/user/reset-country`, { withCredentials: true }));
   }

   function handleBioSaveStatus(status: SaveStatus) {
      if (status === SaveStatus.Started) {
         playerData.set(undefined);
         return;
      }

      if (status === SaveStatus.Completed) {
         refreshPlayerData({ forceRevalidate: true, softRefresh: true });
      }
   }

   function searchUpdated(search: string) {
      $requestCancel.cancel('Filter Changed');
      updateCancelToken();

      const shouldSearch = search && search.length > 3;
      pageQuery.update({
         page: 1,
         search: shouldSearch ? search : null
      });
   }

   let isSteamPlayer: boolean;
   $: isSteamPlayer = $playerData?.id && parseInt($playerData.id, 10) >= 70000000000000000;

   $: isCurrentUser = $userData && $playerData && $playerData.id === $userData.playerId;
   $: isAdmin = $userData && permissions.checkPermissionNumber($userData.permissions, permissions.security.ADMIN);
   $: isActivePlayer = $playerData && !$playerData.inactive && !$playerData.banned;
   $: showScores = $scoreInitialLoadComplete && $playerData && !$playerData.banned;
   $: showChartAndBadges = $playerData?.id && !$playerData.banned && $playerData.scoreStats;
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
         <div in:fly={{ x: 20, duration: 1000 }} class="columns profile-section">
            <!-- Profile picture & badges -->
            <div class="column is-narrow">
               <div class="profile-picture">
                  <div class="image is-128x128 rounded">
                     <img src={$playerData.profilePicture} alt="{$playerData.name}'s profile picture" />
                     {#if isSteamPlayer}
                        <button
                           on:click={() => handleRefresh($playerData)}
                           class="button profile-action refresh is-small is-dark mt-2"
                           title="Refresh User"
                        >
                           <span class="icon is-small">
                              <i class="fas fa-sync-alt" />
                           </span>
                        </button>
                     {/if}
                     {#if isCurrentUser}
                        <button
                           on:click={() => openCountryResetModal()}
                           class="button profile-action refresh-country is-small is-dark mt-2"
                           title="Refresh country"
                        >
                           <span class="icon is-small">
                              <i class="fas fa-flag" />
                           </span>
                        </button>
                     {/if}
                     {#if isAdmin}
                        <button on:click={() => openAdminModal()} class="button profile-action admin is-small is-dark mt-2" title="Admin Actions">
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
                     countryImage={false}
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
                  {#if isActivePlayer}
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
                  {:else if $playerData.banned}
                     <div class="text-inactive text-muted mb-3">Banned account</div>
                  {:else if !$playerData.scoreStats}
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

   {#if showChartAndBadges}
      {#key $playerData.id}
         <div class="window has-shadow noheading">
            <Badges player={$playerData} />
            {#if !$playerData.inactive && RankChartComponent}
               <svelte:component this={RankChartComponent} player={$playerData} />
            {/if}
         </div>
         <Bio saveStatusUpdate={handleBioSaveStatus} player={$playerData} userData={$userData} />
      {/key}
   {/if}

   {#if showScores}
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
         {#if $scoreDataError && $pageQuery.search}
            <Error error={$scoreDataError} />
         {:else if $scoreData}
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
   {:else if !$scoreData && !$scoreDataError}
      <Loader />
   {/if}
</div>

<Modal show={$modal} />

<style lang="scss">
   .bottom-arrowpagination {
      margin-top: 1rem;
   }

   .gridTable {
      display: grid;
      grid-template-columns: 1fr;
      margin-top: 0.75rem;
      min-height: 200px;
      gap: 0.25rem;
   }

   .bottomSection {
      position: relative;
   }

   .button-container {
      display: flex;
      justify-content: center;
      margin-bottom: 1rem;
   }

   .search-container {
      margin-top: 0.75rem;
      margin-bottom: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
   }

   .search {
      width: 320px;
   }

   h5.player {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 0px !important;
      line-height: 1.3;
      .pp {
         align-self: flex-end;
         font-weight: 600;
      }
      .divider {
         border-left: 1px solid var(--borderColor);
         height: 18px;
         opacity: 0.6;
      }
      small {
         display: inline-flex;
         align-items: center;
         gap: 0;
         vertical-align: middle;
         margin-top: 0.25rem;
      }
      .title-header {
         display: inline-flex;
         align-items: center;
         gap: 5px;
         vertical-align: middle;
         a {
            display: inline-flex;
            align-items: center;
            line-height: 1;
            transition: color 0.2s ease;
         }
         a:hover {
            color: var(--scoreSaberYellow);
         }
      }
   }
   .profile-section {
      margin-bottom: 1.25rem;
   }

   .column.is-narrow {
      position: relative;
      width: 200px;
   }

   .profile-picture {
      display: flex;
      justify-content: center;
      margin-bottom: 0.5rem;
   }

   .profile-picture .button.profile-action {
      position: absolute;
      border-radius: 6px;
      border: 1px solid var(--borderColor);
      background-color: var(--foregroundItem);
      transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.15s ease;

      &:hover {
         background-color: var(--gray-light);
         border-color: var(--scoreSaberYellow);
         transform: scale(1.05);
      }

      &:active {
         transform: scale(0.95);
      }

      &.refresh {
         right: 3px;
      }

      &.refresh-country {
         top: 40px;
         right: -15px;
      }

      &.admin {
         right: 105px;
      }
   }

   .profile-picture .image img {
      position: absolute;
      border-radius: 100%;
      border: 2px solid var(--borderColor);
   }

   .title-header {
      font-size: smaller;
      vertical-align: middle;
      a {
         display: inline-flex;
         align-items: center;
         line-height: 1;
      }
   }

   .text-inactive {
      font-size: 14px;
      font-weight: 400;
      color: var(--muted);
   }

   .title-header.spacer {
      border-left: 1px solid var(--borderColor);
      margin-left: 8px;
      padding-left: 12px;
      opacity: 1;
   }

   .title-header .fas.fa-globe-americas {
      cursor: help;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 0.875em;
      line-height: 1;
      flex-shrink: 0;
      vertical-align: middle;
      &::before {
         display: block;
         line-height: 1;
      }
   }

   .stats {
      margin-top: 0.75rem;
   }

   .pagination {
      display: flex;
      width: 100%;
      justify-content: center;
      align-items: center;
      margin: 1rem 0;
   }

   @media only screen and (max-width: 769px) {
      .column.is-narrow {
         width: 100%;
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
