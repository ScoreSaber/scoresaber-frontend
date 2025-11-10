<script lang="ts">
   import { onMount } from 'svelte';
   import { fly } from 'svelte/transition';

   export let extraClasses = '';
   export let rememberClose = false;
   export let id: string;
   export let style = '';
   export let mobile = false;
   let hidden = true;
   let formattedId = `announcement-${id}`;

   onMount(() => {
      if (!localStorage.getItem(formattedId)) {
         hidden = false;
      }
   });

   function hideAnnouncement(event: MouseEvent) {
      event.stopPropagation();
      if (rememberClose) {
         localStorage.setItem(formattedId, 'closed');
      }
      hidden = true;
   }
</script>

{#if !hidden}
   <div class="announcement {extraClasses} {mobile ? 'mobile' : ''}" {style} transition:fly={{ y: mobile ? 0 : -20, duration: 300 }}>
      <div class="announcement-container">
         <div class="announcement-content">
            <slot />
         </div>
         <button type="button" on:click={hideAnnouncement} aria-label="Close announcement">
            <i class="fa fa-times" />
         </button>
      </div>
   </div>
{/if}

<style>
   .announcement {
      position: relative;
      z-index: 1000;
      background: linear-gradient(135deg, rgba(37, 99, 235, 0.95), rgba(59, 130, 246, 0.95));
      backdrop-filter: blur(12px) saturate(180%);
      -webkit-backdrop-filter: blur(12px) saturate(180%);
      border-bottom: 1px solid rgba(59, 130, 246, 0.3);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
   }

   .announcement-container {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1.25rem;
      max-width: 1200px;
      margin: 0 auto;
      min-height: 48px;
   }

   .announcement-content {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #fff;
      font-size: 0.95rem;
      font-weight: 500;
      line-height: 1.5;
      flex-wrap: wrap;
   }

   .announcement-content :global(i) {
      color: rgba(255, 255, 255, 0.95);
      font-size: 1.1rem;
      line-height: 1;
      display: inline-flex;
      align-items: center;
      flex-shrink: 0;
      margin-right: 0.375rem;
   }

   .announcement-content :global(a) {
      display: inline;
      white-space: nowrap;
   }

   .announcement-link {
      color: #fff;
      font-weight: 600;
      text-decoration: underline;
      transition: color 0.2s ease;
   }

   .announcement-link:hover {
      color: var(--scoreSaberYellow);
   }

   button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
      border: 0;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: background 0.2s ease, transform 0.15s ease;
      flex-shrink: 0;
   }

   button:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: scale(1.05);
   }

   button:active {
      transform: scale(0.95);
   }

   button i {
      font-size: 0.85rem;
   }

   @media (max-width: 768px) {
      .announcement-container {
         padding: 0.75rem 1rem;
         gap: 0.5rem;
         min-height: 44px;
      }

      .announcement-content {
         font-size: 0.875rem;
         gap: 0.375rem;
         line-height: 1.4;
      }

      .announcement-content :global(i) {
         font-size: 1rem;
         margin-right: 0.375rem;
      }

      button {
         width: 28px;
         height: 28px;
         flex-shrink: 0;
      }

      button i {
         font-size: 0.8rem;
      }
   }

   @media (max-width: 480px) {
      .announcement-container {
         padding: 0.65rem 0.875rem;
      }

      .announcement-content {
         font-size: 0.8rem;
      }
   }

   @media (max-width: 960px) {
      .announcement:not(.mobile) {
         display: none;
      }
   }

   .announcement.mobile {
      position: static;
      background: rgba(37, 99, 235, 0.15);
      border: 1px solid rgba(59, 130, 246, 0.3);
      border-radius: 0.75rem;
      margin-bottom: 1rem;
      box-shadow: none;
   }

   .announcement.mobile .announcement-container {
      padding: 0.75rem 1rem;
      min-height: auto;
   }

   .announcement.mobile .announcement-content {
      font-size: 0.875rem;
      color: var(--textColor);
   }

   .announcement.mobile .announcement-content :global(i) {
      color: rgba(59, 130, 246, 0.9);
   }

   .announcement.mobile :global(.announcement-link) {
      color: var(--scoreSaberYellow);
   }

   .announcement.mobile :global(.announcement-link:hover) {
      color: var(--alternate);
   }

   .announcement.mobile button {
      background: rgba(255, 255, 255, 0.1);
      color: var(--textColor);
   }

   .announcement.mobile button:hover {
      background: rgba(255, 255, 255, 0.15);
   }

   @media (min-width: 961px) {
      .announcement.mobile {
         display: none;
      }
   }
</style>
