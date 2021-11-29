<script type="ts">
   import { onMount } from 'svelte';

   export let extraClasses: string = '';
   export let style = '';
   let hidden = false;

   onMount(() => {
      if (localStorage.getItem('cookie-consent') === 'closed') {
         hidden = true;
      }
   });

   function hideCookieConsent() {
      localStorage.setItem('cookie-consent', 'closed');
      hidden = true;
   }
</script>

<div class="announcement {extraClasses} {hidden ? 'hidden' : ''}" {style}>
   <div class="container">
      <div class="announcement-content">
         We use cookies to ensure you the best experience. By using our website you agree to our&nbsp; <a href="/legal/privacy">Privacy Policy</a>
         &nbsp; & &nbsp;

         <a href="/legal/cookies-policy">Cookie Policy</a>
      </div>
      <button on:click={() => hideCookieConsent()}>
         <span>Ok, understood</span>
      </button>
   </div>
</div>

<style>
   a {
      color: white;
      font-weight: 700;
   }
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
      align-items: center;
      justify-content: center;
      background: transparent;
      color: inherit;
      font: inherit;
      border-radius: 12px;
      transition: all 0.25s ease;
      cursor: pointer;
      background: #fff2;
      border: 0;
      padding-top: 5px;
      padding-bottom: 5px;
      padding-left: 10px;
      padding-right: 10px;
   }

   button:hover {
      background: rgba(194, 193, 193, 0.133);
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
