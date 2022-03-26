<script lang="ts" context="module">
   export type TimelineStep = {
      title: string;
      accentColour: string;
      content: string;
      isCompleted: boolean;
      time?: Date;
   };
</script>

<script lang="ts">
   import type { TimelineSteps } from './timeline.svelte';

   export let step: TimelineStep;
   const { content, accentColour, isCompleted, time } = step;
   const dateFormat = Intl.DateTimeFormat(typeof navigator !== 'undefined' ? navigator.language : 'en-AU', {
      timeStyle: 'short',
      dateStyle: 'full',
      timeZone: typeof navigator !== 'undefined' ? undefined : 'UTC'
   });
</script>

<div class="timeline-item {isCompleted ? 'completed' : ''}" style="--accent: {accentColour}">
   <div class="spacer" />
   <div class="body">
      <slot />
      {#if time}
         <div class="time">
            {dateFormat.format(time)}<br />
            ({dateFormat.resolvedOptions().timeZone})
         </div>
      {/if}
   </div>
   <div class="line" />
   <div class="marker" />
</div>

<style lang="scss">
   .timeline-item {
      --accent: attr(data-accent);
      --grey: #333;
      --border-colour: var(--grey);
      --line-colour: var(--grey);
      &.completed {
         --border-colour: var(--accent);
      }
      grid-column: 2;
      display: flex;
      flex-direction: row-reverse;
      position: relative;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      border-left: solid 3px var(--border-colour);
      grid-row: auto / span 2;
      margin-left: -1px;

      .time {
         opacity: 0.5;
         margin-top: 0.5em;
         word-wrap: break-word;
      }
      @media (min-width: 720px) {
         .time {
            min-width: 0px;
         }
         &:nth-child(2n) {
            grid-column: 1;
            border-left: unset;
            border-right: solid 2px var(--border-colour);
            margin-left: 0;

            margin-right: -1px;
            flex-direction: row;
            .marker {
               transform: translateX(16px);
               position: relative;
               z-index: 100;
            }
            .line {
               box-shadow: 30px 0 var(--line-colour);
            }
         }
      }

      .marker {
         border-radius: 50%;
         width: 30px;
         height: 30px;
         background: var(--background-color);
         position: relative;
         z-index: 1;
         box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
         transform: translateX(-16px);
      }

      &.completed {
         .marker {
            background: var(--accent);
         }
      }

      .body {
         border: solid 1px #fff1;
         box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
         max-width: calc(100% - 35px);
         padding: 25px;
         background: var(--foreground);
         display: flex;
         flex-direction: column;
         margin: 25px 0;
      }

      .spacer {
         flex: 1;
      }

      .line {
         height: 2px;
         background: var(--line-colour);
         flex: 1;
         box-shadow: -30px 0 var(--line-colour);
      }
   }
</style>