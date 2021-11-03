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
   import { writable } from 'svelte/store';

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

   let showBelowTop = writable(false);

   function toggleBelowTop() {
      console.log('aaa');
      showBelowTop.update((show) => !show);
      if ($showBelowTop) {
         refreshBelowTopRequests();
      }
   }
</script>

<head>
   <title>Rank Requests | ScoreSaber!</title>
</head>

<Navbar />
<div>
   <div class="section breakout">
      <div class="window has-shadow">
         {#if $topRequests}
            <h3>Next items in queue</h3>
            <div class="ranking">
               <table>
                  <thead>
                     <tr>
                        <th class="map centered">Map</th>
                        <th class="rt_upvotes">RT 👍</th>
                        <th class="rt_downvotes">RT 👎</th>
                        <th class="qat_upvotes">QAT 👍</th>
                        <th class="qat_neutral">QAT 😐</th>
                        <th class="qat_downvotes">QAT 👎</th>
                        <th class="difficultyCount centered">Difficulties</th>
                        <th class="created_at centered">Created At</th>
                     </tr>
                  </thead>
                  <tbody>
                     {#each $topRequests as request}
                        <tr class="table-item">
                           <td class="map">
                              <img src={request.leaderboardInfo.coverImage} alt={request.leaderboardInfo.songName} />
                              <span class="songInfo">
                                 <a href="/ranking/request/{request.requestId}"
                                    >{request.leaderboardInfo.songName.length < 30
                                       ? request.leaderboardInfo.songName
                                       : request.leaderboardInfo.songName.slice(0, 29).trim() + '…'}</a
                                 >
                                 by {request.leaderboardInfo.levelAuthorName.length < 16
                                    ? request.leaderboardInfo.levelAuthorName
                                    : request.leaderboardInfo.levelAuthorName.slice(0, 15).trim() + '…'}</span
                              >
                           </td>
                           <td class="rt_upvotes centered">{request.totalRankVotes.upvotes}</td>
                           <td class="rt_downvotes centered">{request.totalRankVotes.downvotes}</td>
                           <td class="qat_upvotes centered">{request.totalQATVotes.upvotes}</td>
                           <td class="qat_neutral centered">{request.totalQATVotes.neutral}</td>
                           <td class="qat_downvotes centered">{request.totalQATVotes.downvotes}</td>
                           <td class="difficultyCount centered">{request.difficultyCount}</td>
                           <td class="created_at centered"><FormattedDate date={new Date(request.created_at)} /></td>
                        </tr>
                     {/each}
                  </tbody>
               </table>
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
         title={$showBelowTop ? 'Hide all requests' : 'Show all requests'}
         icon={$showBelowTop ? 'chevron-up' : 'chevron-down'}
      />
      {#if $showBelowTop}
         <div class="window has-shadow below-top">
            {#if $belowTopRequests}
               <h3>Open rank/unrank requests</h3>
               <div class="ranking">
                  <table>
                     <thead>
                        <tr>
                           <th class="map centered">Map</th>
                           <th class="rt_upvotes">RT 👍</th>
                           <th class="rt_downvotes">RT 👎</th>
                           <th class="qat_upvotes">QAT 👍</th>
                           <th class="qat_neutral">QAT 😐</th>
                           <th class="qat_downvotes">QAT 👎</th>
                           <th class="difficultyCount centered">Difficulties</th>
                           <th class="created_at">Created At</th>
                        </tr>
                     </thead>
                     <tbody>
                        {#each $belowTopRequests as request}
                           <tr class="table-item">
                              <td class="map">
                                 <img src={request.leaderboardInfo.coverImage} alt={request.leaderboardInfo.songName} />
                                 <span class="songInfo">
                                    <a href="/ranking/request/{request.requestId}"
                                       >{request.leaderboardInfo.songName.length < 30
                                          ? request.leaderboardInfo.songName
                                          : request.leaderboardInfo.songName.slice(0, 29).trim() + '…'}</a
                                    >
                                    by {request.leaderboardInfo.levelAuthorName.length < 16
                                       ? request.leaderboardInfo.levelAuthorName
                                       : request.leaderboardInfo.levelAuthorName.slice(0, 15).trim() + '…'}</span
                                 >
                              </td>
                              <td class="rt_upvotes centered">{request.totalRankVotes.upvotes}</td>
                              <td class="rt_downvotes centered">{request.totalRankVotes.downvotes}</td>
                              <td class="qat_upvotes centered">{request.totalQATVotes.upvotes}</td>
                              <td class="qat_neutral centered">{request.totalQATVotes.neutral}</td>
                              <td class="qat_downvotes centered">{request.totalQATVotes.downvotes}</td>
                              <td class="difficultyCount centered">{request.difficultyCount}</td>
                              <td class="created_at"><FormattedDate date={new Date(request.created_at)} /></td>
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
<Footer />

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
      background-color: #323232;
   }
   tr.table-item:hover td {
      background-color: #3c3c3c;
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
</style>
