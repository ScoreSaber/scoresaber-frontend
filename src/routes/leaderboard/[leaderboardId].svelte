<script lang="ts" context="module">
   import { loadMetadata } from '$lib/metadata-loader';

   export async function load({ fetch, page }) {
      return await loadMetadata(fetch, `/api/leaderboard/by-id/${page.params.leaderboardId}/info`);
   }
</script>

<script lang="ts">
   import { useAccio } from '$lib/utils/accio';
   import axios from '$lib/utils/fetcher';
   import Loader from '$lib/components/common/loader.svelte';
   import Error from '$lib/components/common/error.svelte';
   import { page } from '$app/stores';
   import type { LeaderboardInfo, Score } from '$lib/models/LeaderboardData';
   import LeaderboardMapInfo from '$lib/components/map/leaderboard-map-info.svelte';
   import DifficultySelection from '$lib/components/map/difficulty-selection.svelte';
   import queryString from 'query-string';
   import { pageQueryStore } from '$lib/query-store';
   import { fly } from 'svelte/transition';
   import ClassicPagination from '$lib/components/common/classic-pagination.svelte';
   import { onDestroy } from 'svelte';
   import { browser } from '$app/env';
   import Filter from '$lib/components/common/filter.svelte';
   import filters from '$lib/utils/filters';
   import type { FilterItem } from '$lib/models/Filter';

   import Modal, { bind } from '$lib/components/common/modal.svelte';
   import ScoreModal from '$lib/components/leaderboard/score-modal.svelte';

   import { modal, setBackground, userData } from '$lib/global-store';
   import Permissions from '$lib/utils/permissions';
   import poster from '$lib/utils/poster';
   import { requestCancel, updateCancelToken } from '$lib/utils/accio/canceler';
   import LeaderboardGrid from '$lib/components/leaderboard/leaderboard-grid.svelte';
   import TextInput from '$lib/components/common/text-input.svelte';
   import Meta from '$lib/components/common/meta.svelte';
   import ArrowPagination from '$lib/components/common/arrow-pagination.svelte';

   export let metadata: LeaderboardInfo = undefined;

   type leaderboardQuery = {
      page: number;
      search: string;
      countries: string;
   };

   $: pageQuery = pageQueryStore<leaderboardQuery>({
      page: 1,
      search: null,
      countries: null
   });
   $: loading = true;
   $: countryFilters = filters.countryFilter.filter((x) => ($pageQuery.countries?.split(',') ?? []).includes(x.key));

   let leaderboardId = $page.params.leaderboardId;

   function getLeaderboardInfoUrl(leaderboardId: string) {
      return `/api/leaderboard/by-id/${leaderboardId}/info`;
   }

   function getLeaderboardScoresUrl(leaderboardId: string, query: string) {
      return queryString.stringifyUrl({
         url: `/api/leaderboard/by-id/${leaderboardId}/scores`,
         query: queryString.parse(query)
      });
   }

   const {
      data: leaderboard,
      error: leaderboardError,
      refresh: refreshLeaderboard
   } = useAccio<LeaderboardInfo>(getLeaderboardInfoUrl($page.params.leaderboardId), {
      fetcher: axios,
      onSuccess: (data) => setBackground(data.coverImage)
   });

   const {
      data: leaderboardScores,
      error: leaderboardScoresError,
      refresh: refreshLeaderboardScores
   } = useAccio<Score[]>(getLeaderboardScoresUrl($page.params.leaderboardId, $page.query.toString()), { fetcher: axios });

   function countryFilterUpdated(items: FilterItem[]) {
      if (items.length === 0) {
         pageQuery.updateSingle('countries', null);
      } else {
         pageQuery.updateSingle('countries', items.map((i) => i.key).join(','));
      }
   }

   let pageDirection = 1;

   function changePage(newPage: number) {
      $requestCancel.cancel('Page Changed');
      updateCancelToken();
      pageDirection = newPage > $pageQuery.page ? 1 : -1;
      pageQuery.updateSingle('page', newPage);
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

   const pageUnsubscribe = page.subscribe(async (p) => {
      if (browser) {
         loading = true;
         await refreshLeaderboardScores({
            newUrl: getLeaderboardScoresUrl(p.params.leaderboardId, p.query.toString())
         });
         if (leaderboardId != p.params.leaderboardId) {
            await refreshLeaderboard({ newUrl: getLeaderboardInfoUrl(p.params.leaderboardId) });
            leaderboardId = p.params.leaderboardId;
         }
         loading = false;
      }
   });

   function showScoreModal(score: Score, leaderboard: LeaderboardInfo) {
      modal.set(bind(ScoreModal, { score, leaderboard }));
   }

   async function handleGivePP() {
      const leaderboardId = $leaderboard.id;
      leaderboard.set(undefined);
      await poster('/api/ranking/request/action/admin/pp', { leaderboardId }, { withCredentials: true });
      refreshLeaderboard({ forceRevalidate: true, softRefresh: true });
   }

   let manualPP: number;
   async function handleManualPP(event) {
      event.preventDefault();
      const ranked = $leaderboard.ranked;
      leaderboard.set(undefined);
      leaderboardScores.set(undefined);
      await poster(
         `/api/ranking/request/action/admin/pp-manual`,
         { leaderboardId: $page.params.leaderboardId, pp: manualPP },
         { withCredentials: true }
      );
      if (ranked) {
         await new Promise((f) => setTimeout(f, 2000));
      }
      refreshLeaderboard({ forceRevalidate: true });
      refreshLeaderboardScores({ forceRevalidate: true });
   }

   onDestroy(pageUnsubscribe);
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
            <div class="column is-12"><div class="window has-shadow"><Loader /></div></div>
         {/if}
         {#if $leaderboardError}
            <Error error={$leaderboardError} />
         {/if}
         {#if $leaderboard}
            <div class="column is-8">
               <div class="window has-shadow">
                  {#if loading}
                     <Loader displayOver={true} />
                  {/if}
                  <DifficultySelection diffs={$leaderboard.difficulties} currentDiff={$leaderboard.difficulty} />
                  <div in:fly={{ y: -20, duration: 1000 }} class="leaderboard" class:blur={loading}>
                     <LeaderboardGrid leaderboardScores={$leaderboardScores} leaderboard={$leaderboard} {pageDirection} {showScoreModal} />

                     <div class="desktop">
                        <ClassicPagination totalItems={$leaderboard.plays} pageSize={12} currentPage={$pageQuery.page} {changePage} />
                     </div>
                     <div class="mobile">
                        <ArrowPagination pageClicked={changePage} page={$pageQuery.page} maxPages={Math.ceil($leaderboard.plays / 12)} withFirstLast={true} />
                     </div>
                     {#if $leaderboardScoresError}
                        <Error error={$leaderboardScoresError} />
                     {/if}
                  </div>
               </div>
            </div>
            <div class="column is-4">
               <LeaderboardMapInfo leaderboardInfo={$leaderboard} />
               <div class="window has-shadow mt-3">
                  <div class="title is-6 mb-2">Filters</div>
                  <div class="negative-margin-filters">
                     <Filter
                        items={filters.countryFilter}
                        bind:selectedItems={countryFilters}
                        initialItems={$pageQuery.countries}
                        filterName={'Country'}
                        withCountryImages={true}
                        filterUpdated={countryFilterUpdated}
                     />
                  </div>
                  <div class="title is-6 mb-2 mt-3">Search Terms</div>
                  <TextInput icon="fa-search" onInput={searchUpdated} value={$pageQuery.search} />
               </div>
               {#if $userData && Permissions.checkPermissionNumber($userData.permissions, Permissions.groups.RT) && Permissions.checkPermissionNumber($userData.permissions, Permissions.security.ADMIN)}
                  <div class="window has-shadow mt-3">
                     <div class="title is-6 mb-3">Ranking Tool</div>
                     <a href="/ranking/request/create?leaderboardId={leaderboardId}" class="button is-small is-dark">
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

   .window {
      position: relative;
   }

   .negative-margin-filters {
      margin-left: -0.4rem;
   }
</style>
