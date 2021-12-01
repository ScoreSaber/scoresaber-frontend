<script lang="ts">
   // @ts-nocheck
   import fetcher from '$lib/utils/fetcher';
   import poster from '$lib/utils/poster';
   import type { UserData, TokenResponse } from '$lib/models/UserData';
   import { background, userData, snowVisible } from '$lib/global-store';
   import { useAccio } from '$lib/utils/accio';
   import Navbar from '$lib/components/common/navbar.svelte';
   import Footer from '$lib/components/common/footer.svelte';
   import '../styles/scoresaber.scss';
   import { fly } from 'svelte/transition';
   import { browser } from '$app/env';
   import { page } from '$app/stores';

   let tokenCheckAttempts: number = 0;

   async function onUserCheckSuccess() {
      userData.set($user);
      const token = await fetcher<TokenResponse>('/api/auth/getToken', { withCredentials: true });
      localStorage.setItem('login-token', token.token);
      console.log(`Logged in as ${$user.playerId}`);
   }

   async function onUserCheckFailed() {
      let token = localStorage.getItem('login-token');
      if (token != undefined) {
         if (tokenCheckAttempts < 3) {
            const result = await poster('/api/auth/checkToken', { token: token }, { withCredentials: true });
            if (result.status === 200) {
               refreshLogin({ forceRevalidate: true });
               tokenCheckAttempts++;
            } else {
               localStorage.removeItem('login-token');
            }
         }
      }
   }

   const {
      data: user,
      error: loginError,
      refresh: refreshLogin
   } = useAccio<UserData>('/api/user/@me', { fetcher, onSuccess: onUserCheckSuccess, onError: onUserCheckFailed, ignoreSubscriptions: true });

   if (browser) {
      page.subscribe((p) => {
         document.body.style.position = '';
         document.body.style.top = '';
         document.body.style.overflow = '';
         document.body.style.width = '';
         window.scrollTo(0, scrollY);
         if (typeof gtag !== 'undefined') {
            gtag('config', 'UA-121352342-1', {
               page_path: $page.path
            });
         }
      });
   }
</script>

<div class="root">
   <div class="behind-background" />
   {#key $background}
      <div transition:fly={{ y: -20, duration: 1300 }} class="dynamic-background" style={`--background: ${$background};`} />
   {/key}
   <div class="cover" />
   <Navbar />
   <div id="snow" class="snow {$snowVisible ? 'visible' : ''}">
      {#each Array(30) as _, i}
         <div class="snowflake" />
      {/each}
   </div>
   <div class="page-container content">
      <slot />
   </div>
   <Footer />
</div>

<style lang="scss" global>
   html {
      overflow: auto;
   }
   .root {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
   }
   .content {
      flex: 1;
   }

   .snow {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      z-index: 9999999;
      opacity: 0;
   }
   .visible {
      opacity: 100;
   }
   .snowflake {
      --size: 1vw;
      width: var(--size);
      height: var(--size);
      background: linear-gradient(white, white);
      border-radius: 50%;
      position: absolute;
      top: -5vh;
      z-index: 9999999;
   }
   @keyframes snowfall {
      0% {
         transform: translate3d(var(--left-ini), 0, 0);
      }
      100% {
         transform: translate3d(var(--left-end), 110vh, 0);
      }
   }

   @for $i from 1 through 30 {
      .snowflake:nth-child(#{$i}) {
         --size: #{random(5) * 0.2}vw;
         --left-ini: #{random(20) - 10}vw;
         --left-end: #{random(20) - 10}vw;
         left: #{random(100)}vw;
         animation: snowfall #{5 + random(10)}s linear infinite;
         animation-delay: -#{random(10)}s;
      }
   }

   .snowflake:nth-child(6n) {
      filter: blur(1px);
   }

   .snowflake:nth-child(4n) {
      filter: blur(1px);
      filter: drop-shadow(0 0 5px white);
   }
</style>
