<script lang="ts">
   import SearchInput from '$lib/components/common/search-input.svelte';
   import { pageQueryStore } from '$lib/query-store';
   import fetcher from '$lib/utils/fetcher';
   import { requestCancel, updateCancelToken } from '$lib/utils/accio/canceler';
   import type { LeaderboardInfo } from '$lib/models/LeaderboardData';
   import SmallSongInfo from '$lib/components/leaderboard/small-song-info.svelte';
   import { onMount } from 'svelte';
   import Button from '$lib/components/common/button.svelte';
   import { defaultBackground, setBackground, userData } from '$lib/global-store';
   import type { RankRequestInformation, CreateRequestResponse } from '$lib/models/Ranking';
   import SmallRequestInfo from '$lib/components/ranking-requests/small-request-info-offlisting.svelte';
   import FormattedDate from '$lib/components/common/formatted-date.svelte';
   import Permissions from '$lib/utils/permissions';
   import { goto } from '$app/navigation';
   import { browser } from '$app/env';
   import poster from '$lib/utils/poster';
   import { fly } from 'svelte/transition';

   $: pageQuery = pageQueryStore({
      requestId: '',
      leaderboardId: ''
   });

   onMount(() => {
      if ($pageQuery.requestId.length > 0) {
         searchUpdated($pageQuery.requestId);
      }
      if ($pageQuery.leaderboardId.length > 0) {
         newLeaderboardUpdated($pageQuery.leaderboardId);
      }
   });

   function getRequestInfo(requestId: string) {
      return `/api/ranking/request/${requestId}`;
   }

   let searchData: RankRequestInformation;

   let newLeaderboard: LeaderboardInfo;
   let description: string;

   function setSearchData(leaderboardId, data: RankRequestInformation) {
      searchData = data;
      setBackground(data.leaderboardInfo.coverImage);
   }

   function searchUpdated(requestId) {
      pageQuery.updateSingle('requestId', requestId);
      if (requestId) {
         $requestCancel.cancel('new search');
         updateCancelToken();
         fetcher<RankRequestInformation>(getRequestInfo(requestId), { cancelToken: $requestCancel.token, withCredentials: true })
            .then((data) => setSearchData(requestId, data))
            .catch((err) => {
               console.error(err);
            });
      } else {
         defaultBackground();
         searchData = null;
      }
   }

   function newLeaderboardUpdated(leaderboardId) {
      pageQuery.updateSingle('leaderboardId', leaderboardId);
      if (leaderboardId) {
         $requestCancel.cancel('new search');
         updateCancelToken();
         fetcher<LeaderboardInfo>(`/api/leaderboard/by-id/${leaderboardId}/info`, { cancelToken: $requestCancel.token, withCredentials: true })
            .then((data) => {
               newLeaderboard = data;
            })
            .catch((err) => {
               newLeaderboard = null;
               console.error(err);
            });
      } else {
         newLeaderboard = null;
      }
   }

   async function handleSubmit() {
      let createdRequest = await poster(
         `/api/ranking/request/action/nat/replace`,
         { requestId: searchData.requestId, leaderboardId: newLeaderboard.id, description },
         { withCredentials: true }
      );

      if (createdRequest.status == 200) {
         goto(`/ranking/request/${searchData.requestId}`);
      }
   }

   $userData.permissions = Permissions.groups.NAT;
   if (browser) if (!($userData && Permissions.checkPermissionNumber($userData.permissions, Permissions.groups.NAT))) goto('/');
</script>

<head>
   <title>Replace a Rank Request Leaderboard | ScoreSaber!</title>
</head>

<div class="section">
   <div in:fly={{ y: -20, duration: 1000 }} class="window has-shadow">
      <h1 class="text-center">Replace a Rank Request Leaderboard</h1>
      <div>
         <SearchInput icon="fa-list" placeholder="Request ID" onSearch={searchUpdated} value={$pageQuery.requestId} />
         {#if searchData}
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
                           ><b>{searchData.difficulties.length} difficult{searchData.difficulties.length > 1 ? 'ies' : 'y'}</b><br /><FormattedDate
                              date={new Date(searchData.created_at)}
                           /></td
                        >
                        <td class="map">
                           <SmallRequestInfo request={searchData} />
                        </td>
                        <td class="rt_upvotes centered">{searchData.rankVotes.upvotes}</td>
                        <td class="rt_downvotes centered">{searchData.rankVotes.downvotes}</td>
                        <td class="qat_upvotes centered">{searchData.qatVotes.upvotes}</td>
                        <td class="qat_neutral centered">{searchData.qatVotes.neutral}</td>
                        <td class="qat_downvotes centered">{searchData.qatVotes.downvotes}</td>
                     </tr>
                  </tbody>
               </table>
            </div>
            <SearchInput icon="fa-list" placeholder="New Leaderboard ID" onSearch={newLeaderboardUpdated} value={$pageQuery.leaderboardId} />
            {#if newLeaderboard}
               <div class="smallSongInfo"><SmallSongInfo leaderboard={newLeaderboard} margin={false} /></div>
            {/if}
            <textarea class="textarea mt-3" bind:value={description} placeholder="Description..." />
            <div class="text-center mt-3">
               <Button title="Replace Rank Request" size="" poggleable={true} onClicked={() => handleSubmit()} isDisabled={!searchData} />
            </div>
         {/if}
      </div>
   </div>
</div>

<style>
   .existing {
      padding: 10px;
      padding-top: 15px;
      border-radius: 4px;
      margin-top: 1rem;
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
