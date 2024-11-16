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
      <img src="/images/beat-cancer.svg" alt="Logo" class="announcement-logo" />
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
      background-color: #fcc73e;
      color: #4a266e;
      position: relative;
      transition: all 0.5s ease-out;
      max-height: 250px;
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
      box-shadow: 0 0 10px 2px #4a266e;
      animation: pulse 5s ease-in-out infinite;
      opacity: 0.7;
      pointer-events: none;
   }

   @keyframes pulse {
      0% {
         opacity: 0;
         box-shadow: 0 0 3px 3px #4a266e;
      }
      50% {
         opacity: 0.4;
         box-shadow: 0 0 13px 10px #937fbb;
      }
      100% {
         opacity: 0;
         box-shadow: 0 0 3px 3px #4a266e;
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
      color: #4a266e;
      font: inherit;
      border-radius: 12px;
      transition: all 0.25s ease;
      cursor: pointer;
      border: 0;
   }

   button:hover {
      background: #4a266e22;
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
      padding: 12px 15px;
      gap: 15px;
      flex-wrap: wrap;
      justify-content: center;
      position: relative;
   }

   .announcement-logo {
      height: 40px;
      width: 40px;
      flex-shrink: 0;
   }

   .announcement-content {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.05em;
      font-weight: 600;
      text-align: center;
      min-width: 200px;
   }

   button {
      flex-shrink: 0;
      display: flex;
      width: 24px;
      height: 24px;
      align-items: center;
      justify-content: center;
      background: transparent;
      color: #4a266e;
      font: inherit;
      border-radius: 12px;
      transition: all 0.25s ease;
      cursor: pointer;
      border: 0;
   }

   button:hover {
      background: #4a266e22;
   }

   @media (max-width: 480px) {
      .container {
         padding: 8px 35px 8px 10px;
      }

      .announcement-content {
         font-size: 0.95em;
         width: 100%;
         order: 2;
         padding-right: 5px;
      }

      .announcement-logo {
         order: 1;
      }

      button {
         position: absolute;
         top: 8px;
         right: 8px;
         order: 3;
      }
   }
</style>
