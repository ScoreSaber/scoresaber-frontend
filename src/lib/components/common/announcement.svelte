<script type="ts">
   import { onMount } from 'svelte';

   export let extraClasses: string = '';
   export let rememberClose: boolean = false;
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
   }
   .announcement-content {
      flex: 1;
      display: flex;
      align-items: center;
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
      display: none;
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
