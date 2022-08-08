<script lang="ts">
   import type { Player } from '$lib/models/PlayerData';

   export let player: Player;

   const historyArray = player.histories.split(',');

   let difference: number;
   let lastWeek: number;
   if (historyArray.length > 6) {
      lastWeek = parseInt(historyArray[historyArray.length - 7]);
   } else {
      lastWeek = parseInt(historyArray[0]);
   }

   if (lastWeek !== 999999) {
      difference = lastWeek - parseInt(historyArray[historyArray.length - 1]);
   }
</script>

{#if difference > 0}
   <span title="Weekly Change" class="difference positive">
      +{difference}
   </span>
{/if}
{#if difference < 0}
   <span title="Weekly Change" class="difference negative">
      {difference}
   </span>
{/if}
{#if difference === 0}
   <span title="Weekly Change" class="difference neutral">
      {difference}
   </span>
{/if}

<style>
   span.difference {
      cursor: help;
   }
   span.difference.positive {
      color: #42b129;
   }
   span.difference.negative {
      color: #f94022;
   }
</style>
