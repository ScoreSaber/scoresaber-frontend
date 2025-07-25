<script lang="ts">
   import { onMount } from 'svelte';

   import { goto } from '$app/navigation';

   import { userData, searchView } from '$lib/stores/global-store';

   import SearchView from '$lib/components/common/search.svelte';
   import Announcement from '$lib/components/common/announcement.svelte';

   import { API_URL, CDN_URL } from '$lib/utils/env';
   import fetcher from '$lib/utils/fetcher';
   import permissions from '$lib/utils/permissions';

   $: loggedIn = false;
   $: showNormalPost = true;
   $: showPPFarmerPost = false;
   let searchModal: SearchView;
   let userMenuVisible = false;
   let menuButton: HTMLAnchorElement;
   let isExpanded = false;
   let scrollProbe: HTMLDivElement;
   let headerIncreaseContrast = false;
   let header: HTMLElement;

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

   function handleWindowKeydown({ key, metaKey, ctrlKey, preventDefault }: KeyboardEvent) {
      if (key == 'Escape') return searchModal?.setVisibility(false);
      if (key == '/' && (metaKey || ctrlKey) && !searchModal.isVisible()) {
         searchModal?.setVisibility(true);
         preventDefault();
      }
   }

   function handleClick() {
      isExpanded = false;
   }

   userData.subscribe((u) => {
      if (u) {
         loggedIn = true;
         if (
            permissions.checkPermissionNumber($userData.permissions, permissions.security.PPFARMER) ||
            permissions.checkPermissionNumber($userData.permissions, permissions.groups.ALL_STAFF)
         ) {
            showPPFarmerPost = true;
            showNormalPost = false;
            localStorage.setItem('bio', 'closed');
         }
      }
   });
</script>

<SearchView bind:this={searchModal} />

<svelte:window
   on:click={({ target }) => {
      if ((loggedIn && target instanceof Node && menuButton.contains(target)) || menuButton == target) return;
      else {
         userMenuVisible = false;
      }
      if (header && target instanceof Node && !header.contains(target)) {
         isExpanded = false;
      }
   }}
   on:keydown={handleWindowKeydown}
/>

<Announcement id="july-2025-ranked-batch" rememberClose={true}>
   <div class="announcement">
      <span>
         <i class="fab fa-youtube" />
         The July ScoreSaber Ranked Batch Overview video is out!
      </span>
      <span><a class="announcement-link" href="https://youtu.be/pAufYX8I7Fs" target="_blank" rel="noopener">Click here</a> to watch</span>
   </div>
</Announcement>

<!-- This 0px tall div decides whether the header should be transparent or not,
   make sure not to put anyhting between it and the header element -->
<div bind:this={scrollProbe} />
<header class="{isExpanded ? 'expanded' : ''} {headerIncreaseContrast ? 'scrolled' : ''}" bind:this={header}>
   <div class="container">
      <div
         class="hamburger hamburger--spin js-hamburger"
         on:click={() => (isExpanded = !isExpanded)}
         on:keydown={(e) => e.key === 'Enter' && (isExpanded = !isExpanded)}
         class:is-active={isExpanded}
         role="button"
         tabindex="0"
      >
         <div class="hamburger-box">
            <div class="hamburger-inner" />
         </div>
      </div>
      <nav>
         <a on:click={handleClick} href="/" class="logo-container"
            ><img src="/images/logo.svg" class="logo" alt="ScoreSaber" /><span class="navbar-label"><strong>ScoreSaber</strong></span></a
         > <a on:click={handleClick} href="/leaderboards" aria-label="Maps"><i class="fa fa-map" /><span class="navbar-label">Maps</span></a>
         <a on:click={handleClick} href="/rankings" aria-label="Rankings"><i class="fa fa-medal" /><span class="navbar-label">Rankings</span></a>
         <a on:click={handleClick} href="/ranking/requests" aria-label="Rank Requests"
            ><i class="fa fa-list" /><span class="navbar-label">Rank Requests</span></a
         >
         <a on:click={handleClick} href="/scores" aria-label="Rank Requests"><i class="fa fa-rss" /><span class="navbar-label">Score Feed</span></a>
      </nav>
      <button class="searchbox-container" on:click={showSearchModal}>
         <div class="fake-searchbox">
            <i class="fa fa-search" /><span><kbd>Ctrl</kbd> + <kbd>/</kbd></span>
         </div>
      </button>

      <nav class="social">
         <a href="https://discord.scoresaber.com" target="_blank" rel="external" title="Join our Discord!" class="square social"
            ><i class="fab fa-discord fa-2x" /></a
         >
         <a href="https://patreon.com/scoresaber" target="_blank" rel="external" title="Support us on Patreon ❤️" class="square social"
            ><i class="fab fa-patreon fa-2x" /></a
         >
         <a href="https://x.com/scoresaber" target="_blank" rel="external" title="Follow us on X" class="square social"
            ><i class="fab fa-x-twitter fa-2x" /></a
         >
         <div style="flex:1" />
         {#if !loggedIn}
            <a href="{API_URL}/api/auth/steam" aria-label="Log In" class="square" rel="external"><i class="fa fa-user" /></a>
         {:else}
            <a
               href={`/u/${$userData.playerId}`}
               bind:this={menuButton}
               class="user"
               on:click={(e) => {
                  if (e.ctrlKey || e.shiftKey) return;
                  if (e.target instanceof Image) e.preventDefault();
                  userMenuVisible = !userMenuVisible;
               }}
               on:dblclick={(e) => {
                  goto(`/u/${$userData.playerId}`);
               }}
            >
               <img src="{CDN_URL}/avatars/{$userData.playerId}.jpg" alt="" class="user-avatar" />
               <div class="userMenu {userMenuVisible ? 'visible' : ''}">
                  <a on:click={handleClick} href="/u/{$userData.playerId}">My Profile</a>
                  {#if !$userData.patronId}
                     <a href="{API_URL}/api/auth/patreon" class="square" rel="external">Link patreon account</a>
                  {/if}
                  <a href={''} on:click={() => logout()}>Log Out</a>
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

   @keyframes blurIn {
      from {
         background: transparent;
      }

      to {
         background: #1c1c1caa;
         backdrop-filter: saturate(1.5) blur(1rem);
      }
   }
   header.scrolled {
      background: #1c1c1c;
   }

   @supports (backdrop-filter: blur(1px)) {
      header.scrolled {
         background: #1c1c1caa;
         backdrop-filter: saturate(1.5) blur(1rem);
      }
   }

   @supports (backdrop-filter: blur(1px)) and (animation-timeline: scroll(y)) {
      header.scrolled {
         animation: blurIn 0.15s linear forwards;
         animation-timeline: scroll(y);
         animation-range: 0% 61px;
      }
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

   nav > a.square {
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
      width: 170px;
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

   .hamburger {
      padding: 5px 5px;
      display: inline-block;
      cursor: pointer;
      transition-property: opacity, filter;
      transition-duration: 0.15s;
      transition-timing-function: linear;
      font: inherit;
      color: inherit;
      text-transform: none;
      background-color: transparent;
      border: 0;
      margin: 0;
      overflow: visible;
      scale: 0.5;
   }

   .hamburger:hover {
      opacity: 0.7;
   }

   .hamburger.is-active:hover {
      opacity: 0.7;
   }

   .hamburger.is-active .hamburger-inner,
   .hamburger.is-active .hamburger-inner::before,
   .hamburger.is-active .hamburger-inner::after {
      background-color: rgba(255, 255, 255, 0.5);
   }

   .hamburger-box {
      width: 40px;
      height: 24px;
      display: inline-block;
      position: relative;
   }

   .hamburger-inner {
      display: block;
      top: 50%;
      margin-top: -2px;
   }

   .hamburger-inner,
   .hamburger-inner::before,
   .hamburger-inner::after {
      width: 40px;
      height: 4px;
      background-color: rgba(255, 255, 255, 0.5);
      border-radius: 4px;
      position: absolute;
      transition-property: transform;
      transition-duration: 0.15s;
      transition-timing-function: ease;
   }

   .hamburger-inner::before,
   .hamburger-inner::after {
      content: '';
      display: block;
   }

   .hamburger-inner::before {
      top: -10px;
   }

   .hamburger-inner::after {
      bottom: -10px;
   }

   .hamburger--spin .hamburger-inner {
      transition-duration: 0.22s;
      transition-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
   }

   .hamburger--spin .hamburger-inner::before {
      transition: top 0.1s 0.25s ease-in, opacity 0.1s ease-in;
   }

   .hamburger--spin .hamburger-inner::after {
      transition: bottom 0.1s 0.25s ease-in, transform 0.22s cubic-bezier(0.55, 0.055, 0.675, 0.19);
   }

   .hamburger--spin.is-active .hamburger-inner {
      transform: rotate(225deg);
      transition-delay: 0.12s;
      transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
   }

   .hamburger--spin.is-active .hamburger-inner::before {
      top: 0;
      opacity: 0;
      transition: top 0.1s ease-out, opacity 0.1s 0.12s ease-out;
   }

   .hamburger--spin.is-active .hamburger-inner::after {
      bottom: 0;
      transform: rotate(-90deg);
      transition: bottom 0.1s ease-out, transform 0.22s 0.12s cubic-bezier(0.215, 0.61, 0.355, 1);
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

   @media all and (min-width: 720px) {
      .hamburger {
         display: none;
      }
   }

   @media screen and (min-width: 721px) and (max-width: 872px) {
      a.social {
         display: none;
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
      height: 25px;
      width: 25px;
      /* height: 1em;
      transform: scale(1.5); */
      display: block;
   }

   /* .image-container {
      flex-shrink: 0;
   } */

   .announcement-link {
      color: #fff;
      font-weight: 600;
      text-decoration: underline;
      transition: color 300ms;
   }
   .announcement-link:hover {
      color: var(--scoreSaberYellow);
   }
</style>
