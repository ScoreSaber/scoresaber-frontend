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

   const {
      data: request,
      error: requestError,
      refresh: refreshRequest
   } = useAccio<RankRequestInformation>(`/api/ranking/request/${$page.params.requestId}`, { fetcher: axios });

   page.subscribe((p) => {
      refreshRequest({ newUrl: `/api/ranking/request/${$page.params.requestId}` });
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
                  <div class="tabs is-centered">
                     <ul class="m-0">
                        {#each $request.difficulties as difficulty}
                           <li>
                              <a
                                 href="/ranking/request/{difficulty.requestId}"
                                 class={getDifficultyStyle(difficulty.difficulty) +
                                    ' ' +
                                    ($request.leaderboardInfo.difficulty === difficulty.difficulty ? 'selected' : '')}
                              >
                                 <span>{getDifficultyLabel(difficulty.difficulty)}</span>
                              </a>
                           </li>
                        {/each}
                     </ul>
                  </div>
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
               <div class="card map-card">
                  <div
                     class="bg-image"
                     style={`background: linear-gradient(to left, rgba(36, 36, 36, 0.93), rgb(33, 33, 33)) repeat scroll 0% 0%, rgba(0, 0, 0, 0) url(${$request.leaderboardInfo.coverImage}) repeat scroll 0% 0%`}
                  />
                  <div class="card-content">
                     <div class="media">
                        <div class="media-content is-clipped">
                           <div
                              title={getDifficultyLabel($request.leaderboardInfo.difficulty)}
                              class="tag mb-2 {getDifficultyStyle($request.leaderboardInfo.difficulty)}"
                           >
                              {getDifficultyLabel($request.leaderboardInfo.difficulty)}
                           </div>
                           <div class="title is-5 mb-0"><a href={'#'}>{$request.leaderboardInfo.songName}</a></div>
                           <div class="subtitle is-6">by {$request.leaderboardInfo.songAuthorName}</div>
                        </div>
                        <div class="media-right">
                           <figure class="image is-96x96 mr-0 ml-0">
                              <img src={$request.leaderboardInfo.coverImage} alt="Map Cover" class="map-cover" />
                           </figure>
                        </div>
                     </div>

                     <div class="content">
                        Mapped by <a href={'#'}><b>{$request.leaderboardInfo.levelAuthorName}</b></a><br />
                        Status: <strong>{getRankingApprovalStatus($request.approved)}</strong><br />
                        Request Type: <strong>{$request.requestType == 1 ? 'Rank' : 'Unrank'}</strong><br />
                        <hr />
                        <div class="votes">
                           <div class="vote">RT 👍<br /><b>{$request.rankVotes.upvotes}</b></div>
                           <div class="vote">RT 👎<br /><b>{$request.rankVotes.downvotes}</b></div>
                        </div>
                        <div class="votes">
                           <div class="vote">QAT 👍<br /><b>{$request.qatVotes.upvotes}</b></div>
                           <div class="vote">QAT 😐<br /><b>{$request.qatVotes.neutral}</b></div>
                           <div class="vote">QAT 👎<br /><b>{$request.qatVotes.downvotes}</b></div>
                        </div>
                     </div>
                  </div>
               </div>
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