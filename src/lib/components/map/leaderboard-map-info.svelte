<script lang="ts">
   import { searchView, userData } from '$lib/stores/global-store';

   import type SearchView from '$lib/components/common/search.svelte';
   import Button from '$lib/components/common/button.svelte';

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

   const handleDownload = () => {
      window.location.href = `web+bsmap://${leaderboardInfo.songHash}`;
      downloadModal.showModal();
   };

   const handleCopyHash = async () => {
      try {
         await navigator.clipboard.writeText(leaderboardInfo.songHash);
      } catch (err) {
         console.error('Failed to copy hash:', err);
      }
   };
</script>

<div class="card map-card">
   <div class="window card-content">
      <div class="media">
         <div class="media-content is-clipped">
            <div title={getDifficultyLabel(leaderboardInfo.difficulty)} class="tag difficulty-badge {getDifficultyStyle(leaderboardInfo.difficulty)}">
               {getDifficultyOrStarValue(leaderboardInfo)}
            </div>
            <div class="song-title">
               <a href={`/leaderboard/${leaderboardInfo.id}`} class="song-link">{leaderboardInfo.songName}</a>
            </div>
            {#if leaderboardInfo?.songSubName?.length}
               <div class="song-subtitle">
                  <a href={`/leaderboard/${leaderboardInfo.id}`} class="song-link">{leaderboardInfo.songSubName}</a>
               </div>
            {/if}
            <div class="song-author">
               by <a href={'#'} on:click|preventDefault={() => openSearch(leaderboardInfo.songAuthorName)} class="author-link"
                  >{leaderboardInfo.songAuthorName}</a
               >
            </div>
         </div>
         <div class="media-right">
            <figure class="cover-image">
               <img src={leaderboardInfo.coverImage} alt="Map Cover" class="map-cover" />
            </figure>
         </div>
      </div>

      <div class="info-section">
         {#if $userData && Permissions.checkPermissionNumber($userData.permissions, Permissions.security.ADMIN)}
            <div class="info-row admin-info">
               <span class="info-label">Max PP:</span>
               <span class="info-value">{leaderboardInfo.maxPP}</span>
            </div>
         {/if}
         <div class="info-row">
            <span class="info-label">Mapped by:</span>
            <a href={'#'} on:click|preventDefault={() => openSearch(leaderboardInfo.levelAuthorName)} class="info-value mapper-link"
               >{leaderboardInfo.levelAuthorName}</a
            >
         </div>
         <div class="info-row">
            <span class="info-label">Plays:</span>
            <span class="info-value"
               >{leaderboardInfo.plays.toLocaleString('en-US')}
               <span class="info-detail">({leaderboardInfo.dailyPlays.toLocaleString('en-US')} in the last 24h)</span></span
            >
         </div>
         <div class="info-row">
            <span class="info-label">Status:</span>
            <span class="info-value status-badge {leaderboardInfo.ranked ? 'ranked' : leaderboardInfo.qualified ? 'qualified' : 'unranked'}">
               {leaderboardInfo.ranked ? 'Ranked' : leaderboardInfo.qualified ? 'Qualified' : 'Unranked'}
            </span>
         </div>
         <div class="info-row">
            <span class="info-label">Game Mode:</span>
            <span class="info-value">{leaderboardInfo.difficulty.gameMode}</span>
         </div>
         <div class="info-row hash-row">
            <Button onClicked={handleDownload} title="Download" icon="download" size="is-small" />
            <Button onClicked={handleCopyHash} title="Copy Hash" icon="copy" size="is-small" />
         </div>
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
   .map-card .window {
      padding-bottom: 1rem;
   }

   .media {
      align-items: flex-start;
      margin-bottom: 1.5rem;
   }

   .media-content {
      overflow: hidden;
   }

   .difficulty-badge {
      font-size: 0.75rem;
      font-weight: 700;
      min-width: 60px;
      padding: 6px 12px;
      border-radius: 6px;
      cursor: help;
      margin-bottom: 0.75rem;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      color: white;
   }

   .difficulty-badge.expert {
      color: white !important;
   }

   .song-title {
      font-size: 1.25rem;
      font-weight: 700;
      line-height: 1.3;
      margin-bottom: 0.5rem;
      color: var(--textColor);
   }

   .song-subtitle {
      font-size: 1rem;
      font-weight: 600;
      line-height: 1.3;
      margin-bottom: 0.5rem;
      color: var(--textColor);
      opacity: 0.9;
   }

   .song-link {
      color: var(--textColor);
      text-decoration: none;
      transition: color 0.2s ease;
   }

   .song-link:hover {
      color: var(--scoreSaberYellow);
   }

   .song-author {
      font-size: 0.875rem;
      color: var(--muted);
      margin-top: 0.5rem;
   }

   .author-link {
      font-weight: 600;
      text-decoration: none;
      transition: color 0.2s ease;
   }

   .cover-image {
      width: 96px;
      height: 96px;
      margin: 0;
      flex-shrink: 0;
   }

   .map-cover {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
   }

   .info-section {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding-top: 1rem;
      border-top: 1px solid var(--borderColor);
      margin-bottom: 0;
   }

   .info-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      flex-wrap: wrap;
   }

   .info-label {
      color: var(--muted);
      font-weight: 500;
      min-width: 90px;
   }

   .info-value {
      color: var(--textColor);
      font-weight: 600;
   }

   .info-detail {
      color: var(--muted);
      font-weight: 400;
      font-size: 0.8125rem;
   }

   .mapper-link {
      text-decoration: none;
      transition: color 0.2s ease;
   }

   .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
   }

   .status-badge.ranked {
      background-color: rgba(35, 209, 96, 0.15);
      color: var(--success);
      border: 1px solid var(--success);
   }

   .status-badge.qualified {
      background-color: rgba(255, 222, 26, 0.15);
      color: var(--scoreSaberYellow);
      border: 1px solid var(--scoreSaberYellow);
   }

   .status-badge.unranked {
      background-color: rgba(139, 148, 158, 0.15);
      color: var(--muted);
      border: 1px solid var(--muted);
   }

   .admin-info {
      background-color: rgba(191, 220, 249, 0.05);
      padding: 0.5rem;
      border-radius: 4px;
      border-left: 3px solid var(--admin);
   }

   .hash-row {
      margin-top: 0.5rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--borderColor);
      align-items: center;
      gap: 0.5rem;
   }

   .hash-row :global(button) {
      flex: 1;
   }

   .download-overlay {
      background: var(--foregroundItem);
      border: 1px solid var(--borderColor);
      color: var(--textColor);
      width: 100%;
      max-width: 32rem;
      padding: 3rem 2rem;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
   }

   .download-overlay::backdrop {
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
   }

   .download-overlay h1 {
      color: var(--textColor);
      margin-bottom: 1rem;
      font-size: 1.5rem;
   }

   .download-overlay p {
      margin-bottom: 1rem;
      line-height: 1.6;
   }

   .download-overlay code {
      background-color: var(--gray);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      color: var(--scoreSaberYellow);
   }

   .download-overlay .close {
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 2.5rem;
      height: 2.5rem;
      display: flex;
      padding: 0.5rem;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      transition: all 0.2s ease;
   }

   .download-overlay .close svg {
      flex: 1;
   }

   .download-overlay .close:hover {
      background: var(--gray-light);
      color: var(--scoreSaberYellow);
   }

   @media only screen and (max-width: 768px) {
      .media {
         flex-direction: row;
         gap: 1rem;
         align-items: flex-start;
         text-align: left;
         margin-bottom: 1.5rem;
      }

      .media-content {
         flex: 1;
         min-width: 0;
      }

      .media-right {
         flex-shrink: 0;
         order: -1;
      }

      .cover-image {
         width: 110px;
         height: 110px;
      }

      .map-cover {
         box-shadow: 0 6px 16px rgba(0, 0, 0, 0.5);
      }

      .difficulty-badge {
         display: inline-flex;
         align-items: center;
         justify-content: center;
         margin-bottom: 0.625rem;
         padding: 6px 14px;
         font-size: 0.8125rem;
         min-width: 70px;
         text-align: center;
      }

      .song-title {
         font-size: 1.25rem;
         line-height: 1.2;
         margin-bottom: 0.375rem;
         font-weight: 700;
      }

      .song-subtitle {
         font-size: 1rem;
         line-height: 1.25;
         margin-bottom: 0.375rem;
         font-weight: 600;
      }

      .song-author {
         font-size: 0.875rem;
         margin-top: 0.5rem;
         opacity: 0.85;
      }

      .info-section {
         gap: 0.75rem;
         padding-top: 1.5rem;
         text-align: left;
         display: grid;
         grid-template-columns: 1fr 1fr;
         column-gap: 0.75rem;
         row-gap: 0.75rem;
      }

      .info-row {
         flex-direction: column;
         align-items: flex-start;
         text-align: left;
         gap: 0.25rem;
         background-color: rgba(255, 255, 255, 0.02);
         padding: 0.625rem 0.75rem;
         border-radius: 6px;
      }

      .info-label {
         min-width: auto;
         font-size: 0.6875rem;
         color: var(--muted);
         text-transform: uppercase;
         letter-spacing: 0.8px;
         font-weight: 700;
      }

      .info-value {
         font-size: 1rem;
         line-height: 1.4;
         word-break: break-word;
      }

      .info-detail {
         display: block;
         margin-top: 0.25rem;
         font-size: 0.8125rem;
      }

      .status-badge {
         font-size: 0.6875rem;
         padding: 4px 10px;
      }

      .admin-info {
         padding: 0.625rem 0.75rem;
         text-align: left;
         border-left: none;
         border-top: 3px solid var(--admin);
         grid-column: 1 / -1;
         background-color: rgba(191, 220, 249, 0.08);
      }

      .hash-row {
         flex-direction: column;
         align-items: stretch;
         gap: 0.75rem;
         padding-top: 0;
         margin-top: 0;
         border-top: none;
         grid-column: 1 / -1;
         background-color: transparent;
         padding: 0;
      }

      .hash-row :global(button) {
         width: 100%;
         justify-content: center;
         padding: 0.875rem 1rem;
         font-size: 1rem;
      }

      .download-overlay {
         padding: 2rem 1.5rem;
         max-width: calc(100vw - 2rem);
      }

      .download-overlay h1 {
         font-size: 1.25rem;
      }

      .download-overlay .close {
         width: 2rem;
         height: 2rem;
         padding: 0.375rem;
      }
   }

   @media only screen and (max-width: 600px) {
      .info-section {
         grid-template-columns: 1fr;
      }

      .cover-image {
         width: 180px;
         height: 180px;
      }

      .song-title {
         font-size: 1.5rem;
      }

      .song-subtitle {
         font-size: 1.125rem;
      }

      .difficulty-badge {
         padding: 7px 16px;
         font-size: 0.875rem;
         min-width: 80px;
      }

      .song-author {
         font-size: 0.9375rem;
      }
   }

   @media only screen and (max-width: 480px) {
      .cover-image {
         width: 160px;
         height: 160px;
      }

      .song-title {
         font-size: 1.375rem;
      }

      .song-subtitle {
         font-size: 1.0625rem;
      }

      .song-author {
         font-size: 0.875rem;
      }

      .difficulty-badge {
         padding: 7px 15px;
         font-size: 0.8125rem;
         min-width: 75px;
      }

      .info-row {
         padding: 0.5rem 0.625rem;
      }

      .info-label {
         font-size: 0.625rem;
      }

      .info-value {
         font-size: 0.9375rem;
      }

      .info-detail {
         font-size: 0.75rem;
      }

      .hash-row :global(button) {
         padding: 0.75rem 0.875rem;
         font-size: 0.9375rem;
      }
   }
</style>
