<script type="ts">
   import { onMount } from 'svelte';

   export let extraClasses = '';
   export let rememberClose = false;
   export let id: string;
   export let style = '';
   let hidden = true;
   let formattedId = `announcement-${id}`;

   onMount(() => {
      if (!localStorage.getItem(formattedId)) {
         hidden = false;
      }
   });

   function hideAnnouncement() {
      if (rememberClose) {
         localStorage.setItem(formattedId, 'closed');
      }
      hidden = true;
   }
</script>

<div class="announcement {extraClasses} {hidden ? 'hidden' : ''}" {style}>
   <div class="container">
      <div class="announcement-content">
         <slot />
      </div>
      <button on:click={() => hideAnnouncement()}>
         <i class="fa fa-times" />
      </button>
   </div>
</div>

<style>
   .announcement {
      background-color: #2563eb;
      color: #fff;
      position: relative;
      transition: all 0.5s ease-out;
      max-height: 200px;
      opacity: 1;
      overflow: visible;
   }

   .announcement::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 0px;
      background: transparent;
      box-shadow: 0 0 10px 2px #ff0000;
      animation: pulse 5s ease-in-out infinite;
      opacity: 0.7;
      pointer-events: none;
   }

   @keyframes pulse {
      0% {
         opacity: 0;
         box-shadow: 0 0 3px 3px #ff0000;
      }
      50% {
         opacity: 0.4;
         box-shadow: 0 0 13px 10px #cc0000;
      }
      100% {
         opacity: 0;
         box-shadow: 0 0 3px 3px #ff0000;
      }
   }

   .announcement-content {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.05em;
      font-weight: 600;
   }

   button {
      display: flex;
      width: 24px;
      height: 24px;
      align-items: center;
      justify-content: center;
      background: transparent;
      color: inherit;
      font: inherit;
      border-radius: 12px;
      transition: all 0.25s ease;
      cursor: pointer;
      border: 0;
   }

   button:hover {
      background: #fff2;
   }

   .announcement.hidden {
      max-height: 0;
      opacity: 0;
      padding: 0;
      margin: 0;
      visibility: hidden;
      transition: all 0.5s ease-out, visibility 0s 0.5s;
   }

   .container {
      display: flex;
      align-items: center;
      padding: 10px;
   }

   .announcement :global(.icon-container) {
      background: #fff2;
      padding: 8px;
      display: flex;
      height: 35px;
      width: 35px;
      border-radius: 5px;
      margin-right: 10px;
   }
</style>
