<script lang="ts">
   import Navbar from '$lib/components/common/navbar.svelte';
   import Footer from '$lib/components/common/footer.svelte';
   import { useAccio } from '$lib/utils/accio';
   import axios from '$lib/utils/fetcher';
   import Loader from '$lib/components/common/loader.svelte';
   import Error from '$lib/components/common/error.svelte';
   import { page } from '$app/stores';
   import { getDifficultyLabel, getDifficultyStyle, getRankingApprovalStatus } from '$lib/utils/helpers';
   import type { Leaderboard } from '$lib/models/LeaderboardData';
   import LeaderboardMapInfo from '$lib/components/map/leaderboard-map-info.svelte';

   const {
      data: leaderboard,
      error: leaderboardError,
      refresh: refreshLeaderboard
   } = useAccio<Leaderboard>(`/api/leaderboard/${$page.params.leaderboardId}`, {
      fetcher: axios
   });

   page.subscribe((p) => {
      refreshLeaderboard({ newUrl: `/api/leaderboard/${$page.params.leaderboardId}` });
   });
</script>

<head>
   <title>{$leaderboard ? $leaderboard.leaderboardInfo.songName + ' - Leaderboard' : 'Leaderboard'} | ScoreSaber!</title>
</head>

<Navbar />
<div>
   <div class="section">
      <div class="columns">
         {#if $leaderboard}
            <div class="column is-8">
               <div class="window has-shadow">
                  <div class="tabs is-centered">
                     <ul class="m-0">
                        {#each $leaderboard.leaderboardInfo.difficulties as difficulty}
                           <li>
                              <a
                                 href="/leaderboard/{difficulty.leaderboardId}"
                                 class={getDifficultyStyle(difficulty.difficulty) +
                                    ' ' +
                                    ($leaderboard.leaderboardInfo.difficulty === difficulty.difficulty ? 'selected' : '')}
                              >
                                 <span>{getDifficultyLabel(difficulty.difficulty)}</span>
                              </a>
                           </li>
                        {/each}
                     </ul>
                  </div>
                  table here
               </div>
            </div>
            <div class="column is-4">
               <LeaderboardMapInfo leaderboardInfo={$leaderboard.leaderboardInfo} />
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
                              <span> Create Rank Request </span>
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

   .text-muted {
      color: var(--muted);
   }

   .tabs a.selected {
      border-bottom-width: 3px;
      font-weight: 700;
   }

   .tabs li > .selected {
      background-color: var(--gray-dark);
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
   }

   .tabs a {
      color: white;
   }

   .tabs a.easy {
      border-bottom-color: var(--easy);
      color: var(--easy);
   }

   .tabs a.normal {
      border-bottom-color: var(--normal);
      color: var(--normal);
   }

   .tabs a.hard {
      border-bottom-color: var(--hard);
      color: var(--hard);
   }

   .tabs a.expert {
      border-bottom-color: var(--expert);
      color: var(--expert);
   }

   .tabs a.expert-plus {
      border-bottom-color: var(--expert-plus);
      color: var(--expert-plus);
   }

   .tabs ul {
      border-bottom-color: var(--dimmed);
   }

   .comment-content {
      white-space: pre-line;
   }

   span.rank {
      font-size: x-small;
   }

   .rank.rt {
      background-color: var(--rt);
   }

   .rank.qat {
      background-color: var(--qat);
   }

   .rank.nat {
      background-color: var(--nat);
   }

   .rank.admin {
      color: black;
      background-color: var(--admin);
   }

   .tag {
      font-size: xx-small;
      min-width: 20px;
      color: white;
      padding: 4px 4px 3px 4px;
      cursor: help;
   }
</style>
