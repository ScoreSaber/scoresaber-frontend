<script type="ts">
   import { getContext } from 'svelte';

   import FormattedDate from '$lib/components/common/formatted-date.svelte';

   import type { CanResetCountryData } from '$lib/models/CanResetCountryData';

   export let onResetCountryClick: () => void;
   export let canResetCountry: CanResetCountryData;

   const { close } = getContext('simple-modal');
</script>

<div class="media">
   <div class="media-content is-clipped">
      <div class="player-info mb-2">
         <span class="text-muted">Request Country Reset</span>
      </div>
      <div class="tools">
         {#if canResetCountry.canResetCountry}
            <div class="window tool mt-3">
               <p>
                  You can request to change your country <span class="has-text-weight-semibold">once per year</span>. After you have requested a
                  country reset, your country will be changed <span class="has-text-weight-semibold">on your next ingame login</span>.
               </p>
               <div class="notification is-warning">
                  <h4 class="warning">Rules Around Country Changes</h4>
                  <b
                     >You may only change your country to one in which you either reside or hold citizenship. Using this feature to reset to any other
                     country is a violation of the <a target="_blank" href="https://wiki.scoresaber.com/rules.html">rules</a>. Should your country
                     have been accidentally set to a wrong country, contact an admin as soon as possible.</b
                  >
               </div>
               <button
                  on:click={() => {
                     onResetCountryClick();
                     close();
                  }}
                  class="button is-danger is-small"
               >
                  <span>Request Country Reset</span>
               </button>
            </div>
         {:else}
            <div class="window tool mt-3">
               You have reset your country <FormattedDate date={canResetCountry.recentCountryReset} />. You can only reset your country once per year!
            </div>
         {/if}
      </div>
   </div>
</div>

<style>
   .window {
      background-color: var(--gray) !important;
   }
   .window.tool {
      margin-left: 5px;
      margin-right: 5px;
   }
   .media-content {
      color: white;
   }
   .tools {
      display: flex;
   }
   .media {
      padding: 1rem;
      position: relative;
      z-index: 1;
   }
   .text-muted {
      color: var(--muted);
   }
   .warning {
      color: red;
   }

   @media only screen and (max-width: 769px) {
      .tools {
         flex-direction: column;
      }
   }
</style>
