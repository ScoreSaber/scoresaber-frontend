<script lang="ts">
   import SearchInput from '$lib/components/common/search-input.svelte';
   import { pageQueryStore } from '$lib/query-store';
   import fetcher from '$lib/utils/fetcher';
   import queryString from 'query-string';
   import { requestCancel, updateCancelToken } from '$lib/utils/accio/canceler';
   import type { LeaderboardInfo } from '$lib/models/LeaderboardData';
   import LeaderboardMapInfo from '$lib/components/map/leaderboard-map-info.svelte';
   import SmallSongInfo from '$lib/components/leaderboard/small-song-info.svelte';
   import { onMount } from 'svelte';
   import Button from '$lib/components/common/button.svelte';
   import { defaultBackground, setBackground, userData } from '$lib/global-store';
   import type { RankRequestInformation } from '$lib/models/Ranking';
   import SmallRequestInfo from '$lib/components/ranking-requests/small-request-info-offlisting.svelte';
   import FormattedDate from '$lib/components/common/formatted-date.svelte';
   import Permissions from '$lib/utils/permissions';
   import { goto } from '$app/navigation';
   import { browser } from '$app/env';
   import poster from '$lib/utils/poster';

   $: pageQuery = pageQueryStore({
      leaderboardId: ''
   });

   if (browser) if (!($userData && Permissions.checkPermissionNumber($userData.permissions, Permissions.groups.RT))) goto('/');

   onMount(() => {
      if ($pageQuery.leaderboardId.length > 0) {
         searchUpdated($pageQuery.leaderboardId);
      }
   });

   function getLeaderboardInfoUrl(leaderboardId: string) {
      return `/api/leaderboard/by-id/${leaderboardId}/info`;
   }

   function getRequestInfoUrl(leaderboardId: string) {
      return `/api/ranking/request/by-id/${leaderboardId}`;
   }

   let searchData: LeaderboardInfo;
   let requestData: RankRequestInformation;

   let description: string;

   function setSearchData(leaderboardId, data: LeaderboardInfo) {
      searchData = data;
      setBackground(data.coverImage);
      fetcher<RankRequestInformation>(getRequestInfoUrl(leaderboardId), { cancelToken: $requestCancel.token, withCredentials: true })
         .then((data) => (requestData = data))
         .catch((err) => {
            requestData = null;
         });
   }

   function searchUpdated(leaderboardId) {
      pageQuery.updateSingle('leaderboardId', leaderboardId);
      if (leaderboardId) {
         $requestCancel.cancel('new search');
         updateCancelToken();
         fetcher<LeaderboardInfo>(getLeaderboardInfoUrl(leaderboardId), { cancelToken: $requestCancel.token, withCredentials: true })
            .then((data) => setSearchData(leaderboardId, data))
            .catch((err) => {
               console.error(err);
            });
      } else {
         defaultBackground();
         searchData = null;
      }
   }

   async function handleSubmit() {
      let createdRequest = await poster(
         `/api/ranking/request/action/rt/create`,
         { leaderboardId: searchData.id, requestType: 1, description },
         { withCredentials: true }
      );
      goto(`/ranking/request/${createdRequest.data}`);
   }
</script>

<head>
   <title>Create a Rank Request | ScoreSaber!</title>
</head>

<div class="section">
   <div class="window has-shadow">
      <h1 class="text-center">Create a Rank Request</h1>
      <div>
         <SearchInput icon="fa-list" placeholder="Leaderboard ID" onSearch={searchUpdated} value={$pageQuery.leaderboardId} />
         {#if searchData}
            <div class="smallSongInfo"><SmallSongInfo leaderboard={searchData} margin={false} /></div>

            {#if requestData}
               <div class="existing">
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
                        <tr class="table-item">
                           <td class="diffs_created_at"
                              ><b>{requestData.difficulties.length} difficult{requestData.difficulties.length > 1 ? 'ies' : 'y'}</b><br
                              /><FormattedDate date={new Date(requestData.created_at)} /></td
                           >
                           <td class="map">
                              <SmallRequestInfo request={requestData} />
                           </td>
                           <td class="rt_upvotes centered">{requestData.rankVotes.upvotes}</td>
                           <td class="rt_downvotes centered">{requestData.rankVotes.downvotes}</td>
                           <td class="qat_upvotes centered">{requestData.qatVotes.upvotes}</td>
                           <td class="qat_neutral centered">{requestData.qatVotes.neutral}</td>
                           <td class="qat_downvotes centered">{requestData.qatVotes.downvotes}</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            {:else}
               <textarea class="textarea mt-3" bind:value={description} placeholder="Description..." />
               <div class="text-center mt-3">
                  <Button title="Create Rank Request" size="" poggleable={true} onClicked={() => handleSubmit()} isDisabled={!searchData} />
               </div>
            {/if}
         {/if}
      </div>
   </div>
</div>

<style>
   .existing {
      background-color: var(--gray);
      padding: 10px;
      padding-top: 15px;
      border-radius: 4px;
      margin-top: 2rem;
   }

   .smallSongInfo {
      margin-top: 1rem;
      background-color: var(--gray);
      border-radius: 4px;
      padding: 10px;
      color: #fff;
   }

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
      background-color: var(--gray-dark);
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
</style>
