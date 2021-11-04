<script lang="ts">
   import Navbar from '$lib/components/common/navbar.svelte';
   import Footer from '$lib/components/common/footer.svelte';
   import { useAccio } from '$lib/utils/accio';
   import type { RankRequestInformation } from '$lib/models/Ranking';
   import axios from '$lib/utils/fetcher';
   import Loader from '$lib/components/common/loader.svelte';
   import Error from '$lib/components/common/error.svelte';
   import FormattedDate from '$lib/components/common/formatted-date.svelte';
   import { page } from '$app/stores';
   import { getDifficultyLabel, getDifficultyStyle, getRankingApprovalStatus } from '$lib/utils/helpers';
   import AvatarImage from '$lib/components/image/avatar-image.svelte';
   import { decode } from 'html-entities';
   import { fly } from 'svelte/transition';
   import RequestMapInfo from '$lib/components/map/request-map-info.svelte';
   import DifficultySelection from '$lib/components/map/difficulty-selection.svelte';

   const {
      data: request,
      error: requestError,
      refresh: refreshRequest
   } = useAccio<RankRequestInformation>(`/api/ranking/request/${$page.params.requestId}`, { fetcher: axios });

   page.subscribe((p) => {
      if (typeof window !== 'undefined') {
         refreshRequest({ newUrl: `/api/ranking/request/${$page.params.requestId}` });
      }
   });
</script>

<head>
   <title>{$request ? $request.leaderboardInfo.songName + ' - Rank Request' : 'Rank Request'} | ScoreSaber!</title>
</head>

<Navbar />
<div>
   <div class="section">
      <div class="columns">
         {#if $request}
            <div in:fly={{ y: -20, duration: 1000 }} class="column is-8">
               <div class="window has-shadow">
                  <DifficultySelection rankingDiffs={$request.difficulties} currentDiff={$request.leaderboardInfo.difficulty} />
                  <code>{decode($request.requestDescription)}</code>
               </div>
               <div class="title is-5 mt-3 mb-3">Comments</div>
               {#if $request.rankComments.length + $request.qatComments.length === 0}
                  <span class="window has-shadow" color="has-text-color">No comments yet!</span>
               {/if}
               <div class="comment-list">
                  {#each $request.rankComments as comment}
                     <div class="window has-shadow">
                        <article class="media">
                           <figure class="media-left m-0 mr-4 ml-0">
                              <p class="image is-48x48">
                                 <AvatarImage userId={comment.userId} />
                              </p>
                           </figure>
                           <div class="media-content">
                              <div class="content">
                                 <p>
                                    <span class="tag mb-2 rank rt float">Ranking Team</span>
                                    <strong><a href={`/u/${comment.userId}`}>{comment.username}</a></strong>
                                    <small class="text-muted"><FormattedDate date={new Date(comment.timeStamp)} /></small>
                                    <br />
                                    <code class="mt-1">{decode(comment.comment)}</code>
                                 </p>
                              </div>
                           </div>
                        </article>
                     </div>
                  {/each}
                  {#each $request.qatComments as comment}
                     <div class="window has-shadow">
                        <article class="media">
                           <figure class="media-left m-0 mr-4 ml-0">
                              <p class="image is-48x48">
                                 <AvatarImage userId={comment.userId} />
                              </p>
                           </figure>
                           <div class="media-content">
                              <div class="content">
                                 <p>
                                    <span class="tag mb-2 rank qat float">Quality Assurance Team</span>
                                    <strong><a href={`/u/${comment.userId}`}>{comment.username}</a></strong>
                                    <small class="text-muted"><FormattedDate date={new Date(comment.timeStamp)} /></small>
                                    <br />
                                    <code class="mt-1">{decode(comment.comment)}</code>
                                 </p>
                              </div>
                           </div>
                        </article>
                     </div>
                  {/each}
               </div>
            </div>
            <div in:fly={{ y: -20, duration: 1000 }} class="column is-4">
               <RequestMapInfo request={$request} />
               <div class="window has-shadow mt-3">
                  <div class="title is-6 mb-3">Ranking Tool</div>

                  <div class="tooling mb-2">
                     <div class="voting-tool">
                        <span class="tag mb-2 rank rt">Ranking Team</span>
                        <div class="field has-addons">
                           <p class="control m-0">
                              <button class="button is-small is-dark">
                                 <span class="icon is-small">
                                    <i class="fas fa-thumbs-up" />
                                 </span>
                              </button>
                           </p>
                           <p class="control m-0">
                              <button class="button is-small is-dark">
                                 <span class="icon is-small">
                                    <i class="fas fa-thumbs-down" />
                                 </span>
                              </button>
                           </p>
                        </div>
                     </div>

                     <div class="voting-tool">
                        <span class="tag mb-2 rank qat">Quality Assurance Team</span>
                        <div class="field has-addons">
                           <p class="control m-0">
                              <button class="button is-small is-dark">
                                 <span class="icon is-small">
                                    <i class="far fa-thumbs-up" />
                                 </span>
                              </button>
                           </p>
                           <p class="control m-0">
                              <button class="button is-small is-dark">
                                 <span class="icon is-small">
                                    <i class="far fa-meh" />
                                 </span>
                              </button>
                           </p>
                           <p class="control m-0">
                              <button class="button is-small is-dark">
                                 <span class="icon is-small">
                                    <i class="far fa-thumbs-down" />
                                 </span>
                              </button>
                           </p>
                        </div>
                     </div>
                  </div>
                  <div class="tooling">
                     <div class="voting-tool">
                        <span class="tag mb-2 rank nat">Nomination Assessment Team</span>
                        <div class="field has-addons">
                           <p class="control m-0">
                              <button class="button is-small is-dark">
                                 <span class="icon is-small">
                                    <i class="fab fa-accessible-icon" />
                                 </span>
                              </button>
                           </p>
                           <p class="control m-0">
                              <button class="button is-small is-dark">
                                 <span class="icon is-small">
                                    <i class="fas fa-times-circle" />
                                 </span>
                              </button>
                           </p>
                        </div>
                     </div>
                     <div class="voting-tool">
                        <span class="tag mb-2 rank admin">Admin</span>
                        <div class="field has-addons">
                           <p class="control m-0">
                              <button class="button is-small is-danger">
                                 <span class="icon is-small">
                                    <i class="fab fa-pied-piper-pp" />
                                 </span>
                              </button>
                           </p>
                           <p class="control m-0">
                              <button class="button is-small is-dark">
                                 <span class="icon is-small">
                                    <i class="fas fa-check-circle" />
                                 </span>
                              </button>
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         {:else if !$request}
            <div class="column is-12"><div class="window has-shadow"><Loader /></div></div>
         {/if}
         {#if $requestError}
            <Error message={$requestError.toString()} />
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

   .tag {
      font-size: xx-small;
      min-width: 20px;
      color: white;
      padding: 4px 4px 3px 4px;
      cursor: help;
   }
</style>
