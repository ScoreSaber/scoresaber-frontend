<script lang="ts" context="module">
   import { loadMetadata } from '$lib/stores/metadata-loader';

   export async function load({ fetch, params }) {
      return await loadMetadata(fetch, `/api/ranking/request/${params.requestId}`);
   }
</script>

<script lang="ts">
   import { decode } from 'html-entities';
   import { get } from 'svelte/store';

   import { page } from '$app/stores';
   import { browser } from '$app/env';

   import { setBackground, userData } from '$lib/stores/global-store';

   import Loader from '$lib/components/common/loader.svelte';
   import Error from '$lib/components/common/error.svelte';
   import FormattedDate from '$lib/components/common/formatted-date.svelte';
   import AvatarImage from '$lib/components/image/avatar-image.svelte';
   import RequestMapInfo from '$lib/components/map/request-map-info.svelte';
   import DifficultySelection from '$lib/components/map/difficulty-selection.svelte';
   import Meta from '$lib/components/common/meta.svelte';

   import Permissions from '$lib/utils/permissions';
   import axios from '$lib/utils/fetcher';
   import { useAccio } from '$lib/utils/accio';
   import { useDelayedBlur } from '$lib/utils/delayed-blur';
   import poster from '$lib/utils/poster';
   import { getCDNUrl } from '$lib/utils/helpers';

   import type { RankRequestInformation } from '$lib/models/Ranking';

   export let metadata: RankRequestInformation = undefined;

   function getBloq(rank: string) {
      return getCDNUrl(`/badges/name/${rank}.png`);
   }

   function getRequestUrl(requestId: string) {
      return `/api/ranking/request/${requestId}`;
   }

   const initialPage = get(page);
   let activeRequestId = initialPage.params.requestId;
   let currentRequestUrl = getRequestUrl(activeRequestId);

   const {
      data: request,
      error: requestError,
      refresh: refreshRequest,
      loading: requestLoading
   } = useAccio<RankRequestInformation>(currentRequestUrl, {
      fetcher: axios,
      onSuccess: handleRequestSuccess
   });

   const showRequestBlur = useDelayedBlur(requestLoading, { delayMs: 200 });

   function handleRequestSuccess(data: RankRequestInformation) {
      setBackground(data.leaderboardInfo.coverImage);
   }

   $: if (browser) {
      const nextRequestId = $page.params.requestId;
      if (nextRequestId && nextRequestId !== activeRequestId) {
         activeRequestId = nextRequestId;
         const nextRequestUrl = getRequestUrl(nextRequestId);
         currentRequestUrl = nextRequestUrl;
         refreshRequest({
            newUrl: nextRequestUrl,
            softRefresh: Boolean($request),
            bypassInitialCheck: true
         });
      }
   }

   const requestActionEndpoint = '/api/ranking/request/action';
   $: comment = '';

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

   async function handleComment(group: string) {
      request.set(undefined);
      await poster(`${requestActionEndpoint}/${group}/comment`, { requestId: $page.params.requestId, comment }, { withCredentials: true });
      await refreshRequest({ forceRevalidate: true, softRefresh: true });
   }

   async function handleGivePP() {
      const leaderboardId = $request.leaderboardInfo.id;
      request.set(undefined);
      await poster(`${requestActionEndpoint}/admin/pp`, { leaderboardId }, { withCredentials: true });
      refreshRequest({ forceRevalidate: true, softRefresh: true });
   }

   let manualPP: number;

   async function handleManualPP(event) {
      event.preventDefault();
      const ranked = $request.leaderboardInfo.ranked;
      const leaderboardId = $request.leaderboardInfo.id;
      request.set(undefined);
      await poster('/api/ranking/request/action/admin/pp-manual', { leaderboardId: leaderboardId, pp: manualPP }, { withCredentials: true });
      if (ranked) {
         await new Promise((f) => setTimeout(f, 2000));
      }
      refreshRequest({ forceRevalidate: true });
   }
</script>

<head>
   <title>{$request ? $request.leaderboardInfo.songName + ' - Rank Request' : 'Rank Request'} | ScoreSaber!</title>
   {#if metadata}
      <Meta
         description={`Rank Request for ${metadata.leaderboardInfo.songAuthorName} - ${metadata.leaderboardInfo.songName} mapped by ${metadata.leaderboardInfo.levelAuthorName}`}
         image={metadata.leaderboardInfo.coverImage}
         title="{metadata.leaderboardInfo.songAuthorName} - {metadata.leaderboardInfo.songName} mapped by {metadata.leaderboardInfo.levelAuthorName}"
      />
   {/if}
</head>

<div class="bg-content">
   <div class="section">
      <div class="columns">
         {#if !$request && !$requestError}
            <div class="column is-12">
               <div class="window has-shadow request-window">
                  <Loader />
               </div>
            </div>
         {/if}
         {#if $requestError}
            <Error error={$requestError} />
         {/if}
         {#if $request}
            <div class="column is-8">
               <div class="request-content-container">
                  <div class="window has-shadow request-window" aria-busy={$requestLoading || $showRequestBlur}>
                     {#if $showRequestBlur}
                        <Loader displayOver={true} />
                     {/if}
                     <div class:blur={$showRequestBlur}>
                        <DifficultySelection rankingDiffs={$request.difficulties} currentDiff={$request.leaderboardInfo.difficulty} />
                        <div class="description-section">
                           <h3 class="description-label">Request Description</h3>
                           <div class="request-description">
                              {decode($request.requestDescription)}
                           </div>
                        </div>
                     </div>
                  </div>

                  <div class="comments-section">
                     <div class="comments-header">
                        <h2 class="section-title">Discussion</h2>
                        {#if $request.rankComments.length + $request.qatComments.length > 0}
                           <span class="comment-count"
                              >{$request.rankComments.length + $request.qatComments.length}
                              {$request.rankComments.length + $request.qatComments.length === 1 ? 'comment' : 'comments'}</span
                           >
                        {/if}
                     </div>

                     {#if $userData && (Permissions.checkPermissionNumber($userData.permissions, Permissions.groups.ALL_RT) || Permissions.checkPermissionNumber($userData.permissions, Permissions.groups.QAT))}
                        <div class="window has-shadow comment-form-card">
                           <textarea class="textarea" bind:value={comment} placeholder="Write a comment..." rows="3" />
                           <div class="comment-buttons">
                              {#if Permissions.checkPermissionNumber($userData.permissions, Permissions.groups.ALL_RT)}
                                 <button on:click={() => handleComment('rt')} class="button is-small is-dark">
                                    <span class="button-icon rt-icon">RT</span>
                                    Submit as RT
                                 </button>
                              {/if}
                              {#if Permissions.checkPermissionNumber($userData.permissions, Permissions.groups.QAT)}
                                 <button on:click={() => handleComment('qat')} class="button is-small is-dark">
                                    <span class="button-icon qat-icon">QAT</span>
                                    Submit as QAT
                                 </button>
                              {/if}
                           </div>
                        </div>
                     {/if}

                     {#if $request.rankComments.length + $request.qatComments.length === 0}
                        <div class="window has-shadow no-comments-card">
                           <div class="no-comments-content">
                              <i class="far fa-comments no-comments-icon" />
                              <p>No comments yet</p>
                           </div>
                        </div>
                     {:else}
                        <div class="comment-list">
                           {#each $request.rankComments as comment}
                              <div class="window has-shadow comment-card">
                                 <div class="comment-header">
                                    <div class="comment-author">
                                       <figure class="comment-avatar">
                                          {#if comment.userId != null}
                                             <AvatarImage userId={comment.userId} />
                                          {:else}
                                             <img src={getBloq('ranking-team')} alt="Ranking Team" />
                                          {/if}
                                       </figure>
                                       <div class="comment-meta">
                                          <div class="comment-author-line">
                                             <a href={comment.userId != null ? `/u/${comment.userId}` : ''} class="comment-author-name"
                                                >{comment.username}</a
                                             >
                                             <span class="comment-badge rank rt">RT</span>
                                          </div>
                                          <span class="comment-date"><FormattedDate date={new Date(comment.timeStamp)} /></span>
                                       </div>
                                    </div>
                                 </div>
                                 <div class="comment-body">
                                    {decode(comment.comment)}
                                 </div>
                              </div>
                           {/each}
                           {#each $request.qatComments as comment}
                              <div class="window has-shadow comment-card">
                                 <div class="comment-header">
                                    <div class="comment-author">
                                       <figure class="comment-avatar">
                                          {#if comment.userId != null}
                                             <AvatarImage userId={comment.userId} />
                                          {:else}
                                             <img src={getBloq('qat')} alt="Quality Assurance Team" />
                                          {/if}
                                       </figure>
                                       <div class="comment-meta">
                                          <div class="comment-author-line">
                                             <a href={comment.userId != null ? `/u/${comment.userId}` : ''} class="comment-author-name"
                                                >{comment.username}</a
                                             >
                                             <span class="comment-badge rank qat">QAT</span>
                                          </div>
                                          <span class="comment-date"><FormattedDate date={new Date(comment.timeStamp)} /></span>
                                       </div>
                                    </div>
                                 </div>
                                 <div class="comment-body">
                                    {decode(comment.comment)}
                                 </div>
                              </div>
                           {/each}
                        </div>
                     {/if}
                  </div>
               </div>
            </div>
            <div class="column is-4">
               <RequestMapInfo request={$request} />
               {#if $userData && Permissions.checkPermissionNumber($userData.permissions, Permissions.security.ADMIN)}
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
               {#if $userData && Permissions.checkPermissionNumber($userData.permissions, Permissions.groups.VOTING_STAFF)}
                  <div class="window has-shadow mt-3">
                     <div class="title is-6 mb-3">Voting Tool</div>

                     <div class="tooling mb-2">
                        {#if $userData && Permissions.checkPermissionNumber($userData.permissions, Permissions.groups.ALL_RT)}
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
                                    <button on:click={() => handleGivePP()} class="button is-small is-danger">
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
         {/if}
      </div>
   </div>
</div>

<style lang="scss">
   @media screen and (max-width: 768px), print {
      .columns {
         display: flex;
         flex-direction: column-reverse;
      }
   }

   .window {
      position: relative;
      margin-bottom: 1rem;
   }

   .window.mt-3 {
      margin-top: 1rem;
   }

   .request-content-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
   }

   .request-window {
      margin-bottom: 0;
   }

   .description-section {
      margin-top: 1rem;
   }

   .description-label {
      font-size: 1rem;
      font-weight: 600;
      color: var(--textColor);
      margin-bottom: 0.75rem;
      margin-top: 0;
   }

   .request-description {
      padding: 1rem;
      background-color: var(--foregroundItem);
      border: 1px solid var(--borderColor);
      border-radius: 6px;
      color: var(--textColor);
      white-space: pre-line;
      overflow-wrap: anywhere;
      line-height: 1.6;
   }

   .comments-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
   }

   .comments-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0;
      margin: 0;

      .section-title {
         font-size: 1.25rem;
         font-weight: 700;
         color: var(--textColor);
         margin: 0;
      }

      .comment-count {
         color: var(--muted);
         font-size: 0.875rem;
         font-weight: 500;
         padding: 0.25rem 0.75rem;
         background-color: var(--foregroundItem);
         border: 1px solid var(--borderColor);
         border-radius: 12px;
      }
   }

   .comment-form-card {
      .textarea {
         margin-bottom: 0.75rem;
         resize: vertical;
         min-height: 80px;
         font-size: 0.9375rem;
      }

      .comment-buttons {
         display: flex;
         gap: 0.5rem;
         flex-wrap: wrap;

         .button {
            display: flex;
            align-items: center;
            gap: 0.5rem;
         }

         .button-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 0.625rem;
            font-weight: 700;
            padding: 0.125rem 0.375rem;
            border-radius: 3px;
            color: white;

            &.rt-icon {
               background-color: var(--rt);
            }

            &.qat-icon {
               background-color: var(--qat);
            }
         }
      }
   }

   .no-comments-card {
      .no-comments-content {
         text-align: center;
         padding: 3rem 2rem;
         display: flex;
         flex-direction: column;
         align-items: center;
         gap: 0.75rem;

         .no-comments-icon {
            font-size: 3rem;
            color: var(--muted);
            opacity: 0.5;
            margin-bottom: 0.5rem;
         }

         p {
            font-size: 1.125rem;
            font-weight: 600;
            color: var(--textColor);
            margin: 0;
         }
      }
   }

   .comment-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
   }

   .comment-card {
      margin-bottom: 0 !important;
   }

   .comment-header {
      margin-bottom: 0.75rem;

      .comment-author {
         display: flex;
         align-items: flex-start;
         gap: 0.75rem;
      }

      .comment-avatar {
         width: 40px;
         height: 40px;
         overflow: hidden;
         flex-shrink: 0;
         margin: 0;

         :global(img) {
            width: 100%;
            height: 100%;
            object-fit: cover;
         }
      }

      .comment-meta {
         display: flex;
         flex-direction: column;
         gap: 0.25rem;
         flex: 1;
      }

      .comment-author-line {
         display: flex;
         align-items: center;
         gap: 0.5rem;
         flex-wrap: wrap;
         line-height: 1;
      }

      .comment-author-name {
         font-weight: 700;
         font-size: 0.9375rem;
         color: var(--textColor);
         text-decoration: none;
         transition: color 0.2s ease;

         &:hover {
            color: var(--scoreSaberYellow);
         }
      }

      .comment-badge {
         display: inline-flex;
         align-items: center;
         font-size: 0.625rem;
         font-weight: 700;
         padding: 0.125rem 0.5rem;
         border-radius: 3px;
         color: white;
         text-transform: uppercase;
         letter-spacing: 0.5px;
         transform: translateY(-1px);

         &.rt {
            background-color: var(--rt);
         }

         &.qat {
            background-color: var(--qat);
         }
      }

      .comment-date {
         font-size: 0.8125rem;
         color: var(--muted);
      }
   }

   .comment-body {
      color: var(--textColor);
      line-height: 1.6;
      white-space: pre-line;
      overflow-wrap: anywhere;
      padding-left: 3.25rem;
      font-size: 0.9375rem;
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

   @media only screen and (max-width: 768px) {
      .comment-body {
         padding-left: 0;
         margin-top: 0.5rem;
      }

      .comment-header {
         .comment-avatar {
            width: 36px;
            height: 36px;
         }
      }
   }
</style>
