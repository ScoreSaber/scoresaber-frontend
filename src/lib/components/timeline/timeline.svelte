<script lang="ts" context="module">
   export type TimelineSteps = TimelineStep[];
</script>

<script lang="ts">
   import TimelineItem, { type TimelineStep } from './timeline-item.svelte';

   export let steps: TimelineSteps = [];
</script>

<div class="timeline">
   <div class="blank-space" />
   {#each steps as step, i}
      <TimelineItem {step} secondHalfAccent={steps[i + 1]?.isCompleted ? steps[i + 1]?.accentColour : undefined}>
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
      }
      padding: 15px;
   }

   .blank-space {
      min-height: 79px;
      grid-row: 1;
      grid-column: 2;
   }
</style>
