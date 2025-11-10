<script lang="ts">
   import queryString from 'query-string';

   import { goto } from '$app/navigation';

   import { defaultBackground, userData } from '$lib/stores/global-store';

   import Loader from '$lib/components/common/loader.svelte';
   import Error from '$lib/components/common/error.svelte';
   import FormattedDate from '$lib/components/common/formatted-date.svelte';
   import Button from '$lib/components/common/button.svelte';
   import SmallRequestInfo from '$lib/components/ranking-requests/small-request-info.svelte';

   import axios from '$lib/utils/fetcher';
   import { useAccio } from '$lib/utils/accio';
   import { useDelayedBlur } from '$lib/utils/delayed-blur';
   import permissions from '$lib/utils/permissions';

   import type { RankRequestListing } from '$lib/models/Ranking';
   import type { LeaderboardInfoCollection } from '$lib/models/LeaderboardData';

   const {
      data: topRequests,
      error: topRequestsError,
      loading: topRequestsLoading
   } = useAccio<RankRequestListing[]>(
      queryString.stringifyUrl({
         url: '/api/ranking/requests/top'
      }),
      { fetcher: axios }
   );

   const {
      data: belowTopRequests,
      error: belowTopRequestsError,
      loading: belowTopRequestsLoading,
      refresh: refreshBelowTopRequests
   } = useAccio<RankRequestListing[]>(
      queryString.stringifyUrl({
         url: '/api/ranking/requests/belowTop'
      }),
      { fetcher: axios }
   );

   const showTopRequestsBlur = useDelayedBlur(topRequestsLoading, { delayMs: 200 });
   const showBelowTopRequestsBlur = useDelayedBlur(belowTopRequestsLoading, { delayMs: 200 });

   const {
      data: qualifiedMapsPage1,
      error: qualifiedMapsPage1Error,
      loading: qualifiedMapsPage1Loading
   } = useAccio<LeaderboardInfoCollection>(
      queryString.stringifyUrl({
         url: '/api/leaderboards',
         query: { qualified: 1, unique: 1, page: 1 }
      }),
      { fetcher: axios }
   );

   const {
      data: qualifiedMapsPage2,
      error: qualifiedMapsPage2Error,
      loading: qualifiedMapsPage2Loading
   } = useAccio<LeaderboardInfoCollection>(
      queryString.stringifyUrl({
         url: '/api/leaderboards',
         query: { qualified: 1, unique: 1, page: 2 }
      }),
      { fetcher: axios }
   );

   $: navBarReady =
      ($topRequests || $topRequestsError) &&
      ($belowTopRequests || $belowTopRequestsError) &&
      ($qualifiedMapsPage1 !== undefined || $qualifiedMapsPage1Error) &&
      ($qualifiedMapsPage2 !== undefined || $qualifiedMapsPage2Error) &&
      !$topRequestsLoading &&
      !$belowTopRequestsLoading &&
      !$qualifiedMapsPage1Loading &&
      !$qualifiedMapsPage2Loading;

   $: qualifiedMapsCount = ($qualifiedMapsPage1?.leaderboards?.length || 0) + ($qualifiedMapsPage2?.leaderboards?.length || 0);

   $: qualifiedMapsQueryParams = queryString.stringify({ qualified: 1, unique: 1 });

   $: showBelowTop = false;

   $: showDownvotedRequests = true;

   $: allRequests = [...($topRequests || []), ...($belowTopRequests || [])];

   $: nonDownvotedRequests = allRequests.filter((r) => r.totalRankVotes.downvotes === 0 && r.totalQATVotes.downvotes === 0);

   $: topRequestsToShow = showDownvotedRequests ? $topRequests : nonDownvotedRequests.slice(0, 6);

   $: belowTopRequestsToShow = showDownvotedRequests ? $belowTopRequests : nonDownvotedRequests.slice(6);

   function toggleBelowTop() {
      showBelowTop = !showBelowTop;
      if (showBelowTop) {
         refreshBelowTopRequests();
      }
   }

   function toggleDownvotedRequests() {
      showDownvotedRequests = !showDownvotedRequests;
      if (showDownvotedRequests) {
         refreshBelowTopRequests();
      }
   }

   defaultBackground();
</script>

<head>
   <title>Rank Requests | ScoreSaber!</title>
</head>

<div class="bg-content">
   <div class="section breakout">
      {#if navBarReady}
         <nav class="level mb-5">
            <div class="level-item has-text-centered">
               <div>
                  <p class="heading">Rank Requests</p>
                  <p class="title level-color">
                     {showDownvotedRequests ? allRequests.length : nonDownvotedRequests.length}
                  </p>
               </div>
            </div>
            <div class="level-item has-text-centered">
               <div
                  on:click={() => goto(`/leaderboards?${qualifiedMapsQueryParams}`)}
                  on:keydown={(e) => e.key === 'Enter' && goto(`/leaderboards?${qualifiedMapsQueryParams}`)}
                  tabindex="0"
                  role="button"
                  class="qualified-link"
               >
                  <p class="heading">Qualified Maps</p>
                  <p class="title level-color">{qualifiedMapsCount}</p>
               </div>
            </div>
         </nav>
      {/if}
      <div class="window has-shadow" aria-busy={$topRequestsLoading || $showTopRequestsBlur}>
         {#if !navBarReady || (!$topRequests && !$topRequestsError)}
            <div class="loader-placeholder">
               <Loader />
            </div>
         {/if}
         {#if $topRequestsError}
            <Error error={$topRequestsError} />
         {/if}
         {#if navBarReady && $topRequests}
            {#if $showTopRequestsBlur}
               <Loader displayOver={true} />
            {/if}
            <div class:blur={$showTopRequestsBlur}>
               <h3>Next items in queue</h3>
               <div class="ranking ranking-table">
                  <table>
                     <thead>
                        <tr>
                           <th class="diffs_created_at" />
                           <th class="map" />
                           <th class="rt_upvotes">RT 👍</th>
                           <th class="rt_downvotes">RT 👎</th>
                           <th class="qat_upvotes">QAT 👍</th>
                           <th class="qat_neutral">QAT ✅</th>
                           <th class="qat_downvotes">QAT 👎</th>
                        </tr>
                     </thead>
                     <tbody>
                        {#each topRequestsToShow as request}
                           <tr class="table-item" class:highlight={request.totalQATVotes.myVote || request.totalRankVotes.myVote}>
                              <td class="diffs_created_at"
                                 ><b>{request.difficultyCount} difficult{request.difficultyCount > 1 ? 'ies' : 'y'}</b><br /><FormattedDate
                                    date={new Date(request.created_at)}
                                 /></td
                              >
                              <td class="map">
                                 <SmallRequestInfo {request} />
                              </td>
                              <td class="rt_upvotes centered">{request.totalRankVotes.upvotes}</td>
                              <td class="rt_downvotes centered">{request.totalRankVotes.downvotes}</td>
                              <td class="qat_upvotes centered">{request.totalQATVotes.upvotes}</td>
                              <td class="qat_neutral centered">{request.totalQATVotes.neutral}</td>
                              <td class="qat_downvotes centered">{request.totalQATVotes.downvotes}</td>
                           </tr>
                        {/each}
                     </tbody>
                  </table>
               </div>
            </div>
         {/if}
      </div>
      <Button
         isDisabled={false}
         onClicked={() => {
            toggleBelowTop();
         }}
         title={showBelowTop ? 'Hide all requests' : 'Show all requests'}
         icon={showBelowTop ? 'chevron-up' : 'chevron-down'}
      />
      <Button
         isDisabled={false}
         onClicked={() => {
            toggleDownvotedRequests();
         }}
         title={showDownvotedRequests ? 'Hide downvoted maps' : 'Show downvoted maps'}
         icon={showDownvotedRequests ? 'eye-slash' : 'eye'}
      />
      {#if $userData && permissions.checkPermissionNumber($userData.permissions, permissions.groups.ALL_RT)}
         <Button
            isDisabled={false}
            onClicked={() => {
               goto('/ranking/request/create');
            }}
            title={'Create Rank Request'}
            icon={'list'}
         />
      {/if}
      {#if showBelowTop}
         <div class="window has-shadow below-top" aria-busy={$belowTopRequestsLoading || $showBelowTopRequestsBlur}>
            {#if $belowTopRequests}
               {#if $showBelowTopRequestsBlur}
                  <Loader displayOver={true} />
               {/if}
               <div class:blur={$showBelowTopRequestsBlur}>
                  <h3>Open rank/unrank requests</h3>
                  <div class="ranking ranking-table">
                     <table>
                        <thead>
                           <tr>
                              <th class="diffs_created_at" />
                              <th class="map" />
                              <th class="rt_upvotes">RT 👍</th>
                              <th class="rt_downvotes">RT 👎</th>
                              <th class="qat_upvotes">QAT 👍</th>
                              <th class="qat_neutral">QAT ✅</th>
                              <th class="qat_downvotes">QAT 👎</th>
                           </tr>
                        </thead>
                        <tbody>
                           {#each belowTopRequestsToShow as request}
                              <tr class="table-item" class:highlight={request.totalQATVotes.myVote || request.totalRankVotes.myVote}>
                                 <td class="diffs_created_at"
                                    ><b>{request.difficultyCount} difficult{request.difficultyCount > 1 ? 'ies' : 'y'}</b><br /><FormattedDate
                                       date={new Date(request.created_at)}
                                    /></td
                                 ><td class="map">
                                    <SmallRequestInfo {request} />
                                 </td>
                                 <td class="rt_upvotes centered">{request.totalRankVotes.upvotes}</td>
                                 <td class="rt_downvotes centered">{request.totalRankVotes.downvotes}</td>
                                 <td class="qat_upvotes centered">{request.totalQATVotes.upvotes}</td>
                                 <td class="qat_neutral centered">{request.totalQATVotes.neutral}</td>
                                 <td class="qat_downvotes centered">{request.totalQATVotes.downvotes}</td>
                              </tr>
                           {/each}
                        </tbody>
                     </table>
                  </div>
               </div>
            {:else if !$belowTopRequests && !$belowTopRequestsError}
               <div class="loader-placeholder">
                  <Loader />
               </div>
            {/if}
            {#if $belowTopRequestsError}
               <Error error={$belowTopRequestsError} />
            {/if}
         </div>
      {/if}
   </div>
</div>

<style lang="scss">
   .window {
      position: relative;
   }

   .ranking-table table {
      margin-top: -15px;
   }

   div.ranking {
      overflow-x: auto;
   }

   tr.highlight {
      td {
         border-top: 2px solid var(--scoreSaberYellow) !important;
         border-bottom: 2px solid var(--scoreSaberYellow) !important;
      }
      td:first-child {
         border-left: 2px solid var(--scoreSaberYellow) !important;
      }
      td:last-child {
         border-right: 2px solid var(--scoreSaberYellow) !important;
      }
   }

   tr.table-item td {
      background-color: var(--gray);
      border: 1px solid var(--borderColor);
   }

   tr.table-item:hover td {
      background-color: var(--gray-light);
      border-color: var(--gray-light);
   }

   .below-top {
      margin-top: 1rem;
   }

   .level-color {
      color: var(--textColor);
   }

   @media only screen and (max-width: 512px) {
      table {
         margin-top: 0;
      }

      table thead {
         display: none;
      }
   }

   .qualified-link {
      cursor: pointer;
   }

   .qualified-link:hover .heading,
   .qualified-link:hover .title {
      color: var(--scoreSaberYellow);
   }
</style>
