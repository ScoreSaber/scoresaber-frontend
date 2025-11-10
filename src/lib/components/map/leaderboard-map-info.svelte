<script lang="ts">
   import { userData } from '$lib/stores/global-store';

   import BaseMapInfo from '$lib/components/map/base-map-info.svelte';
   import Button from '$lib/components/common/button.svelte';

   import Permissions from '$lib/utils/permissions';
   import { getDifficultyStyle, getDifficultyLabel, getDifficultyOrStarValue } from '$lib/utils/helpers';

   import type { LeaderboardInfo } from '$lib/models/LeaderboardData';

   export let leaderboardInfo: LeaderboardInfo;

   let downloadModal: HTMLDialogElement;

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

<BaseMapInfo
   coverImage={leaderboardInfo.coverImage}
   songName={leaderboardInfo.songName}
   songSubName={leaderboardInfo.songSubName}
   songAuthorName={leaderboardInfo.songAuthorName}
   levelAuthorName={leaderboardInfo.levelAuthorName}
   difficultyLabel={getDifficultyLabel(leaderboardInfo.difficulty)}
   difficultyStyle={getDifficultyStyle(leaderboardInfo.difficulty)}
   difficultyOrStarValue={getDifficultyOrStarValue(leaderboardInfo)}
   leaderboardId={leaderboardInfo.id}
>
   {#if $userData && Permissions.checkPermissionNumber($userData.permissions, Permissions.security.ADMIN)}
      <div class="info-row admin-info">
         <span class="info-label">Max PP:</span>
         <span class="info-value">{leaderboardInfo.maxPP}</span>
      </div>
   {/if}
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
</BaseMapInfo>

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
   :global(.hash-row) {
      margin-top: 0.5rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--borderColor);
      align-items: center;
      gap: 0.5rem;
   }

   :global(.hash-row button) {
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
      :global(.hash-row) {
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

      :global(.hash-row button) {
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

   @media only screen and (max-width: 480px) {
      :global(.hash-row button) {
         padding: 0.75rem 0.875rem;
         font-size: 0.9375rem;
      }
   }
</style>
