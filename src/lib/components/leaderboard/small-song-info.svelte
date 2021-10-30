<script lang="ts">
   import type { LeaderboardInfo } from '$lib/models/LeaderboardData';
   import { getDifficultyStyle, getDifficultyLabel, getDifficultyOrStarValue } from '$lib/utils/helpers';
   export let leaderboard: LeaderboardInfo;
</script>

<div class="song-container">
   <div class="song-image-wrapper">
      <img class="song-image" src={leaderboard.coverImage} alt="cock" />
      <div title={getDifficultyLabel(leaderboard.difficulty)} class="tag {getDifficultyStyle(leaderboard.difficulty)}">
         {getDifficultyOrStarValue(leaderboard)}
      </div>
   </div>
   <div class="song-info-container">
      <div class="song-info">
         <a href={'#'}>
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
         <a href={'#'}>
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

   .tag.expert-plus {
      background-color: #8f48db;
   }

   .tag.expert {
      background-color: #bf2a42;
   }

   .tag.hard {
      background-color: tomato;
   }

   .tag.normal {
      background-color: #59b0f4;
   }

   .tag.easy {
      background-color: MediumSeaGreen;
   }
</style>
