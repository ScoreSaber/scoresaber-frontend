<script lang="ts">
   import { onDestroy, onMount } from 'svelte';

   import { page } from '$app/stores';
   import { goto } from '$app/navigation';

   import { userData, searchView } from '$lib/stores/global-store';

   import SearchView from '$lib/components/common/search.svelte';
   import Announcement from '$lib/components/common/announcement.svelte';

   import { API_URL, CDN_URL } from '$lib/utils/env';
   import fetcher from '$lib/utils/fetcher';

   interface NavItem {
      href: string;
      icon: string;
      label: string;
      ariaLabel?: string;
   }

   interface SocialLink {
      href: string;
      icon: string;
      title: string;
   }

   const navItems = [
      { href: '/leaderboards', label: 'Maps', icon: 'fa fa-map', ariaLabel: 'Maps' },
      { href: '/rankings', label: 'Rankings', icon: 'fa fa-medal', ariaLabel: 'Rankings' },
      { href: '/ranking/requests', label: 'Rank Requests', icon: 'fa fa-list', ariaLabel: 'Rank Requests' },
      { href: '/scores', label: 'Score Feed', icon: 'fa fa-rss', ariaLabel: 'Score Feed' }
   ] satisfies readonly NavItem[];

   const socialLinks = [
      { href: 'https://discord.scoresaber.com', icon: 'fab fa-discord', title: 'Join our Discord!' },
      { href: 'https://patreon.com/scoresaber', icon: 'fab fa-patreon', title: 'Support us on Patreon ❤️' },
      { href: 'https://x.com/scoresaber', icon: 'fab fa-x-twitter', title: 'Follow us on X' }
   ] satisfies readonly SocialLink[];

   let searchModal: SearchView;
   let accountRegion: HTMLDivElement | null = null;
   let header: HTMLElement | null = null;
   let scrollProbe: HTMLDivElement | null = null;

   let userMenuVisible = false;
   let isMobileMenuOpen = false;
   let headerIncreaseContrast = false;

   let observer: IntersectionObserver | undefined;

   let loggedIn = false;
   let playerId = '';
   let showPatreonLink = false;
   let isMac = false;

   const showSearchModal = () => searchModal?.setVisibility(true);

   function updateScrollState() {
      if (typeof window === 'undefined') {
         return;
      }

      const scrollY = window.scrollY || window.pageYOffset || 0;
      headerIncreaseContrast = scrollY > 0;
   }

   function handleScroll() {
      updateScrollState();
   }

   onMount(() => {
      searchView.set(searchModal);
      isMac = typeof navigator !== 'undefined' && navigator.platform.includes('Mac');

      // Initialize scroll state
      updateScrollState();

      // Set up scroll event listener as primary method
      window.addEventListener('scroll', handleScroll, { passive: true });

      // Also set up intersection observer as backup
      if (scrollProbe) {
         observer = new IntersectionObserver(
            ([entry]) => {
               headerIncreaseContrast = entry.intersectionRatio <= 0;
            },
            {
               threshold: [0, 1],
               rootMargin: '0px'
            }
         );

         observer.observe(scrollProbe);
      }

      return () => {
         window.removeEventListener('scroll', handleScroll);
         observer?.disconnect();
      };
   });

   onDestroy(() => {
      if (typeof window !== 'undefined') {
         window.removeEventListener('scroll', handleScroll);
      }
      observer?.disconnect();
   });

   $: {
      const data = $userData;
      loggedIn = Boolean(data);
      playerId = data?.playerId ?? '';
      showPatreonLink = Boolean(data) && !data?.patronId;
   }

   function isCurrent(href: string, currentPath: string) {
      if (!href) {
         return false;
      }

      if (href === '/') {
         return currentPath === '/';
      }

      return currentPath === href || currentPath.startsWith(`${href}/`);
   }

   async function logout() {
      localStorage.removeItem('login-token');
      try {
         await fetcher('/api/auth/logout', { withCredentials: true });
      } finally {
         location.reload();
      }
   }

   function closeMobileMenu() {
      if (!isMobileMenuOpen) {
         return;
      }

      isMobileMenuOpen = false;
   }

   function handleWindowKeydown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
         searchModal?.setVisibility(false);
         userMenuVisible = false;
         closeMobileMenu();
         return;
      }

      const hasModifier = event.metaKey || event.ctrlKey;
      const wantsSearch = hasModifier && (event.key === 'k' || event.key === '/');
      if (!wantsSearch || searchModal?.isVisible()) {
         return;
      }

      event.preventDefault();
      searchModal?.setVisibility(true);
   }

   function handleWindowClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Node)) {
         return;
      }

      if (header && !header.contains(target)) {
         closeMobileMenu();
      }

      if (loggedIn && !accountRegion?.contains(target)) {
         userMenuVisible = false;
      }
   }

   function toggleMobileMenu() {
      isMobileMenuOpen = !isMobileMenuOpen;
      if (!isMobileMenuOpen) {
         userMenuVisible = false;
      }
   }

   function handleNavSelect() {
      userMenuVisible = false;
      closeMobileMenu();
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
</script>

<SearchView bind:this={searchModal} />

<svelte:window on:click={handleWindowClick} on:keydown={handleWindowKeydown} />

<Announcement id="november-2025-ranked-batch" rememberClose={true}>
   <i class="fab fa-youtube" />
   The November ScoreSaber Ranked Batch Overview video is out!{' '}
   <a class="announcement-link" href="https://youtu.be/kWqdTFP6bs8" target="_blank" rel="noopener">Click here</a> to watch
</Announcement>

<div class="scroll-probe" bind:this={scrollProbe} />

<header class:scrolled={headerIncreaseContrast} class:menu-open={isMobileMenuOpen} bind:this={header}>
   <div class="bar">
      <a href="/" class="logo-link" on:click={handleNavSelect}>
         <img src="/images/logo.svg" class="logo" alt="ScoreSaber logo" />
         <span class="logo-wordmark"><strong>ScoreSaber</strong></span>
      </a>

      <nav class="primary" aria-label="Primary navigation">
         {#each navItems as item}
            <a
               href={item.href}
               aria-label={item.ariaLabel ?? item.label}
               class:current={isCurrent(item.href, $page.url.pathname)}
               on:click={handleNavSelect}
            >
               <i class={item.icon} />
               <span>{item.label}</span>
            </a>
         {/each}
      </nav>

      <div class="spacer" />

      <div class="actions">
         <button type="button" class="search-trigger" on:click={showSearchModal} aria-label="Open search">
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
               >
                  <img src={`${CDN_URL}/avatars/${playerId}.jpg`} alt="Open profile menu" class="user-avatar" />
               </a>

               <div class="user-menu" class:visible={userMenuVisible} role="menu">
                  <a role="menuitem" href={`/u/${playerId}`} on:click={handleNavSelect}>My Profile</a>
                  {#if showPatreonLink}
                     <a role="menuitem" href={`${API_URL}/api/auth/patreon`} rel="external">Link Patreon account</a>
                  {/if}
                  <button type="button" role="menuitem" on:click={logout}>Log Out</button>
               </div>
            </div>
         {/if}

         <button
            class="hamburger"
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            on:click={toggleMobileMenu}
         >
            <span class="hamburger-bar" />
            <span class="hamburger-bar" />
            <span class="hamburger-bar" />
         </button>
      </div>
   </div>
</header>

<button type="button" class="mobile-overlay" class:visible={isMobileMenuOpen} on:click={closeMobileMenu} aria-label="Close navigation" />

<aside id="mobile-navigation" class:open={isMobileMenuOpen} aria-hidden={!isMobileMenuOpen}>
   <div class="mobile-header">
      <span>Navigation</span>
      <button type="button" aria-label="Close menu" on:click={closeMobileMenu}>
         <i class="fa fa-times" />
      </button>
   </div>

   <button
      type="button"
      class="mobile-search"
      on:click={() => {
         showSearchModal();
         closeMobileMenu();
      }}
   >
      <i class="fa fa-search" />
      <span>Search</span>
   </button>

   <Announcement id="november-2025-ranked-batch" rememberClose={true} mobile={true}>
      <i class="fab fa-youtube" />
      The November ScoreSaber Ranked Batch Overview video is out!{' '}
      <a class="announcement-link" href="https://youtu.be/kWqdTFP6bs8" target="_blank" rel="noopener">Click here</a> to watch
   </Announcement>

   <nav class="mobile-nav" aria-label="Mobile navigation">
      <a href="/" class:current={isCurrent('/', $page.url.pathname)} on:click={handleNavSelect}>
         <i class="fa fa-home" />
         <span>Home</span>
      </a>
      {#each navItems as item}
         <a href={item.href} class:current={isCurrent(item.href, $page.url.pathname)} on:click={handleNavSelect}>
            <i class={item.icon} />
            <span>{item.label}</span>
         </a>
      {/each}
   </nav>

   <nav class="mobile-social" aria-label="Mobile social links">
      {#each socialLinks as link}
         <a href={link.href} target="_blank" rel="noopener">
            <i class={`${link.icon} fa-lg`} />
            <span>{link.title}</span>
         </a>
      {/each}
   </nav>

   {#if !loggedIn}
      <a class="mobile-login" href={`${API_URL}/api/auth/steam`} rel="external">Log In</a>
   {:else}
      <div class="mobile-user">
         <div class="avatar-row">
            <img src={`${CDN_URL}/avatars/${playerId}.jpg`} alt="" />
            <span>ID #{playerId}</span>
         </div>

         <a href={`/u/${playerId}`} on:click={handleNavSelect}>My Profile</a>
         {#if showPatreonLink}
            <a href={`${API_URL}/api/auth/patreon`} rel="external">Link Patreon account</a>
         {/if}
         <button
            type="button"
            on:click={() => {
               closeMobileMenu();
               logout();
            }}
         >
            Log Out
         </button>
      </div>
   {/if}
</aside>

<style>
   .scroll-probe {
      width: 100%;
      height: 1px;
   }

   header {
      position: sticky;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 100;
      transition: background 0.2s ease, border-color 0.2s ease;
      border-bottom: 1px solid transparent;
   }

   header.scrolled,
   header.menu-open {
      background: rgba(12, 12, 15, 0.85);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border-bottom-color: var(--borderColor);
   }

   .bar {
      display: flex;
      align-items: center;
      gap: 1rem;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0.75rem 1.5rem;
   }

   .logo-link {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      text-decoration: none;
      color: var(--textColor);
      font-weight: 600;
   }

   .logo {
      width: 28px;
      height: 28px;
      display: block;
   }

   .logo-wordmark {
      display: none;
   }

   @media (min-width: 640px) {
      .logo-wordmark {
         display: inline;
      }
   }

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

   .spacer {
      flex: 1;
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

   .social-link:hover {
      background: rgba(255, 255, 255, 0.08);
      color: var(--scoreSaberYellow);
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

   .hamburger {
      display: none;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.3rem;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 0.85rem;
      border: 0;
      background: rgba(255, 255, 255, 0.04);
      cursor: pointer;
      transition: background 0.2s ease;
   }

   .hamburger:hover {
      background: rgba(255, 255, 255, 0.08);
   }

   .hamburger-bar {
      width: 18px;
      height: 2px;
      background: rgba(255, 255, 255, 0.85);
      border-radius: 999px;
      transition: transform 0.2s ease, opacity 0.2s ease;
   }

   header.menu-open .hamburger-bar:nth-child(1) {
      transform: translateY(6px) rotate(45deg);
   }

   header.menu-open .hamburger-bar:nth-child(2) {
      opacity: 0;
   }

   header.menu-open .hamburger-bar:nth-child(3) {
      transform: translateY(-6px) rotate(-45deg);
   }

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
      box-shadow: -24px 0 48px rgba(0, 0, 0, 0.45);
      transform: translateX(100%);
      transition: transform 0.3s ease;
      z-index: 100;
      display: flex;
      flex-direction: column;
      padding: 1.5rem;
      gap: 1.5rem;
   }

   aside.open {
      transform: translateX(0);
   }

   .mobile-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 600;
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

   .mobile-search {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-radius: 0.9rem;
      border: 1px solid var(--borderColor);
      background: rgba(255, 255, 255, 0.04);
      color: rgba(255, 255, 255, 0.85);
      font: inherit;
      cursor: pointer;
      transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
   }

   .mobile-search:hover {
      border-color: var(--scoreSaberYellow);
      color: var(--scoreSaberYellow);
      background: rgba(255, 255, 255, 0.08);
   }

   .mobile-social {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
   }

   .mobile-social a {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.65rem 0.75rem;
      border-radius: 0.75rem;
      color: rgba(255, 255, 255, 0.75);
      transition: background 0.2s ease, color 0.2s ease;
   }

   .mobile-social a:hover {
      background: rgba(255, 255, 255, 0.08);
      color: var(--scoreSaberYellow);
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

   .avatar-row {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      color: rgba(255, 255, 255, 0.85);
   }

   .avatar-row img {
      width: 2.75rem;
      height: 2.75rem;
      border-radius: 999px;
      object-fit: cover;
   }

   .mobile-user a,
   .mobile-user button {
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

   .mobile-user a:hover,
   .mobile-user button:hover {
      background: rgba(255, 255, 255, 0.08);
      color: var(--scoreSaberYellow);
   }

   @media (max-width: 1024px) {
      .bar {
         padding: 0.75rem 1rem;
      }
   }

   @media (max-width: 960px) {
      .primary,
      .search-trigger,
      .social,
      .user-wrapper,
      .login-button {
         display: none;
      }

      .hamburger {
         display: flex;
      }
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
