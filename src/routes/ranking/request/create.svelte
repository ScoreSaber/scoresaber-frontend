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
   import { defaultBackground, setBackground } from '$lib/global-store';

   $: pageQuery = pageQueryStore({
      leaderboardId: ''
   });

   onMount(() => {
      if ($pageQuery.leaderboardId.length > 0) {
         searchUpdated($pageQuery.leaderboardId);
      }
   });

   function getLeaderboardInfoUrl(leaderboardId: string) {
      return `/api/leaderboard/by-id/${leaderboardId}/info`;
   }

   let searchData: LeaderboardInfo;
   let description: string;

   function setSearchData(data: LeaderboardInfo) {
      searchData = data;
      setBackground(data.coverImage);
   }

   function searchUpdated(leaderboardId) {
      pageQuery.updateSingle('leaderboardId', leaderboardId);
      if (leaderboardId) {
         $requestCancel.cancel('new search');
         updateCancelToken();
         fetcher<LeaderboardInfo>(getLeaderboardInfoUrl(leaderboardId), { cancelToken: $requestCancel.token, withCredentials: true }).then((data) =>
            setSearchData(data)
         );
      } else {
         defaultBackground();
         searchData = null;
      }
   }

   function handleSubmit() {
      console.log('submit');
   }
</script>

<head>
   <title>Rank Requests | ScoreSaber!</title>
</head>

<div class="section">
   <div class="window has-shadow">
      <h1 class="text-center">Create a Rank Request</h1>
      <form>
         <SearchInput icon="fa-search" onSearch={searchUpdated} value={$pageQuery.leaderboardId} />
         {#if searchData}
            <div class="smallSongInfo"><SmallSongInfo leaderboard={searchData} margin={false} /></div>
            <textarea class="textarea mt-3" bind:value={description} placeholder="Description..." />
         {/if}

         <div class="text-center mt-3">
            <Button title="Create Rank Request" size="" poggleable={true} onClicked={() => handleSubmit()} isDisabled={!searchData} />
         </div>
      </form>
   </div>
</div>

<style>
   .smallSongInfo {
      margin-top: 1rem;
      background-color: var(--gray);
      border-radius: 4px;
      padding: 10px;
      color: #fff;
   }
</style>
