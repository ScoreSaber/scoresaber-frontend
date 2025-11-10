<script lang="ts">
   import { slide } from 'svelte/transition';

   import { page } from '$app/stores';

   import { userData } from '$lib/stores/global-store';

   import Announcement from '$lib/components/common/announcement.svelte';
   import Footer from '$lib/components/common/footer.svelte';

   import { API_URL, CDN_URL } from '$lib/utils/env';
   import fetcher from '$lib/utils/fetcher';
   import { navItems, isCurrent } from '$lib/utils/nav-utils';
   import { useAccio } from '$lib/utils/accio';

   import type { Player } from '$lib/models/PlayerData';

   import { rankedBatch, getYouTubeUrl, getAnnouncementMessage } from '$lib/config/ranked-batch';

   export let isOpen: boolean;
   export let onClose: () => void;
   export let onNavSelect: () => void;

   let loggedIn = false;
   let playerId = '';
   let showPatreonLink = false;
   let profileExpanded = false;

   let touchStartX = 0;
   let touchStartY = 0;
   let isSwiping = false;
   let swipeOffset = 0;
   let asideElement: HTMLElement | null = null;
   const SWIPE_DISTANCE_THRESHOLD = 50;

   $: {
      const data = $userData;
      loggedIn = Boolean(data);
      playerId = data?.playerId ?? '';
      showPatreonLink = Boolean(data) && !data?.patronId;
   }

   $: playerDataUrl = loggedIn && playerId ? `/api/player/${playerId}/full` : '';

   const { data: playerData, refresh: refreshPlayerData } = useAccio<Player>(playerDataUrl, {
      fetcher,
      ignoreSubscriptions: true
   });

   $: if (playerDataUrl && playerDataUrl !== '') {
      refreshPlayerData({ newUrl: playerDataUrl, bypassInitialCheck: true });
   }

   $: username = $playerData?.name ?? '';

   function toggleProfile(event: MouseEvent) {
      event.stopPropagation();
      event.preventDefault();
      profileExpanded = !profileExpanded;
   }

   async function logout() {
      onClose();
      localStorage.removeItem('login-token');
      try {
         await fetcher('/api/auth/logout', { withCredentials: true });
      } finally {
         location.reload();
      }
   }

   function handleTouchStart(event: TouchEvent) {
      if (!isOpen) {
         return;
      }

      const touch = event.touches[0];
      if (!touch) {
         return;
      }

      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      isSwiping = true;
      swipeOffset = 0;
   }

   function handleTouchMove(event: TouchEvent) {
      if (!isSwiping || !isOpen) {
         return;
      }

      const touch = event.touches[0];
      if (!touch) {
         return;
      }

      const deltaX = touch.clientX - touchStartX;
      const deltaY = Math.abs(touch.clientY - touchStartY);

      // Only proceed if horizontal movement is greater than vertical (horizontal swipe)
      if (deltaX > 0 && deltaX > deltaY) {
         event.preventDefault();
         swipeOffset = Math.min(deltaX, asideElement?.offsetWidth ?? 0);
         if (asideElement) {
            asideElement.style.transform = `translateX(${swipeOffset}px)`;
            asideElement.style.transition = 'none';
         }
      } else if (deltaX <= 0) {
         // Reset if swiping left
         swipeOffset = 0;
         if (asideElement) {
            asideElement.style.transform = '';
            asideElement.style.transition = '';
         }
      }
   }

   function handleTouchEnd(event: TouchEvent) {
      if (!isSwiping || !isOpen) {
         isSwiping = false;
         swipeOffset = 0;
         return;
      }

      const touch = event.changedTouches[0];
      if (!touch) {
         isSwiping = false;
         swipeOffset = 0;
         if (asideElement) {
            asideElement.style.transform = '';
            asideElement.style.transition = '';
         }
         return;
      }

      const deltaX = touch.clientX - touchStartX;
      const deltaY = Math.abs(touch.clientY - touchStartY);

      // Reset transform styles
      if (asideElement) {
         asideElement.style.transform = '';
         asideElement.style.transition = '';
      }

      // Check if it's a valid horizontal swipe from left to right
      if (deltaX > SWIPE_DISTANCE_THRESHOLD && deltaX > deltaY) {
         onClose();
      }

      isSwiping = false;
      swipeOffset = 0;
   }
</script>

<button type="button" class="mobile-overlay" class:visible={isOpen} on:click={onClose} aria-label="Close navigation" tabindex={isOpen ? 0 : -1} />

<aside
   id="mobile-navigation"
   class:open={isOpen}
   aria-hidden={!isOpen}
   bind:this={asideElement}
   on:touchstart={handleTouchStart}
   on:touchmove={handleTouchMove}
   on:touchend={handleTouchEnd}
>
   <div class="mobile-header">
      <button type="button" aria-label="Close menu" on:click={onClose}>
         <i class="fa fa-times" />
      </button>
   </div>

   <Announcement id={rankedBatch.announcementId} rememberClose={true} mobile={true}>
      <i class="fab fa-youtube" />
      {getAnnouncementMessage(rankedBatch.month)}{' '}
      <a class="announcement-link" href={getYouTubeUrl(rankedBatch.videoId)} target="_blank" rel="noopener">Click here</a> to watch
   </Announcement>

   {#if !loggedIn}
      <a class="mobile-login" href={`${API_URL}/api/auth/steam`} rel="external">Log In</a>
   {:else}
      <div class="mobile-user">
         <button type="button" class="profile-toggle" on:click={toggleProfile}>
            <div class="avatar-row">
               <img src={`${CDN_URL}/avatars/${playerId}.jpg`} alt="" />
               {#if username}
                  <span class="username">{username}</span>
               {/if}
            </div>
            {#if profileExpanded}
               <i class="fa fa-chevron-up" />
            {:else}
               <i class="fa fa-chevron-down" />
            {/if}
         </button>

         {#if profileExpanded}
            <div class="profile-options" transition:slide={{ duration: 200 }}>
               <a href={`/u/${playerId}`} on:click={onNavSelect}>My Profile</a>
               {#if showPatreonLink}
                  <a href={`${API_URL}/api/auth/patreon`} rel="external">Link Patreon account</a>
               {/if}
               <button type="button" on:click={logout}>Log Out</button>
            </div>
         {/if}
      </div>
   {/if}

   {#if loggedIn}
      <div class="separator" />
   {/if}

   <nav class="mobile-nav" aria-label="Mobile navigation">
      <a href="/" class:current={isCurrent('/', $page.url.pathname)} on:click={onNavSelect} data-sveltekit-preload-code>
         <i class="fa fa-home" />
         <span>Home</span>
      </a>
      {#each navItems as item}
         <a href={item.href} class:current={isCurrent(item.href, $page.url.pathname)} on:click={onNavSelect} data-sveltekit-preload-code>
            <i class={item.icon} />
            <span>{item.label}</span>
         </a>
      {/each}
   </nav>

   <Footer mobile={true} />
</aside>

<style>
   .mobile-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.45);
      opacity: 0;
      border: 0;
      padding: 0;
      cursor: pointer;
      pointer-events: none;
      transition: opacity 0.25s ease;
      z-index: 90;
   }

   .mobile-overlay.visible {
      opacity: 1;
      pointer-events: auto;
   }

   aside {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: min(22rem, 85vw);
      background: var(--background-color);
      transform: translateX(100%);
      transition: transform 0.3s ease;
      z-index: 100;
      display: flex;
      flex-direction: column;
      padding: 1.5rem;
      gap: 1.5rem;
      overflow-y: auto;
      overflow-x: hidden;
   }

   aside.open {
      transform: translateX(0);
      box-shadow: -24px 0 48px rgba(0, 0, 0, 0.45);
   }

   .mobile-header {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      color: var(--textColor);
   }

   .mobile-header button {
      border: 0;
      background: none;
      color: inherit;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.35rem;
      border-radius: 0.6rem;
   }

   .mobile-header button:hover {
      background: rgba(255, 255, 255, 0.08);
   }

   .mobile-nav {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
   }

   .mobile-nav a {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-radius: 0.9rem;
      background: rgba(255, 255, 255, 0.04);
      color: rgba(255, 255, 255, 0.85);
      transition: background 0.2s ease, color 0.2s ease;
   }

   .mobile-nav a.current {
      background: rgba(255, 215, 0, 0.14);
      color: var(--scoreSaberYellow);
      box-shadow: inset 0 0 0 1px rgba(255, 215, 0, 0.3);
   }

   .mobile-nav a:hover {
      background: rgba(255, 255, 255, 0.08);
   }

   .mobile-login {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.9rem 1rem;
      border-radius: 0.9rem;
      background: linear-gradient(135deg, rgba(255, 215, 0, 0.85), rgba(255, 166, 0, 0.85));
      color: #0c0c0f;
      font-weight: 600;
      text-decoration: none;
   }

   .mobile-user {
      display: flex;
      flex-direction: column;
      gap: 0.55rem;
   }

   .profile-toggle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      padding: 0.65rem 0.75rem;
      border-radius: 0.75rem;
      border: 0;
      background: rgba(255, 255, 255, 0.04);
      color: rgba(255, 255, 255, 0.85);
      font: inherit;
      cursor: pointer;
      transition: background 0.2s ease, color 0.2s ease;
   }

   .profile-toggle:hover {
      background: rgba(255, 255, 255, 0.08);
   }

   .avatar-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex: 1;
   }

   .avatar-row img {
      width: 2.75rem;
      height: 2.75rem;
      border-radius: 999px;
      object-fit: cover;
      flex-shrink: 0;
   }

   .username {
      color: rgba(255, 255, 255, 0.85);
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
   }

   .profile-toggle i {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.85rem;
      transition: transform 0.2s ease, color 0.2s ease;
      flex-shrink: 0;
   }

   .profile-options {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      padding-left: 0.5rem;
   }

   .profile-options a,
   .profile-options button {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.65rem 0.75rem;
      border-radius: 0.75rem;
      border: 0;
      background: rgba(255, 255, 255, 0.04);
      color: rgba(255, 255, 255, 0.85);
      font: inherit;
      cursor: pointer;
      text-align: left;
      transition: background 0.2s ease, color 0.2s ease;
   }

   .profile-options a:hover,
   .profile-options button:hover {
      background: rgba(255, 255, 255, 0.08);
      color: var(--scoreSaberYellow);
   }

   .separator {
      height: 1px;
      background: rgba(255, 255, 255, 0.1);
      margin: 0.5rem 0;
   }

   @media (min-width: 961px) {
      .mobile-overlay {
         display: none;
      }

      aside {
         display: none;
      }
   }
</style>
