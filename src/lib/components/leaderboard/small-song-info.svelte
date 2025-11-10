<script lang="ts">
   import { searchView } from '$lib/stores/global-store';

   import type SearchView from '$lib/components/common/search.svelte';

   import { getDifficultyStyle, getDifficultyLabel, getDifficultyOrStarValue } from '$lib/utils/helpers';

   import type { LeaderboardInfo } from '$lib/models/LeaderboardData';

   import FormattedDate from '../common/formatted-date.svelte';

   export let leaderboard: LeaderboardInfo;
   export let margin: boolean | undefined = undefined;

   let searchModal: SearchView;

   let clipAt = 30;
   let innerWidth: number;
   $: innerWidth = window.innerWidth;

   let songName: string;
   $: songName = `${leaderboard.songName}${leaderboard.songSubName ? ' ' + leaderboard.songSubName : ''}`;

   let levelAuthorName: string;
   $: levelAuthorName = `${leaderboard.levelAuthorName}`;

   let truncatedLevelAuthorName: string;
   $: truncatedLevelAuthorName =
      levelAuthorName.length < clipAt ? levelAuthorName : levelAuthorName.slice(0, margin === false ? 18 : 29).trim() + '…';

   searchView.subscribe((v) => (searchModal = v));

   const openSearch = (val) => {
      searchModal?.setVisibility(true);
      searchModal?.search(val);
   };
</script>

<svelte:window bind:innerWidth />

<div class="song-info-component">
   <div class="song-container">
      <div class="song-image-wrapper">
      <figure style={margin === false ? 'margin: 0px 1.2rem 0 0rem !important;' : ''}>
         <img class="song-image" src={leaderboard.coverImage} alt="{songName} Cover" />
         <div title={getDifficultyLabel(leaderboard.difficulty)} class="tag {getDifficultyStyle(leaderboard.difficulty)}">
            {getDifficultyOrStarValue(leaderboard)}
         </div>
      </figure>
   </div>
   <div class="song-info-container mobile-enhance">
      <div class="song-info">
         <a href={`/leaderboard/${leaderboard.id}`}>
            <span class="song-name" title={songName}>{songName}</span>
         </a>
         by
         <a href={'#'} on:click|preventDefault={() => openSearch(leaderboard.songAuthorName)}>
            <span title={leaderboard.songAuthorName}>{leaderboard.songAuthorName}</span>
         </a>
      </div>
      <div class="mapper-info">
         Mapped by
         <a href={'#'} on:click|preventDefault={() => openSearch(leaderboard.levelAuthorName)}>
            <span class="mapper-name" title={truncatedLevelAuthorName !== levelAuthorName ? levelAuthorName : null}>{truncatedLevelAuthorName}</span>
         </a>
         <span class="text-muted"><FormattedDate date={new Date(leaderboard.createdDate)} /></span>
      </div>
   </div>
   </div>
</div>

<style>
   .song-image {
      min-width: 46px;
      width: 46px;
      height: 46px;
      border-radius: 15%;
      display: block;
   }
   .song-info-component .song-container {
      height: 100%;
   }
   .song-info-component .song-info-container {
      justify-content: center;
   }
   .tag {
      display: flex;
      align-items: center;
      font-size: xx-small;
      position: absolute;
      bottom: 20%;
      right: -10px;
      min-width: 20px;
      color: white;
      background-color: MediumSeaGreen;
      padding: 4px 4px 3px 4px;
      cursor: help;
   }

   figure {
      margin: 0px 1rem !important;
      position: relative;
   }

   .mobile-show {
      display: none;
   }

   .song-info {
      display: inline-block;
      width: 40vw;
      max-width: 400px;
      overflow: hidden;
      text-overflow: ellipsis;
   }

   @media screen and (max-width: 768px), print {
      .song-info {
         width: auto;
      }
   }

   @media screen and (max-width: 512px), print {
      .mobile-hide {
         display: none;
      }
      .mobile-enhance {
         margin-left: 5px;
      }
      .mobile-show.tag {
         display: inline;
         position: relative;
         width: 44px;
         bottom: 0;
         right: 0;
         margin-right: 5px;
      }
      .song-info-container {
         margin-bottom: 5px;
      }
   }
</style>
