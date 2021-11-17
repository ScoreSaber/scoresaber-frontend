<script lang="ts">
   import Navbar from '$lib/components/common/navbar.svelte';
   import Footer from '$lib/components/common/footer.svelte';
   import { useAccio } from '$lib/utils/accio';
   import queryString from 'query-string';
   import type { RankRequestListing } from '$lib/models/Ranking';
   import axios from '$lib/utils/fetcher';
   import Loader from '$lib/components/common/loader.svelte';
   import Error from '$lib/components/common/error.svelte';
   import FormattedDate from '$lib/components/common/formatted-date.svelte';
   import Button from '$lib/components/common/button.svelte';
   import SmallRequestInfo from '$lib/components/ranking-requests/small-request-info.svelte';
   import { fly } from 'svelte/transition';
   import { background, defaultBackground, userData } from '$lib/global-store';
   import { goto } from '$app/navigation';
   import Permissions from '$lib/utils/permissions';

   const {
      data: topRequests,
      error: topRequestsError,
      refresh: refreshTopRequests
   } = useAccio<RankRequestListing[]>(
      queryString.stringifyUrl({
         url: '/api/ranking/requests/top'
      }),
      { fetcher: axios }
   );

   const {
      data: belowTopRequests,
      error: belowTopRequestsError,
      refresh: refreshBelowTopRequests
   } = useAccio<RankRequestListing[]>(
      queryString.stringifyUrl({
         url: '/api/ranking/requests/belowTop'
      }),
      { fetcher: axios }
   );

   $: showBelowTop = false;

   function toggleBelowTop() {
      showBelowTop = !showBelowTop;
      if (showBelowTop) {
         refreshBelowTopRequests();
      }
   }

   defaultBackground();
</script>

<head>
   <title>Rank Requests | ScoreSaber!</title>
</head>

<div>
   <div class="section breakout">
      {#if $topRequests && $belowTopRequests}
         <nav in:fly={{ x: 20, duration: 1000 }} class="level mb-5">
            <div class="level-item has-text-centered">
               <div>
                  <p class="heading">Rank Requests</p>
                  <p class="title level-color">{$topRequests.length + $belowTopRequests.length}</p>
               </div>
            </div>
            <div class="level-item has-text-centered">
               <div>
                  <p class="heading">Something else...</p>
                  <p class="title level-color">0</p>
               </div>
            </div>
         </nav>
      {/if}
      <div class="window has-shadow">
         {#if $topRequests}
            <div in:fly={{ x: 20, duration: 1000 }}>
               <h3>Next items in queue</h3>
               <div class="ranking">
                  <table>
                     <thead>
                        <tr>
                           <th class="diffs_created_at" />
                           <th class="map" />
                           <th class="rt_upvotes">RT 👍</th>
                           <th class="rt_downvotes">RT 👎</th>
                           <th class="qat_upvotes">QAT 👍</th>
                           <th class="qat_neutral">QAT 😐</th>
                           <th class="qat_downvotes">QAT 👎</th>
                        </tr>
                     </thead>
                     <tbody>
                        {#each $topRequests as request}
                           <tr class="table-item">
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
         {:else if !$topRequests}
            <Loader />
         {/if}
         {#if $topRequestsError}
            <Error message={$topRequestsError.toString()} />
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
      {#if $userData && Permissions.checkPermissionNumber($userData.permissions, Permissions.groups.RT)}
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
         <div in:fly={{ x: 20, duration: 500 }} class="window has-shadow below-top">
            {#if $belowTopRequests}
               <h3>Open rank/unrank requests</h3>
               <div class="ranking">
                  <table>
                     <thead>
                        <tr>
                           <th class="diffs_created_at" />
                           <th class="map" />
                           <th class="rt_upvotes">RT 👍</th>
                           <th class="rt_downvotes">RT 👎</th>
                           <th class="qat_upvotes">QAT 👍</th>
                           <th class="qat_neutral">QAT 😐</th>
                           <th class="qat_downvotes">QAT 👎</th>
                        </tr>
                     </thead>
                     <tbody>
                        {#each $belowTopRequests as request}
                           <tr class="table-item">
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
            {:else if !$belowTopRequests}
               <Loader />
            {/if}
            {#if $belowTopRequestsError}
               <Error message={$belowTopRequestsError.toString()} />
            {/if}
         </div>
      {/if}
   </div>
</div>

<style>
   table {
      border-collapse: separate;
      border-spacing: 0 5px;
      white-space: nowrap;
      margin-top: -15px;
   }
   div.ranking {
      overflow-x: auto;
   }
   .content table th {
      border: none !important;
   }
   td {
      border: none !important;
      border-style: solid none;
      align-items: center;
      vertical-align: middle;
   }

   td.map img {
      width: 24px;
      height: 24px;
      border-radius: 15%;
      vertical-align: middle;
   }

   td.map .songInfo {
      overflow-wrap: break-word;
      padding-left: 7px;
   }

   tr.table-item td {
      background-color: var(--gray);
   }
   tr.table-item:hover td {
      background-color: var(--gray-light);
   }
   td:first-child {
      border-left-style: solid;
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
   }
   td:last-child {
      border-right-style: solid;
      border-bottom-right-radius: 5px;
      border-top-right-radius: 5px;
   }

   .below-top {
      margin-top: 1rem;
   }

   .level-color {
      color: var(--textColor);
   }
</style>
