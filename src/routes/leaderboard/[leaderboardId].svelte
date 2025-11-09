<script lang="ts" context="module">
   import { loadMetadata } from '$lib/stores/metadata-loader';

   export async function load({ fetch, params }) {
      return await loadMetadata(fetch, `/api/leaderboard/by-id/${params.leaderboardId}/info`);
   }
</script>

<script lang="ts">
   import queryString from 'query-string';
   import { get } from 'svelte/store';
   import { setContext } from 'svelte';
   import { writable } from 'svelte/store';

   import { page } from '$app/stores';
   import { browser } from '$app/env';
   import { goto } from '$app/navigation';

   import { modal, setBackground, userData } from '$lib/stores/global-store';
   import { pageQueryStore } from '$lib/stores/query-store';

   import LeaderboardGrid from '$lib/components/leaderboard/leaderboard-grid.svelte';
   import TextInput from '$lib/components/common/text-input.svelte';
   import Meta from '$lib/components/common/meta.svelte';
   import ArrowPagination from '$lib/components/common/arrow-pagination.svelte';
   import DifficultySelection from '$lib/components/map/difficulty-selection.svelte';
   import LeaderboardMapInfo from '$lib/components/map/leaderboard-map-info.svelte';
   import Filter from '$lib/components/common/filter.svelte';
   import { FILTER_CONTEXT_KEY } from '$lib/components/common/filter-context';
   import Error from '$lib/components/common/error.svelte';
   import Loader from '$lib/components/common/loader.svelte';
   import ClassicPagination from '$lib/components/common/classic-pagination.svelte';
   import ScoreModal from '$lib/components/leaderboard/score-modal.svelte';
   import Modal, { bind } from '$lib/components/common/modal.svelte';

   import { requestCancel, updateCancelToken } from '$lib/utils/accio/canceler';
   import { useDelayedBlur } from '$lib/utils/delayed-blur';
   import poster from '$lib/utils/poster';
   import Permissions from '$lib/utils/permissions';
   import filters from '$lib/utils/filters';
   import axios from '$lib/utils/fetcher';
   import { useAccio } from '$lib/utils/accio';

   import type { FilterItem } from '$lib/models/Filter';
   import type { Difficulty, LeaderboardInfo, Score, ScoreCollection } from '$lib/models/LeaderboardData';

   const expandedFilterStore = writable<string | null>(null);
   setContext(FILTER_CONTEXT_KEY, expandedFilterStore);

   export let metadata: LeaderboardInfo = undefined;

   interface LeaderboardQuery {
      page: number;
      search: string;
      countries: string;
   }

   const pageQuery = pageQueryStore<LeaderboardQuery>({
      page: 1,
      search: null,
      countries: null
   });

   const initialPage = get(page);
   let activeLeaderboardId = initialPage.params.leaderboardId;
   const initialQuery = initialPage.url.searchParams.toString();

   let selectedGameMode = '';
   let filteredDiffs: Difficulty[] = [];
   let availableGameModes: string[] = [];
   let manualPP: number;
   let countryFilters: FilterItem[] = [];

   function getLeaderboardInfoUrl(leaderboardId: string) {
      return `/api/leaderboard/by-id/${leaderboardId}/info`;
   }

   function getLeaderboardScoresUrl(leaderboardId: string, query: string) {
      return queryString.stringifyUrl({
         url: `/api/leaderboard/by-id/${leaderboardId}/scores`,
         query: queryString.parse(query)
      });
   }

   let currentInfoUrl = getLeaderboardInfoUrl(activeLeaderboardId);
   let currentScoresUrl = getLeaderboardScoresUrl(activeLeaderboardId, initialQuery);

   const {
      data: leaderboard,
      error: leaderboardError,
      refresh: refreshLeaderboard,
      loading: leaderboardLoading
   } = useAccio<LeaderboardInfo>(currentInfoUrl, {
      fetcher: axios,
      onSuccess: handleLeaderboardSuccess
   });

   const {
      data: leaderboardScores,
      error: leaderboardScoresError,
      refresh: refreshLeaderboardScores,
      loading: leaderboardScoresLoading
   } = useAccio<ScoreCollection>(currentScoresUrl, { fetcher: axios });

   const showScoresBlur = useDelayedBlur(leaderboardScoresLoading, { delayMs: 200 });

   $: countryFilters = filters.countryFilter.filter((x) => ($pageQuery.countries?.split(',') ?? []).includes(x.key));

   $: availableGameModes = $leaderboard ? Array.from(new Set($leaderboard.difficulties.map((diff) => diff.gameMode))) : [];

   $: {
      if ($leaderboard) {
         const fallbackMode = $leaderboard.difficulty.gameMode ?? availableGameModes[0] ?? '';
         if (!selectedGameMode || !availableGameModes.includes(selectedGameMode)) {
            selectedGameMode = fallbackMode;
         }
      } else {
         selectedGameMode = '';
      }
   }

   $: filteredDiffs = $leaderboard ? $leaderboard.difficulties.filter((diff) => diff.gameMode === selectedGameMode) : [];

   $: if (browser) {
      const nextLeaderboardId = $page.params.leaderboardId;
      if (nextLeaderboardId && nextLeaderboardId !== activeLeaderboardId) {
         activeLeaderboardId = nextLeaderboardId;
         const nextInfoUrl = getLeaderboardInfoUrl(nextLeaderboardId);
         currentInfoUrl = nextInfoUrl;
         refreshLeaderboard({
            newUrl: nextInfoUrl,
            softRefresh: Boolean($leaderboard),
            bypassInitialCheck: true
         });
      }
   }

   $: if (browser) {
      const nextScoresUrl = getLeaderboardScoresUrl($page.params.leaderboardId, $page.url.searchParams.toString());
      if (nextScoresUrl !== currentScoresUrl) {
         currentScoresUrl = nextScoresUrl;
         refreshLeaderboardScores({
            newUrl: nextScoresUrl,
            softRefresh: Boolean($leaderboardScores),
            bypassInitialCheck: true
         });
      }
   }

   function handleLeaderboardSuccess(data: LeaderboardInfo) {
      setBackground(data.coverImage);
      selectedGameMode = data.difficulty.gameMode;
   }

   function gameModeChanged(shouldNavigate: boolean) {
      if (!$leaderboard) return;

      const diffsForMode = $leaderboard.difficulties.filter((diff) => diff.gameMode === selectedGameMode);
      if (shouldNavigate && diffsForMode.length > 0) {
         const currentDifficulty = $leaderboard.difficulty.difficulty;
         const targetDiff = diffsForMode.find((diff) => diff.difficulty === currentDifficulty) ?? diffsForMode[0];
         goto(`/leaderboard/${targetDiff.leaderboardId}`, { keepfocus: true, noscroll: true, replaceState: true });
      }
   }

   function countryFilterUpdated(items: FilterItem[]) {
      if (items.length === 0) {
         pageQuery.updateSingle('countries', null);
      } else {
         pageQuery.updateSingle('countries', items.map((i) => i.key).join(','));
      }
   }

   function changePage(newPage: number) {
      $requestCancel.cancel('Page Changed');
      updateCancelToken();
      pageQuery.updateSingle('page', newPage);
   }

   function searchUpdated(search: string) {
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

   function showScoreModal(score: Score, leaderboard: LeaderboardInfo) {
      modal.set(bind(ScoreModal, { score, leaderboard }));
   }

   async function handleGivePP() {
      const leaderboardId = $leaderboard.id;
      leaderboard.set(undefined);
      await poster('/api/ranking/request/action/admin/pp', { leaderboardId }, { withCredentials: true });
      refreshLeaderboard({ forceRevalidate: true, softRefresh: true });
   }

   async function handleSyncLeaderboard() {
      const leaderboardId = $leaderboard.id;
      leaderboard.set(undefined);
      await poster('/api/ranking/request/action/admin/refresh', { leaderboardId }, { withCredentials: true });
      refreshLeaderboard({ forceRevalidate: true, softRefresh: true });
   }

   async function handleRankLeaderboard() {
      const leaderboardId = $leaderboard.id;
      leaderboard.set(undefined);
      await poster('/api/ranking/admin/leaderboard/rank', { leaderboardId }, { withCredentials: true });
      refreshLeaderboard({ forceRevalidate: true, softRefresh: true });
   }

   async function handleUnrankLeaderboard() {
      const leaderboardId = $leaderboard.id;
      leaderboard.set(undefined);
      await poster('/api/ranking/admin/leaderboard/unrank', { leaderboardId }, { withCredentials: true });
      refreshLeaderboard({ forceRevalidate: true, softRefresh: true });
   }

   async function handleManualPP(event) {
      event.preventDefault();
      const ranked = $leaderboard.ranked;
      leaderboard.set(undefined);
      leaderboardScores.set(undefined);
      await poster('/api/ranking/request/action/admin/pp-manual', { leaderboardId: activeLeaderboardId, pp: manualPP }, { withCredentials: true });
      if (ranked) {
         await new Promise((f) => setTimeout(f, 2000));
      }
      refreshLeaderboard({ forceRevalidate: true });
      refreshLeaderboardScores({ forceRevalidate: true });
   }
</script>

<head>
   <title>{$leaderboard ? $leaderboard.songName + ' - Leaderboard' : 'Leaderboard'} | ScoreSaber!</title>
   {#if metadata}
      <Meta
         description={`Status: ${metadata.ranked ? 'Ranked' : metadata.qualified ? 'Qualified' : 'Unranked'}
Total Scores: ${metadata.plays.toLocaleString('en-US')}
Total Scores (today): ${metadata.dailyPlays.toLocaleString('en-US')}
Stars: ${metadata.stars}★`}
         image={metadata.coverImage}
         title="{metadata.songAuthorName} - {metadata.songName} mapped by {metadata.levelAuthorName}"
      />
   {/if}
</head>

<div class="bg-content">
   <div class="section">
      <div class="columns">
         {#if !$leaderboard && !$leaderboardError}
            <div class="column is-12">
               <div class="window has-shadow leaderboard-window">
                  <Loader />
               </div>
            </div>
         {/if}
         {#if $leaderboardError}
            <Error error={$leaderboardError} />
         {/if}
         {#if $leaderboard}
            <div class="column is-8">
               <div class="window has-shadow leaderboard-window" aria-busy={$leaderboardLoading || $showScoresBlur}>
                  <DifficultySelection diffs={filteredDiffs} currentDiff={$leaderboard.difficulty} />
                  {#if $leaderboardScoresError}
                     <Error error={$leaderboardScoresError} />
                  {/if}
                  {#if $leaderboardScores}
                     {#if $showScoresBlur}
                        <Loader displayOver={true} />
                     {/if}
                     <div class="leaderboard" class:blur={$showScoresBlur}>
                        {#if $leaderboardScores.scores?.length > 0}
                           <LeaderboardGrid
                              playerHighlight={$userData?.playerId}
                              leaderboardScores={$leaderboardScores.scores}
                              leaderboard={$leaderboard}
                              {showScoreModal}
                           />
                        {/if}
                     </div>
                     <div class="desktop">
                        <ClassicPagination
                           totalItems={$leaderboardScores.metadata.total}
                           pageSize={$leaderboardScores.metadata.itemsPerPage}
                           currentPage={$pageQuery.page}
                           {changePage}
                        />
                     </div>
                     <div class="mobile">
                        <ArrowPagination
                           pageClicked={changePage}
                           page={$pageQuery.page}
                           pageSize={$leaderboardScores.metadata.itemsPerPage}
                           maxPages={$leaderboardScores.metadata.total}
                           withFirstLast={true}
                        />
                     </div>
                  {:else if $leaderboardScoresLoading}
                     <div class="loader-placeholder">
                        <Loader />
                     </div>
                  {:else}
                     <div class="empty-state">No scores available.</div>
                  {/if}
               </div>
            </div>
            <div class="column is-4">
               <LeaderboardMapInfo leaderboardInfo={$leaderboard} />
               <div class="window has-shadow mt-3">
                  <div class="sidebar-section">
                     <div class="title is-6">Filters</div>
                     <div class="filters-content">
                        <div class="filter-group">
                           <Filter
                              items={filters.countryFilter}
                              bind:selectedItems={countryFilters}
                              initialItems={$pageQuery.countries}
                              filterName="Country"
                              withCountryImages={true}
                              filterUpdated={countryFilterUpdated}
                           />
                        </div>
                        {#if availableGameModes.length > 1}
                           <div class="filter-group">
                              <label class="filter-label">Game Mode</label>
                              <div class="select">
                                 <select bind:value={selectedGameMode} on:change={() => gameModeChanged(true)} class="select">
                                    {#each availableGameModes as gameMode}
                                       <option value={gameMode}>{gameMode}</option>
                                    {/each}
                                 </select>
                              </div>
                           </div>
                        {/if}
                        <div class="filter-group">
                           <TextInput icon="fa-search" onInput={searchUpdated} value={$pageQuery.search} placeholder="Search players..." />
                        </div>
                     </div>
                  </div>
               </div>
               {#if $userData && (Permissions.checkPermissionNumber($userData.permissions, Permissions.groups.ALL_RT) || Permissions.checkPermissionNumber($userData.permissions, Permissions.security.ADMIN))}
                  <div class="window has-shadow mt-3">
                     <div class="title is-6 mb-3">Ranking Tools</div>
                     <a href="/ranking/request/create?leaderboardId={activeLeaderboardId}" class="button is-small is-dark">
                        <span class="icon is-small">
                           <i class="fas fa-stream" />
                        </span>
                        <span>Create Rank Request</span>
                     </a>
                     {#if Permissions.checkPermissionNumber($userData.permissions, Permissions.security.ADMIN)}
                        <div class="field has-addons mt-3">
                           <div class="control">
                              <input class="input is-small" type="number" bind:value={manualPP} placeholder="PP" />
                           </div>
                           <div class="control">
                              <button on:click={(ev) => handleManualPP(ev)} class="button is-small is-info">Set PP</button>
                           </div>
                        </div>
                        <div class="voting-tool">
                           <div class="field has-addons">
                              <p class="control m-0">
                                 <button on:click={() => handleGivePP()} class="button is-small is-danger">
                                    <span class="icon is-small">
                                       <i class="fab fa-pied-piper-pp" />
                                    </span>
                                 </button>
                              </p>
                              <p class="control ml-0">
                                 <button on:click={() => handleSyncLeaderboard()} class="button is-small is-success">
                                    <span class="icon is-small">
                                       <i class="fas fa-sync-alt" />
                                    </span>
                                 </button>
                              </p>
                              <p class="control ml-1">
                                 <button on:click={() => handleUnrankLeaderboard()} class="button is-small is-danger"> Unrank </button>
                              </p>
                              <p class="control m-0">
                                 <button on:click={() => handleRankLeaderboard()} class="button is-small is-success"> Rank </button>
                              </p>
                           </div>
                        </div>
                     {/if}
                  </div>
               {/if}
            </div>
         {/if}
      </div>
   </div>
</div>

<Modal show={$modal} />

<style lang="scss">
   @media screen and (max-width: 769px), print {
      .columns {
         display: flex;
         flex-direction: column-reverse;
      }

      .desktop {
         display: none;
      }
   }

   @media only screen and (min-width: 769px) {
      .mobile {
         display: none;
      }
   }

   .leaderboard {
      overflow-x: auto;
      &.blur {
         filter: blur(3px) saturate(1.2);
         transition: 0.25s filter linear;
      }
   }

   .mobile {
      margin-top: 0.5rem;
   }

   .leaderboard-window {
      min-height: 28rem;
   }

   .loader-placeholder {
      display: flex;
      justify-content: center;
      padding: 4rem 0;
   }

   .empty-state {
      padding: 2rem 0;
      text-align: center;
      color: var(--muted);
      font-weight: 500;
   }

   .window {
      position: relative;
      margin-bottom: 1rem;
   }

   .bg-content {
      min-height: 100vh;
   }

   .window.mt-3 {
      margin-top: 1rem;
   }

   .title.is-6 {
      font-weight: 600;
      margin-bottom: 1rem;
      color: var(--textColor);
   }

   .sidebar-section {
      margin-bottom: 1.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--borderColor);
   }

   .sidebar-section:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
   }

   .filters-content {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
   }

   .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
   }

   .filter-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--textColor);
      opacity: 0.9;
   }

   .select {
      width: 100%;
   }

   .select select {
      width: 100%;
      background-color: var(--foregroundItem);
      border: 1px solid var(--borderColor);
      border-radius: 6px;
      color: var(--textColor);
      padding: 0.5rem;
      font-size: 0.875rem;
      cursor: pointer;
      transition: border-color var(--transitionTime) ease;
   }

   .select select:hover {
      border-color: var(--gray-light);
   }

   .select select:focus {
      outline: none;
      border-color: var(--scoreSaberYellow);
   }

   .voting-tool {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--borderColor);
   }

   .field.has-addons {
      margin-top: 0.75rem;
   }

   .field.has-addons .control:first-child {
      flex: 1;
   }

   .field.has-addons .button {
      border-left: none;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
   }

   .field.has-addons .input {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
   }

   .button.is-small {
      font-size: 0.875rem;
      padding: 0.375rem 0.75rem;
      border: 1px solid var(--borderColor);
      transition: all 0.2s ease;
   }

   .button.is-small:hover {
      border-color: var(--gray-light);
   }

   .button.is-dark {
      background-color: var(--foregroundItem);
      color: var(--textColor);
   }

   .button.is-dark:hover {
      background-color: var(--gray-light);
      color: var(--scoreSaberYellow);
   }

   .button.is-info {
      background-color: var(--alternate);
      color: white;
   }

   .button.is-info:hover {
      background-color: var(--ppColour);
   }

   .button.is-success {
      background-color: var(--success);
      color: white;
   }

   .button.is-success:hover {
      opacity: 0.9;
   }

   .button.is-danger {
      background-color: var(--danger);
      color: white;
   }

   .button.is-danger:hover {
      opacity: 0.9;
   }
</style>
