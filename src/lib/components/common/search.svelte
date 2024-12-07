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
      const max = searchResults.leaderboards.length + searchResults.players.length - 1;
      if (focusElement > max) focusElement = 0;
      if (focusElement < 0) focusElement = max;
   };

   export const setVisibility = (value: boolean) => {
      visible = value;
      if (value) inputBox.focus();
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

   const handleKeydown = ({ key }: KeyboardEvent) => {
      switch (key) {
         case 'ArrowUp':
            focusElement--;
            bounceCursor();
            scrollToActive();
            break;
         case 'ArrowDown':
            focusElement++;
            bounceCursor();
            scrollToActive();
            break;
         case 'Enter':
            if (focusElement < searchResults.players.length && !searchResults.loading) {
               goto(`/u/${searchResults.players[focusElement].id}`);
            } else if (!searchResults.loading) {
               const leaderboard = searchResults.leaderboards[focusElement - searchResults.players.length];
               goto(`/leaderboard/${leaderboard.id}`);
            }
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
</script>

<div
   class="modal-background {visible ? 'is-visible' : ''}"
   on:click={() => setVisibility(false)}
   on:keydown={(e) => e.key === 'Enter' && setVisibility(false)}
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
         <input bind:value={searchValue} bind:this={inputBox} on:input={handleInput} on:keydown={handleKeydown} type="search" placeholder="Search" />
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
               {#if searchValue.length >= 2}
                  <div class="section-title">
                     <a href="/rankings?search={encodeURIComponent(searchValue)}" title="Advanced Search"
                        >Players <i class="fa fa-external-link-alt" /></a
                     >
                  </div>
               {/if}
               {#each searchResults.players as player, i}
                  <div class="result {i == focusElement ? 'focus' : ''}">
                     <img src={player.profilePicture} alt={player.name} title={player.name} class="image rounded is-32x32" />
                     <div class="player-name"><PlayerLink {player} destination="/u/{player.id}" /></div>
                     <div class="rank">#{player.rank.toLocaleString(navigator?.language ?? 'en-AU')}</div>
                  </div>
               {/each}
            </div>
            <div class="results">
               {#if searchValue.length > 3}
                  <div class="section-title">
                     <a href="/leaderboards?search={encodeURIComponent(searchValue)}" title="Advanced Search"
                        >Leaderboards <i class="fa fa-external-link-alt" /></a
                     >
                  </div>
               {/if}
               {#each searchResults.leaderboards as leaderboard, i}
                  <div class="result map {i == focusElement - searchResults.players.length ? 'focus' : ''}">
                     <div><SmallSongInfo {leaderboard} margin={false} /></div>
                  </div>
               {/each}
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
      background: #0003;
      z-index: 500;
      opacity: 0;
      pointer-events: none;
      transition: all 0.25s ease;
   }

   .modal-background.is-visible {
      opacity: 1;
      pointer-events: all;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
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
      border-radius: 5px;
      background: var(--gray);
      height: min-content;
      width: 100%;
      max-width: 640px;
      opacity: 0;
      transition: all 0.25s ease;
      overflow: hidden;
      transform: translate3d(0, -30px, 0);
      box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px,
         rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
   }

   .modal-container.is-visible .search-wrapper {
      pointer-events: all;
      opacity: 1;
      transform: none;
   }

   .search-wrapper .search-box {
      display: flex;
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
      color: #eee;
      align-items: center;
      position: relative;
      font-size: 1.25em;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
   }

   .result.map {
      justify-content: space-between;
   }

   .result .player-name {
      flex: 1;
   }

   .results .rank {
      content: '⏎';
      border: solid 1px #777;
      flex: 1;
      max-width: min-content;
      padding: 3px 7px;
      border-radius: 5px;
      font-size: 0.8em;
      height: 29px;
   }

   .results .result:focus,
   .results .result.focus {
      background: #0002;
   }

   .results .result.focus::after {
      content: '⏎';
      border: solid 1px #777;
      padding: 5px 7px;
      border-radius: 5px;
      font-size: 0.5em;
      display: flex;
      align-items: center;
   }

   .search-box input {
      flex: 1;
      background: transparent;
      border: 0;
      padding: 15px;
      font-size: 1.25em;
      color: #fff;
   }

   .search-box input:focus {
      outline: 0;
   }

   .section-title {
      padding: 15px;
      border-top: solid 1px #4a4a4a;
      border-bottom: solid 1px #4a4a4a;
      color: #eee;
      text-transform: uppercase;
      font-weight: bold;
      background: #323232;
      position: sticky;
      top: 0;
      z-index: 2;
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
   }
</style>
