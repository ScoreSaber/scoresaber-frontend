<script lang="ts" context="module">
   export interface onClicked {
      (): void;
   }
</script>

<script lang="ts">
   // SkyKiwi wuz here
   export let poggleable: boolean = false;
   export let isDisabled: boolean = false;
   export let size: string = 'is-small';

   export let onClicked: onClicked = null;
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
   <span class="icon">
      <i class="fas fa-{icon}" />
   </span>
   <span>{title}</span>
</button>

<style>
   .button {
      font-size: 14px;
      height: 2.3em;
      line-height: 1;
      border-color: var(--foreground);
      border: transparent;
      margin-left: 5px;
      margin-right: 5px;
   }
</style>
