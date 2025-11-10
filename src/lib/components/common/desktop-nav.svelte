<script lang="ts">
   import { goto } from '$app/navigation';
   import { page } from '$app/stores';

   import { userData } from '$lib/stores/global-store';

   import { API_URL, CDN_URL } from '$lib/utils/env';
   import fetcher from '$lib/utils/fetcher';
   import { navItems, socialLinks, isCurrent } from '$lib/utils/nav-utils';

   export let searchModal: { setVisibility: (visible: boolean) => void } | null;
   export let isMac: boolean;
   export let onNavSelect: () => void;

   let accountRegion: HTMLDivElement | null = null;
   let userMenuVisible = false;
   let loggedIn = false;
   let playerId = '';
   let showPatreonLink = false;

   $: {
      const data = $userData;
      loggedIn = Boolean(data);
      playerId = data?.playerId ?? '';
      showPatreonLink = Boolean(data) && !data?.patronId;
   }

   function showSearchModal() {
      searchModal?.setVisibility(true);
   }

   async function logout() {
      localStorage.removeItem('login-token');
      try {
         await fetcher('/api/auth/logout', { withCredentials: true });
      } finally {
         location.reload();
      }
   }

   function handleUserMenuClick(event: MouseEvent) {
      if (event.ctrlKey || event.shiftKey) {
         return;
      }

      if (event.target instanceof HTMLImageElement) {
         event.preventDefault();
      }

      userMenuVisible = !userMenuVisible;
   }

   function handleClickOutside(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Node)) {
         return;
      }

      if (loggedIn && !accountRegion?.contains(target)) {
         userMenuVisible = false;
      }
   }
</script>

<svelte:window on:click={handleClickOutside} />

<nav class="primary" aria-label="Primary navigation">
   {#each navItems as item}
      <a
         href={item.href}
         aria-label={item.ariaLabel ?? item.label}
         class:current={isCurrent(item.href, $page.url.pathname)}
         on:click={onNavSelect}
         data-sveltekit-preload-code
      >
         <i class={item.icon} />
         <span>{item.label}</span>
      </a>
   {/each}
</nav>

<div class="spacer" />

<div class="actions">
   <button type="button" class="search-trigger desktop-search-trigger" on:click={showSearchModal} aria-label="Open search">
      <i class="fa fa-search" />
      <span class="shortcut">
         {#if isMac}
            <kbd>⌘</kbd>
         {:else}
            <kbd>Ctrl</kbd>
         {/if}
         <span class="separator">+</span>
         <kbd>K</kbd>
      </span>
   </button>

   <nav class="social" aria-label="Social links">
      {#each socialLinks as link}
         <a href={link.href} target="_blank" rel="noopener" class="social-link" title={link.title}>
            <i class={`${link.icon} fa-lg`} />
         </a>
      {/each}
   </nav>

   {#if !loggedIn}
      <a class="login-button" href={`${API_URL}/api/auth/steam`} rel="external" aria-label="Log in">
         <i class="fa fa-user" />
      </a>
   {:else}
      <div class="user-wrapper" bind:this={accountRegion}>
         <a
            href={`/u/${playerId}`}
            class="user-trigger"
            aria-haspopup="true"
            aria-expanded={userMenuVisible}
            on:click={handleUserMenuClick}
            on:dblclick={() => goto(`/u/${playerId}`)}
            data-sveltekit-preload-code
         >
            <img src={`${CDN_URL}/avatars/${playerId}.jpg`} alt="Open profile menu" class="user-avatar" />
         </a>

         <div class="user-menu" class:visible={userMenuVisible} role="menu">
            <a role="menuitem" href={`/u/${playerId}`} on:click={onNavSelect}>My Profile</a>
            {#if showPatreonLink}
               <a role="menuitem" href={`${API_URL}/api/auth/patreon`} rel="external">Link Patreon account</a>
            {/if}
            <button type="button" role="menuitem" on:click={logout}>Log Out</button>
         </div>
      </div>
   {/if}
</div>

<style>
   .primary {
      display: flex;
      align-items: center;
      gap: 0.5rem;
   }

   .primary a {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.9rem;
      border-radius: 999px;
      color: rgba(255, 255, 255, 0.75);
      font-weight: 500;
      transition: background 0.2s ease, color 0.2s ease;
   }

   .primary a:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.08);
   }

   .primary a.current {
      background: rgba(255, 215, 0, 0.12);
      color: var(--scoreSaberYellow);
      box-shadow: inset 0 0 0 1px rgba(255, 215, 0, 0.3);
   }

   .actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      position: relative;
   }

   .search-trigger {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.45rem 0.85rem;
      border-radius: 0.85rem;
      border: 1px solid var(--borderColor);
      background: rgba(255, 255, 255, 0.04);
      color: rgba(255, 255, 255, 0.85);
      font: inherit;
      cursor: pointer;
      transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
   }

   .desktop-search-trigger {
      display: flex;
   }

   .search-trigger:hover {
      border-color: var(--scoreSaberYellow);
      color: var(--scoreSaberYellow);
      background: rgba(255, 255, 255, 0.08);
   }

   .shortcut {
      display: flex;
      align-items: center;
      gap: 0.3rem;
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.6);
   }

   .shortcut kbd {
      font-family: inherit;
      font-size: 0.75rem;
      padding: 0.1rem 0.35rem;
      border-radius: 0.4rem;
      border: 1px solid var(--borderColor);
      background: rgba(255, 255, 255, 0.05);
      color: inherit;
   }

   .shortcut .separator {
      opacity: 0.6;
   }

   .social {
      display: flex;
      align-items: center;
      gap: 0.5rem;
   }

   .social-link {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 0.85rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.04);
      color: rgba(255, 255, 255, 0.7);
      transition: background 0.2s ease, color 0.2s ease;
   }

   .login-button {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 0.85rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255, 255, 255, 0.85);
      background: rgba(255, 255, 255, 0.04);
      transition: background 0.2s ease, color 0.2s ease;
   }

   .login-button:hover {
      background: rgba(255, 255, 255, 0.08);
      color: var(--scoreSaberYellow);
   }

   .user-wrapper {
      position: relative;
      display: flex;
      align-items: center;
   }

   .user-trigger {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.04);
      transition: transform 0.2s ease, background 0.2s ease;
   }

   .user-trigger:hover {
      transform: translateY(-1px);
      background: rgba(255, 255, 255, 0.08);
   }

   .user-avatar {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
   }

   .user-menu {
      position: absolute;
      top: calc(100% + 0.5rem);
      right: 0;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      background: var(--foregroundItem);
      border: 1px solid var(--borderColor);
      border-radius: 0.85rem;
      padding: 0.5rem;
      min-width: 190px;
      box-shadow: 0 18px 45px rgba(0, 0, 0, 0.4);
      opacity: 0;
      transform: translateY(-8px);
      pointer-events: none;
      transition: opacity 0.2s ease, transform 0.2s ease;
      z-index: 5;
   }

   .user-menu.visible {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
   }

   .user-menu a,
   .user-menu button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border: 0;
      background: transparent;
      color: var(--textColor);
      font: inherit;
      padding: 0.55rem 0.65rem;
      border-radius: 0.65rem;
      cursor: pointer;
      text-align: left;
      transition: background 0.2s ease, color 0.2s ease;
   }

   .user-menu a:hover,
   .user-menu button:hover {
      background: rgba(255, 255, 255, 0.08);
      color: var(--scoreSaberYellow);
   }

   @media (max-width: 960px) {
      .primary,
      .desktop-search-trigger,
      .social,
      .user-wrapper,
      .login-button {
         display: none;
      }
   }
</style>
