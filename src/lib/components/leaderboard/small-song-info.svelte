<script lang="ts">
   import type { LeaderboardInfo } from '$lib/models/LeaderboardData';
   import { getDifficultyStyle, getDifficultyLabel, getDifficultyOrStarValue } from '$lib/utils/helpers';
   export let leaderboard: LeaderboardInfo;
   import type SearchView from '$lib/components/common/search.svelte';
   import { searchView } from '$lib/global-store';
   let searchModal: SearchView;

   searchView.subscribe((v) => (searchModal = v));

   const openSearch = (val) => {
      searchModal?.setVisibility(true);
      searchModal?.search(val);
   };
</script>

<div class="song-container">
   <div class="song-image-wrapper">
      <figure>
         <img class="song-image" src={leaderboard.coverImage} alt="{leaderboard.songName} Cover" />
         <div title={getDifficultyLabel(leaderboard.difficulty)} class="tag {getDifficultyStyle(leaderboard.difficulty)}">
            {getDifficultyOrStarValue(leaderboard)}
         </div>
      </figure>
   </div>
   <div class="song-info-container">
      <div class="song-info">
         <a href={`/leaderboard/${leaderboard.id}`}>
            <span class="song-name">
               {leaderboard.songName}
            </span>
         </a>
         by
         <a href={'#'} on:click|preventDefault={() => openSearch(leaderboard.songAuthorName)}>
            <span>
               {leaderboard.songAuthorName}
            </span>
         </a>
      </div>
      <div class="mapper-info">
         Mapped by
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
      justify-content: center;
   }
   .song-container {
      display: flex;
      height: 100%;
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
      bottom: 20%;
      right: 20px;
      min-width: 20px;
      color: white;
      background-color: MediumSeaGreen;
      padding: 4px 4px 3px 4px;
      cursor: help;
   }

   figure {
      margin: 0px;
      position: relative;
   }
</style>
