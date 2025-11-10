<script lang="ts">
   import { onDestroy, onMount } from 'svelte';

   import { searchView } from '$lib/stores/global-store';

   import SearchView from '$lib/components/common/search.svelte';
   import Announcement from '$lib/components/common/announcement.svelte';
   import DesktopNav from '$lib/components/common/desktop-nav.svelte';
   import MobileNav from '$lib/components/common/mobile-nav.svelte';

   import { lockBodyScroll, unlockBodyScroll } from '$lib/utils/nav-utils';

   import { rankedBatch, getYouTubeUrl, getAnnouncementMessage } from '$lib/config/ranked-batch';

   let searchModal: SearchView;
   let header: HTMLElement | null = null;
   let scrollProbe: HTMLDivElement | null = null;

   let isMobileMenuOpen = false;
   let headerIncreaseContrast = false;
   let isMac = false;

   let observer: IntersectionObserver | undefined;

   let touchStartX = 0;
   let touchStartY = 0;
   let isSwiping = false;
   const SWIPE_EDGE_THRESHOLD = 30;
   const SWIPE_DISTANCE_THRESHOLD = 50;

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

      updateScrollState();

      window.addEventListener('scroll', handleScroll, { passive: true });

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

   function closeMobileMenu() {
      if (!isMobileMenuOpen) {
         return;
      }

      isMobileMenuOpen = false;
      unlockBodyScroll();
   }

   function handleWindowKeydown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
         searchModal?.setVisibility(false);
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
   }

   function toggleMobileMenu() {
      isMobileMenuOpen = !isMobileMenuOpen;

      if (isMobileMenuOpen) {
         lockBodyScroll();
      } else {
         unlockBodyScroll();
      }
   }

   function handleNavSelect() {
      closeMobileMenu();
   }

   function handleTouchStart(event: TouchEvent) {
      if (isMobileMenuOpen) {
         return;
      }

      const touch = event.touches[0];
      if (!touch) {
         return;
      }

      const screenWidth = window.innerWidth;
      const startX = touch.clientX;
      const startY = touch.clientY;

      // Only start swipe detection if touch starts near the right edge
      if (startX >= screenWidth - SWIPE_EDGE_THRESHOLD) {
         touchStartX = startX;
         touchStartY = startY;
         isSwiping = true;
      }
   }

   function handleTouchMove(event: TouchEvent) {
      if (!isSwiping || isMobileMenuOpen) {
         return;
      }

      const touch = event.touches[0];
      if (!touch) {
         return;
      }

      const deltaX = touchStartX - touch.clientX;
      const deltaY = Math.abs(touch.clientY - touchStartY);

      // Only proceed if horizontal movement is greater than vertical (horizontal swipe)
      if (deltaX > 0 && deltaX > deltaY) {
         event.preventDefault();
      }
   }

   function handleTouchEnd(event: TouchEvent) {
      if (!isSwiping || isMobileMenuOpen) {
         isSwiping = false;
         return;
      }

      const touch = event.changedTouches[0];
      if (!touch) {
         isSwiping = false;
         return;
      }

      const deltaX = touchStartX - touch.clientX;
      const deltaY = Math.abs(touch.clientY - touchStartY);

      // Check if it's a valid horizontal swipe from right to left
      if (deltaX > SWIPE_DISTANCE_THRESHOLD && deltaX > deltaY) {
         toggleMobileMenu();
      }

      isSwiping = false;
   }
</script>

<SearchView bind:this={searchModal} />

<svelte:window
   on:click={handleWindowClick}
   on:keydown={handleWindowKeydown}
   on:touchstart={handleTouchStart}
   on:touchmove={handleTouchMove}
   on:touchend={handleTouchEnd}
/>

<Announcement id={rankedBatch.announcementId} rememberClose={true}>
   <i class="fab fa-youtube" />
   {getAnnouncementMessage(rankedBatch.month)}{' '}
   <a class="announcement-link" href={getYouTubeUrl(rankedBatch.videoId)} target="_blank" rel="noopener">Click here</a> to watch
</Announcement>

<div class="scroll-probe" bind:this={scrollProbe} />

<header class:scrolled={headerIncreaseContrast} class:menu-open={isMobileMenuOpen} bind:this={header}>
   <div class="bar">
      <a href="/" class="logo-link" on:click={handleNavSelect} data-sveltekit-preload-code>
         <img src="/images/logo.svg" class="logo" alt="ScoreSaber logo" />
         <span class="logo-wordmark"><strong>ScoreSaber</strong></span>
      </a>

      <DesktopNav {searchModal} {isMac} onNavSelect={handleNavSelect} />

      <button type="button" class="search-trigger mobile-search-trigger" on:click={showSearchModal} aria-label="Open search">
         <i class="fa fa-search" />
      </button>

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
</header>

<MobileNav isOpen={isMobileMenuOpen} onClose={closeMobileMenu} onNavSelect={handleNavSelect} />

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


   .logo-wordmark {
      display: none;
   }

   @media (min-width: 640px) {
      .logo-wordmark {
         display: inline;
      }
   }

   .mobile-search-trigger {
      width: 2.5rem;
      height: 2.5rem;
      padding: 0;
      display: none;
      align-items: center;
      justify-content: center;
      border: 0;
      background: rgba(255, 255, 255, 0.04);
      color: rgba(255, 255, 255, 0.85);
      font: inherit;
      cursor: pointer;
      transition: background 0.2s ease;
      border-radius: 0.85rem;
   }

   .mobile-search-trigger:hover {
      background: rgba(255, 255, 255, 0.08);
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

   @media (max-width: 1024px) {
      .bar {
         padding: 0.75rem 1rem;
      }
   }

   @media (max-width: 960px) {
      .mobile-search-trigger {
         display: flex;
      }

      .hamburger {
         display: flex;
      }
   }
</style>
