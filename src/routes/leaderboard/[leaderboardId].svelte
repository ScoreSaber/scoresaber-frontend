<script lang="ts">
   import Navbar from '$lib/components/common/navbar.svelte';
   import Footer from '$lib/components/common/footer.svelte';
   import { useAccio } from '$lib/utils/accio';
   import axios from '$lib/utils/fetcher';
   import Loader from '$lib/components/common/loader.svelte';
   import Error from '$lib/components/common/error.svelte';
   import FormattedDate from '$lib/components/common/formatted-date.svelte';
   import { page } from '$app/stores';
   import { getDifficultyLabel, getDifficultyStyle, getRankingApprovalStatus } from '$lib/utils/helpers';
   import AvatarImage from '$lib/components/image/avatar-image.svelte';
   import { decode } from 'html-entities';
   import type { Difficulty, Leaderboard, LeaderboardInfo } from '$lib/models/LeaderboardData';

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
   <title>{$leaderboard ? $leaderboard.leaderboardInfo.songHash + ' - Leaderboard' : 'Leaderboard'} | ScoreSaber!</title>
</head>

<Navbar />
<div>
   <div class="section">
      <div class="columns">
         {#if $leaderboard && $leaderboardDiffs}
            <div class="column is-8">
               <div class="window has-shadow">
                  <div class="tabs is-centered">
                     <ul class="m-0">
                        {#each $leaderboardDiffs as difficulty}
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
               <div class="card map-card">
                  <div
                     class="bg-image"
                     style={`background: linear-gradient(to left, rgba(36, 36, 36, 0.93), rgb(33, 33, 33)) repeat scroll 0% 0%, rgba(0, 0, 0, 0) url(${$leaderboard.leaderboardInfo.coverImage}) repeat scroll 0% 0%`}
                  />
                  <div class="card-content">
                     <div class="media">
                        <div class="media-content is-clipped">
                           <div
                              title={getDifficultyLabel($leaderboard.leaderboardInfo.difficulty)}
                              class="tag mb-2 {getDifficultyStyle($leaderboard.leaderboardInfo.difficulty)}"
                           >
                              {getDifficultyLabel($leaderboard.leaderboardInfo.difficulty)}
                           </div>
                           <div class="title is-5 mb-0"><a href={'#'}>{$leaderboard.leaderboardInfo.songName}</a></div>
                           <div class="subtitle is-6">by {$leaderboard.leaderboardInfo.songAuthorName}</div>
                        </div>
                        <div class="media-right">
                           <figure class="image is-96x96 mr-0 ml-0">
                              <img src={$leaderboard.leaderboardInfo.coverImage} alt="Map Cover" class="map-cover" />
                           </figure>
                        </div>
                     </div>

                     <div class="content">
                        Mapped by <a href={'#'}><b>{$leaderboard.leaderboardInfo.levelAuthorName}</b></a><br />
                     </div>
                  </div>
               </div>
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
                           </button>
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         {:else}
            <div class="column is-12"><div class="window has-shadow"><Loader /></div></div>
         {/if}
         {#if $leaderboardError || $leaderboardDiffsError}
            <Error message={$leaderboardError.toString() || $leaderboardDiffsError.toString()} />
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

   code {
      display: block;
      width: 100%;
      color: var(--textColor);
      background-color: var(--dimmed);
      border-radius: 5px;
      white-space: pre-line;
      overflow-wrap: anywhere;
   }

   .tabs a.selected {
      border-bottom-width: 3px;
      font-weight: 700;
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

   span.rank.float {
      float: right;
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

   .bg-image {
      position: absolute;
      height: 100%;
      width: 100%;
      background-position: 50% !important;
      background-repeat: no-repeat !important;
      background-size: cover !important;
      z-index: -1;
   }

   .map-card {
      z-index: 1;
      color: var(--textColor);
   }

   .subtitle {
      display: block;
      color: var(--textColor);
      font-size: 14px;
      margin-top: 0.5rem;
   }

   hr {
      margin-top: 1rem;
      margin-bottom: 1rem;
      background-color: var(--dimmed);
   }

   .tag {
      font-size: xx-small;
      min-width: 20px;
      color: white;
      padding: 4px 4px 3px 4px;
      cursor: help;
   }

   .votes {
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      align-items: center;
      margin-top: 0.8rem;
      text-align: center;
      gap: 0.5rem;
   }

   .vote {
      background-color: var(--foregroundItem);
      padding: 0.2rem 0.3rem;
      border-radius: 5px;
      flex-grow: 1;
   }

   .map-cover {
      border-radius: 5px;
   }
</style>
