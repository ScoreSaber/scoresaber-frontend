<script lang="ts">
   import queryString from 'query-string';
   import axios from 'axios';
   import { onDestroy } from 'svelte';

   import { browser } from '$app/env';
   import { page } from '$app/stores';
   import { goto } from '$app/navigation';

   import PlayerLink from '$lib/components/player/player-link.svelte';
   import SmallSongInfo from '$lib/components/leaderboard/small-song-info.svelte';

   import fetcher from '$lib/utils/fetcher';

   import type { LeaderboardInfo, LeaderboardInfoCollection } from '$lib/models/LeaderboardData';
   import type { Player, PlayerCollection } from '$lib/models/PlayerData';
   let searchValue = '';
   let inputBox: HTMLInputElement;
   let visible = false;
   let focusElement = 0;
   let resultsElement: HTMLDivElement;
   let playersCollapsed = false;
   let leaderboardsCollapsed = false;
   let isMac = false;

   export const isVisible = () => visible;

   interface SearchResults {
      players: Player[];
      leaderboards: LeaderboardInfo[];
      loading?: boolean;
      typing?: boolean;
   }

   let searchResults: SearchResults = {
      players: [],
      leaderboards: []
   };

   const bounceCursor = () => {
      const playersCount = playersCollapsed ? 0 : searchResults.players.length;
      const leaderboardsCount = leaderboardsCollapsed ? 0 : searchResults.leaderboards.length;
      const max = leaderboardsCount + playersCount - 1;
      if (focusElement > max) focusElement = 0;
      if (focusElement < 0) focusElement = max;
   };

   export const setVisibility = (value: boolean) => {
      visible = value;
      if (value) {
         inputBox.focus();
         if (typeof navigator !== 'undefined') {
            isMac = navigator.platform.includes('Mac');
         }
      }
   };

   const pageUnsubscribe = page.subscribe(() => {
      if (browser) {
         setVisibility(false);
      }
   });
   onDestroy(pageUnsubscribe);

   let debounceTimer;

   const scrollToActive = () => {
      if (focusElement < 2) return resultsElement.scrollTo({ top: 0, behavior: 'smooth' });
      const target = resultsElement.querySelectorAll('.result')[Math.max(0, focusElement - 2)];
      target.scrollIntoView({ behavior: 'smooth' });
   };

   const handleKeydown = (event: KeyboardEvent) => {
      switch (event.key) {
         case 'Escape':
            event.preventDefault();
            event.stopPropagation();
            setVisibility(false);
            break;
         case 'ArrowUp':
            event.preventDefault();
            focusElement--;
            bounceCursor();
            scrollToActive();
            break;
         case 'ArrowDown':
            event.preventDefault();
            focusElement++;
            bounceCursor();
            scrollToActive();
            break;
         case 'Enter': {
            const playersCount = playersCollapsed ? 0 : searchResults.players.length;
            if (focusElement < playersCount && !searchResults.loading) {
               goto(`/u/${searchResults.players[focusElement].id}`);
            } else if (!searchResults.loading) {
               const leaderboardIndex = focusElement - playersCount;
               const leaderboard = searchResults.leaderboards[leaderboardIndex];
               if (leaderboard) {
                  goto(`/leaderboard/${leaderboard.id}`);
               }
            }
            break;
         }
         case '1':
            if (event.ctrlKey || event.metaKey) {
               event.preventDefault();
               togglePlayersSection(event);
            }
            break;
         case '2':
            if (event.ctrlKey || event.metaKey) {
               event.preventDefault();
               toggleLeaderboardsSection(event);
            }
            break;
      }
   };

   let cancel = axios.CancelToken.source();

   export const search = async (value: string) => {
      searchValue = value; // external search calls should update the value

      cancel.cancel('new search');
      cancel = axios.CancelToken.source();
      Promise.allSettled([
         fetcher<PlayerCollection>(
            queryString.stringifyUrl({
               url: '/api/players',
               query: { search: value.trim(), includeScoreStats: false }
            }),
            { cancelToken: cancel.token, withCredentials: true }
         ),
         fetcher<LeaderboardInfoCollection>(
            queryString.stringifyUrl({
               url: '/api/leaderboards',
               query: {
                  search: value.trim(),
                  category: 2,
                  sort: 0
               }
            }),
            { cancelToken: cancel.token, withCredentials: true }
         )
      ])
         .then((result) => {
            let players = [];
            let leaderboards = [];
            if (result[0].status === 'fulfilled' && result[0].value?.players) {
               players = result[0].value.players;
            }
            if (result[1].status === 'fulfilled' && result[1].value?.leaderboards) {
               leaderboards = result[1].value.leaderboards;
            }
            searchResults = { players, leaderboards };
         })
         .catch(() => {
            searchResults = { players: [], leaderboards: [] };
         });
   };

   const handleInput = () => {
      searchResults = {
         players: [],
         leaderboards: [],
         loading: true,
         typing: true
      };
      focusElement = 0;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
         searchResults.typing = false;
         search(searchValue);
      }, 300);
   };

   function togglePlayersSection(event: MouseEvent | KeyboardEvent) {
      event.preventDefault();
      event.stopPropagation();
      playersCollapsed = !playersCollapsed;
      bounceCursor();
   }

   function toggleLeaderboardsSection(event: MouseEvent | KeyboardEvent) {
      event.preventDefault();
      event.stopPropagation();
      leaderboardsCollapsed = !leaderboardsCollapsed;
      bounceCursor();
   }
</script>

<div
   class="modal-background {visible ? 'is-visible' : ''}"
   on:click={() => setVisibility(false)}
   on:keydown={(e) => {
      if (e.key === 'Escape' || e.key === 'Enter') {
         e.preventDefault();
         e.stopPropagation();
         setVisibility(false);
      }
   }}
   tabindex="0"
   role="button"
   aria-label="Close search"
/>
<div class="modal-container {visible ? 'is-visible' : ''}">
   <div class="search-wrapper">
      <div class="search-box">
         <div class="search-icon">
            {#if !searchResults.loading}
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
               </svg>
            {:else if searchResults.typing}
               <img src="/images/typing.svg" alt="Waiting..." />
            {:else}
               <img src="/images/loading.svg" alt="Loading..." />
            {/if}
         </div>
         <input bind:value={searchValue} bind:this={inputBox} on:input={handleInput} on:keydown={handleKeydown} type="text" placeholder="Search" />
         <button on:click={() => setVisibility(false)} class="close" aria-label="close"
            ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg></button
         >
      </div>
      {#if searchResults.loading}
         <!-- loading -->
      {:else}
         <div class="search-results" bind:this={resultsElement}>
            <div class="results">
               {#if searchValue.length >= 3}
                  <div
                     class="section-title"
                     on:click={togglePlayersSection}
                     role="button"
                     tabindex="0"
                     on:keydown={(e) => e.key === 'Enter' && togglePlayersSection(e)}
                  >
                     <div class="section-title-content">
                        <i class="fa fa-chevron-{playersCollapsed ? 'right' : 'down'}" />
                        <span>Players</span>
                        <span class="count">({searchResults.players.length})</span>
                        <span class="shortcut">
                           <kbd>{isMac ? '⌘' : 'Ctrl'}</kbd>
                           <span class="separator">+</span>
                           <kbd>1</kbd>
                        </span>
                     </div>
                     <a href="/rankings?search={encodeURIComponent(searchValue)}" title="Advanced Search" on:click={(e) => e.stopPropagation()}>
                        <i class="fa fa-external-link-alt" />
                     </a>
                  </div>
               {/if}
               {#if !playersCollapsed}
                  {#each searchResults.players as player, i}
                     <div class="result {i == focusElement ? 'focus' : ''}">
                        <img src={player.profilePicture} alt={player.name} title={player.name} class="image rounded is-32x32" />
                        <div class="player-name"><PlayerLink {player} destination="/u/{player.id}" /></div>
                        <div class="rank">#{player.rank.toLocaleString(navigator?.language ?? 'en-AU')}</div>
                     </div>
                  {/each}
               {/if}
            </div>
            <div class="results">
               {#if searchValue.length >= 3}
                  <div
                     class="section-title"
                     on:click={toggleLeaderboardsSection}
                     role="button"
                     tabindex="0"
                     on:keydown={(e) => e.key === 'Enter' && toggleLeaderboardsSection(e)}
                  >
                     <div class="section-title-content">
                        <i class="fa fa-chevron-{leaderboardsCollapsed ? 'right' : 'down'}" />
                        <span>Leaderboards</span>
                        <span class="count">({searchResults.leaderboards.length})</span>
                        <span class="shortcut">
                           <kbd>{isMac ? '⌘' : 'Ctrl'}</kbd>
                           <span class="separator">+</span>
                           <kbd>2</kbd>
                        </span>
                     </div>
                     <a href="/leaderboards?search={encodeURIComponent(searchValue)}" title="Advanced Search" on:click={(e) => e.stopPropagation()}>
                        <i class="fa fa-external-link-alt" />
                     </a>
                  </div>
               {/if}
               {#if !leaderboardsCollapsed}
                  {#each searchResults.leaderboards as leaderboard, i}
                     {@const playersCount = playersCollapsed ? 0 : searchResults.players.length}
                     <div class="result map {i == focusElement - playersCount ? 'focus' : ''}">
                        <div><SmallSongInfo {leaderboard} margin={false} /></div>
                     </div>
                  {/each}
               {/if}
            </div>
         </div>
      {/if}
   </div>
</div>

<style>
   .modal-background {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.4);
      z-index: 500;
      opacity: 0;
      pointer-events: none;
      transition: all 0.25s ease;
   }

   .modal-background.is-visible {
      opacity: 1;
      pointer-events: all;
      backdrop-filter: blur(8px) saturate(180%);
      -webkit-backdrop-filter: blur(8px) saturate(180%);
   }

   .modal-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      margin: 0 auto;
      pointer-events: none;
      display: flex;
      justify-content: center;
      z-index: 500;
   }

   .search-wrapper {
      border-radius: 0.85rem;
      background: rgba(12, 12, 15, 0.85);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.1);
      height: min-content;
      width: 100%;
      max-width: 640px;
      opacity: 0;
      transition: all 0.25s ease;
      overflow: hidden;
      transform: translate3d(0, -30px, 0);
      box-shadow: 0 18px 45px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05);
   }

   .modal-container.is-visible .search-wrapper {
      pointer-events: all;
      opacity: 1;
      transform: none;
   }

   .search-wrapper .search-box {
      display: flex;
      align-items: center;
   }

   .search-results {
      max-height: calc(100vh - 251px);
      overflow: auto;
   }

   .results {
      display: flex;
      flex-direction: column;
   }

   .results .result {
      padding: 10px 15px;
      display: flex;
      gap: 10px;
      color: rgba(255, 255, 255, 0.9);
      align-items: center;
      position: relative;
      font-size: 1.25em;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      transition: background 0.2s ease;
   }

   .result.map {
      justify-content: space-between;
   }

   .result .player-name {
      flex: 1;
   }

   .results .rank {
      content: '⏎';
      border: solid 1px rgba(255, 255, 255, 0.2);
      flex: 1;
      max-width: min-content;
      padding: 3px 7px;
      border-radius: 5px;
      font-size: 0.8em;
      height: 29px;
      color: rgba(255, 255, 255, 0.7);
   }

   .results .result:focus,
   .results .result.focus {
      background: rgba(255, 255, 255, 0.08);
   }

   .results .result.focus::after {
      content: '⏎';
      border: solid 1px rgba(255, 255, 255, 0.3);
      padding: 5px 7px;
      border-radius: 5px;
      font-size: 0.5em;
      display: flex;
      align-items: center;
      color: rgba(255, 255, 255, 0.8);
   }

   .search-box input {
      flex: 1;
      background: transparent;
      border: 0;
      padding: 15px;
      font-size: 1.25em;
      color: #fff;
      cursor: text;
      line-height: 1.5;
      vertical-align: middle;
   }

   @media (max-width: 640px) {
      .search-box input {
         font-size: 16px;
      }
   }

   .search-box input:focus {
      outline: 0;
   }

   .section-title {
      padding: 15px;
      border-top: solid 1px rgba(255, 255, 255, 0.1);
      border-bottom: solid 1px rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.95);
      text-transform: uppercase;
      font-weight: bold;
      background: rgba(12, 12, 15, 0.95);
      backdrop-filter: blur(10px) saturate(180%);
      -webkit-backdrop-filter: blur(10px) saturate(180%);
      position: sticky;
      top: 0;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      user-select: none;
      transition: background 0.2s ease;
   }

   .section-title:hover {
      background: rgba(12, 12, 15, 0.98);
   }

   .section-title:focus {
      outline: 2px solid rgba(255, 215, 0, 0.5);
      outline-offset: -2px;
   }

   .section-title-content {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;
   }

   .section-title-content i {
      font-size: 0.85em;
      width: 12px;
      transition: transform 0.2s ease;
   }

   .section-title-content .count {
      font-size: 0.85em;
      opacity: 0.7;
      font-weight: normal;
   }

   .section-title-content .shortcut {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.75em;
      opacity: 0.6;
      margin-left: auto;
      margin-right: 10px;
   }

   .section-title-content .shortcut kbd {
      font-family: inherit;
      font-size: 0.7em;
      padding: 0.15rem 0.4rem;
      border-radius: 0.35rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
      background: rgba(255, 255, 255, 0.1);
      color: inherit;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      vertical-align: middle;
   }

   .section-title-content .shortcut .separator {
      opacity: 0.5;
      font-size: 0.8em;
   }

   .section-title a {
      display: flex;
      align-items: center;
      color: inherit;
      opacity: 0.7;
      transition: opacity 0.2s ease;
      margin-left: 10px;
   }

   .section-title a:hover {
      opacity: 1;
   }

   .close,
   .search-icon {
      width: 51px;
      background: transparent;
      border: 0;
      display: flex;
      padding: 15px;
      font-size: 2em;
      color: #fff;
      cursor: pointer;
      transition: color 0.2s ease, background 0.2s ease;
   }

   .close:hover {
      color: rgba(255, 255, 255, 0.8);
      background: rgba(255, 255, 255, 0.05);
   }

   .search-icon {
      padding-right: 0;
      width: 36px;
   }

   @media (min-width: 640px) {
      .search-wrapper {
         margin-top: 100px;
      }
   }
   @media (max-width: 640px) {
      .search-wrapper {
         height: 100%;
         border-radius: 0;
      }

      .search-results {
         max-height: calc(100% - 51px);
      }

      .section-title-content .shortcut {
         display: none;
      }
   }
</style>
