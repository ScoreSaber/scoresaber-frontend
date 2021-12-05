<script lang="ts">
   import type { LeaderboardInfo } from '$lib/models/LeaderboardData';
   import { getDifficultyStyle, getDifficultyLabel, getDifficultyOrStarValue } from '$lib/utils/helpers';
   import type SearchView from '$lib/components/common/search.svelte';
   import { searchView } from '$lib/global-store';
   import FormattedDate from '../common/formatted-date.svelte';

   export let leaderboard: LeaderboardInfo;
   export let margin: boolean | undefined = undefined;
   let searchModal: SearchView;

   const clipAt = 30;

   let songName: string;
   $: songName = `${leaderboard.songName}${leaderboard.songSubName ? ' ' + leaderboard.songSubName : ''}`;

   let songAuthorName: string;
   $: songAuthorName = `${leaderboard.songAuthorName}`;

   let levelAuthorName: string;
   $: levelAuthorName = `${leaderboard.levelAuthorName}`;

   let truncatedSongName: string;
   $: truncatedSongName = songName.length < clipAt ? songName : songName.slice(0, margin === false ? 18 : 29).trim() + '…';

   let truncatedSongAuthorName: string;
   $: truncatedSongAuthorName = songAuthorName.length < clipAt ? songAuthorName : songAuthorName.slice(0, margin === false ? 18 : 29).trim() + '…';

   let truncatedLevelAuthorName: string;
   $: truncatedLevelAuthorName =
      levelAuthorName.length < clipAt ? levelAuthorName : levelAuthorName.slice(0, margin === false ? 18 : 29).trim() + '…';

   searchView.subscribe((v) => (searchModal = v));

   const openSearch = (val) => {
      searchModal?.setVisibility(true);
      searchModal?.search(val);
   };
</script>

<div class="song-container">
   <div class="song-image-wrapper mobile-hide">
      <figure style={margin === false ? 'margin: 0px 1.2rem 0 0rem !important;' : ''}>
         <img class="song-image" src={leaderboard.coverImage} alt="{songName} Cover" />
         <div title={getDifficultyLabel(leaderboard.difficulty)} class="tag {getDifficultyStyle(leaderboard.difficulty)}">
            {getDifficultyOrStarValue(leaderboard)}
         </div>
      </figure>
   </div>
   <div class="song-info-container mobile-enhance">
      <div class="song-info">
         <div title={getDifficultyLabel(leaderboard.difficulty)} class="tag mobile-show {getDifficultyStyle(leaderboard.difficulty)}">
            {getDifficultyOrStarValue(leaderboard)}
         </div>
         <a href={`/leaderboard/${leaderboard.id}`}>
            <span class="song-name" title={truncatedSongName !== songName ? songName : null}>{truncatedSongName}</span>
         </a>
         by
         <a href={'#'} on:click|preventDefault={() => openSearch(leaderboard.songAuthorName)}>
            <span title={truncatedSongAuthorName !== songAuthorName ? songAuthorName : null}>{truncatedSongAuthorName}</span>
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

   @media (max-width: 512px) {
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
