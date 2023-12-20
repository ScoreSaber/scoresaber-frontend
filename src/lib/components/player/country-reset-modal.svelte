<script type="ts">
   import { getContext } from 'svelte';

   import PlayerLink from '$lib/components/player/player-link.svelte';
   import TextInput from '$lib/components/common/text-input.svelte';

   import FormattedDate from '$lib/components/common/formatted-date.svelte';

   import type { Player } from '$lib/models/PlayerData';
   import type { CanResetCountryData } from '$lib/models/CanResetCountryData';

   export let onResetCountryClick: () => void;
   export let player: Player;
   export let canResetCountry: CanResetCountryData;

   const { close } = getContext('simple-modal');

   $: banReason = '';
</script>

<div class="media">
   <div class="media-content is-clipped">
      <div class="player-info mb-2">
         <span class="text-muted">Request Country Reset</span>
      </div>
      <div class="tools">
         {#if canResetCountry.canResetCountry}
            <div class="window tool mt-3">
               <p>You can request to change your country <span class="has-text-weight-semibold">once every two years</span>. After you have requested a country reset, your country will be changed <span class="has-text-weight-semibold">on your next score submission</span>.</p>
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
               You have reset your country <FormattedDate date={canResetCountry.recentCountryReset} />. You can only reset your country once every two years!
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

   @media only screen and (max-width: 769px) {
      .tools {
         flex-direction: column;
      }
   }
</style>
