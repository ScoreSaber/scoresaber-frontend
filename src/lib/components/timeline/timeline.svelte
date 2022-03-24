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
      <TimelineItem accentColour={step.accentColour} isCompleted={step.isCompleted}>
         {step.content}
      </TimelineItem>
   {/each}
</div>

<style lang="scss">
   .timeline {
      display: grid;
      grid-template-columns: 1fr 1fr;
      padding: 15px;
      gap: 30px 0;
   }

   .blank-space {
      /* border: solid 1px red; */
      padding: 25px;
      /* height: 25px; */
      grid-row: 1;
      grid-column: 2;
   }
</style>
