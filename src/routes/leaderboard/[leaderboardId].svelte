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

   $: pageQuery = pageQueryStore({
      page: 1,
      search: null,
      countries: null
   });

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

   const pageUnsubscribe = page.subscribe((p) => {
      if (browser) {
         refreshLeaderboardScores({
            newUrl: getLeaderboardScoresUrl(p.params.leaderboardId, p.query.toString())
         });
         if (leaderboardId != p.params.leaderboardId) {
            refreshLeaderboard({ newUrl: getLeaderboardInfoUrl(p.params.leaderboardId) });
            leaderboardId = p.params.leaderboardId;
         }
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
</head>

<div class="bg-content">
   <div class="section">
      <div class="columns">
         {#if $leaderboard}
            <div class="column is-8">
               <div class="window has-shadow">
                  <DifficultySelection diffs={$leaderboard.difficulties} currentDiff={$leaderboard.difficulty} />
                  <div in:fly={{ y: -20, duration: 1000 }} class="leaderboard">
                     <LeaderboardGrid leaderboardScores={$leaderboardScores} leaderboard={$leaderboard} {pageDirection} {showScoreModal} />
                     {#if $leaderboardScores}
                        <ClassicPagination
                           totalItems={$leaderboard.plays}
                           pageSize={12}
                           currentPage={$pageQuery.page}
                           changePage={(e) => changePage(e)}
                        />
                     {:else}
                        <div class="window has-shadow"><Loader /></div>
                     {/if}
                     {#if $leaderboardScoresError}
                        <Error message={$leaderboardScoresError.toString()} />
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
                        initialItems={$pageQuery.countries}
                        filterName={'Country'}
                        withCountryImages={true}
                        filterUpdated={countryFilterUpdated}
                     />
                  </div>
                  <div class="title is-6 mb-2 mt-3">Search Terms</div>
                  <TextInput icon="fa-search" onInput={searchUpdated} value={$pageQuery.search} />
               </div>
               {#if $userData && Permissions.checkPermissionNumber($userData.permissions, Permissions.groups.RT) && Permissions.checkPermissionNumber($userData.permissions, Permissions.groups.ADMIN)}
                  <div class="window has-shadow mt-3">
                     <div class="title is-6 mb-3">Ranking Tool</div>
                     <a href="/ranking/request/create?leaderboardId={leaderboardId}" class="button is-small is-dark">
                        <span class="icon is-small">
                           <i class="fas fa-stream" />
                        </span>
                        <span>Create Rank Request</span>
                     </a>
                     {#if Permissions.checkPermissionNumber($userData.permissions, Permissions.groups.ADMIN)}
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
         {:else}
            <div class="column is-12"><div class="window has-shadow"><Loader /></div></div>
         {/if}
         {#if $leaderboardError}
            <Error message={$leaderboardError.toString()} />
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
   }

   .leaderboard {
      overflow-x: auto;
   }

   .negative-margin-filters {
      margin-left: -0.4rem;
   }
</style>
