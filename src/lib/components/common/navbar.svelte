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
<nav id="navbar" class="navbar has-border is-fixed-top" aria-label="main navigation">
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
</nav>

<style>
   .navbar-menu {
      background-color: var(--foreground);
   }

   .navbar.has-border {
      background-color: var(--foreground);
      border-bottom: 1px solid var(--borderColor);
   }

   .navbar {
      background-color: var(--foreground);
   }

   .navbar-item,
   .navbar-item:hover,
   .navbar-item:focus {
      color: var(--scoreSaberYellow);
      background-color: var(--foreground);
      border: 0;
   }

   .navbar-item {
      color: var(--textColor);
   }

   .navbar-link,
   .navbar-link:hover,
   .navbar-link:focus {
      color: var(--scoreSaberYellow);
      background-color: var(--foreground);
      border: 0;
   }

   .navbar-item.has-dropdown:focus .navbar-link,
   .navbar-item.has-dropdown:hover .navbar-link {
      background-color: var(--foreground);
   }
   .navbar-link {
      color: var(--textColor);
   }

   .navbar-link:hover {
      background-color: var(--foreground);
   }

   .navbar-dropdown {
      border-top: 2px solid var(--background);
      background-color: var(--foreground);
   }

   .navbar-item:hover {
      background-color: var(--foreground);
   }

   .navbar-item:active {
      background-color: var(--foreground);
   }

   .fake-searchbox {
      background: #3c3c3c;
      padding: 5px 10px;
      cursor: text;
      border-radius: 5px;
      display: flex;
      align-items: center;
      gap: 60px;
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

   .navbar-burger.is-button {
      background-color: transparent;
      border: none;
      outline: none;
   }

   .navbar-burger.is-button:hover {
      color: var(--scoreSaberYellow);
   }
   .logo {
      width: 28px;
      height: 28px;
      margin-top: 2px;
      margin-right: 7px;
   }
   .fas {
      padding-right: 5px;
   }
</style>
