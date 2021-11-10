<script lang="ts">
   import { onMount } from 'svelte';
   import SearchView from '$lib/components/common/search.svelte';
   import { userData } from '$lib/global-store';
   import { API_URL } from '../../utils/env';
   import fetcher from '$lib/utils/fetcher';
   $: loggedIn = $userData != undefined;
   let searchModal: SearchView;

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
<!-- <nav id="navbar" class="navbar has-border is-fixed-top" aria-label="main navigation">
   <div class="container">
      <div class="navbar-brand">
         <a href="/" class="navbar-item">
            <img src="/images/logo.svg" class="logo" alt="Logo" />
            <b>ScoreSaber</b>
         </a>
         <button class="navbar-burger is-button" data-target="navMenu" aria-label="menu" aria-expanded="false">
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
         </button>
      </div>
      <div class="navbar-menu" id="navMenu">
         <div class="navbar-start">
            <a href="https://scoresaber.com" class="navbar-item">
               <i class="fas fa-trophy" />
               Leaderboards
            </a>
            <a href="/rankings" class="navbar-item">
               <i class="fas fa-medal" />
               Player Rankings
            </a>
            <a href="/ranking/requests" class="navbar-item">
               <i class="fas fa-tasks" />
               Rank Requests
            </a>
            {#if !loggedIn}
               <a href={`${API_URL}/api/auth/steam`} class="navbar-item">
                  <i class="fas fa-user" />
                  Login
               </a>
            {:else}
               <div class="navbar-item has-dropdown is-hoverable">
                  <a href={''} class="navbar-link"> Profile </a>
                  <div class="navbar-dropdown">
                     <a href={`/u/${$userData.playerId}`} class="navbar-item">
                        <i class="fas fa-user" />
                        My Profile
                     </a>
                     <a href={`#`} on:click={() => logout()} class="navbar-item">
                        <i class="fas fa-user-times" />
                        Sign out
                     </a>
                  </div>
               </div>
            {/if}
         </div>
         <div class="navbar-end">
            <a class="navbar-item" target="_blank" rel="noopener noreferrer" href="https://discord.gg/scoresaber">
               <i class="fab fa-discord fa-2x" title="Join the ScoreSaber Discord!" />
            </a>
            <a class="navbar-item" target="_blank" rel="noopener noreferrer" href="https://twitter.com/ScoreSaber">
               <i class="fab fa-twitter fa-2x" title="Follow us on Twitter for updates!" />
            </a>
            <a class="navbar-item donate" target="_blank" rel="noopener noreferrer" href="https://www.patreon.com/scoresaber">
               <i class="fab fa-gratipay fa-2x" title="Support us on Patreon!" />
            </a>
            <button class="navbar-item" on:click={showSearchModal}>
               <div class="fake-searchbox">
                  <i class="fa fa-search" /><span><kbd>Ctrl</kbd> + <kbd>/</kbd></span>
               </div>
            </button>
         </div>
      </div>
   </div>
</nav> -->

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
      <nav><a href="{API_URL}/api/auth/steam" aria-label="Log In" class="square"><i class="fa fa-user" /></a></nav>
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
   header nav a {
      padding: 10px 15px;
      color: inherit;
      border-radius: 5px;
      display: flex;
      align-items: center;
      gap: 10px;
      height: 41px;
   }

   header nav a.square {
      width: 41px;
      padding: 0;
      align-items: center;
      justify-content: center;
   }
   header nav a:hover {
      background: #fff2;
   }

   header nav a span {
      display: block;
   }

   header nav a .fa {
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

      header nav a,
      .fake-searchbox {
         width: 41px;
         padding: 0;
         align-items: center;
         justify-content: center;
      }

      header nav a span {
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
