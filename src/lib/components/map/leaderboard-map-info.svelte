<script lang="ts">
   import { searchView, userData } from '$lib/stores/global-store';

   import type SearchView from '$lib/components/common/search.svelte';

   import Permissions from '$lib/utils/permissions';
   import { getDifficultyStyle, getDifficultyLabel, getDifficultyOrStarValue } from '$lib/utils/helpers';

   import type { LeaderboardInfo } from '$lib/models/LeaderboardData';

   export let leaderboardInfo: LeaderboardInfo;

   let downloadModal: HTMLDialogElement;

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
            {#if leaderboardInfo?.songSubName?.length}
               <div class="title is-6 mb-0">
                  <a href={`/leaderboard/${leaderboardInfo.id}`}>{leaderboardInfo.songSubName}</a>
               </div>
            {/if}
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
         {#if $userData && Permissions.checkPermissionNumber($userData.permissions, Permissions.security.ADMIN)}
            Max PP: <strong>{leaderboardInfo.maxPP}</strong> <br />
         {/if}
         Mapped by
         <a href={'#'} on:click|preventDefault={() => openSearch(leaderboardInfo.levelAuthorName)}><b>{leaderboardInfo.levelAuthorName}</b></a><br />
         Plays: <b>{leaderboardInfo.plays.toLocaleString('en-US')}</b> ({leaderboardInfo.dailyPlays.toLocaleString('en-US')} in the last 24h)<br />
         Status: <b>{leaderboardInfo.ranked ? 'Ranked' : leaderboardInfo.qualified ? 'Qualified' : 'Unranked'}</b><br />
         Game Mode: <b>{leaderboardInfo.difficulty.gameMode}</b>
         <br />
         <strong class="text-muted"
            ><a href="web+bsmap://{leaderboardInfo.songHash}" title="Download Map" class="btn" on:click={() => downloadModal.showModal()}
               ><i class="fa fa-sm fa-download" />
            </a>{leaderboardInfo.songHash}</strong
         >         <br />
      </div>
   </div>
</div>

<dialog class="card download-overlay" bind:this={downloadModal}>
   <h1>Nothing happened?</h1>
   <p>ScoreSaber's download button relies on an external service implementing the <code>web+bsmap:</code> URL protocol to work.</p>
   <p>Make sure you have something installed that can do this and try again.</p>
   <button class="close button" on:click={() => downloadModal.close()} title="Close"
      ><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
         <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
         />
      </svg></button
   >
</dialog>

<style>
   .bg-image {
      position: absolute;
      height: 100%;
      width: 100%;
      background-position: 50% !important;
      background-repeat: no-repeat !important;
      background-size: cover !important;
      z-index: -1;
      border-radius: 6px;
   }

   .download-overlay {
      background: var(--foregroundItem);
      border: 1px solid var(--borderColor);
      color: var(--textColor);
      width: 100%;
      max-width: 32rem;
      padding: 3rem 2rem;
      border-radius: 6px;
   }

   .download-overlay .close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 2em;
      height: 2em;
      display: flex;
      padding: 0.5em;
      align-items: center;
      justify-content: center;
   }

   .download-overlay .close svg {
      flex: 1;
   }

   .download-overlay .close:hover {
      background: var(--gray-light);
   }

   .map-card {
      z-index: 1;
      color: var(--textColor);
      background: none;
      border-radius: 0.9rem;
   }

   .map-card .card-content {
      border-radius: 0.9rem;
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
      border: 1px solid var(--borderColor);
      padding: 0.2rem 0.3rem;
      border-radius: 6px;
      flex-grow: 1;
   }

   .map-cover {
      border-radius: 6px;
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
