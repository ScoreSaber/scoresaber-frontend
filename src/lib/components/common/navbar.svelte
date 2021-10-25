<script lang="ts">
   import { onMount } from 'svelte';

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
</script>

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
            <a href to="/ranking/requests" class="navbar-item">
               <i class="fas fa-tasks" />
               Rank Requests
            </a>
            <a href="/" class="navbar-item">
               <i class="fas fa-book" />
               Wiki
            </a>
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

   a.navbar-item,
   a.navbar-item:hover,
   a.navbar-item:focus {
      color: var(--scoreSaberYellow);
      background-color: var(--foreground);
   }

   a.navbar-item {
      color: var(--textColor);
   }

   a.navbar-item:hover {
      background-color: var(--foreground);
   }

   a.navbar-item:active {
      background-color: var(--foreground);
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
