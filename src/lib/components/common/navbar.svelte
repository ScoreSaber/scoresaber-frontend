<script lang="ts">
   import { onMount } from 'svelte';
   import SearchView from '$lib/components/common/search.svelte';
   import { userData } from '$lib/global-store';
   import { API_URL, CDN_URL } from '../../utils/env';
   import fetcher from '$lib/utils/fetcher';
   $: loggedIn = $userData != undefined;
   let searchModal: SearchView;
   let userMenuVisible: boolean = false;

   const showSearchModal = () => searchModal?.setVisibility(true);

   onMount(() => {
      let burger = document.getElementsByClassName('navbar-burger')[0] as HTMLElement;
      if (burger) {
         burger.addEventListener('click', () => {
            let target = document.getElementById(burger.dataset['target'] || '');
            burger.classList.toggle('is-active');
            if (target) {
               target.classList.toggle('is-active');
            }
         });
      }
   });

   async function logout() {
      localStorage.removeItem('login-token');
      await fetcher('/api/auth/logout', { withCredentials: true });
      location.reload();
   }
</script>

<SearchView bind:this={searchModal} />

<header>
   <div class="container">
      <nav>
         <a href="/" class="logo-container"
            ><img src="/images/logo.svg" class="logo" alt="ScoreSaber" /><span class="navbar-label">ScoreSaber</span></a
         >
         <a href="/rankings" aria-label="Rankings"><i class="fa fa-medal" /><span class="navbar-label">Rankings</span></a>
         <a href="/leaderboards" aria-label="Maps"><i class="fa fa-map" /><span class="navbar-label">Maps</span></a>
      </nav>
      <button class="searchbox-container" on:click={showSearchModal}>
         <div class="fake-searchbox">
            <i class="fa fa-search" /><span><kbd>Ctrl</kbd> + <kbd>/</kbd></span>
         </div>
      </button>

      <nav>
         {#if !loggedIn}
            <a href="{API_URL}/api/auth/steam" aria-label="Log In" class="square"><i class="fa fa-user" /></a>
         {:else}
            <a
               href="javascript: void(0);"
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
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 100;
      background: #202020;
   }

   header .container {
      display: flex;
      justify-content: space-around;
      align-items: center;
   }

   @supports (backdrop-filter: blur(20px)) {
      header {
         background: #202020aa;
         backdrop-filter: blur(20px);
      }
   }

   header nav {
      display: flex;
      align-items: center;
      padding: 10px;
   }

   header nav:first-of-type {
      flex-grow: 1;
   }
   nav > a {
      padding: 10px 15px;
      color: inherit;
      transition: background 0.25s ease;
      border-radius: 5px;
      display: flex;
      align-items: center;
      gap: 10px;
      height: 41px;
   }

   nav > a.square {
      width: 41px;
      padding: 0;
      align-items: center;
      justify-content: center;
   }
   nav > a:hover {
      background: #fff2;
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
   }
   .userMenu a:hover {
      background: #fff2;
   }

   .userMenu::before {
      content: '';
      position: absolute;
      bottom: 100%;
      right: 20px;
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
      opacity: 0.2;
   }

   @media all and (max-width: 512px) {
      .fake-searchbox {
         gap: 0;
         width: 35px;
         justify-content: center;
         background: transparent;
         cursor: pointer;
         padding: 0;
         font-size: 1.25em;
      }

      .fake-searchbox:hover {
         background: #fff2;
      }

      header nav {
         gap: 5px;
      }
      .fake-searchbox span {
         display: none;
      }

      nav > a,
      .fake-searchbox {
         width: 41px;
         padding: 0;
         align-items: center;
         justify-content: center;
      }

      nav > a span {
         display: none;
      }
   }

   .searchbox-container {
      background: transparent;
      border: 0;
   }

   .fake-searchbox span {
      color: #555;
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
