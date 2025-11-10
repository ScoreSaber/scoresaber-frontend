<script lang="ts">
   import { searchView } from '$lib/stores/global-store';

   import type SearchView from '$lib/components/common/search.svelte';

   export let coverImage: string;
   export let songName: string;
   export let songSubName: string | undefined = undefined;
   export let songAuthorName: string;
   export let levelAuthorName: string;
   export let difficultyLabel: string;
   export let difficultyStyle: string;
   export let difficultyOrStarValue: string;
   export let leaderboardId: number;

   let searchModal: SearchView;

   searchView.subscribe((v) => (searchModal = v));

   const openSearch = (val: string) => {
      searchModal?.setVisibility(true);
      searchModal?.search(val);
   };
</script>

<div class="card map-card">
   <div class="window card-content">
      <div class="media">
         <div class="media-content is-clipped">
            <div title={difficultyLabel} class="tag difficulty-badge {difficultyStyle}">
               {difficultyOrStarValue}
            </div>
            <div class="song-title">
               <a href={`/leaderboard/${leaderboardId}`} class="song-link">{songName}</a>
            </div>
            {#if songSubName?.length}
               <div class="song-subtitle">
                  <a href={`/leaderboard/${leaderboardId}`} class="song-link">{songSubName}</a>
               </div>
            {/if}
            <div class="song-author">
               by <a href={'#'} on:click|preventDefault={() => openSearch(songAuthorName)} class="author-link">{songAuthorName}</a>
            </div>
         </div>
         <div class="media-right">
            <figure class="cover-image">
               <img src={coverImage} alt="Map Cover" class="map-cover" />
            </figure>
         </div>
      </div>

      <div class="info-section">
         <div class="info-row">
            <span class="info-label">Mapped by:</span>
            <a href={'#'} on:click|preventDefault={() => openSearch(levelAuthorName)} class="info-value mapper-link">{levelAuthorName}</a>
         </div>
         <slot />
      </div>
   </div>
</div>

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

   .difficulty-badge :global(.expert) {
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

   :global(.info-row) {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      flex-wrap: wrap;
   }

   :global(.info-label) {
      color: var(--muted);
      font-weight: 500;
      min-width: 90px;
   }

   :global(.info-value) {
      color: var(--textColor);
      font-weight: 600;
   }

   :global(.info-detail) {
      color: var(--muted);
      font-weight: 400;
      font-size: 0.8125rem;
   }

   :global(.mapper-link) {
      text-decoration: none;
      transition: color 0.2s ease;
   }

   :global(.status-badge) {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
   }

   :global(.status-badge.ranked) {
      background-color: rgba(35, 209, 96, 0.15);
      color: var(--success);
      border: 1px solid var(--success);
   }

   :global(.status-badge.qualified) {
      background-color: rgba(255, 222, 26, 0.15);
      color: var(--scoreSaberYellow);
      border: 1px solid var(--scoreSaberYellow);
   }

   :global(.status-badge.unranked) {
      background-color: rgba(139, 148, 158, 0.15);
      color: var(--muted);
      border: 1px solid var(--muted);
   }

   :global(.status-badge.pending) {
      background-color: rgba(41, 128, 185, 0.15);
      color: var(--info);
      border: 1px solid var(--info);
   }

   :global(.status-badge.approved) {
      background-color: rgba(35, 209, 96, 0.15);
      color: var(--success);
      border: 1px solid var(--success);
   }

   :global(.status-badge.denied) {
      background-color: rgba(209, 35, 42, 0.15);
      color: var(--danger);
      border: 1px solid var(--danger);
   }

   :global(.admin-info) {
      background-color: rgba(191, 220, 249, 0.05);
      padding: 0.5rem;
      border-radius: 4px;
      border-left: 3px solid var(--admin);
   }

   :global(.votes-container) {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--borderColor);
   }

   :global(.votes) {
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      align-items: center;
      text-align: center;
      gap: 0.5rem;
   }

   :global(.vote) {
      background-color: var(--foregroundItem);
      border: 1px solid var(--borderColor);
      padding: 0.5rem 0.625rem;
      border-radius: 6px;
      flex-grow: 1;
      font-size: 0.875rem;
      transition: all 0.2s ease;
   }

   :global(.vote:hover) {
      border-color: var(--scoreSaberYellow);
      background-color: rgba(255, 222, 26, 0.05);
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

      :global(.info-row) {
         flex-direction: column;
         align-items: flex-start;
         text-align: left;
         gap: 0.25rem;
         background-color: rgba(255, 255, 255, 0.02);
         padding: 0.625rem 0.75rem;
         border-radius: 6px;
      }

      :global(.info-label) {
         min-width: auto;
         font-size: 0.6875rem;
         color: var(--muted);
         text-transform: uppercase;
         letter-spacing: 0.8px;
         font-weight: 700;
      }

      :global(.info-value) {
         font-size: 1rem;
         line-height: 1.4;
         word-break: break-word;
      }

      :global(.info-detail) {
         display: block;
         margin-top: 0.25rem;
         font-size: 0.8125rem;
      }

      :global(.status-badge) {
         font-size: 0.6875rem;
         padding: 4px 10px;
      }

      :global(.admin-info) {
         padding: 0.625rem 0.75rem;
         text-align: left;
         border-left: none;
         border-top: 3px solid var(--admin);
         grid-column: 1 / -1;
         background-color: rgba(191, 220, 249, 0.08);
      }

      :global(.votes-container) {
         grid-column: 1 / -1;
         padding-top: 0.5rem;
      }

      :global(.votes) {
         gap: 0.625rem;
      }

      :global(.vote) {
         padding: 0.5rem;
         font-size: 0.8125rem;
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

      :global(.info-row) {
         padding: 0.5rem 0.625rem;
      }

      :global(.info-label) {
         font-size: 0.625rem;
      }

      :global(.info-value) {
         font-size: 0.9375rem;
      }

      :global(.info-detail) {
         font-size: 0.75rem;
      }
   }
</style>
