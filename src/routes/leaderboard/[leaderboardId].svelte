<script lang="ts">
   import Navbar from '$lib/components/common/navbar.svelte';
   import Footer from '$lib/components/common/footer.svelte';
   import { useAccio } from '$lib/utils/accio';
   import axios from '$lib/utils/fetcher';
   import Loader from '$lib/components/common/loader.svelte';
   import Error from '$lib/components/common/error.svelte';
   import { page } from '$app/stores';
   import { getDifficultyLabel, getDifficultyStyle, getRankingApprovalStatus } from '$lib/utils/helpers';
   import type { Leaderboard, LeaderboardInfo, Score } from '$lib/models/LeaderboardData';
   import LeaderboardMapInfo from '$lib/components/map/leaderboard-map-info.svelte';
   import DifficultySelection from '$lib/components/map/difficulty-selection.svelte';
   import queryString from 'query-string';
   import { createQueryStore } from '$lib/query-store';

   $: currentPage = createQueryStore('page', 1, queryChanged);

   const {
      data: leaderboard,
      error: leaderboardError,
      refresh: refreshLeaderboard
   } = useAccio<LeaderboardInfo>(`/api/leaderboard/by-id/${$page.params.leaderboardId}/info`, { fetcher: axios });

   const {
      data: leaderboardScores,
      error: leaderboardScoresError,
      refresh: refreshLeaderboardScores
   } = useAccio<Score[]>(
      queryString.stringifyUrl({
         url: `/api/leaderboard/by-id/${$page.params.leaderboardId}/scores`,
         query: queryString.parse($page.query.toString())
      }),
      { fetcher: axios }
   );

   page.subscribe((p) => {
      refreshLeaderboard({ newUrl: `/api/leaderboard/by-id/${$page.params.leaderboardId}/info` });
   });

   function changePage(newPage: number) {
      $currentPage = newPage;
   }

   function queryChanged(newQuery: string) {
      refreshLeaderboardScores({ query: newQuery });
   }
</script>

<head>
   <title>{$leaderboard ? $leaderboard.songName + ' - Leaderboard' : 'Leaderboard'} | ScoreSaber!</title>
</head>

<Navbar />
<div>
   <div class="section">
      <div class="columns">
         {#if $leaderboard}
            <div class="column is-8">
               <div class="window has-shadow">
                  <DifficultySelection diffs={$leaderboard.difficulties} currentDiff={$leaderboard.difficulty} />
                  table here
               </div>
            </div>
            <div class="column is-4">
               <LeaderboardMapInfo leaderboardInfo={$leaderboard} />
               <div class="window has-shadow mt-3">
                  <div class="title is-6 mb-3">Ranking Tool</div>

                  <div class="tooling mb-2">
                     <div class="voting-tool">
                        <span class="tag mb-2 rank rt">Ranking Team</span>
                        <p class="control m-0">
                           <button class="button is-small is-dark">
                              <span class="icon is-small">
                                 <i class="fas fa-stream" />
                              </span>
                              <span>Create Rank Request</span>
                           </button>
                        </p>
                     </div>
                  </div>
               </div>
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
<Footer />

<style>
   @media screen and (max-width: 769px), print {
      .columns {
         display: flex;
         flex-direction: column-reverse;
      }
   }

   .tooling {
      display: flex;
      gap: 0.5rem;
   }

   .voting-tool {
      background-color: var(--gray-dark);
      border-radius: 5px;
      padding: 0.6rem 0.9rem;
   }

   span.rank {
      font-size: x-small;
   }

   .rank.rt {
      background-color: var(--rt);
   }

   .tag {
      font-size: xx-small;
      min-width: 20px;
      color: white;
      padding: 4px 4px 3px 4px;
      cursor: help;
   }
</style>
