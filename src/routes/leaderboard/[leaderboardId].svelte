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
   import LeaderboardRow from '$lib/components/leaderboard/leaderboard-row.svelte';
   import ClassicPagination from '$lib/components/common/classic-pagination.svelte';
   import { onDestroy } from 'svelte';
   import { browser } from '$app/env';
   import Filter from '$lib/components/common/filter.svelte';
   import filters from '$lib/utils/filters';
   import type { FilterItem } from '$lib/models/Filter';
   import ScoreModal from '$lib/components/leaderboard/score-modal.svelte';
   import { setBackground, userData } from '$lib/global-store';
   import Permissions from '$lib/utils/permissions';
   import permissions from '$lib/utils/permissions';
   import poster from '$lib/utils/poster';
   import { requestCancel, updateCancelToken } from '$lib/utils/accio/canceler';
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

   function changePage(newPage: number) {
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

   let scoreChosen: Score = null;
   let setVisibility;

   function showScoreModal(score: Score) {
      scoreChosen = score;
      setVisibility(true);
   }

   let manualPP: number;
   async function handleManualPP(event) {
      event.preventDefault();
      let createdRequest = await poster(
         `/api/ranking/request/action/nat/replace`,
         { leaderboardId: $page.params.leaderboardId, manualPP },
         { withCredentials: true }
      );

      if (createdRequest.status == 200) {
         refreshLeaderboard({ newUrl: getLeaderboardInfoUrl($page.params.leaderboardId) });
      }
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
                     {#if $leaderboardScores}
                        <table>
                           <thead>
                              <tr class="headers">
                                 <th class="rank" />
                                 <th class="player" />
                                 <th class="timeSet centered">Time Set</th>
                                 <th class="score centered">Score</th>
                                 {#if $leaderboardScores.filter((score) => score.modifiers.length > 0).length > 0}
                                    <th class="mods centered">Mods</th>
                                 {/if}
                                 {#if $leaderboard.maxScore}<th class="accuracy centered">Accuracy</th>{/if}
                                 {#if $leaderboard.ranked}<th class="pp centered">PP</th>{/if}
                              </tr>
                           </thead>
                           <tbody>
                              {#each $leaderboardScores as score}
                                 <LeaderboardRow {score} leaderboard={$leaderboard} otherScores={$leaderboardScores} {showScoreModal} />
                              {/each}
                           </tbody>
                        </table>
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
                  <div class="title is-6 mb-3">Filters</div>
                  <Filter
                     items={filters.countryFilter}
                     initialItems={$pageQuery.countries}
                     filterName={'Country'}
                     withCountryImages={true}
                     filterUpdated={countryFilterUpdated}
                  />
                  <div class="mb-2">Search Terms</div>
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

<ScoreModal score={scoreChosen} leaderboard={$leaderboard} otherScores={$leaderboardScores} bind:setVisibility />

<style>
   @media screen and (max-width: 769px), print {
      .columns {
         display: flex;
         flex-direction: column-reverse;
      }
   }

   .leaderboard {
      overflow-x: auto;
   }

   .bg-image {
      background: linear-gradient(180deg, rgba(36, 36, 36, 0.8), rgb(33, 33, 33)) repeat scroll 0% 0%,
         rgba(0, 0, 0, 0) var(--cover) repeat scroll 0% 0%;
      position: fixed;
      height: 100%;
      width: 100%;
      top: 0;
      left: 0;
      background-position: 50% !important;
      background-repeat: no-repeat !important;
      background-size: cover !important;
      z-index: -1;
   }

   table {
      border-collapse: separate;
      border-spacing: 0 5px;
      white-space: nowrap;
      margin-top: -15px;
   }

   .content table th {
      border: none !important;
   }
</style>
