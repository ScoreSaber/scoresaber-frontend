<script lang="ts">
   import Navbar from '$lib/components/common/navbar.svelte';
   import Footer from '$lib/components/common/footer.svelte';
   import { useAccio } from '$lib/utils/accio';
   import queryString from 'query-string';
   import type { RankRequestInformation } from '$lib/models/Ranking';
   import axios from '$lib/utils/fetcher';
   import Loader from '$lib/components/common/loader.svelte';
   import Error from '$lib/components/common/error.svelte';
   import FormattedDate from '$lib/components/common/formatted-date.svelte';
   import Button from '$lib/components/common/button.svelte';
   import { page } from '$app/stores';

   const {
      data: request,
      error: requestError,
      refresh: refreshRequest
   } = useAccio<RankRequestInformation>(
      queryString.stringifyUrl({
         url: `/api/ranking/request/${$page.params.requestId}`
      }),
      { fetcher: axios }
   );
</script>

<head>
   <title>{$request ? $request.leaderboardInfo.songName + ' - Rank Request' : 'Rank Request'} | ScoreSaber!</title>
</head>

<Navbar />
<div>
   <div class="section breakout">
      <div class="window has-shadow">
         {#if $request}
            {JSON.stringify($request)}
         {:else if !$request}
            <Loader />
         {/if}
         {#if $requestError}
            <Error message={$requestError.toString()} />
         {/if}
      </div>
   </div>
</div>
<Footer />

<style>
</style>
