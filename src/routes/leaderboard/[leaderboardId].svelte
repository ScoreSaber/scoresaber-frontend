<script lang="ts" context="module">
   import { loadMetadata } from '$lib/stores/metadata-loader';

   export async function load({ fetch, params }) {
      return await loadMetadata(fetch, `/api/leaderboard/by-id/${params.leaderboardId}/info`);
   }
</script>

<script lang="ts">
   import queryString from 'query-string';
   import { get, writable } from 'svelte/store';
   import { setContext } from 'svelte';

   import { page } from '$app/stores';
   import { browser } from '$app/env';
   import { goto } from '$app/navigation';

   import { modal, setBackground, userData } from '$lib/stores/global-store';
   import { pageQueryStore } from '$lib/stores/query-store';

   import InlineLeaderboard from '$lib/components/leaderboard/inline-leaderboard.svelte';
   import TextInput from '$lib/components/common/text-input.svelte';
   import Meta from '$lib/components/common/meta.svelte';
   import DifficultySelection from '$lib/components/map/difficulty-selection.svelte';
   import LeaderboardMapInfo from '$lib/components/map/leaderboard-map-info.svelte';
   import Filter from '$lib/components/common/filter.svelte';
   import { FILTER_CONTEXT_KEY } from '$lib/components/common/filter-context';
   import Error from '$lib/components/common/error.svelte';
   import Loader from '$lib/components/common/loader.svelte';
   import ScoreModal from '$lib/components/leaderboard/score-modal.svelte';
   import Modal, { bind } from '$lib/components/common/modal.svelte';

   import { requestCancel, updateCancelToken } from '$lib/utils/accio/canceler';
   import poster from '$lib/utils/poster';
   import Permissions from '$lib/utils/permissions';
   import filters from '$lib/utils/filters';
   import axios from '$lib/utils/fetcher';
   import { useAccio } from '$lib/utils/accio';

   import type { FilterItem } from '$lib/models/Filter';
   import type { Difficulty, LeaderboardInfo, Score } from '$lib/models/LeaderboardData';

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

   let selectedGameMode = '';
   let filteredDiffs: Difficulty[] = [];
   let availableGameModes: string[] = [];
   let manualPP: number;
   let countryFilters: FilterItem[] = [];
   let inlineLeaderboard: InlineLeaderboard;

   const {
      data: leaderboard,
      error: leaderboardError,
      refresh: refreshLeaderboard,
      loading: leaderboardLoading
   } = useAccio<LeaderboardInfo>(`/api/leaderboard/by-id/${activeLeaderboardId}/info`, {
      fetcher: axios,
      onSuccess: (data) => {
         setBackground(data.coverImage);
         selectedGameMode = data.difficulty.gameMode;
      }
   });

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
         refreshLeaderboard({
            newUrl: `/api/leaderboard/by-id/${nextLeaderboardId}/info`,
            softRefresh: Boolean($leaderboard),
            bypassInitialCheck: true
         });
      }
   }

   $: if (browser && inlineLeaderboard) {
      const queryParams = queryString.parse($page.url.searchParams.toString());
      inlineLeaderboard.refresh($page.params.leaderboardId, Number(queryParams.page) || 1, {
         search: queryParams.search,
         countries: queryParams.countries
      });
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
      pageQuery.updateSingle('countries', items.length === 0 ? null : items.map((i) => i.key).join(','));
   }

   function searchUpdated(search: string) {
      $requestCancel.cancel('Filter Changed');
      updateCancelToken();

      if (!search) {
         // Clear search and reset to page 1
         pageQuery.update({ page: 1, search: null });
         return;
      }

      search = search.trim();
      if (search.length >= 3) {
         pageQuery.update({ page: 1, search });
      } else {
         pageQuery.update({ page: 1, search: null });
      }
   }

   function showScoreModal(score: Score, leaderboard: LeaderboardInfo) {
      modal.set(bind(ScoreModal, { score, leaderboard }));
   }

   function changePage(newPage: number) {
      $requestCancel.cancel('Page Changed');
      updateCancelToken();
      pageQuery.updateSingle('page', newPage);
   }

   async function handleAdminAction(url: string, params: Record<string, unknown>) {
      leaderboard.set(undefined);
      await poster(url, params, { withCredentials: true });
      refreshLeaderboard({ forceRevalidate: true, softRefresh: true });
   }

   async function handleManualPP(event: Event) {
      event.preventDefault();
      const ranked = $leaderboard.ranked;
      leaderboard.set(undefined);
      await poster('/api/ranking/request/action/admin/pp-manual', { leaderboardId: activeLeaderboardId, pp: manualPP }, { withCredentials: true });
      if (ranked) {
         await new Promise((f) => setTimeout(f, 2000));
      }
      await refreshLeaderboard({ forceRevalidate: true });
      inlineLeaderboard?.refresh();
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
               <div class="window has-shadow leaderboard-window" aria-busy={$leaderboardLoading}>
                  <DifficultySelection diffs={filteredDiffs} currentDiff={$leaderboard.difficulty} />
                  <InlineLeaderboard
                     bind:this={inlineLeaderboard}
                     leaderboardId={activeLeaderboardId}
                     leaderboard={$leaderboard}
                     initialPage={$pageQuery.page}
                     queryParams={{ search: $pageQuery.search, countries: $pageQuery.countries }}
                     {showScoreModal}
                     playerHighlight={$userData?.playerId}
                     displayOver={true}
                     onPageChange={changePage}
                  />
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
                              <label for="game-mode-select" class="filter-label">Game Mode</label>
                              <div class="select">
                                 <select id="game-mode-select" bind:value={selectedGameMode} on:change={() => gameModeChanged(true)} class="select">
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
                              <button on:click={handleManualPP} class="button is-small is-info">Set PP</button>
                           </div>
                        </div>
                        <div class="voting-tool">
                           <div class="field has-addons">
                              <p class="control m-0">
                                 <button
                                    on:click={() => handleAdminAction('/api/ranking/request/action/admin/pp', { leaderboardId: $leaderboard.id })}
                                    class="button is-small is-danger"
                                 >
                                    <span class="icon is-small">
                                       <i class="fab fa-pied-piper-pp" />
                                    </span>
                                 </button>
                              </p>
                              <p class="control ml-0">
                                 <button
                                    on:click={() =>
                                       handleAdminAction('/api/ranking/request/action/admin/refresh', { leaderboardId: $leaderboard.id })}
                                    class="button is-small is-success"
                                 >
                                    <span class="icon is-small">
                                       <i class="fas fa-sync-alt" />
                                    </span>
                                 </button>
                              </p>
                              <p class="control ml-1">
                                 <button
                                    on:click={() => handleAdminAction('/api/ranking/admin/leaderboard/unrank', { leaderboardId: $leaderboard.id })}
                                    class="button is-small is-danger"
                                 >
                                    Unrank
                                 </button>
                              </p>
                              <p class="control m-0">
                                 <button
                                    on:click={() => handleAdminAction('/api/ranking/admin/leaderboard/rank', { leaderboardId: $leaderboard.id })}
                                    class="button is-small is-success"
                                 >
                                    Rank
                                 </button>
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
   @media screen and (max-width: 768px), print {
      .columns {
         display: flex;
         flex-direction: column-reverse;
      }
   }

   .leaderboard-window {
      min-height: 28rem;
   }

   .window {
      position: relative;
      margin-bottom: 1rem;
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

      &:last-child {
         border-bottom: none;
         margin-bottom: 0;
         padding-bottom: 0;
      }
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

      select {
         width: 100%;
         background-color: var(--foregroundItem);
         border: 1px solid var(--borderColor);
         border-radius: 6px;
         color: var(--textColor);
         padding: 0.5rem;
         font-size: 0.875rem;
         cursor: pointer;
         transition: border-color var(--transitionTime) ease;

         &:hover {
            border-color: var(--gray-light);
         }

         &:focus {
            outline: none;
            border-color: var(--scoreSaberYellow);
         }
      }
   }

   .voting-tool {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--borderColor);
   }

   .field.has-addons {
      margin-top: 0.75rem;

      .control:first-child {
         flex: 1;
      }

      .button {
         border-left: none;
         border-top-left-radius: 0;
         border-bottom-left-radius: 0;
      }

      .input {
         border-top-right-radius: 0;
         border-bottom-right-radius: 0;
      }
   }

   .button.is-small {
      font-size: 0.875rem;
      padding: 0.375rem 0.75rem;
      border: 1px solid var(--borderColor);
      transition: all 0.2s ease;

      &:hover {
         border-color: var(--gray-light);
      }

      &.is-dark {
         background-color: var(--foregroundItem);
         color: var(--textColor);

         &:hover {
            background-color: var(--gray-light);
            color: var(--scoreSaberYellow);
         }
      }

      &.is-info {
         background-color: var(--alternate);
         color: white;

         &:hover {
            background-color: var(--ppColour);
         }
      }

      &.is-success {
         background-color: var(--success);
         color: white;

         &:hover {
            opacity: 0.9;
         }
      }

      &.is-danger {
         background-color: var(--danger);
         color: white;

         &:hover {
            opacity: 0.9;
         }
      }
   }
</style>
