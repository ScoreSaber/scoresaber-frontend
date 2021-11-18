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
   import { createQueryStore } from '$lib/query-store';
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
   import { requestCancel, updateCancelToken } from '$lib/utils/accio/canceler';
   import LeaderboardGrid from '$lib/components/leaderboard/leaderboard-grid.svelte';

   $: currentPage = createQueryStore('page', 1);
   $: countries = createQueryStore('countries', undefined);

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
         $countries = null;
      } else {
         $countries = items.map((i) => i.key).join(',');
      }
   }

   let pageDirection = 1;

   function changePage(newPage: number) {
      $requestCancel.cancel('Page Changed');
      updateCancelToken();
      pageDirection = newPage > $currentPage ? 1 : -1;
      $currentPage = newPage;
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
                           currentPage={$currentPage}
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
                     initialItems={$countries}
                     filterName={'Country'}
                     withCountryImages={true}
                     filterUpdated={countryFilterUpdated}
                  />
               </div>
               {#if $userData && Permissions.checkPermissionNumber($userData.permissions, Permissions.groups.ALL_STAFF)}
                  <div class="window has-shadow mt-3">
                     <div class="title is-6 mb-3">Ranking Tool</div>
                     <a href="/ranking/request/create?leaderboardId={leaderboardId}" class="button is-small is-dark">
                        <span class="icon is-small">
                           <i class="fas fa-stream" />
                        </span>
                        <span>Create Rank Request</span>
                     </a>
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
</style>
