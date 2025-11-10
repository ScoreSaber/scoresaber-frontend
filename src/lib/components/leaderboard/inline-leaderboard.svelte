<script lang="ts">
   import queryString from 'query-string';

   import ClassicPagination from '$lib/components/common/classic-pagination.svelte';
   import ArrowPagination from '$lib/components/common/arrow-pagination.svelte';
   import Error from '$lib/components/common/error.svelte';
   import Loader from '$lib/components/common/loader.svelte';

   import { useAccio } from '$lib/utils/accio';
   import { requestCancel, updateCancelToken } from '$lib/utils/accio/canceler';
   import { useDelayedBlur } from '$lib/utils/delayed-blur';
   import axios from '$lib/utils/fetcher';

   import type { Score, ScoreCollection, LeaderboardInfo } from '$lib/models/LeaderboardData';

   import LeaderboardGrid from './leaderboard-grid.svelte';

   export let leaderboardId: string;
   export let leaderboard: LeaderboardInfo;
   export let initialPage = 1;
   export let queryParams: Record<string, unknown> = {};
   export let showScoreModal: (score: Score, leaderboard: LeaderboardInfo) => void;
   export let playerHighlight: string | undefined = undefined;
   export let displayOver = false;
   export let onPageChange: ((page: number) => void) | undefined = undefined;

   let currentPage = initialPage;
   let currentUrl = buildUrl(leaderboardId, currentPage, queryParams);

   const {
      data: scores,
      error: scoresError,
      loading: scoresLoading,
      refresh: refreshScores
   } = useAccio<ScoreCollection>(currentUrl, { fetcher: axios });

   const showBlur = useDelayedBlur(scoresLoading, { delayMs: 200 });

   function buildUrl(id: string, page: number, params: Record<string, unknown>) {
      // Filter out null, undefined, and empty string values
      const cleanParams: Record<string, string | number | boolean> = {};

      Object.entries({ page, ...params }).forEach(([key, value]) => {
         if (value !== null && value !== undefined && (typeof value !== 'string' || value !== '')) {
            cleanParams[key] = value as string | number | boolean;
         }
      });

      return queryString.stringifyUrl({
         url: `/api/leaderboard/by-id/${id}/scores`,
         query: cleanParams
      });
   }

   export async function refresh(newLeaderboardId?: string, newPage?: number, newParams?: Record<string, unknown>) {
      if (newLeaderboardId !== undefined) leaderboardId = newLeaderboardId;
      if (newPage !== undefined) currentPage = newPage;
      if (newParams !== undefined) queryParams = newParams;

      const nextUrl = buildUrl(leaderboardId, currentPage, queryParams);
      if (nextUrl !== currentUrl) {
         currentUrl = nextUrl;
         await refreshScores({
            newUrl: nextUrl,
            softRefresh: Boolean($scores),
            bypassInitialCheck: true
         });
      }
   }

   async function changePage(page: number) {
      $requestCancel.cancel('Page Changed');
      updateCancelToken();

      if (onPageChange) {
         // Let parent handle page change (updates URL)
         onPageChange(page);
      } else {
         // Handle internally if no callback provided
         await refresh(undefined, page);
      }
   }
</script>

{#if $scoresError}
   <div class="error-container">
      <Error error={$scoresError} />
   </div>
{:else if $scores}
   {#if $showBlur && displayOver}
      <Loader displayOver={true} />
   {/if}
   <div class="leaderboard-content" class:blur={$showBlur}>
      {#if $scores.scores?.length > 0}
         <div class="tableWrapper">
            <LeaderboardGrid leaderboardScores={$scores.scores} {leaderboard} {showScoreModal} {playerHighlight} />
         </div>
      {:else}
         <div class="empty-state">No scores available.</div>
      {/if}
   </div>
   <div class="pagination desktop tablet">
      <ClassicPagination totalItems={$scores.metadata.total} pageSize={$scores.metadata.itemsPerPage} {currentPage} {changePage} />
   </div>
   <div class="mobile">
      <ArrowPagination
         pageClicked={changePage}
         page={currentPage}
         pageSize={$scores.metadata.itemsPerPage}
         maxPages={$scores.metadata.total}
         withFirstLast={true}
      />
   </div>
{:else if $scoresLoading}
   <div class="loader-placeholder">
      <Loader />
   </div>
{:else}
   <div class="empty-state">No scores available.</div>
{/if}

<style lang="scss">
   .error-container {
      padding: 2rem;
      min-height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
   }

   .leaderboard-content {
      overflow-x: auto;
   }

   .tableWrapper {
      overflow-x: auto;
   }

   .pagination {
      display: flex;
      width: 100%;
      justify-content: center;
      align-items: center;
      margin: 15px 0;
   }

   .loader-placeholder {
      display: flex;
      justify-content: center;
      padding: 4rem 0;
      min-height: 200px;
   }

   .empty-state {
      padding: 2rem 0;
      text-align: center;
      color: var(--muted);
      font-weight: 500;
   }

   .mobile {
      margin-top: 0.5rem;
   }
</style>
