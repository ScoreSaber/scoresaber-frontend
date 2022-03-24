<script lang="ts" context="module">
   export type TimelineSteps = TimelineStep[];
</script>

<script lang="ts">
   import TimelineItem, { TimelineStep } from './timeline-item.svelte';

   export let steps: TimelineSteps = [];
</script>

<div class="timeline">
   <div class="blank-space" />
   {#each steps as step}
      <TimelineItem {step}>
         {step.content}
      </TimelineItem>
   {/each}
</div>

<style lang="scss">
   .timeline {
      display: flex;
      flex-direction: column;
      @media (min-width: 720px) {
         grid-template-columns: 1fr 1fr;
         display: grid;
         gap: 30px 0;
      }
      padding: 15px;
   }

   .blank-space {
      /* border: solid 1px red; */
      padding: 25px;
      /* height: 25px; */
      grid-row: 1;
      grid-column: 2;
   }
</style>
