<script lang="ts">
   import type { LeaderboardInfo } from '$lib/models/LeaderboardData';
   import { getDifficultyStyle, getDifficultyLabel, getDifficultyOrStarValue } from '$lib/utils/helpers';
   export let leaderboard: LeaderboardInfo;
   import SearchView from '$lib/components/common/search.svelte';
   let searchModal: SearchView;

   const openSearch = (val) => {
      searchModal?.setVisibility(true);
      searchModal?.search(val);
   };
</script>

<SearchView bind:this={searchModal} />

<div class="song-container">
   <div class="song-image-wrapper">
      <img class="song-image" src={leaderboard.coverImage} alt="cock" />
      <div title={getDifficultyLabel(leaderboard.difficulty)} class="tag {getDifficultyStyle(leaderboard.difficulty)}">
         {getDifficultyOrStarValue(leaderboard)}
      </div>
   </div>
   <div class="song-info-container">
      <div class="song-info">
         <a href={`/leaderboard/${leaderboard.id}`}>
            <span class="song-name">
               {leaderboard.songName}
            </span>
         </a>
         by
         <a href={'#'}>
            <span>
               {leaderboard.songAuthorName}
            </span>
         </a>
      </div>
      <div class="mapper-info">
         mapped by
         <a href={'#'} on:click|preventDefault={() => openSearch(leaderboard.levelAuthorName)}>
            <span class="mapper-name">
               {leaderboard.levelAuthorName}
            </span>
         </a>
      </div>
   </div>
</div>

<style>
   .song-name {
      font-weight: 800;
      font-size: larger;
   }
   .song-image {
      min-width: 46px;
      width: 46px;
      height: 46px;
      border-radius: 15%;
      margin-right: 25px;
      display: block;
   }

   .song-info-container {
      display: flex;
      flex-direction: column;
   }
   .song-container {
      display: flex;
   }
   .song-image-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
   }
   .tag {
      display: flex;
      align-items: center;
      font-size: xx-small;
      position: absolute;
      bottom: 0.5em;
      right: 20px;
      min-width: 20px;
      color: white;
      background-color: MediumSeaGreen;
      padding: 4px 4px 3px 4px;
      cursor: help;
   }

   @media only screen and (max-width: 769px) {
      .tag {
         bottom: auto !important;
      }
   }
</style>
