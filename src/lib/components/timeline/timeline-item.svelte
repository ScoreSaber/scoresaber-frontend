<script lang="ts">
   export let accentColour = 'var(--scoreSaberYellow)';
   export let isCompleted = false;
</script>

<div class="timeline-item {isCompleted ? 'completed' : ''}" style="--accent: {accentColour}">
   <div class="spacer" />
   <div class="body">
      <slot />
   </div>
   <div class="line" />
   <div class="marker" />
</div>

<style lang="scss">
   .timeline-item {
      --accent: attr(data-accent);
      --grey: #333;
      --border-colour: var(--grey);
      &.completed {
         --border-colour: var(--accent);
      }
      grid-column: 1;
      display: flex;
      position: relative;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      border-right: solid 2px var(--border-colour);
      grid-row: auto / span 2;
      margin-right: -1px;

      &:nth-child(2n + 1) {
         grid-column: 2;
         border-right: unset;
         border-left: solid 2px var(--border-colour);
         margin-right: 0;

         margin-left: -1px;
         flex-direction: row-reverse;
         .marker {
            transform: translateX(-16px);
            position: relative;
            z-index: 100;
         }
         .line {
            box-shadow: -30px 0 var(--grey);
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
         transform: translateX(16px);
      }

      &.completed {
         .marker {
            background: var(--accent);
         }
      }

      .body {
         border: solid 1px #fff1;
         box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
         max-width: 75%;
         padding: 25px;
         background: var(--foreground);
         flex: 1;
      }

      .spacer {
         flex: 1;
      }

      .line {
         height: 1px;
         background: var(--grey);
         flex: 1;
         box-shadow: 30px 0 var(--grey);
      }
   }
</style>
