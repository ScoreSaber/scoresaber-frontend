<script lang="ts" context="module">
   export interface onClickedCallback {
      (): void;
   }
</script>

<script lang="ts">
   // SkyKiwi wuz here
   export let poggleable = false;
   export let isDisabled = false;
   export let size = 'is-small';

   export let onClicked: onClickedCallback;
   export let title: string;
   export let icon: string;

   function onButtonClicked() {
      if (poggleable) {
         isDisabled = !isDisabled;
         if (onClicked) {
            onClicked();
         }
      } else {
         // did this since I don't want to disable the button and what even is "poggleable" bruh
         if (onClicked) {
            onClicked();
         }
      }
   }

   //is-medium-small
</script>

<button on:click={() => onButtonClicked()} class="button {size}" disabled={isDisabled}>
   {#if icon}
      <span class="icon">
         <i class="fas fa-{icon}" />
      </span>
   {/if}
   <span>{title}</span>
</button>

<style>
   .button {
      font-size: 0.875rem;
      height: 2.3em;
      line-height: 1;
      border: 1px solid var(--borderColor);
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 6px 14px;
      border-radius: 6px;
      font-weight: 600;
      transition: all 0.2s ease;
   }

   .button:hover:enabled {
      background-color: var(--gray-light);
      border-color: var(--scoreSaberYellow);
   }

   .button .icon {
      margin: 0;
      width: auto;
      height: auto;
   }
</style>
