<script lang="ts">
   import type { LeaderboardInfo } from '$lib/models/LeaderboardData';
   import { getDifficultyStyle, getDifficultyLabel, getDifficultyOrStarValue } from '$lib/utils/helpers';
   import FormattedDate from '../common/formatted-date.svelte';
   export let leaderboardInfo: LeaderboardInfo;
</script>

<div class="card map-card">
   <div
      class="bg-image"
      style={`background: linear-gradient(to left, rgba(36, 36, 36, 0.93), rgb(33, 33, 33)) repeat scroll 0% 0%, rgba(0, 0, 0, 0) url(${leaderboardInfo.coverImage}) repeat scroll 0% 0%`}
   />
   <div class="card-content">
      <div class="media">
         <div class="media-content is-clipped">
            <div title={getDifficultyLabel(leaderboardInfo.difficulty)} class="tag mb-2 {getDifficultyStyle(leaderboardInfo.difficulty)}">
               {getDifficultyOrStarValue(leaderboardInfo)}
            </div>
            <div class="title is-5 mb-0">
               <a href={`/leaderboard/${leaderboardInfo.id}`}>{leaderboardInfo.songName}</a>
            </div>
            <div class="subtitle is-6">by {leaderboardInfo.songAuthorName}</div>
         </div>
         <div class="media-right">
            <figure class="image is-96x96 mr-0 ml-0">
               <img src={leaderboardInfo.coverImage} alt="Map Cover" class="map-cover" />
            </figure>
         </div>
      </div>

      <div class="content">
         Mapped by <a href={'#'}><b>{leaderboardInfo.levelAuthorName}</b></a><br />
         Plays: <b>{leaderboardInfo.plays.toLocaleString('en-US')}</b> ({leaderboardInfo.dailyPlays.toLocaleString('en-US')} daily)<br />
         Status: <b>{leaderboardInfo.ranked ? 'Ranked' : leaderboardInfo.qualified ? 'Qualified' : 'Unranked'}</b><br />
         <br />
         <strong class="text-muted">{leaderboardInfo.songHash}</strong><br />
      </div>
   </div>
</div>

<style>
   hr {
      margin-top: 1rem;
      margin-bottom: 1rem;
      background-color: var(--dimmed);
   }

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
