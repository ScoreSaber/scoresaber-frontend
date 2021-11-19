<script lang="ts">
   import { useAccio } from '$lib/utils/accio';
   import type { RankRequestInformation } from '$lib/models/Ranking';
   import axios from '$lib/utils/fetcher';
   import Loader from '$lib/components/common/loader.svelte';
   import Error from '$lib/components/common/error.svelte';
   import FormattedDate from '$lib/components/common/formatted-date.svelte';
   import { page } from '$app/stores';
   import AvatarImage from '$lib/components/image/avatar-image.svelte';
   import { decode } from 'html-entities';
   import { fly } from 'svelte/transition';
   import RequestMapInfo from '$lib/components/map/request-map-info.svelte';
   import DifficultySelection from '$lib/components/map/difficulty-selection.svelte';
   import { onDestroy } from 'svelte';

   import { setBackground, userData } from '$lib/global-store';
   import Permissions from '$lib/utils/permissions';
   import { browser } from '$app/env';
   import poster from '$lib/utils/poster';

   const {
      data: request,
      error: requestError,
      refresh: refreshRequest
   } = useAccio<RankRequestInformation>(`/api/ranking/request/${$page.params.requestId}`, {
      fetcher: axios,
      onSuccess: (data) => setBackground(data.leaderboardInfo.coverImage)
   });

   const pageUnsubscribe = page.subscribe((p) => {
      if (browser) {
         refreshRequest({ newUrl: `/api/ranking/request/${$page.params.requestId}` });
      }
   });

   const requestActionEndpoint = '/api/ranking/request/action';

   async function handleVote(group: string, direction: number) {
      request.set(undefined);
      await poster(`${requestActionEndpoint}/${group}/vote`, { requestId: $page.params.requestId, vote: direction }, { withCredentials: true });
      refreshRequest({ forceRevalidate: true, softRefresh: true });
   }

   async function handleAction(group: string, action: string) {
      request.set(undefined);
      await poster(`${requestActionEndpoint}/${group}/${action}`, { requestId: $page.params.requestId }, { withCredentials: true });
      refreshRequest({ forceRevalidate: true, softRefresh: true });
   }

   $: comment = '';

   async function handleComment(group: string) {
      request.set(undefined);
      await poster(`${requestActionEndpoint}/${group}/comment`, { requestId: $page.params.requestId, comment }, { withCredentials: true });
      await refreshRequest({ forceRevalidate: true, softRefresh: true });
   }

   let manualPP: number;
   async function handleManualPP(event) {
      event.preventDefault();
      const ranked = $request.leaderboardInfo.ranked;
      request.set(undefined);
      await poster(
         `/api/ranking/request/action/admin/pp-manual`,
         { leaderboardId: $request.leaderboardInfo.id, pp: manualPP },
         { withCredentials: true }
      );
      if (ranked) {
         await new Promise((f) => setTimeout(f, 2000));
      }
      refreshRequest({ forceRevalidate: true });
   }

   onDestroy(pageUnsubscribe);
</script>

<head>
   <title>{$request ? $request.leaderboardInfo.songName + ' - Rank Request' : 'Rank Request'} | ScoreSaber!</title>
</head>

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
               {#if $userData && (Permissions.checkPermissionNumber($userData.permissions, Permissions.groups.RT) || Permissions.checkPermissionNumber($userData.permissions, Permissions.groups.QAT))}
                  <div class="window has-shadow">
                     <textarea class="textarea mb-2" bind:value={comment} placeholder="Comment..." />
                     {#if Permissions.checkPermissionNumber($userData.permissions, Permissions.groups.RT)}
                        <button on:click={() => handleComment('rt')} class="button is-small is-dark">Submit comment as RT</button>
                     {/if}
                     {#if Permissions.checkPermissionNumber($userData.permissions, Permissions.groups.QAT)}
                        <button on:click={() => handleComment('qat')} class="button is-small is-dark">Submit comment as QAT</button>
                     {/if}
                  </div>
               {/if}
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
               {#if $userData && Permissions.checkPermissionNumber($userData.permissions, Permissions.groups.ADMIN)}
                  <div class="window has-shadow mt-3">
                     <div class="title is-6 mb-3">Admin Tool</div>
                     <div class="field has-addons mt-3">
                        <div class="control">
                           <input class="input is-small" type="number" bind:value={manualPP} placeholder="PP" />
                        </div>
                        <div class="control">
                           <button on:click={(ev) => handleManualPP(ev)} class="button is-small is-info">Set PP</button>
                        </div>
                     </div>
                  </div>
               {/if}
               {#if $userData && Permissions.checkPermissionNumber($userData.permissions, Permissions.groups.ALL_STAFF)}
                  <div class="window has-shadow mt-3">
                     <div class="title is-6 mb-3">Voting Tool</div>

                     <div class="tooling mb-2">
                        {#if $userData && Permissions.checkPermissionNumber($userData.permissions, Permissions.security.RT)}
                           <div class="voting-tool">
                              <span class="tag mb-2 rank rt">RT</span>
                              <div class="field has-addons">
                                 <p class="control m-0">
                                    <button on:click={() => handleVote('rt', 1)} class="button is-small is-dark">
                                       <span class="icon is-small">
                                          <i class="fas fa-thumbs-up" />
                                       </span>
                                    </button>
                                 </p>
                                 <p class="control m-0">
                                    <button on:click={() => handleVote('rt', 0)} class="button is-small is-dark">
                                       <span class="icon is-small">
                                          <i class="fas fa-thumbs-down" />
                                       </span>
                                    </button>
                                 </p>
                              </div>
                           </div>
                        {/if}
                        {#if $userData && Permissions.checkPermissionNumber($userData.permissions, Permissions.security.QAT)}
                           <div class="voting-tool">
                              <span class="tag mb-2 rank qat">QAT</span>
                              <div class="field has-addons">
                                 <p class="control m-0">
                                    <button on:click={() => handleVote('qat', 1)} class="button is-small is-dark">
                                       <span class="icon is-small">
                                          <i class="far fa-thumbs-up" />
                                       </span>
                                    </button>
                                 </p>
                                 <p class="control m-0">
                                    <button on:click={() => handleVote('qat', 2)} class="button is-small is-dark">
                                       <span class="icon is-small">
                                          <i class="far fa-meh" />
                                       </span>
                                    </button>
                                 </p>
                                 <p class="control m-0">
                                    <button on:click={() => handleVote('qat', 0)} class="button is-small is-dark">
                                       <span class="icon is-small">
                                          <i class="far fa-thumbs-down" />
                                       </span>
                                    </button>
                                 </p>
                              </div>
                           </div>
                        {/if}
                     </div>

                     <div class="tooling">
                        {#if $userData && Permissions.checkPermissionNumber($userData.permissions, Permissions.security.NAT)}
                           <div class="voting-tool">
                              <span class="tag mb-2 rank nat">NAT</span>
                              <div class="field has-addons">
                                 <p class="control m-0">
                                    <button on:click={() => handleAction('nat', 'qualify')} class="button is-small is-dark">
                                       <span class="icon is-small">
                                          <i class="fab fa-accessible-icon" />
                                       </span>
                                    </button>
                                 </p>
                                 <p class="control m-0">
                                    <button on:click={() => handleAction('nat', 'deny')} class="button is-small is-dark">
                                       <span class="icon is-small">
                                          <i class="fas fa-times-circle" />
                                       </span>
                                    </button>
                                 </p>
                                 <p class="control m-0">
                                    <a href="/ranking/request/replace?requestId={$page.params.requestId}" class="button is-small is-dark">
                                       <span class="icon is-small mr-2">
                                          <i class="fas fa-list" />
                                       </span> Replace
                                    </a>
                                 </p>
                              </div>
                           </div>
                        {/if}
                        {#if $userData && Permissions.checkPermissionNumber($userData.permissions, Permissions.security.ADMIN)}
                           <div class="voting-tool">
                              <span class="tag mb-2 rank admin">Admin</span>
                              <div class="field has-addons">
                                 <p class="control m-0">
                                    <button on:click={() => handleAction('admin', 'pp')} class="button is-small is-danger">
                                       <span class="icon is-small">
                                          <i class="fab fa-pied-piper-pp" />
                                       </span>
                                    </button>
                                 </p>
                                 <p class="control m-0">
                                    <button on:click={() => handleAction('admin', 'approve')} class="button is-small is-dark">
                                       <span class="icon is-small">
                                          <i class="fas fa-check-circle" />
                                       </span>
                                    </button>
                                 </p>
                              </div>
                           </div>
                        {/if}
                     </div>
                  </div>
               {/if}
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
