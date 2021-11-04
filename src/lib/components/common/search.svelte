<script lang="ts">
   import type { Player } from '$lib/models/PlayerData';
   import type { LeaderboardInfo } from '$lib/models/LeaderboardData';
   import queryString from 'query-string';
   import fetcher from '$lib/utils/fetcher';
   import axios from 'axios';
   import CountryImage from '../image/country-image.svelte';
   let searchValue = '';
   let inputBox: HTMLInputElement;
   let visible = false;
   let focusElement: number = 0;
   let resultsElement: HTMLDivElement;

   const diffNames = ['E', 'N', 'H', 'X', 'X+'];
   const colours = {
      Easy: '#4eb677',
      Normal: '#66b2ea',
      Hard: '#fc6e51',
      Expert: '#c23a4c',
      ExpertPlus: '#904fd4'
   };

   interface SearchResults {
      players: Player[] | 'loading';
      leaderboards: LeaderboardInfo[] | 'loading';
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

   let debounceTimer;

   const scrollToActive = () => {
      const target = resultsElement.querySelectorAll(`a.result`)[Math.max(0, focusElement - 1)];
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
            if (focusElement < searchResults.players.length && searchResults.players !== 'loading') {
               location.href = `/u/${searchResults.players[focusElement].id}`;
            } else if (searchResults.leaderboards !== 'loading') {
               const leaderboard = searchResults.leaderboards[focusElement - searchResults.players.length];
               location.href = `/leaderboard/${leaderboard.id}`;
            }
      }
      console.log(focusElement);
   };

   let cancel = axios.CancelToken.source();

   const absorbCancel = (thrown) => {
      if (axios.isCancel(thrown)) {
         console.log('request canceled');
      } else {
         console.error(thrown);
      }
   };

   const handleInput = () => {
      searchResults = {
         players: [],
         leaderboards: []
      };
      focusElement = 0;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
         cancel.cancel('new search');

         cancel = axios.CancelToken.source();

         fetcher<Player[]>(
            queryString.stringifyUrl({
               url: '/api/players',
               query: { search: searchValue }
            }),
            { cancelToken: cancel.token }
         ).then((players) => (searchResults.players = players));
         fetcher<LeaderboardInfo[]>(
            queryString.stringifyUrl({
               url: '/api/leaderboards',
               query: { search: searchValue }
            }),
            { cancelToken: cancel.token }
         )
            .then((leaderboards) => (searchResults.leaderboards = leaderboards))
            .catch(absorbCancel);
      }, 200);
   };

   function handleWindowKeydown({ key, metaKey, ctrlKey, preventDefault, stopPropagation, stopImmediatePropagation }: KeyboardEvent) {
      if (key == 'Escape') return setVisibility(false);
      if (key == '/' && (metaKey || ctrlKey) && !visible) {
         setVisibility(true);
         preventDefault();
      }
   }
</script>

<svelte:window on:keydown={handleWindowKeydown} />
<div class="modal-background {visible ? 'is-visible' : ''}" on:click={() => setVisibility(false)} />
<div class="modal-container {visible ? 'is-visible' : ''}">
   <div class="search-wrapper">
      <div class="search-box">
         <div class="search-icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
         </div>
         <input bind:value={searchValue} bind:this={inputBox} on:input={handleInput} on:keydown={handleKeydown} type="search" placeholder="Search" />
         <button on:click={() => setVisibility(false)} class="close" aria-label="close"
            ><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg></button
         >
      </div>
      <div class="search-results" bind:this={resultsElement}>
         <div class="results">
            {#if searchResults.players == 'loading'}
               <div>Loading...</div>
            {:else}
               {#if searchResults.players.length > 0}
                  <div class="section-title">
                     <a href="/rankings?search={encodeURIComponent(searchValue)}" title="Advanced Search"
                        >Players <i class="fa fa-external-link-alt" /></a
                     >
                  </div>
               {/if}
               {#each searchResults.players as player, i}
                  <a href="/u/{player.id}" class="result {i == focusElement ? 'focus' : ''}">
                     <img src={player.profilePicture} alt={player.name} title={player.name} class="image rounded is-32x32" />
                     <span class="player-name"><CountryImage country={player.country} /> {player.name}</span>
                     <span class="rank">#{player.rank.toLocaleString('en-US')}</span></a
                  >
               {/each}
            {/if}
         </div>
         <div class="results">
            {#if searchResults.leaderboards == 'loading'}
               loading...
            {:else}
               {#if searchResults.leaderboards.length > 0}
                  <div class="section-title">
                     <a href="/leaderboards?search={encodeURIComponent(searchValue)}" title="Advanced Search"
                        >Leaderboards <i class="fa fa-external-link-alt" /></a
                     >
                  </div>
               {/if}
               {#each searchResults.leaderboards as leaderboard, i}
                  <a href="/leaderboard/{leaderboard.id}" class="result map-result {i == focusElement - searchResults.players.length ? 'focus' : ''}">
                     <div class="cover-art">
                        <img src={leaderboard.coverImage} alt={leaderboard.songName} />
                        <div class="difficulty-badge" style="background-color: {colours[leaderboard.difficultyRaw.replace(/_(.*?)_.*/, '$1')]}">
                           {leaderboard.stars ? `★ ${leaderboard.stars}` : leaderboard.difficultyRaw.replace(/_(.*?)_.*/, '$1').replace('Plus', '+')}
                        </div>
                     </div>
                     <div class="song-info">
                        <div class="song-name">{leaderboard.songName}</div>
                        <div class="song-artist">{leaderboard.songAuthorName}</div>
                        <div class="mapper">{leaderboard.levelAuthorName}</div>
                     </div>
                  </a>
               {/each}
            {/if}
         </div>
      </div>
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
      background: #373737;
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

   .result .player-name {
      flex: 1;
   }

   .results .map-result {
      display: grid;
      grid-template-columns: 100px calc(100% - 100px);
      gap: 10px;
      padding: 5px;
   }

   .map-result .song-name {
      font-size: 1.5em;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: bold;
      grid-row: 2;
   }
   .map-result .song-artist {
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
   }

   .song-info {
      width: 100%;
      padding-right: 15px;
      display: flex;
      flex-direction: column;
   }
   .map-result .cover-art {
      position: relative;
      padding: 10px;
      width: 100px;
      height: 100px;
      flex-shrink: 0;
      overflow: hidden;
   }

   .map-result .cover-art img {
      border-radius: 5px;
      background: #555;
      width: 100%;
      height: 100%;
      object-fit: cover;
   }

   .cover-art .difficulty-badge {
      position: absolute;
      bottom: 0;
      right: 0;
      padding: 3px 7px;
      font-size: 0.8em;
      border-radius: 5px;
      font-weight: bold;
      display: flex;
      gap: 5px;
   }

   .results .result:hover,
   .results .result:focus,
   .results .result.focus {
      background: #4a4a4a;
   }

   .results .result.focus::after {
      content: '⏎';
      border: solid 1px #777;
      padding: 5px 7px;
      border-radius: 5px;
      font-size: 0.5em;
      height: 29px;
      display: flex;
      align-items: center;
   }

   .map-result.result.focus::after {
      position: absolute;
      right: 15px;
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
