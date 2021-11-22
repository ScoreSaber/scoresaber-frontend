<script lang="ts">
   import SearchView from '$lib/components/common/search.svelte';
   import { userData, searchView } from '$lib/global-store';
   import { API_URL, CDN_URL } from '$lib/utils/env';
   import fetcher from '$lib/utils/fetcher';
   import { onMount } from 'svelte';
   import Announcement from './announcement.svelte';
   $: loggedIn = $userData != undefined;
   let searchModal: SearchView;
   let userMenuVisible: boolean = false;
   let menuButton: HTMLAnchorElement;
   let isExpanded = false;
   let scrollProbe: HTMLDivElement;
   let headerIncreaseContrast = false;

   const showSearchModal = () => searchModal?.setVisibility(true);
   onMount(() => {
      searchView.set(searchModal);
      const observer = new IntersectionObserver(([probe]) => {
         headerIncreaseContrast = probe.intersectionRatio <= 0;
      });

      observer.observe(scrollProbe);
   });

   async function logout() {
      localStorage.removeItem('login-token');
      await fetcher('/api/auth/logout', { withCredentials: true });
      location.reload();
   }
   function handleWindowKeydown({ key, metaKey, ctrlKey, preventDefault, stopPropagation, stopImmediatePropagation }: KeyboardEvent) {
      if (key == 'Escape') return searchModal?.setVisibility(false);
      if (key == '/' && (metaKey || ctrlKey) && !searchModal.isVisible()) {
         searchModal?.setVisibility(true);
         preventDefault();
      }
   }
</script>

<SearchView bind:this={searchModal} />

<svelte:window
   on:click={({ target }) => {
      if ((loggedIn && target instanceof Node && menuButton.contains(target)) || menuButton == target) return;
      else {
         userMenuVisible = false;
      }
   }}
   on:keydown={handleWindowKeydown}
/>

<Announcement id="launch" rememberClose={true}>
   <div class="icon-container">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
         />
      </svg>
   </div>
   Welcome to the new ScoreSaber!<a href={'https://www.patreon.com/posts/58995454'}>&nbsp;Click here&nbsp;</a>to read our Patreon post! If you
   experience any bugs please report them in the<a class="announcement" target="_blank" rel="external" href="https://discord.gg/scoresaber"
      >&nbsp;Discord</a
   ></Announcement
>

<!-- This 0px tall div decides whether the header should be transparent or not,
   make sure not to put anyhting between it and the header element -->
<div bind:this={scrollProbe} />
<header class="{isExpanded ? 'expanded' : ''} {headerIncreaseContrast ? 'scrolled' : ''}">
   <div class="container">
      <button class="hamburger" on:click={() => (isExpanded = !isExpanded)}><i class="fa fa-bars" /></button>
      <nav>
         <a href="/" class="logo-container"
            ><img src="/images/logo.svg" class="logo" alt="ScoreSaber" /><span class="navbar-label"><strong>ScoreSaber</strong></span></a
         > <a href="/leaderboards" aria-label="Maps"><i class="fa fa-map" /><span class="navbar-label">Maps</span></a>
         <a href="/rankings" aria-label="Rankings"><i class="fa fa-medal" /><span class="navbar-label">Rankings</span></a>
         <a href="/ranking/requests" aria-label="Rank Requests"><i class="fa fa-list" /><span class="navbar-label">Rank Requests</span></a>
      </nav>
      <button class="searchbox-container" on:click={showSearchModal}>
         <div class="fake-searchbox">
            <i class="fa fa-search" /><span><kbd>Ctrl</kbd> + <kbd>/</kbd></span>
         </div>
      </button>

      <nav class="social">
         <a href="https://discord.gg/scoresaber" target="_blank" rel="external" title="Join our Discord!" class="square"
            ><i class="fab fa-discord fa-2x" /></a
         >
         <a href="https://www.patreon.com/scoresaber" target="_blank" rel="external" title="Support us on Patreon ❤️" class="square"
            ><i class="fab fa-patreon fa-2x" /></a
         >
         <a href="https://twitter.com/scoresaber" target="_blank" rel="external" title="Follow us on Twitter" class="square"
            ><i class="fab fa-twitter fa-2x" /></a
         >
         <div style="flex:1" />
         {#if !loggedIn}
            <a href="{API_URL}/api/auth/steam" aria-label="Log In" class="square" rel="external"><i class="fa fa-user" /></a>
         {:else}
            <a
               href={'javascript: void(0);'}
               bind:this={menuButton}
               class="user"
               on:click={({ preventDefault }) => {
                  userMenuVisible = !userMenuVisible;
               }}
            >
               <img src="{CDN_URL}/avatars/{$userData.playerId}.jpg" alt="" class="user-avatar" />
               <div class="userMenu {userMenuVisible ? 'visible' : ''}">
                  <a href="/u/{$userData.playerId}">My Profile</a>
                  <a href="/api/auth/logout" on:click={() => logout()}>Log Out</a>
               </div>
            </a>
         {/if}
      </nav>
   </div>
</header>

<style>
   header {
      position: sticky;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 100;
      transition: all 0.25s ease;
   }

   header.scrolled {
      background: #1c1c1c;
   }

   header .container {
      display: flex;
      justify-content: space-around;
      align-items: center;
      position: relative;
   }

   header nav {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 10px;
      position: relative;
   }

   header nav:first-of-type {
      flex-grow: 1;
   }
   nav > a,
   .hamburger {
      padding: 10px 15px;
      color: #eee;
      transition: background 0.25s ease;
      border-radius: 5px;
      display: flex;
      align-items: center;
      gap: 10px;
      height: 41px;
   }

   .hamburger {
      position: absolute;
      background: transparent;
      color: var(--textColor);
      top: 10px;
      display: none;
      right: 10px;
      z-index: 2;
      border: 0;
      padding: 15px;
   }

   nav > a.square,
   .hamburger {
      width: 41px;
      padding: 0;
      align-items: center;
      justify-content: center;
   }
   nav > a:hover,
   .hamburger:hover {
      background: #fff2;
      color: var(--scoreSaberYellow);
   }

   nav > a span {
      display: block;
   }

   .user-avatar {
      border-radius: 999px;
      width: 41px;
      transition: all 0.25s ease;
   }

   nav > a.user {
      width: 41px;
      padding: 0;
      border-radius: 99999px;
      align-items: center;
      justify-content: center;
   }

   .userMenu {
      position: absolute;
      top: 100%;
      right: 5px;
      color: #fff;
      background: #3e3e3e;
      border-radius: 5px;
      display: flex;
      flex-direction: column;
      width: 150px;
      pointer-events: none;
      opacity: 0;
      transform: translate3d(0, -10px, 0);
      transition: all 0.25s ease;
   }

   .userMenu a {
      display: block;
      color: #eee;
      padding: 10px 15px;
      filter: drop-shadow(0 5px 10px #0005);
   }
   .userMenu a:hover {
      background: #fff2;
   }

   .userMenu::before {
      content: '';
      position: absolute;
      bottom: 100%;
      right: 21px;
      display: block;
      width: 0;
      height: 0;
      border: solid 5px transparent;
      border-bottom-color: #3e3e3e;
   }

   .userMenu.visible {
      transform: none;
      opacity: 1;
      pointer-events: all;
   }

   .userMenu a {
      border-radius: 0;
   }

   .userMenu > :first-child {
      border-radius: 5px 5px 0 0;
   }

   .userMenu > :last-child {
      border-radius: 0 0 5px 5px;
   }

   nav > a .fa {
      display: block;
      font-size: 1.25em;
   }

   header nav:last-of-type {
      justify-content: end;
   }

   header nav,
   .searchbox-container {
      color: #eee;
   }
   .fake-searchbox {
      background: #ffffff28;
      padding: 5px 15px;
      cursor: text;
      border-radius: 5px;
      display: flex;
      align-items: center;
      height: 41px;
      width: 165px;
      justify-content: space-between;
   }
   .fake-searchbox kbd {
      padding: 2px 4px;
      color: #fff;
   }

   @media all and (max-width: 720px) {
      header {
         max-height: 61px;
      }

      header.expanded {
         max-height: 45vh;
         background-color: var(--background-color);
      }
      .hamburger {
         display: block;
      }
      .userMenu {
         top: unset;
         bottom: 100%;
      }
      .userMenu::before {
         bottom: unset;
         top: 100%;
         border: solid 5px transparent;
         border-top-color: #3e3e3e;
      }
      header {
         /* height: 61px; */
         overflow: hidden;
      }
      header .container {
         flex-direction: column;
         align-items: baseline;
         width: 100%;
      }

      header nav {
         flex-direction: column;
         align-items: flex-start;
         flex: 1;
         width: 100%;
      }

      header nav.social {
         flex-direction: row;
         margin-top: 5px;
      }

      .searchbox-container {
         padding: 0 10px;
         width: 100%;
      }
      .fake-searchbox {
         width: 100%;
      }
   }

   .searchbox-container {
      background: transparent;
      border: 0;
   }

   .fake-searchbox span {
      color: #fff;
      opacity: 0.2;
   }

   kbd {
      font-family: sans-serif;
      padding: 0 5px;
      border-radius: 5px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: solid 1px currentColor;
   }

   .logo {
      height: 1em;
      transform: scale(1.5);
      display: block;
   }
</style>
