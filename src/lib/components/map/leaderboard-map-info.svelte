<script lang="ts">
   import type { LeaderboardInfo } from '$lib/models/LeaderboardData';
   import Permissions from '$lib/utils/permissions';
   import { getDifficultyStyle, getDifficultyLabel, getDifficultyOrStarValue } from '$lib/utils/helpers';

   export let leaderboardInfo: LeaderboardInfo;

   import type SearchView from '$lib/components/common/search.svelte';
   import { searchView, userData } from '$lib/global-store';
   let searchModal: SearchView;

   searchView.subscribe((v) => (searchModal = v));

   const openSearch = (val) => {
      searchModal?.setVisibility(true);
      searchModal?.search(val);
   };
</script>

<div class="card map-card">
   <div class="window card-content">
      <div class="media">
         <div class="media-content is-clipped">
            <div title={getDifficultyLabel(leaderboardInfo.difficulty)} class="tag mb-2 {getDifficultyStyle(leaderboardInfo.difficulty)}">
               {getDifficultyOrStarValue(leaderboardInfo)}
            </div>
            <div class="title is-5 mb-0">
               <a href={`/leaderboard/${leaderboardInfo.id}`}>{leaderboardInfo.songName}</a>
            </div>
            <div class="subtitle is-6">
               by <a href={'#'} on:click|preventDefault={() => openSearch(leaderboardInfo.songAuthorName)}><b>{leaderboardInfo.songAuthorName}</b></a>
            </div>
         </div>
         <div class="media-right">
            <figure class="image is-96x96 mr-0 ml-0">
               <img src={leaderboardInfo.coverImage} alt="Map Cover" class="map-cover" />
            </figure>
         </div>
      </div>

      <div class="content">
         {#if $userData && Permissions.checkPermissionNumber($userData.permissions, Permissions.groups.ADMIN)}
            Max PP: <strong>{leaderboardInfo.maxPP}</strong> <br />
         {/if}
         Mapped by
         <a href={'#'} on:click|preventDefault={() => openSearch(leaderboardInfo.levelAuthorName)}><b>{leaderboardInfo.levelAuthorName}</b></a><br />
         Plays: <b>{leaderboardInfo.plays.toLocaleString('en-US')}</b> ({leaderboardInfo.dailyPlays.toLocaleString('en-US')} in the last 24h)<br />
         Status: <b>{leaderboardInfo.ranked ? 'Ranked' : leaderboardInfo.qualified ? 'Qualified' : 'Unranked'}</b><br />
         <br />
         <strong class="text-muted">{leaderboardInfo.songHash}</strong><br />
      </div>
   </div>
</div>

<style>
   .bg-image {
      position: absolute;
      height: 100%;
      width: 100%;
      background-position: 50% !important;
      background-repeat: no-repeat !important;
      background-size: cover !important;
      z-index: -1;
      border-radius: 5px;
   }

   .map-card {
      z-index: 1;
      color: var(--textColor);
      background: none;
   }

   .tag {
      font-size: x-small;
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

   .subtitle {
      display: block;
      color: var(--textColor);
      font-size: 14px;
      margin-top: 0.5rem !important;
   }

   .content {
      word-break: break-all;
   }

   .text-muted {
      color: var(--muted);
   }
</style>
