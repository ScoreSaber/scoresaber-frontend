<script lang="ts">
   import { fade, slide } from 'svelte/transition';

   import { browser } from '$app/env';

   import { modal } from '$lib/stores/global-store';

   import Modal, { bind } from '$lib/components/common/modal.svelte';
   import ConfirmModal from '$lib/components/common/confirm-modal.svelte';

   export let videoId: string;
   export let title: string;
   export let dismissMessage: string;
   export let showIcon = true;

   const isMobile = browser ? window.innerWidth <= 769 : false;
   let showVideoBlock = browser ? localStorage.getItem(`hideVideo_${videoId}`) !== 'true' : true;
   let isExpanded = browser ? (isMobile ? false : localStorage.getItem(`collapseVideo_${videoId}`) === 'true') : false;

   // Clear mobile preferences
   if (browser && isMobile) {
      localStorage.removeItem(`collapseVideo_${videoId}`);
   }

   const dismissVideo = () => {
      showVideoBlock = false;
      browser && localStorage.setItem(`hideVideo_${videoId}`, 'true');
   };

   const toggleExpand = () => {
      isExpanded = !isExpanded;
      browser && !isMobile && localStorage.setItem(`collapseVideo_${videoId}`, isExpanded.toString());
   };

   const showDismissConfirmation = () =>
      modal.set(
         bind(ConfirmModal, {
            title: 'Dismiss Video',
            message: dismissMessage,
            onConfirm: () => {
               dismissVideo();
               modal.set(null);
            },
            onCancel: () => modal.set(null)
         })
      );
</script>

{#if showVideoBlock}
   <div class="video-block" out:fade|local={{ duration: 300 }}>
      <div class="video-header">
         {#if showIcon}
            <i class="fab fa-youtube" />
         {/if}
         {title}
         <div class="header-controls">
            <button class="toggle-button" on:click={toggleExpand}>
               <i class="fas fa-chevron-{isExpanded ? 'up' : 'down'}" />
            </button>
            <button class="dismiss-button" on:click={showDismissConfirmation}>
               <i class="fas fa-times" />
            </button>
         </div>
      </div>
      {#if isExpanded}
         <div class="video-container" transition:slide|local={{ duration: 300 }}>
            <iframe
               width="100%"
               height="215"
               src="https://www.youtube.com/embed/{videoId}"
               {title}
               frameborder="0"
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
               allowfullscreen
            />
         </div>
      {/if}
   </div>
{/if}

<Modal show={$modal} />

<style>
   .video-block {
      background: var(--gray);
      border-radius: 5px;
      margin-bottom: 1rem;
      overflow: hidden;
   }

   .video-header {
      padding: 0.5rem;
      font-weight: 600;
      background: var(--gray-light);
      color: var(--textColor);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      justify-content: center;
   }

   .video-header :nth-child(2) {
      text-align: center;
   }

   @media screen and (min-width: 769px) {
      .video-header :nth-child(2) {
         margin-right: auto;
         text-align: left;
      }
   }

   .header-controls {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-left: 0.5rem;
   }

   .video-container {
      position: relative;
      padding-bottom: 56.25%;
      height: 0;
      overflow: hidden;
   }

   .video-container iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
   }

   .dismiss-button,
   .toggle-button {
      display: flex;
      width: 24px;
      height: 24px;
      align-items: center;
      justify-content: center;
      background: transparent;
      color: var(--textColor);
      border: 0;
      border-radius: 12px;
      transition: all 0.25s ease;
      cursor: pointer;
      opacity: 0.6;
   }

   .dismiss-button:hover,
   .toggle-button:hover {
      background: rgba(255, 255, 255, 0.1);
      opacity: 1;
   }

   .dismiss-button i,
   .toggle-button i {
      transform: translateY(1px);
   }

   @media screen and (max-width: 768px) {
      .video-block {
         margin-bottom: 0;
      }
   }
</style>
